import express from 'express';
import { getDamageLevels } from '../controllers/damageLevelController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all damage level routes
router.use(authMiddleware);

router.get('/', getDamageLevels);

export default router;