import cors from 'cors';
import 'dotenv/config';

import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cookieParser from 'cookie-parser';
import http from 'http';
import https from 'https';
import fs from 'fs';
import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';

// Rate limiting
import rateLimit from 'express-rate-limit';

// Import cron job
import './cron/notifySchedule.js';

// Import models
import * as BorrowModel from './models/borrowModel.js';
import * as RepairRequest from './models/repairRequestModel.js';
import roomModel from './models/roomModel.js';

// Import routes
import branchRoutes from './routes/branchRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import positionRoutes from './routes/positionRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import userRoutes from './routes/userRoutes.js';
import borrowRoutes from './routes/borrowRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import damageLevelRoutes from './routes/damageLevelRoutes.js';
import equipmentRoutes from './routes/equipmentRoutes.js';
import lineRoutes from './routes/lineRoutes.js';
import repairRequestRoutes from './routes/repairRequestRoutes.js';
import returnRoutes from './routes/returnRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import contactInfoRoutes from './routes/contactInfoRoutes.js';
import cloudinaryRoutes from './routes/cloudinaryRoutes.js';
import notificationSettingsRoutes from './routes/notificationSettingsRoutes.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('trust proxy', 1);

// SSL Configuration
const isProduction = process.env.NODE_ENV === 'production';
let server;

// สำหรับตอนนี้ให้ใช้ HTTP ทั้งหมด (development mode)
server = http.createServer(app);

// เมื่อมี domain จริงแล้ว ให้เปลี่ยนเป็น:
// if (isProduction) {
//   // Production: Use HTTPS
//   const privateKey = fs.readFileSync(process.env.SSL_PRIVATE_KEY_PATH || '/path/to/private-key.pem', 'utf8');
//   const certificate = fs.readFileSync(process.env.SSL_CERTIFICATE_PATH || '/path/to/certificate.pem', 'utf8');
//   const credentials = { key: privateKey, cert: certificate };
//   server = https.createServer(credentials, app);
// } else {
//   // Development: Use HTTP
//   server = http.createServer(app);
// }

const io = new SocketIOServer(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true
  }
});

// Socket.IO Session Management
const socketSessions = new Map(); // เก็บ socket sessions
const userSockets = new Map(); // เก็บ user_id -> socket mapping

// ฟังก์ชัน broadcast badgeCountsUpdated
export function broadcastBadgeCounts(badges) {
  io.emit('badgeCountsUpdated', badges);
}

// ฟังก์ชันส่งข้อมูลเฉพาะ user
export function emitToUser(userId, event, data) {
  const userSocketIds = userSockets.get(userId);
  if (userSocketIds) {
    userSocketIds.forEach(socketId => {
      const socket = io.sockets.sockets.get(socketId);
      if (socket) {
        socket.emit(event, data);
      }
    });
  }
}

// ฟังก์ชันลบ socket session
function removeSocketSession(socketId) {
  const session = socketSessions.get(socketId);
  if (session) {
    // ลบ socket จาก user mapping
    const userSocketIds = userSockets.get(session.userId);
    if (userSocketIds) {
      userSocketIds.delete(socketId);
      if (userSocketIds.size === 0) {
        userSockets.delete(session.userId);
      }
    }
    // ลบ session
    socketSessions.delete(socketId);
    console.log(`Socket session removed: ${socketId} for user: ${session.userId}`);
  }
}

// ฟังก์ชันตรวจสอบ JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

