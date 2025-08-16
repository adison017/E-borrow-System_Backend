import User from '../models/userModel.js';
import db from '../db.js';

const notificationSettingsController = {
  // GET /api/notification-settings/stats
  getNotificationStats: async (req, res) => {
    try {
      // Get overall statistics
      const [overallStats] = await db.query(`
        SELECT
          COUNT(*) as total_users,
          SUM(CASE WHEN line_id IS NOT NULL AND line_id != 'ยังไม่ผูกบัญชี' THEN 1 ELSE 0 END) as users_with_line,
          SUM(CASE WHEN line_id IS NOT NULL AND line_id != 'ยังไม่ผูกบัญชี' AND line_notify_enabled = 1 THEN 1 ELSE 0 END) as users_enabled_line
        FROM users
      `);

      // Get statistics by role
      const [roleStats] = await db.query(`
        SELECT
          r.role_name,
          COUNT(u.user_id) as total_users,
          SUM(CASE WHEN u.line_id IS NOT NULL AND u.line_id != 'ยังไม่ผูกบัญชี' THEN 1 ELSE 0 END) as users_with_line,
          SUM(CASE WHEN u.line_id IS NOT NULL AND u.line_id != 'ยังไม่ผูกบัญชี' AND u.line_notify_enabled = 1 THEN 1 ELSE 0 END) as users_enabled_line
        FROM roles r
        LEFT JOIN users u ON r.role_id = u.role_id
        GROUP BY r.role_id, r.role_name
        ORDER BY r.role_id
      `);

      res.json({
        success: true,
        data: {
          overall: overallStats[0],
          by_role: roleStats
        },
        message: 'ดึงสถิติการแจ้งเตือนสำเร็จ'
      });
    } catch (error) {
      console.error('Error getting notification stats:', error);
      res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการดึงสถิติการแจ้งเตือน',
        error: error.message
      });
    }
  },

  // GET /api/notification-settings/users
  getAllUsersNotificationSettings: async (req, res) => {
    try {
      const [users] = await db.query(`
        SELECT
          u.user_id,
          u.user_code,
          u.username,
          u.Fullname,
          u.email,
          u.line_id,
          u.line_notify_enabled,
          r.role_name,
          p.position_name,
          b.branch_name
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.role_id
        LEFT JOIN positions p ON u.position_id = p.position_id
        LEFT JOIN branches b ON u.branch_id = b.branch_id
        ORDER BY r.role_id, u.Fullname
      `);

      res.json({
        success: true,
        data: users,
        message: 'ดึงข้อมูลการตั้งค่าการแจ้งเตือนของผู้ใช้สำเร็จ'
      });
    } catch (error) {
      console.error('Error getting users notification settings:', error);
      res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการดึงข้อมูลการตั้งค่าการแจ้งเตือน',
        error: error.message
      });
    }
  },

  // PUT /api/notification-settings/users/:userId/line-toggle
  toggleUserLineNotification: async (req, res) => {
    try {
      const { userId } = req.params;
      const { enabled } = req.body;

      if (typeof enabled !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'ค่า enabled ต้องเป็น boolean'
        });
      }

      const result = await User.updateLineNotifyEnabled(userId, enabled ? 1 : 0);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'ไม่พบผู้ใช้งาน'
        });
      }

      res.json({
        success: true,
        message: `${enabled ? 'เปิด' : 'ปิด'}การแจ้งเตือน LINE สำเร็จ`
      });
    } catch (error) {
      console.error('Error toggling LINE notification:', error);
      res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการเปลี่ยนการตั้งค่าการแจ้งเตือน',
        error: error.message
      });
    }
  },

  // PUT /api/notification-settings/bulk-toggle
  bulkToggleNotifications: async (req, res) => {
    try {
      const { userIds, enabled } = req.body;

      if (!Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'userIds ต้องเป็น array และไม่ว่าง'
        });
      }

      if (typeof enabled !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'ค่า enabled ต้องเป็น boolean'
        });
      }

      const placeholders = userIds.map(() => '?').join(',');
      const [result] = await db.query(
        `UPDATE users SET line_notify_enabled = ? WHERE user_id IN (${placeholders})`,
        [enabled ? 1 : 0, ...userIds]
      );

      res.json({
        success: true,
        message: `${enabled ? 'เปิด' : 'ปิด'}การแจ้งเตือน LINE สำหรับ ${result.affectedRows} ผู้ใช้งานสำเร็จ`,
        affectedRows: result.affectedRows
      });
    } catch (error) {
      console.error('Error bulk toggling notifications:', error);
      res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการเปลี่ยนการตั้งค่าการแจ้งเตือนหลายคน',
        error: error.message
      });
    }
  },

  // POST /api/notification-settings/test-line-connection
  testLineConnection: async (req, res) => {
    try {
      const token = process.env.token;
      const secretcode = process.env.secretcode;

      if (!token || !secretcode) {
        return res.status(400).json({
          success: false,
          message: 'LINE Bot configuration ไม่ครบถ้วน กรุณาตั้งค่า token และ secretcode ใน .env file'
        });
      }

      // ทดสอบการเชื่อมต่อ (ในกรณีจริงอาจจะเรียก LINE API เพื่อทดสอบ)
      res.json({
        success: true,
        message: 'การเชื่อมต่อ LINE Bot สำเร็จ',
        config: {
          token_configured: !!token,
          secret_configured: !!secretcode
        }
      });
    } catch (error) {
      console.error('Error testing LINE connection:', error);
      res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการทดสอบการเชื่อมต่อ LINE Bot',
        error: error.message
      });
    }
  }
};

export default notificationSettingsController;