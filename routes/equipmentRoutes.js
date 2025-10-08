import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import * as equipmentController from '../controllers/equipmentController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import auditLogger from '../utils/auditLogger.js';
import { uploadEquipmentImage as uploadEquipmentToCloudinary } from '../utils/cloudinaryUploadUtils.js';
import { createEquipmentUploadWithItemCode } from '../utils/cloudinaryUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Temporary public diagnostic route (placed BEFORE auth middleware)
// NOTE: This endpoint is added only for quick verification on deployed servers
// where you may not have a JWT handy. Remove or protect this in production.
router.get('/public/borrow-history/:item_code', equipmentController.getEquipmentBorrowHistory);

// Protect all equipment routes
router.use(authMiddleware);

// Image upload endpoint using Cloudinary with item_code as filename
router.post('/upload', async (req, res) => {
  try {
    console.log('[UPLOAD] Request received');
    console.log('[UPLOAD] Query params:', req.query);

    // Get item_code from query parameter
    const { item_code } = req.query;

    if (!item_code) {
      console.log('[UPLOAD] Missing item_code in query parameter');
      return res.status(400).json({
        error: 'item_code is required as query parameter (?item_code=EQ-008)'
      });
    }

    // Handle upload directly with item_code from query
    handleUpload(req, res, item_code);

  } catch (error) {
    console.error('[UPLOAD] Unexpected error:', error);
    res.status(500).json({
      error: 'Failed to upload file',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Helper function to handle the actual upload
const handleUpload = async (req, res, item_code) => {
  try {
    console.log('[UPLOAD] Creating upload middleware for item_code:', item_code);

    // Create custom upload middleware with item_code as filename
    const customUpload = createEquipmentUploadWithItemCode(item_code);

    // Handle the upload with custom filename
    customUpload(req, res, async (err) => {
      if (err) {
        console.error('[UPLOAD] Multer error:', err);
        return res.status(400).json({
          error: 'File upload failed',
          details: err.message,
          type: err.constructor.name
        });
      }

      console.log('[UPLOAD] Multer completed, checking file:', req.file);

      if (!req.file) {
        console.log('[UPLOAD] No file found in request');
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // The file is already uploaded to Cloudinary with item_code as filename
      const cloudinaryUrl = req.file.path || req.file.secure_url;
      const publicId = req.file.filename || req.file.public_id;

      console.log('[UPLOAD] File uploaded to Cloudinary:', {
        url: cloudinaryUrl,
        item_code: item_code,
        public_id: publicId,
        file_info: {
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size
        }
      });

      // Log file upload
      try {
        await auditLogger.logFile(req, 'upload', req.file.originalname, {
          file_size: req.file.size,
          file_type: req.file.mimetype,
          cloudinary_url: cloudinaryUrl,
          cloudinary_public_id: publicId,
          item_code: item_code,
          upload_type: 'equipment_image'
        });
      } catch (logError) {
        console.error('Failed to log equipment image upload:', logError);
      }

      res.json({
        url: cloudinaryUrl,
        public_id: publicId,
        item_code: item_code
      });
    });
  } catch (error) {
    console.error('[UPLOAD] Upload handling error:', error);
    res.status(500).json({
      error: 'Failed to upload file',
      details: error.message
    });
  }
};

// Helper function to handle upload when file is already parsed
const handleUploadWithFile = async (req, res, item_code) => {
  try {
    console.log('[UPLOAD] Handling upload with parsed file for item_code:', item_code);

    // Check if file exists in parsed form data
    if (!req.files || !req.files.image || req.files.image.length === 0) {
      console.log('[UPLOAD] No image file found in parsed form data');
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const file = req.files.image[0];
    console.log('[UPLOAD] File found:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });

    // Convert file buffer to base64
    const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

    // Upload to Cloudinary using cloudinaryUploadUtils
    const result = await uploadEquipmentToCloudinary(dataUri, item_code);

    if (result.success) {
      console.log('[UPLOAD] File uploaded to Cloudinary:', {
        url: result.url,
        item_code: item_code,
        public_id: result.public_id
      });

      // Log file upload
      try {
        await auditLogger.logFile(req, 'upload', file.originalname, {
          file_size: file.size,
          file_type: file.mimetype,
          cloudinary_url: result.url,
          cloudinary_public_id: result.public_id,
          item_code: item_code,
          upload_type: 'equipment_image'
        });
      } catch (logError) {
        console.error('Failed to log equipment image upload:', logError);
      }

      res.json({
        url: result.url,
        public_id: result.public_id,
        item_code: item_code
      });
    } else {
      console.error('[UPLOAD] Cloudinary upload failed:', result.error);
      res.status(400).json({
        error: 'Failed to upload to Cloudinary',
        details: result.error
      });
    }
  } catch (error) {
    console.error('[UPLOAD] Upload with file error:', error);
    res.status(500).json({
      error: 'Failed to upload file',
      details: error.message
    });
  }
};

// Use item_code as canonical identifier for all CRUD routes
router.get('/', equipmentController.getAllEquipment);
router.get('/:item_code', equipmentController.getEquipmentByCode);
router.get('/:item_code/borrow-history', equipmentController.getEquipmentBorrowHistory);
router.get('/:item_code/repair-history', equipmentController.getEquipmentRepairHistory);
router.post('/', equipmentController.addEquipment);
router.put('/:item_id', equipmentController.updateEquipment);
router.put('/:item_code/status', equipmentController.updateEquipmentStatus);
router.delete('/:item_code', equipmentController.deleteEquipment);

export default router;