import express from 'express';
import multer from 'multer';
import { cloudinaryUtils } from '../utils/cloudinaryUtils.js';
import authMiddleware from '../middleware/authMiddleware.js';
import cloudinaryController from '../controllers/cloudinaryController.js';

const router = express.Router();

// Test Cloudinary connection
router.get('/test-connection', authMiddleware, async (req, res) => {
  try {
    const result = await cloudinaryUtils.testConnection();

    if (result.success) {
      res.json({
        success: true,
        message: 'เชื่อมต่อ Cloudinary สำเร็จ',
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'ไม่สามารถเชื่อมต่อ Cloudinary ได้',
        error: result.error,
        suggestion: result.suggestion
      });
    }
  } catch (error) {
    console.error('Cloudinary test connection error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการทดสอบการเชื่อมต่อ',
      error: error.message
    });
  }
});

// Get Cloudinary configuration status
router.get('/config', authMiddleware, (req, res) => {
  const isConfigured = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

  res.json({
    success: true,
    data: {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || null,
      api_key: process.env.CLOUDINARY_API_KEY ? '***configured***' : null,
      is_configured: isConfigured
    }
  });
});

// Upload file to Cloudinary (for testing)
// Configure multer for generic uploads (memory storage)
const memoryStorage = multer.memoryStorage();
const uploadSingle = multer({ storage: memoryStorage, limits: { fileSize: 5 * 1024 * 1024 } }).single('file');
const uploadMultiple = multer({ storage: memoryStorage, limits: { fileSize: 5 * 1024 * 1024, files: 10 } }).array('files', 10);

// Upload single file to Cloudinary
router.post('/upload', authMiddleware, uploadSingle, cloudinaryController.uploadFile);

// Upload multiple files to Cloudinary (max 10)
router.post('/upload-multiple', authMiddleware, uploadMultiple, cloudinaryController.uploadMultipleFiles);

// Delete file from Cloudinary
router.delete('/delete/:publicId', authMiddleware, async (req, res) => {
  try {
    const { publicId } = req.params;
    const result = await cloudinaryUtils.deleteFile(publicId);

    if (result.success) {
      res.json({
        success: true,
        message: 'ลบไฟล์สำเร็จ',
        data: result.result
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'ไม่สามารถลบไฟล์ได้',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลบไฟล์',
      error: error.message
    });
  }
});

export default router;