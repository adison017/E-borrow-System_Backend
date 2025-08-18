import express from 'express';
import footerController from '../controllers/footerController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// GET footer settings (public)
router.get('/', footerController.getFooterSettings);

// PUT footer settings (admin only)
router.put('/', authMiddleware, footerController.updateFooterSettings);

export default router;