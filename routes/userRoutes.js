
import express from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import userController from '../controllers/userController.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/userModel.js';
import db from '../db.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { uploadUserAvatar } from '../utils/cloudinaryUploadUtils.js';
import auditLogger from '../utils/auditLogger.js';

const router = express.Router();
// ส่ง OTP ไปอีเมล (สมัครสมาชิก)
// ส่ง OTP ไปอีเมล (สมัครสมาชิก)
router.post('/request-otp', userController.requestRegisterOtp);
// ตรวจสอบ OTP (สมัครสมาชิก)
router.post('/verify-otp-register', userController.verifyRegisterOtp);
// ส่ง OTP ไปอีเมล (ลืมรหัสผ่าน)
router.post('/request-password-otp', userController.requestPasswordOtp);

// ตรวจสอบ OTP (ลืมรหัสผ่าน)
router.post('/verify-otp', userController.verifyPasswordOtp);

// เปลี่ยนรหัสผ่าน (reset password)
router.post('/reset-password', userController.resetPassword);

// CORS middleware - Removed to avoid conflicts with main CORS configuration
// The main CORS configuration in index.js handles all CORS requirements

// Debug middleware to log all requests
router.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Request Headers:', req.headers);
  console.log('Request Body:', req.body);
  next();
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Save to uploads/user
    const uploadDir = path.join(__dirname, '../uploads/user');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Use user_code as filename, keep extension
    const userCode = req.body.user_code;
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, userCode ? `${userCode}${ext}` : file.originalname);
  }
});

// File filter for image upload
const fileFilter = (req, file, cb) => {
  console.log('File filter checking file:', {
    originalname: file.originalname,
    mimetype: file.mimetype
  });
  // Accept only jpg and png
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Only .jpg and .png files are allowed!'), false);
  }
};

// Configure multer upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  }
}).single('avatar');

