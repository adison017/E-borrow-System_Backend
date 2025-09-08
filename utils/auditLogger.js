import AuditLog from '../models/auditLogModel.js';

class AuditLogger {
  constructor() {
    this.isEnabled = process.env.AUDIT_LOGGING !== 'false'; // Enable by default
  }

  // Extract IP address from request
  getClientIP(req) {
    return req.ip || 
           req.connection?.remoteAddress || 
           req.socket?.remoteAddress ||
           req.headers['x-forwarded-for']?.split(',')[0] ||
           req.headers['x-real-ip'] ||
           'unknown';
  }

  // Extract user agent
  getUserAgent(req) {
    return req.headers['user-agent'] || 'unknown';
  }

  // Extract user info from request
  getUserInfo(req) {
    const user = req.user || {};
    return {
      user_id: user.user_id || null,
      username: user.username || null
    };
  }

  // Log user authentication activities
  async logAuth(req, action, details = {}) {
    if (!this.isEnabled) return;

    try {
      const { user_id, username } = this.getUserInfo(req);
      const responseTime = req._startTime ? Date.now() - req._startTime : null;
      
      await AuditLog.log({
        user_id,
        username,
        action_type: action, // 'login', 'logout'
        description: details.description || `User ${action}`,
        ip_address: this.getClientIP(req),
        user_agent: this.getUserAgent(req),
        request_method: req.method,
        request_url: req.originalUrl,
        new_values: details.data || null,
        response_time_ms: responseTime
      });
    } catch (error) {
      // Only log errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to log auth activity:', error);
      }
    }
  }

  // Log CRUD operations
  async logCRUD(req, action, tableName, recordId, description, oldValues = null, newValues = null) {
    if (!this.isEnabled) return;

    try {
      const { user_id, username } = this.getUserInfo(req);
      
      // Calculate response time if available
      const responseTime = req._startTime ? Date.now() - req._startTime : null;
      
      await AuditLog.log({
        user_id,
        username,
        action_type: action, // 'create', 'update', 'delete'
        table_name: tableName,
        record_id: recordId ? String(recordId) : null,
        description,
        old_values: oldValues,
        new_values: newValues,
        ip_address: this.getClientIP(req),
        user_agent: this.getUserAgent(req),
        request_method: req.method,
        request_url: req.originalUrl,
        response_time_ms: responseTime
      });
    } catch (error) {
      // Only log errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to log CRUD activity:', error);
      }
    }
  }

  // Log business operations (borrow, return, approve, etc.)
  async logBusiness(req, action, description, data = null, oldValues = null, tableName = null, recordId = null) {
    if (!this.isEnabled) return;

    try {
      const { user_id, username } = this.getUserInfo(req);
      
      // Calculate response time if available
      const responseTime = req._startTime ? Date.now() - req._startTime : null;
      
      await AuditLog.log({
        user_id,
        username,
        action_type: action, // 'borrow', 'return', 'approve', 'reject'
        table_name: tableName,
        record_id: recordId ? String(recordId) : null,
        description,
        old_values: oldValues,
        new_values: data,
        ip_address: this.getClientIP(req),
        user_agent: this.getUserAgent(req),
        request_method: req.method,
        request_url: req.originalUrl,
        response_time_ms: responseTime
      });
    } catch (error) {
      // Only log errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to log business activity:', error);
      }
    }
  }

  // Log file operations
  async logFile(req, action, filename, details = {}) {
    if (!this.isEnabled) return;

    try {
      const { user_id, username } = this.getUserInfo(req);
      const responseTime = req._startTime ? Date.now() - req._startTime : null;
      
      await AuditLog.log({
        user_id,
        username,
        action_type: action, // 'upload', 'download'
        description: `ไฟล์ ${action}: ${filename}`,
        new_values: { filename, ...details },
        ip_address: this.getClientIP(req),
        user_agent: this.getUserAgent(req),
        request_method: req.method,
        request_url: req.originalUrl,
        response_time_ms: responseTime
      });
    } catch (error) {
      // Only log errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to log file activity:', error);
      }
    }
  }

  // Log system changes
  async logSystem(req, description, data = null) {
    if (!this.isEnabled) return;

    try {
      const { user_id, username } = this.getUserInfo(req);
      
      await AuditLog.log({
        user_id,
        username,
        action_type: 'system_setting',
        description,
        new_values: data,
        ip_address: this.getClientIP(req),
        user_agent: this.getUserAgent(req),
        request_method: req.method,
        request_url: req.originalUrl
      });
    } catch (error) {
      // Only log errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to log system activity:', error);
      }
    }
  }

  // Log permission changes
  async logPermission(req, description, data = null) {
    if (!this.isEnabled) return;

    try {
      const { user_id, username } = this.getUserInfo(req);
      
      await AuditLog.log({
        user_id,
        username,
        action_type: 'permission_change',
        description,
        new_values: data,
        ip_address: this.getClientIP(req),
        user_agent: this.getUserAgent(req),
        request_method: req.method,
        request_url: req.originalUrl
      });
    } catch (error) {
      // Only log errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to log permission activity:', error);
      }
    }
  }

  // Log status changes
  async logStatusChange(req, tableName, recordId, oldStatus, newStatus, description = null) {
    if (!this.isEnabled) return;

    try {
      const { user_id, username } = this.getUserInfo(req);
      
      await AuditLog.log({
        user_id,
        username,
        action_type: 'status_change',
        table_name: tableName,
        record_id: recordId ? String(recordId) : null,
        description: description || `เปลี่ยนสถานะจาก ${oldStatus} เป็น ${newStatus}`,
        old_values: { status: oldStatus },
        new_values: { status: newStatus },
        ip_address: this.getClientIP(req),
        user_agent: this.getUserAgent(req),
        request_method: req.method,
        request_url: req.originalUrl
      });
    } catch (error) {
      // Only log errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to log status change:', error);
      }
    }
  }

  // Generic logging method
  async log(req, actionType, description, data = {}) {
    if (!this.isEnabled) return;

    try {
      const { user_id, username } = this.getUserInfo(req);
      
      await AuditLog.log({
        user_id,
        username,
        action_type: actionType,
        description,
        ...data,
        ip_address: this.getClientIP(req),
        user_agent: this.getUserAgent(req),
        request_method: req.method,
        request_url: req.originalUrl
      });
    } catch (error) {
      // Only log errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to log activity:', error);
      }
    }
  }

  // Middleware to log only essential operations
  middleware() {
    return async (req, res, next) => {
      const startTime = Date.now();
      req._startTime = startTime; // Store start time on request object
      
      // Skip logging for certain paths to reduce repetitive logs
      if (req.originalUrl === '/api/users/verify-token' && req.method === 'GET') {
        return next();
      }
      
      // Override res.end to capture response
      const originalEnd = res.end;
      res.end = function(...args) {
        const responseTime = Date.now() - startTime;
        
        // Skip logging for borrower location updates
        if (req.originalUrl.includes('/location') && req.method === 'PUT') {
          return originalEnd.apply(this, args);
        }
        
        // Skip logging for verify-token endpoints to reduce repetitive logs
        if (req.originalUrl.includes('/verify-token')) {
          return originalEnd.apply(this, args);
        }
        
        // Only log essential operations
        const essentialPaths = [
          '/api/equipment',
          '/api/users',
          '/api/rooms',
          '/api/categories',
          '/api/borrows',
          '/api/repairs',
          '/api/news'
        ];
        
        const isEssentialOperation = essentialPaths.some(path => req.originalUrl.includes(path));
        const isModificationOperation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
        
        if (isEssentialOperation && isModificationOperation && auditLogger.isEnabled) {
          // Get user info if available
          const { user_id, username } = auditLogger.getUserInfo(req);
          
          // Determine action type based on method
          let actionType = 'other';
          if (req.method === 'POST') actionType = 'create';
          else if (req.method === 'PUT' || req.method === 'PATCH') actionType = 'update';
          else if (req.method === 'DELETE') actionType = 'delete';
          
          // Special handling for borrow operations
          if (req.originalUrl.includes('/borrows')) {
            if (req.originalUrl.includes('/approve')) actionType = 'approve';
            else if (req.originalUrl.includes('/return')) actionType = 'return';
            else if (req.method === 'POST') actionType = 'borrow';
          }
          
          // Log the operation only once
          AuditLog.log({
            user_id,
            username,
            action_type: actionType,
            description: `${req.method} ${req.originalUrl}`,
            ip_address: auditLogger.getClientIP(req),
            user_agent: auditLogger.getUserAgent(req),
            request_method: req.method,
            request_url: req.originalUrl,
            status_code: res.statusCode,
            response_time_ms: responseTime
          }).catch(error => {
            // Only log errors in development
            if (process.env.NODE_ENV === 'development') {
              console.error('Failed to log operation:', error);
            }
          });
        }
        
        originalEnd.apply(this, args);
      };
      
      next();
    };
  }
}

// Create singleton instance
const auditLogger = new AuditLogger();

export default auditLogger;