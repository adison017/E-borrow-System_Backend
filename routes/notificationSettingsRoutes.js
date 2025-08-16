import express from 'express';
import notificationSettingsController from '../controllers/notificationSettingsController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// ทุก route ต้องผ่าน authentication
router.use(authMiddleware);

// Routes สำหรับสถิติการแจ้งเตือน
router.get('/stats', notificationSettingsController.getNotificationStats);

// Routes สำหรับการจัดการการตั้งค่าการแจ้งเตือนของผู้ใช้
router.get('/users', notificationSettingsController.getAllUsersNotificationSettings);
router.put('/users/:userId/line-toggle', notificationSettingsController.toggleUserLineNotification);
router.put('/bulk-toggle', notificationSettingsController.bulkToggleNotifications);

// Routes สำหรับการทดสอบ
router.post('/test-line-connection', notificationSettingsController.testLineConnection);

export default router;