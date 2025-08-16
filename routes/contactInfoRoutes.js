import express from 'express';
import { getContactInfo, updateContactInfo, addContactInfo } from '../controllers/contactInfoController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

// ดึงข้อมูลติดต่อเจ้าหน้าที่
router.get('/', authenticateToken, getContactInfo);

// อัปเดตข้อมูลติดต่อเจ้าหน้าที่
router.put('/', authenticateToken, updateContactInfo);

// เพิ่มข้อมูลติดต่อเจ้าหน้าที่ใหม่
router.post('/', authenticateToken, addContactInfo);

export default router;