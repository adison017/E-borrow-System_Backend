import express from 'express';
import * as borrowController from '../controllers/borrowController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { uploadImportantDocumentsWithCustomName } from '../utils/cloudinaryUtils.js';
const router = express.Router();

// Protect all borrow routes
router.use(authMiddleware);

router.post('/', uploadImportantDocumentsWithCustomName, borrowController.createBorrow);
router.get('/', borrowController.getAllBorrows);
router.get('/:id', borrowController.getBorrowById);
router.put('/:id/status', borrowController.updateBorrowStatus);
router.delete('/:id', borrowController.deleteBorrow);

export default router;