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
import { startNotificationCron } from './cron/notifySchedule.js';

// Import models
import * as BorrowModel from './models/borrowModel.js';
import * as RepairRequest from './models/repairRequestModel.js';

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
import paymentSettingsRoutes from './routes/paymentSettingsRoutes.js';
import footerRoutes from './routes/footerRoutes.js';
import auditLogRoutes from './routes/auditLogRoutes.js';


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

// Centralized CORS configuration
const defaultDevOrigins = [
  'http://localhost:5033',
  'http://127.0.0.1:5033',
  'https://e-borrow-system.vercel.app' // Production frontend URL
     // Alternative frontend URL (without dash)
];
const configuredOrigins = (process.env.FRONTEND_URLS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const allowedOrigins = Array.from(new Set([...defaultDevOrigins, ...configuredOrigins]));

// Log allowed origins for debugging (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('CORS Allowed Origins:', allowedOrigins);
  console.log('FRONTEND_URLS from env:', process.env.FRONTEND_URLS);
}

function isOriginAllowed(origin) {
  if (!origin) return true; // non-browser or same-origin
  const isAllowed = allowedOrigins.includes(origin);
  // Log CORS checks only in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`CORS Check - Origin: ${origin}, Allowed: ${isAllowed}`);
  }
  return isAllowed;
}

const io = new SocketIOServer(server, {
  cors: {
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true
  }
});

// Socket.IO Session Management
const socketSessions = new Map(); // เก็บ socket sessions
const userSockets = new Map(); // เก็บ user_id -> socket mapping

// Handshake authentication middleware
io.use((socket, next) => {
  try {
    const token = socket.handshake?.auth?.token;
    if (!token) {
      return next(new Error('Token required'));
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return next(new Error('Invalid token'));
    }
    socket.data.user = decoded;
    return next();
  } catch (err) {
    return next(new Error('Authentication error'));
  }
});

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
  const clientOrigin = socket.handshake.headers.origin || 'No origin';
  const userAgent = socket.handshake.headers['user-agent'] || 'No user-agent';

  // ตั้งค่าหลังผ่าน handshake auth แล้ว
  try {
    const decoded = socket.data.user;
    if (!decoded) {
      socket.emit('auth_error', { message: 'Authentication required' });
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
    console.error('Post-auth setup error:', error);
    socket.disconnect();
    return;
  }

  // จัดการ disconnect
  socket.on('disconnect', (reason) => {
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

}, 5 * 60 * 1000);

// Enable CORS with specific options (allow only configured frontend origins)
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (isOriginAllowed(origin)) return callback(null, true);

    // Log blocked origins for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log(`CORS blocked origin: ${origin}`);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 0 // Disable preflight caching to avoid stale CORS policy in browsers
};

app.use(cors(corsOptions));

// Add global CORS headers for all responses
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && isOriginAllowed(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Vary', 'Origin');
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Global OPTIONS handler for all routes to ensure CORS preflight is handled
// app.options('*', cors(corsOptions));

// Central OPTIONS preflight handler (route-agnostic to avoid path-to-regexp issues)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    const origin = req.headers.origin;

    // Always allow OPTIONS requests
    if (origin && isOriginAllowed(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Vary', 'Origin');
    } else if (origin && process.env.NODE_ENV === 'development') {
      // Log blocked origins for debugging (only in development)
      console.log(`OPTIONS blocked origin: ${origin}`);
    }

    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    const reqHeaders = req.headers['access-control-request-headers'];
    res.header('Access-Control-Allow-Headers', reqHeaders || 'Authorization, Content-Type, X-Requested-With, Accept, Origin');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(204);
  }
  next();
});

// Debug middleware removed - CORS issue fixed

// Global CORS middleware - Removed to avoid conflicts with main CORS configuration
// The main CORS configuration above handles all methods including PATCH

// Parse cookies for refresh token handling
app.use(cookieParser());