io.on('connection', async (socket) => {
  console.log('Socket connected:', socket.id);
  
  // ตรวจสอบ authentication
  socket.on('authenticate', async (data) => {
    try {
      const { token } = data;
      if (!token) {
        socket.emit('auth_error', { message: 'Token required' });
        socket.disconnect();
        return;
      }
      
      const decoded = verifyToken(token);
      if (!decoded) {
        socket.emit('auth_error', { message: 'Invalid token' });
        socket.disconnect();
        return;
      }
      
      // บันทึก session
      const session = {
        userId: decoded.user_id,
        username: decoded.username,
        role: decoded.role,
        deviceFingerprint: decoded.deviceFingerprint,
        loginTime: decoded.loginTime,
        connectedAt: Date.now()
      };
      
      socketSessions.set(socket.id, session);
      
      // เพิ่ม socket ไปยัง user mapping
      if (!userSockets.has(decoded.user_id)) {
        userSockets.set(decoded.user_id, new Set());
      }
      userSockets.get(decoded.user_id).add(socket.id);
      
      console.log(`User authenticated: ${decoded.username} (${decoded.user_id}) on socket: ${socket.id}`);
      
      // ส่งข้อมูล badge counts เริ่มต้น
      try {
        const [pending, carry, pendingApproval] = await Promise.all([
          BorrowModel.getBorrowsByStatus(['pending']),
          BorrowModel.getBorrowsByStatus(['carry']),
          BorrowModel.getBorrowsByStatus(['pending_approval'])
        ]);
        const allRepairs = await RepairRequest.getAllRepairRequests();
        const repairApprovalCount = allRepairs.length;
        
        socket.emit('badgeCountsUpdated', {
          pendingCount: pending.length + pendingApproval.length,
          carryCount: carry.length,
          borrowApprovalCount: pendingApproval.length,
          repairApprovalCount
        });
        
        socket.emit('auth_success', { message: 'Authentication successful' });
      } catch (err) {
        console.error('Error sending initial badge counts:', err);
        socket.emit('auth_error', { message: 'Error loading data' });
      }
      
    } catch (error) {
      console.error('Socket authentication error:', error);
      socket.emit('auth_error', { message: 'Authentication failed' });
      socket.disconnect();
    }
  });
  
  // จัดการ disconnect
  socket.on('disconnect', (reason) => {
    console.log(`Socket disconnected: ${socket.id}, reason: ${reason}`);
    removeSocketSession(socket.id);
  });
  
  // จัดการ error
  socket.on('error', (error) => {
    console.error(`Socket error: ${socket.id}`, error);
    removeSocketSession(socket.id);
  });
  
  // Heartbeat เพื่อตรวจสอบการเชื่อมต่อ
  socket.on('ping', () => {
    socket.emit('pong', { timestamp: Date.now() });
  });
  
  // ตรวจสอบ session หลังจาก 30 วินาที
  setTimeout(() => {
    const session = socketSessions.get(socket.id);
    if (!session) {
      console.log(`Socket ${socket.id} not authenticated, disconnecting...`);
      socket.disconnect();
    }
  }, 30000);
});

// Cleanup sessions ทุก 5 นาที
setInterval(() => {
  const now = Date.now();
  const disconnectedSockets = [];
  
  socketSessions.forEach((session, socketId) => {
    // ลบ session ที่ไม่มีการใช้งานเกิน 30 นาที
    if (now - session.connectedAt > 30 * 60 * 1000) {
      disconnectedSockets.push(socketId);
    }
  });
  
  disconnectedSockets.forEach(socketId => {
    const socket = io.sockets.sockets.get(socketId);
    if (socket) {
      socket.disconnect();
    }
    removeSocketSession(socketId);
  });
  
  if (disconnectedSockets.length > 0) {
    console.log(`Cleaned up ${disconnectedSockets.length} inactive socket sessions`);
  }
}, 5 * 60 * 1000);

// Enable CORS with specific options
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Length', 'X-Requested-With'],
  credentials: true
}));

// Parse cookies for refresh token handling
app.use(cookieParser());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Security Headers Middleware
app.use((req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Strict Transport Security (HSTS) - only in production
  // if (isProduction) {
  //   res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  // }
  
  // Content Security Policy
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;");
  
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  next();
});

// Rate Limiting for Login Endpoints
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    message: 'Too many login attempts, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to login routes
app.use('/api/users/login', loginLimiter);
app.use('/api/users/verify-otp', loginLimiter);
app.use('/api/users/request-otp', loginLimiter);

