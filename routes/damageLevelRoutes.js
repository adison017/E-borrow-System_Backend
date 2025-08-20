import express from 'express';
import { getDamageLevels, updateDamageLevelController, createDamageLevelController } from '../controllers/damageLevelController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all damage level routes
router.use(authMiddleware);

router.get('/', getDamageLevels);
router.post('/', createDamageLevelController);
router.put('/:id', updateDamageLevelController);

export default router;