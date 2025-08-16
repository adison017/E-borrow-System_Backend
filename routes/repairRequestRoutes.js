
import express from 'express';
import * as repairRequestController from '../controllers/repairRequestController.js';
import db from '../db.js';
import { processRepairImages, uploadRepairImages } from '../utils/imageUtils.js';
import { uploadRepairImages as uploadRepairToCloudinary } from '../utils/cloudinaryUploadUtils.js';
import authMiddleware from '../middleware/authMiddleware.js';
import multer from 'multer';

const router = express.Router();
// GET /api/repair-requests/history (approved, completed, incomplete)
router.use((req, res, next) => {
  req.db = db;
  next();
});
router.get('/history', repairRequestController.getHistoryRequests);
// GET all repair requests
router.get('/', repairRequestController.getAllRepairRequests);

// GET repair request by ID
router.get('/:id', repairRequestController.getRepairRequestById);

// GET repair request images
router.get('/:id/images', repairRequestController.getRepairRequestImages);

// GET repair requests by user ID
router.get('/user/:user_id', repairRequestController.getRepairRequestsByUserId);

// GET repair requests by item ID
router.get('/item/:item_id', repairRequestController.getRepairRequestsByItemId);

// POST new repair request
router.post('/', repairRequestController.addRepairRequest);

// PUT update repair request
router.put('/:id', repairRequestController.updateRepairRequest);

// DELETE repair request
router.delete('/:id', repairRequestController.deleteRepairRequest);

// POST upload repair images with repair code using Cloudinary
router.post('/upload-images', async (req, res, next) => {
  try {
    // Use multer to parse multiple files
    const parseMulter = multer().array('images', 10);

    parseMulter(req, res, async (err) => {
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({ error: err.message });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      // Extract repair code from request body
      let repairCode = req.body.repair_code;

      // If not in body, generate one
      if (!repairCode) {
        repairCode = `RP${Date.now()}`;
      }

      try {
        // Convert files to base64 and upload to Cloudinary
        const base64DataArray = req.files.map(file =>
          `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
        );

        const results = await uploadRepairToCloudinary(base64DataArray, repairCode);

        // Check if all uploads were successful
        const successfulUploads = results.filter(result => result.success);
        const failedUploads = results.filter(result => !result.success);

        if (failedUploads.length > 0) {
          console.error('Some uploads failed:', failedUploads);
          return res.status(400).json({
            error: 'Some images failed to upload',
            failed: failedUploads,
            successful: successfulUploads.length
          });
        }

        // Format response similar to the original processRepairImages
        const images = successfulUploads.map((result, index) => ({
          filename: result.public_id,
          url: result.url,
          repair_code: repairCode,
          index: index + 1
        }));

        res.json({
          message: 'Images uploaded successfully to Cloudinary',
          images: images,
          repair_code: repairCode
        });
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        res.status(500).json({
          error: 'Error uploading to Cloudinary',
          details: uploadError.message
        });
      }
    });
  } catch (error) {
    console.error('Upload route error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Protect all repair request routes
router.use(authMiddleware);

export default router;