import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import paymentSettingsController from '../controllers/paymentSettingsController.js';

const router = express.Router();

// Admin only in real usage; for now protect with auth
router.use(authMiddleware);

// CRUD minimal API
router.get('/', paymentSettingsController.get);
router.get('/:id', paymentSettingsController.getById);
router.post('/', paymentSettingsController.create);
router.put('/', paymentSettingsController.put);
router.put('/:id', paymentSettingsController.put);
router.patch('/', paymentSettingsController.patch);
router.patch('/:id', paymentSettingsController.patch);
router.delete('/', paymentSettingsController.remove);
router.delete('/:id', paymentSettingsController.remove);

export default router;