// Request logging middleware (disabled)
app.use((req, res, next) => {
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

// Rate Limiting for Login Endpoints - ใช้ username + IP เพื่อป้องกันการบล็อก IP ร่วม
const loginLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 5, // เพิ่มให้มากขึ้นเพราะแยกตาม user แล้ว
  keyGenerator: (req) => {
    // ใช้ username + IP เป็น key เพื่อแยกการนับตาม user
    const username = req.body?.username || 'anonymous';
    const ip = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || 'unknown';
    return `${username}:${ip}`;
  },
  message: {
    message: 'Too many login attempts for this account, please try again after 2 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to login routes
app.use('/api/users/login', loginLimiter);
app.use('/api/users/verify-otp', loginLimiter);
app.use('/api/users/request-otp', loginLimiter);

// เพิ่ม IP-based flooding protection (ป้องกันการโจมตีด้วย username หลายตัว)
const ipFloodingLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // สูงสุด 20 requests ต่อ IP ใน 5 นาที
  keyGenerator: (req) => req.ip,
  message: {
    message: 'Too many requests from this IP address, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/users/login', ipFloodingLimiter);

// General rate limiting for all routes (dev ผ่อนคลายมากขึ้น)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 300 : 5000, // ผ่อนคลายใน dev
  message: {
    message: 'Too many requests from this IP, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ยกเว้นเส้นทาง dashboard และ borrows จาก general limiter (ลด 429 ระหว่างโหลดหลายกราฟ)
app.use('/api', (req, res, next) => {
  if (req.path.startsWith('/dashboard') || req.path.startsWith('/borrows')) return next();
  return generalLimiter(req, res, next);
});

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// LINE webhook route ต้องมาก่อน express.json()
app.use('/api/line', lineRoutes);

// ตัวนี้ค่อยใส่ทีหลัง
app.use(express.json());

// Import and add audit logging middleware
import auditLogger from './utils/auditLogger.js';
import AuditLog from './models/auditLogModel.js';

// Initialize audit logs table on startup
AuditLog.createTable().catch(console.error);

// Add audit logging middleware (before routes)
app.use(auditLogger.middleware());

// Serve static files from uploads directory with proper MIME types
// Apply CORS before static serving
app.use('/uploads', cors(corsOptions), 
  // Add audit logging middleware for file downloads
  async (req, res, next) => {
    // Only log actual file requests (not directory listings)
    if (req.path && req.path !== '/' && !req.path.endsWith('/')) {
      try {
        const filename = req.path.split('/').pop();
        await auditLogger.logFile(req, 'download', filename, {
          file_path: req.path,
          user_agent: req.get('User-Agent') || 'Unknown',
          referer: req.get('Referer') || 'Direct access'
        });
      } catch (logError) {
        console.error('Failed to log file download:', logError);
      }
    }
    next();
  },
  express.static(path.join(__dirname, '/uploads'), {
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

// Apply CORS to the user routes at the app level - REMOVED duplicate CORS
app.use('/api/users', userRouter);

// Specific OPTIONS handler removed - using global handler instead

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
app.use('/api/payment-settings', paymentSettingsRoutes);
app.use('/api/footer-settings', footerRoutes);
app.use('/api/audit-logs', auditLogRoutes);

// Executive dashboard analytics endpoints
import dashboardRoutes from './routes/dashboardRoutes.js';
app.use('/api/dashboard', dashboardRoutes);

// Root route
app.get('/', (req, res) => {
  const serverUrl = getServerUrl();
  res.json({
    message: 'E-borrow API running',
    server: {
      url: serverUrl,
      environment: process.env.NODE_ENV || 'development',
      port: PORT,
      ssl: isProduction ? 'enabled' : 'disabled'
    },
    api: {
      base_url: `${serverUrl}/api`,
      upload_url: `${serverUrl}/uploads`,
      websocket_url: serverUrl
    },
    cors: {
      allowed_origins: allowedOrigins,
      configured_origins: configuredOrigins
    },
    timestamp: new Date().toISOString()
  });
});

// API host info endpoint
app.get('/api/host-info', (req, res) => {
  const serverUrl = getServerUrl();
  const clientOrigin = req.headers.origin || 'No origin';

  res.json({
    server_url: serverUrl,
    api_base_url: `${serverUrl}/api`,
    upload_url: `${serverUrl}/uploads`,
    websocket_url: serverUrl,
    environment: process.env.NODE_ENV || 'development',
    client_origin: clientOrigin,
    timestamp: new Date().toISOString()
  });
});

// Host info endpoint for testing
app.get("/host-info", (req, res) => {
  res.json({
    server_url: process.env.BASE_URL || `http://localhost:${PORT}`,
    api_base_url: `${process.env.BASE_URL || `http://localhost:${PORT}`}/api`,
    upload_url: `${process.env.BASE_URL || `http://localhost:${PORT}`}/uploads`,
    websocket_url: process.env.WEBSOCKET_URL || process.env.BASE_URL || `http://localhost:${PORT}`,
    environment: process.env.NODE_ENV || "development",
    client_origin: req.headers.origin || "No origin",
    timestamp: new Date().toISOString()
  });
});

// CORS test route - temporarily removed to fix path-to-regexp error
// app.options('/api/cors-test', cors(corsOptions));
// app.patch('/api/cors-test', cors(corsOptions), (req, res) => {
//   res.json({
//     message: 'CORS PATCH test successful',
//     origin: req.headers.origin,
//     method: req.method,
//     timestamp: new Date().toISOString()
//   });
// });

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

// Get server URL for logging
const getServerUrl = () => {
  const protocol = isProduction ? 'https' : 'http';
  const host = process.env.HOST || 'localhost';
  return `${protocol}://${host}:${PORT}`;
};

// Request logging middleware (disabled for cleaner logs)
app.use((req, res, next) => {
  next();
});

// เริ่มต้น cron jobs
startNotificationCron();

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});