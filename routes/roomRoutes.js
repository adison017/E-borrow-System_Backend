import express from 'express';
import { roomController } from '../controllers/roomController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { uploadRoomImages as uploadRoomToCloudinary } from '../utils/cloudinaryUploadUtils.js';
import multer from 'multer';

const router = express.Router();

// Routes สำหรับจัดการห้อง (ต้อง login)
router.use(authMiddleware);

// ===== ROOM MANAGEMENT ROUTES =====

// GET /api/rooms - ดึงข้อมูลห้องทั้งหมด
router.get('/', roomController.getAllRooms);

// GET /api/rooms/search - ค้นหาห้อง
router.get('/search', roomController.searchRooms);

// GET /api/rooms/code/:code - ดึงข้อมูลห้องตามรหัสห้อง
router.get('/code/:code', roomController.getRoomByCode);

// GET /api/rooms/:id - ดึงข้อมูลห้องตาม ID
router.get('/:id', roomController.getRoomById);

// POST /api/rooms - สร้างห้องใหม่ (รองรับการอัปโหลดรูปภาพ)
router.post('/', async (req, res, next) => {
  try {
    // Use multer to parse multiple files
    const parseMulter = multer().array('images', 5);

    parseMulter(req, res, async (err) => {
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({ error: err.message });
      }

      // Continue to controller
      next();
    });
  } catch (error) {
    console.error('Upload route error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}, roomController.createRoom);

// PUT /api/rooms/:id - อัปเดตข้อมูลห้อง (รองรับการอัปโหลดรูปภาพ)
router.put('/:id', async (req, res, next) => {
  try {
    // Use multer to parse multiple files
    const parseMulter = multer().array('images', 5);

    parseMulter(req, res, async (err) => {
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({ error: err.message });
      }

      // Continue to controller
      next();
    });
  } catch (error) {
    console.error('Upload route error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}, roomController.updateRoom);

// DELETE /api/rooms/:id - ลบห้อง
router.delete('/:id', roomController.deleteRoom);

// ===== ROOM IMAGE MANAGEMENT ROUTES =====

// POST /api/rooms/:room_code/upload-images - อัปโหลดรูปภาพห้อง
router.post('/:room_code/upload-images', async (req, res, next) => {
  try {
    const { room_code } = req.params;

    // Use multer to parse multiple files
    const parseMulter = multer().array('images', 5);

    parseMulter(req, res, async (err) => {
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({ error: err.message });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      try {
        // Convert files to base64 and upload to Cloudinary
        const base64DataArray = req.files.map(file =>
          `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
        );

        const results = await uploadRoomToCloudinary(base64DataArray, room_code);

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

        // Format response
        const images = successfulUploads.map((result, index) => ({
          filename: result.public_id,
          url: result.url,
          room_code: room_code,
          index: index + 1
        }));

        res.json({
          message: 'Room images uploaded successfully to Cloudinary',
          images: images,
          room_code: room_code
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

// GET /api/rooms/:room_code/images - ดึงรายการรูปภาพของห้อง
router.get('/:room_code/images', roomController.getRoomImages);

// DELETE /api/rooms/:room_code/images/:filename - ลบรูปภาพเฉพาะ
router.delete('/:room_code/images/:filename', roomController.deleteRoomImage);

export default router;