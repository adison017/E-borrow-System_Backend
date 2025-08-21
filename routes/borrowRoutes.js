import express from 'express';
import {
  getAllBorrows,
  getBorrowById,
  createBorrow,
  updateBorrowStatus,
  deleteBorrow,
  updateBorrowerLocation,
  checkLocationTrackingStatus
} from '../controllers/borrowController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { uploadImportantDocumentsWithCustomName } from '../utils/cloudinaryUtils.js';
const router = express.Router();

// Protect all borrow routes
router.use(authMiddleware);

router.post('/', uploadImportantDocumentsWithCustomName, createBorrow);
router.get('/', getAllBorrows);
router.get('/:id', getBorrowById);
router.put('/:id/status', updateBorrowStatus);
router.put('/:id/location', updateBorrowerLocation);
router.delete('/:id', deleteBorrow);

// เพิ่ม route สำหรับตรวจสอบสถานะการติดตาม
router.get('/location-tracking-status/:user_id', authMiddleware, checkLocationTrackingStatus);

export default router;