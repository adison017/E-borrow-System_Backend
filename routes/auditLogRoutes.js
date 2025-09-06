import express from 'express';
import auditLogController from '../controllers/auditLogController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Middleware to require admin role for all audit log routes
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required.'
    });
  }
  next();
};

// Apply auth and admin middleware to all routes
router.use(authMiddleware);
router.use(requireAdmin);

// Initialize audit logs table
router.post('/initialize', auditLogController.initializeTable);

// Get audit logs with filters and pagination
router.get('/logs', auditLogController.getLogs);

// Get activity summary statistics
router.get('/summary', auditLogController.getActivitySummary);

// Export logs to CSV
router.get('/export', auditLogController.exportLogs);

// Get user activity report
router.get('/user/:user_id', auditLogController.getUserActivityReport);

// Get available action types for filtering
router.get('/action-types', auditLogController.getActionTypes);

// Clean up old logs (maintenance)
router.delete('/cleanup', auditLogController.cleanupOldLogs);

// Clean up view logs (one-time cleanup)
router.delete('/cleanup-view-logs', auditLogController.cleanupViewLogs);

export default router;