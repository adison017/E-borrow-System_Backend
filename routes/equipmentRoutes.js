import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as equipmentController from '../controllers/equipmentController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { uploadEquipmentImage, createEquipmentUploadWithItemCode, handleCloudinaryUpload, cloudinaryUtils } from '../utils/cloudinaryUtils.js';
import { uploadEquipmentImage as uploadEquipmentToCloudinary } from '../utils/cloudinaryUploadUtils.js';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Protect all equipment routes
router.use(authMiddleware);

// Image upload endpoint using Cloudinary with item_code as filename
router.post('/upload', async (req, res) => {
  try {
    console.log('[UPLOAD] Request received');

    // Get item_code from query parameter first
    let { item_code } = req.query;

    // If not in query, try to get from form data
    if (!item_code) {
      // Create a multer instance to parse form data
      const parseMulter = multer().fields([
        { name: 'image', maxCount: 1 },
        { name: 'item_code', maxCount: 1 }
      ]);

      parseMulter(req, res, (err) => {
        if (err) {
          console.error('[UPLOAD] Form parsing error:', err);
          return res.status(400).json({ error: 'Form data parsing failed', details: err.message });
        }

        // Get item_code from form data
        item_code = req.body.item_code;

        if (!item_code) {
          console.log('[UPLOAD] Missing item_code in both query and form data');
          return res.status(400).json({
            error: 'item_code is required. Send as query parameter (?item_code=EQ-008) or form data (item_code: EQ-008)'
          });
        }

        // Continue with upload using the parsed file
        handleUploadWithFile(req, res, item_code);
      });
      return;
    }

    // If item_code is in query, handle upload directly
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
router.post('/', equipmentController.addEquipment);
router.put('/:item_id', equipmentController.updateEquipment);
router.put('/:item_code/status', equipmentController.updateEquipmentStatus);
router.delete('/:item_code', equipmentController.deleteEquipment);

export default router;