// Image upload route using Cloudinary
router.post('/upload-image', authMiddleware, async (req, res, next) => {
  try {
    // Use multer to parse the file
    const parseMulter = multer().single('avatar');

    parseMulter(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Get user_code from request body
      const { user_code } = req.body;
      if (!user_code) {
        return res.status(400).json({ message: 'user_code is required' });
      }

      try {
        // Convert file buffer to base64
        const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

        // Upload to Cloudinary
        const result = await uploadUserAvatar(dataUri, user_code);

        if (result.success) {
          // Save avatar URL to DB
          let saved = false;
          try {
            const updateRes = await User.updateByUserCode(user_code, { avatar: result.url });
            saved = !!updateRes && updateRes.affectedRows > 0;
          } catch (saveErr) {
            console.error('Failed to save avatar URL to DB:', saveErr);
          }

          // Log avatar upload
          try {
            await auditLogger.logFile(req, 'upload', req.file.originalname, {
              file_size: req.file.size,
              file_type: req.file.mimetype,
              cloudinary_url: result.url,
              cloudinary_public_id: result.public_id,
              user_code: user_code,
              upload_type: 'user_avatar',
              saved_to_db: saved
            });
          } catch (logError) {
            console.error('Failed to log avatar upload:', logError);
          }

          res.json({
            filename: result.public_id,
            url: result.url,
            public_id: result.public_id,
            saved
          });
        } else {
          res.status(400).json({
            message: 'Failed to upload to Cloudinary',
            error: result.error
          });
        }
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        res.status(500).json({
          message: 'Error uploading to Cloudinary',
          error: uploadError.message
        });
      }
    });
  } catch (error) {
    console.error('Upload route error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get all positions
router.get('/positions', async (req, res) => {
  try {
    const [positions] = await db.query('SELECT * FROM positions ORDER BY position_name');
    res.json(positions);
  } catch (error) {
    console.error('Error fetching positions:', error);
    res.status(500).json({
      message: 'Error fetching positions',
      error: error.message
    });
  }
});

// Get all branches
router.get('/branches', async (req, res) => {
  try {
    const [branches] = await db.query('SELECT * FROM branches ORDER BY branch_name');
    res.json(branches);
  } catch (error) {
    console.error('Error fetching branches:', error);
    res.status(500).json({
      message: 'Error fetching branches',
      error: error.message
    });
  }
});

// Get all roles
router.get('/roles', async (req, res) => {
  try {
    const [roles] = await db.query('SELECT * FROM roles ORDER BY role_name');
    res.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({
      message: 'Error fetching roles',
      error: error.message
    });
  }
});

// User routes
// Protect sensitive user routes
router.get('/', authMiddleware, userController.getAllUsers);
router.get('/username/:username', userController.getUserByUsername);
router.get('/email/:email', userController.getUserByEmail);
router.get('/phone/:phone', userController.getUserByPhone);
router.get('/id/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/id/:id', authMiddleware, userController.updateUser);
router.patch('/id/:id', authMiddleware, userController.updateUser);
// OPTIONS handler for line-notify route to satisfy CORS preflight
router.options('/:id/line-notify', (req, res) => {
  const origin = req.headers.origin;
  if (origin) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Vary', 'Origin');
  }
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  const reqHeaders = req.headers['access-control-request-headers'];
  res.header('Access-Control-Allow-Headers', reqHeaders || 'Authorization, Content-Type, X-Requested-With, Accept, Origin');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(204);
});

// Add CORS headers for line-notify route
router.patch('/:id/line-notify', authMiddleware, (req, res, next) => {
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
}, userController.updateLineNotifyEnabled);
router.delete('/id/:id', authMiddleware, async (req, res) => {
  try {
    // Get user info first
    const [userRows] = await db.query('SELECT avatar, user_code FROM users WHERE user_id = ?', [req.params.id]);
    const user = userRows[0];

    // Delete user from DB
    await userController.deleteUser(req, res);

    // Remove avatar file if exists
    if (user && user.avatar) {
      if (user.avatar.includes('cloudinary.com')) {
        // ถ้าเป็น Cloudinary URL ให้ลบจาก Cloudinary
        try {
          const { deleteImageFromCloudinary, extractPublicIdFromUrl } = await import('../utils/cloudinaryUploadUtils.js');
          const publicId = extractPublicIdFromUrl(user.avatar);
          if (publicId) {
            await deleteImageFromCloudinary(publicId);
            console.log('Deleted user avatar from Cloudinary:', publicId);
          }
        } catch (cloudinaryError) {
          console.error('Error deleting from Cloudinary:', cloudinaryError);
        }
      } else {
        // ถ้าเป็น local file ให้ลบจาก local storage
        const avatarFilename = user.avatar.split('/').pop();
        const avatarPath = path.join(__dirname, '../uploads/user', avatarFilename);
        if (fs.existsSync(avatarPath)) {
          fs.unlinkSync(avatarPath);
          console.log('Deleted user avatar from local storage:', avatarPath);
        }
      }
    }
  } catch (error) {
    console.error('Error deleting user and avatar:', error);
    res.status(500).json({ message: 'Error deleting user or avatar', error: error.message });
  }
});
router.get('/role/:role', authMiddleware, userController.getUsersByRole);

// เพิ่ม login route
router.post('/login', userController.login);

// Refresh Access Token (rotate refresh token)
router.post('/auth/refresh', async (req, res) => {
  try {
    const refresh = req.cookies?.refresh_token;
    if (!refresh) return res.status(401).json({ message: 'Missing refresh token' });

    const payload = jwt.verify(refresh, process.env.REFRESH_SECRET || (process.env.JWT_SECRET + '_refresh'));

    // ดึงข้อมูลผู้ใช้เพื่อใส่ role/username ใน access token ใหม่
    const user = await User.findById(payload.user_id);
    if (!user) return res.status(401).json({ message: 'User not found' });

    let role = 'user';
    if (user.role_name && user.role_name.toLowerCase().includes('admin')) role = 'admin';
    else if (user.role_name && user.role_name.toLowerCase().includes('executive')) role = 'executive';

    // ออก access token ใหม่ (มี role/username) และ rotate refresh token ใหม่ทุกครั้ง
    const access = jwt.sign({ user_id: user.user_id, username: user.username, role }, process.env.JWT_SECRET, { expiresIn: '60m' });
    const newRefresh = jwt.sign({ user_id: payload.user_id, tokenId: crypto.randomUUID() }, process.env.REFRESH_SECRET || (process.env.JWT_SECRET + '_refresh'), { expiresIn: '7d' });

    res.cookie('refresh_token', newRefresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ token: access });
  } catch (err) {
    console.error('Refresh error:', err.message);
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
});

// เพิ่ม endpoint สำหรับ verify token
router.get('/verify-token', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// เพิ่ม endpoint สำหรับ verify password
router.post('/verify-password', authMiddleware, userController.verifyPassword);

// เพิ่ม endpoint สำหรับดึงข้อมูลผู้ใช้จาก token
router.get('/profile', authMiddleware, userController.getProfile);

// Session Management Routes
router.get('/sessions', authMiddleware, userController.getActiveSessions);
router.post('/logout', authMiddleware, userController.logout);
router.post('/logout-all', authMiddleware, userController.logoutAll);

// Debug route to test server
router.get('/test', (req, res) => {
  res.json({ message: 'User routes are working' });
});

export default router;