import express from 'express';
import * as categoryController from '../controllers/categoryController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all category routes
router.use(authMiddleware);

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', categoryController.addCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

export default router;