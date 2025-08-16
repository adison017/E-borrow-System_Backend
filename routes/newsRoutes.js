import express from 'express';
import * as newsController from '../controllers/newsController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all news routes
router.use(authMiddleware);

// Get all news
router.get('/', newsController.getAllNews);

// Get single news
router.get('/:id', newsController.getNewsById);

// Create new news
router.post('/', newsController.createNews);

// Update news
router.put('/:id', newsController.updateNews);

// Delete news
router.delete('/:id', newsController.deleteNews);

export default router;