// General rate limiting for all routes (dev ผ่อนคลายมากขึ้น)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 300 : 2000, // ผ่อนคลายใน dev
  message: {
    message: 'Too many requests from this IP, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ยกเว้นเส้นทาง dashboard จาก general limiter (ลด 429 ระหว่างโหลดหลายกราฟ)
app.use('/api', (req, res, next) => {
  if (req.path.startsWith('/dashboard')) return next();
  return generalLimiter(req, res, next);
});

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// LINE webhook route ต้องมาก่อน express.json()
app.use('/api/line', lineRoutes);

// ตัวนี้ค่อยใส่ทีหลัง
app.use(express.json());



// Serve static files from uploads directory with proper MIME types
// Apply CORS before static serving
app.use('/uploads', cors(), express.static(path.join(__dirname, '/uploads'), {
  setHeaders: (res, path) => {
    const ext = path.split('.').pop().toLowerCase();

    // Set proper MIME types for different file types
    switch (ext) {
      case 'pdf':
        res.setHeader('Content-Type', 'application/pdf');
        break;
      case 'txt':
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        break;
      case 'rtf':
        res.setHeader('Content-Type', 'application/rtf');
        break;
      case 'md':
        res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
        break;
             case 'doc':
         res.setHeader('Content-Type', 'application/msword');
         res.setHeader('Content-Disposition', 'inline');
         break;
               case 'docx':
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
          res.setHeader('Content-Disposition', 'inline');
          break;
        case 'xls':
          res.setHeader('Content-Type', 'application/vnd.ms-excel');
          res.setHeader('Content-Disposition', 'inline');
          break;
        case 'xlsx':
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Disposition', 'inline');
          break;
        case 'ppt':
          res.setHeader('Content-Type', 'application/vnd.ms-powerpoint');
          res.setHeader('Content-Disposition', 'inline');
          break;
        case 'pptx':
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
          res.setHeader('Content-Disposition', 'inline');
          break;
      case 'jpg':
      case 'jpeg':
        res.setHeader('Content-Type', 'image/jpeg');
        break;
      case 'png':
        res.setHeader('Content-Type', 'image/png');
        break;
      case 'gif':
        res.setHeader('Content-Type', 'image/gif');
        break;
      case 'webp':
        res.setHeader('Content-Type', 'image/webp');
        break;
      default:
        // Let Express handle other MIME types
        break;
    }
  }
}));

// Create nested router for user-related routes
const userRouter = express.Router();
userRouter.use('/', userRoutes);
userRouter.use('/positions', positionRoutes);
userRouter.use('/branches', branchRoutes);
userRouter.use('/roles', roleRoutes);
app.use('/api/users', userRouter);

// Route อื่นๆ ที่ต้องการอ่าน req.body
app.use('/api/borrows', borrowRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/repair-requests', repairRequestRoutes);
app.use('/api/returns', returnRoutes);
app.use('/api/damage-levels', damageLevelRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/contact-info', contactInfoRoutes);
app.use('/api/cloudinary', cloudinaryRoutes);
app.use('/api/notification-settings', notificationSettingsRoutes);

// Executive dashboard analytics endpoints
import dashboardRoutes from './routes/dashboardRoutes.js';
app.use('/api/dashboard', dashboardRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('สวัสดี Express API');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', err);
  console.error('Error stack:', err.stack);

    // Handle multer errors specifically
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      message: 'ขนาดไฟล์ใหญ่เกินไป',
      error: err.message
    });
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      message: 'อัปโหลดไฟล์มากเกินไป',
      error: err.message
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      message: 'ฟิลด์ไฟล์ไม่ถูกต้อง',
      error: err.message
    });
  }

  // Handle custom file format errors
  if (err.message && err.message.includes('รูปแบบไฟล์ไม่ได้รับอนุญาต')) {
    return res.status(400).json({
      message: err.message,
      error: err.message
    });
  }

  res.status(err.http_code || 500).json({
    message: 'เกิดข้อผิดพลาดในระบบ!',
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('CORS enabled for: http://localhost:5173, http://127.0.0.1:5173');
  console.log('Socket.IO server started');

  // Initialize database tables after server starts
  try {
    await roomModel.initialize();
    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.warn('⚠️ Database initialization failed:', error.message);
    console.warn('Some features may not work properly');
  }
});