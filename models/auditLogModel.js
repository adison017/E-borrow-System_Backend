import db from '../db.js';

const AuditLog = {
  // Create audit_logs table if not exists
  createTable: async () => {
    try {
      // First create the table
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS audit_logs (
          log_id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NULL,
          username VARCHAR(100) NULL,
          action_type ENUM(
            'create', 'update', 'delete', 'borrow', 'return', 'approve', 'reject',
            'login', 'logout', 'upload', 'download', 'system_setting', 'permission_change', 'status_change'
          ) NOT NULL,
          table_name VARCHAR(100) NULL,
          record_id VARCHAR(100) NULL,
          description TEXT NULL,
          old_values JSON NULL,
          new_values JSON NULL,
          ip_address VARCHAR(45) NULL,
          user_agent TEXT NULL,
          request_method VARCHAR(10) NULL,
          request_url VARCHAR(500) NULL,
          status_code INT DEFAULT 200,
          response_time_ms INT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_user_id (user_id),
          INDEX idx_action_type (action_type),
          INDEX idx_table_name (table_name),
          INDEX idx_created_at (created_at),
          INDEX idx_username (username),
          FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `;
      
      await db.execute(createTableQuery);
      
      // Add additional indexes for better performance
      try {
        // Index for combined user_id and created_at for user activity reports
        await db.execute('CREATE INDEX idx_user_created ON audit_logs (user_id, created_at)');
      } catch (indexError) {
        // Index might already exist, ignore
        console.log('Index idx_user_created already exists or creation failed');
      }
      
      try {
        // Index for combined action_type and created_at for activity summaries
        await db.execute('CREATE INDEX idx_action_created ON audit_logs (action_type, created_at)');
      } catch (indexError) {
        // Index might already exist, ignore
        console.log('Index idx_action_created already exists or creation failed');
      }
      
      try {
        // Index for search operations
        await db.execute('CREATE INDEX idx_search ON audit_logs (description(255), username(50), request_url(100))');
      } catch (indexError) {
        // Index might already exist, ignore
        console.log('Index idx_search already exists or creation failed');
      }
      
      console.log('✅ Audit logs table created/verified successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Error creating audit logs table:', error);
      throw error;
    }
  },

  // Log an activity
  log: async (logData) => {
    try {
      const {
        user_id = null,
        username = null,
        action_type,
        table_name = null,
        record_id = null,
        description = null,
        old_values = null,
        new_values = null,
        ip_address = null,
        user_agent = null,
        request_method = null,
        request_url = null,
        status_code = 200,
        response_time_ms = null
      } = logData;

      const [result] = await db.execute(
        `INSERT INTO audit_logs (
          user_id, username, action_type, table_name, record_id, description,
          old_values, new_values, ip_address, user_agent, request_method,
          request_url, status_code, response_time_ms
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user_id,
          username,
          action_type,
          table_name,
          record_id,
          description,
          old_values ? JSON.stringify(old_values) : null,
          new_values ? JSON.stringify(new_values) : null,
          ip_address,
          user_agent,
          request_method,
          request_url,
          status_code,
          response_time_ms
        ]
      );

      return { success: true, log_id: result.insertId };
    } catch (error) {
      console.error('❌ Error logging activity:', error);
      throw error;
    }
  },

  // Get logs with filters and pagination
  getLogs: async (filters = {}) => {
    try {
      let whereConditions = [];
      let params = [];
      
      const {
        user_id,
        username,
        action_type,
        table_name,
        start_date,
        end_date,
        limit = 25,
        offset = 0,
        search
      } = filters;

      if (user_id) {
        whereConditions.push('al.user_id = ?');
        params.push(user_id);
      }
      
      if (username) {
        whereConditions.push('al.username LIKE ?');
        params.push(`%${username}%`);
      }
      
      if (action_type) {
        whereConditions.push('al.action_type = ?');
        params.push(action_type);
      }
      
      if (table_name) {
        whereConditions.push('al.table_name = ?');
        params.push(table_name);
      }
      
      if (start_date) {
        whereConditions.push('al.created_at >= ?');
        params.push(start_date);
      }
      
      if (end_date) {
        whereConditions.push('al.created_at <= ?');
        params.push(end_date);
      }
      
      if (search) {
        whereConditions.push('(al.description LIKE ? OR al.username LIKE ? OR al.request_url LIKE ?)');
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
      
      // Add a timeout to prevent long-running queries
      const query = `
        SELECT 
          al.*,
          u.Fullname as user_fullname,
          u.email as user_email,
          r.role_name as role_name
        FROM audit_logs al
        LEFT JOIN users u ON al.user_id = u.user_id
        LEFT JOIN roles r ON u.role_id = r.role_id
        ${whereClause}
        ORDER BY al.created_at DESC
        LIMIT ? OFFSET ?
      `;
      
      params.push(parseInt(limit), parseInt(offset));
      
      // Set a query timeout of 5 seconds
      const [logs] = await db.execute({
        sql: query,
        timeout: 5000
      }, params);
      
      // Get total count with timeout
      const countQuery = `
        SELECT COUNT(*) as total
        FROM audit_logs al
        LEFT JOIN users u ON al.user_id = u.user_id
        ${whereClause}
      `;
      
      const countParams = params.slice(0, -2); // Remove limit and offset
      const [countResult] = await db.execute({
        sql: countQuery,
        timeout: 5000
      }, countParams);
      const total = countResult[0].total;
      
      return {
        success: true,
        data: logs,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('❌ Error getting audit logs:', error);
      throw error;
    }
  },

  // Get activity summary statistics
  getActivitySummary: async (period = '24h') => {
    try {
      let dateCondition = '';
      
      switch (period) {
        case '1h':
          dateCondition = 'AND al.created_at >= DATE_SUB(NOW(), INTERVAL 1 HOUR)';
          break;
        case '24h':
          dateCondition = 'AND al.created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)';
          break;
        case '7d':
          dateCondition = 'AND al.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
          break;
        case '30d':
          dateCondition = 'AND al.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
          break;
        default:
          dateCondition = 'AND al.created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)';
      }

      // Add timeout to prevent long-running queries
      const [activityByType] = await db.execute({
        sql: `
          SELECT 
            action_type,
            COUNT(*) as count
          FROM audit_logs al
          WHERE 1=1 ${dateCondition}
          GROUP BY action_type
          ORDER BY count DESC
        `,
        timeout: 5000
      });

      const [activityByUser] = await db.execute({
        sql: `
          SELECT 
            al.username,
            u.Fullname,
            COUNT(*) as activity_count
          FROM audit_logs al
          LEFT JOIN users u ON al.user_id = u.user_id
          WHERE al.username IS NOT NULL ${dateCondition}
          GROUP BY al.user_id, al.username, u.Fullname
          ORDER BY activity_count DESC
          LIMIT 10
        `,
        timeout: 5000
      });

      const [hourlyActivity] = await db.execute({
        sql: `
          SELECT 
            HOUR(al.created_at) as hour,
            COUNT(*) as count
          FROM audit_logs al
          WHERE al.created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
          GROUP BY HOUR(al.created_at)
          ORDER BY hour
        `,
        timeout: 5000
      });

      return {
        success: true,
        data: {
          activity_by_type: activityByType,
          top_active_users: activityByUser,
          hourly_activity: hourlyActivity,
          period
        }
      };
    } catch (error) {
      console.error('❌ Error getting activity summary:', error);
      throw error;
    }
  },

  // Export logs to CSV
  exportLogs: async (filters) => {
    try {
      // Reduced limit for export to prevent timeouts
      const exportFilters = {
        ...filters,
        limit: 5000, // Reduced from 10000 to 5000
        offset: 0
      };

      const result = await AuditLog.getLogs(exportFilters);
      
      return result;
    } catch (error) {
      console.error('❌ Error exporting audit logs:', error);
      throw error;
    }
  },

  // Get user activity report
  getUserActivityReport: async (filters) => {
    try {
      // Add timeout to prevent long-running queries
      const result = await AuditLog.getLogs(filters);
      
      return result;
    } catch (error) {
      console.error('Error getting user activity report:', error);
      throw error;
    }
  },

  // Get action types for filtering
  getActionTypes: async () => {
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

      return {
        success: true,
        data: actionTypes
      };
    } catch (error) {
      console.error('Error getting action types:', error);
      throw error;
    }
  },

  // Delete old logs (for maintenance)
  deleteOldLogs: async (daysToKeep = 90) => {
    try {
      const [result] = await db.execute(
        `DELETE FROM audit_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)`,
        [daysToKeep]
      );

      return {
        success: true,
        deleted_count: result.affectedRows
      };
    } catch (error) {
      console.error('❌ Error deleting old logs:', error);
      throw error;
    }
  },

  // Delete view logs (one-time cleanup)
  deleteViewLogs: async () => {
    try {
      const [result] = await db.execute(
        `DELETE FROM audit_logs WHERE action_type = 'view' OR description LIKE '%ดู%' OR description LIKE 'view%'`
      );

      return {
        success: true,
        deleted_count: result.affectedRows
      };
    } catch (error) {
      console.error('❌ Error deleting view logs:', error);
      throw error;
    }
  }
};

export default AuditLog;