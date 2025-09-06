import AuditLog from '../models/auditLogModel.js';
import auditLogger from '../utils/auditLogger.js';

const auditLogController = {
  // Initialize audit logs table
  initializeTable: async (req, res) => {
    try {
      await AuditLog.createTable();
      
      await auditLogger.logSystem(req, 'เริ่มต้นตารางบันทึกกิจกรรมแล้ว');
      
      res.json({
        success: true,
        message: 'Audit logs table initialized successfully'
      });
    } catch (error) {
      console.error('Error initializing audit logs table:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to initialize audit logs table',
        error: error.message
      });
    }
  },

  // Get audit logs with filters
  getLogs: async (req, res) => {
    try {
      const {
        user_id,
        username,
        action_type,
        table_name,
        start_date,
        end_date,
        limit = 50,
        offset = 0,
        search
      } = req.query;

      const filters = {
        user_id,
        username,
        action_type,
        table_name,
        start_date,
        end_date,
        limit: parseInt(limit),
        offset: parseInt(offset),
        search
      };

      const result = await AuditLog.getLogs(filters);
      
      res.json(result);
    } catch (error) {
      console.error('Error getting audit logs:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get audit logs',
        error: error.message
      });
    }
  },

  // Get activity summary
  getActivitySummary: async (req, res) => {
    try {
      const { period = '24h' } = req.query;
      const result = await AuditLog.getActivitySummary(period);
      
      res.json(result);
    } catch (error) {
      console.error('Error getting activity summary:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get activity summary',
        error: error.message
      });
    }
  },

  // Export logs to CSV
  exportLogs: async (req, res) => {
    try {
      const {
        user_id,
        username,
        action_type,
        table_name,
        start_date,
        end_date,
        search
      } = req.query;

      const filters = {
        user_id,
        username,
        action_type,
        table_name,
        start_date,
        end_date,
        limit: 10000, // Large limit for export
        offset: 0,
        search
      };

      const result = await AuditLog.getLogs(filters);
      
      if (!result.success || !result.data.length) {
        return res.status(404).json({
          success: false,
          message: 'No logs found for export'
        });
      }

      // Convert to CSV
      const csvHeader = [
        'Log ID',
        'Date/Time',
        'Username',
        'Full Name',
        'Action Type',
        'Table Name',
        'Record ID',
        'Description',
        'IP Address',
        'Status Code',
        'Response Time (ms)'
      ].join(',');

      const csvRows = result.data.map(log => [
        log.log_id,
        log.created_at,
        log.username || '',
        log.user_fullname || '',
        log.action_type,
        log.table_name || '',
        log.record_id || '',
        `"${(log.description || '').replace(/"/g, '""')}"`, // Escape quotes
        log.ip_address || '',
        log.status_code || '',
        log.response_time_ms || ''
      ].join(','));

      const csv = [csvHeader, ...csvRows].join('\n');
      
      // Log the export
      await auditLogger.logFile(req, 'download', 'audit_logs.csv', { 
        filters, 
        record_count: result.data.length 
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="audit_logs_${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csv);
    } catch (error) {
      console.error('Error exporting audit logs:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to export audit logs',
        error: error.message
      });
    }
  },

  // Get user activity report
  getUserActivityReport: async (req, res) => {
    try {
      const { user_id } = req.params;
      const { start_date, end_date, limit = 100 } = req.query;

      const filters = {
        user_id,
        start_date,
        end_date,
        limit: parseInt(limit),
        offset: 0
      };

      const result = await AuditLog.getLogs(filters);
      
      res.json(result);
    } catch (error) {
      console.error('Error getting user activity report:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get user activity report',
        error: error.message
      });
    }
  },

  // Get action types for filtering
  getActionTypes: async (req, res) => {
    try {
      const actionTypes = [
        { value: 'create', label: 'สร้างข้อมูล' },
        { value: 'update', label: 'แก้ไขข้อมูล' },
        { value: 'delete', label: 'ลบข้อมูล' },
        { value: 'borrow', label: 'ยืมครุภัณฑ์' },
        { value: 'return', label: 'คืนครุภัณฑ์' },
        { value: 'approve', label: 'อนุมัติ' },
        { value: 'reject', label: 'ปฏิเสธ' },
        { value: 'login', label: 'เข้าสู่ระบบ' },
        { value: 'logout', label: 'ออกจากระบบ' },
        { value: 'upload', label: 'อัปโหลดไฟล์' },
        { value: 'download', label: 'ดาวน์โหลดไฟล์' }
      ];

      res.json({
        success: true,
        data: actionTypes
      });
    } catch (error) {
      console.error('Error getting action types:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get action types',
        error: error.message
      });
    }
  },

  // Clean up old logs (for maintenance)
  cleanupOldLogs: async (req, res) => {
    try {
      const { days = 90 } = req.query;
      const result = await AuditLog.deleteOldLogs(parseInt(days));
      
      await auditLogger.logSystem(req, `ล้างข้อมูลบันทึกที่เก่ากว่า ${days} วัน`, {
        deleted_count: result.deleted_count,
        days: parseInt(days)
      });
      
      res.json({
        success: true,
        message: `Successfully deleted ${result.deleted_count} old log entries`,
        deleted_count: result.deleted_count
      });
    } catch (error) {
      console.error('Error cleaning up old logs:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to clean up old logs',
        error: error.message
      });
    }
  },

  // Clean up view logs (one-time cleanup)
  cleanupViewLogs: async (req, res) => {
    try {
      const result = await AuditLog.deleteViewLogs();
      
      await auditLogger.logSystem(req, 'ล้างข้อมูลบันทึกการดูข้อมูล (view logs)', {
        deleted_count: result.deleted_count
      });
      
      res.json({
        success: true,
        message: `Successfully deleted ${result.deleted_count} view log entries`,
        deleted_count: result.deleted_count
      });
    } catch (error) {
      console.error('Error cleaning up view logs:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to clean up view logs',
        error: error.message
      });
    }
  }
};

export default auditLogController;