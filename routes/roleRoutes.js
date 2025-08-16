import express from 'express';
import db from '../db.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all role routes
router.use(authMiddleware);

// Get all roles
router.get('/', async (req, res) => {
  try {
    const [roles] = await db.query('SELECT * FROM roles ORDER BY role_id');
    res.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลบทบาท',
      error: error.message
    });
  }
});

// Get role by ID
router.get('/:id', async (req, res) => {
  try {
    const [roles] = await db.query('SELECT * FROM roles WHERE role_id = ?', [req.params.id]);

    if (roles.length === 0) {
      return res.status(404).json({
        message: 'ไม่พบบทบาทที่ต้องการ',
        error: 'Role not found'
      });
    }

    res.json(roles[0]);
  } catch (error) {
    console.error('Error fetching role:', error);
    res.status(500).json({
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลบทบาท',
      error: error.message
    });
  }
});

// Create new role
router.post('/', async (req, res) => {
  try {
    const { role_name } = req.body;

    if (!role_name) {
      return res.status(400).json({
        message: 'กรุณาระบุชื่อบทบาท',
        error: 'Role name is required'
      });
    }

    const [result] = await db.query(
      'INSERT INTO roles (role_name) VALUES (?)',
      [role_name]
    );

    res.status(201).json({
      message: 'เพิ่มบทบาทสำเร็จ',
      roleId: result.insertId
    });
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({
      message: 'เกิดข้อผิดพลาดในการเพิ่มบทบาท',
      error: error.message
    });
  }
});

// Update role
router.put('/:id', async (req, res) => {
  try {
    const { role_name } = req.body;
    const roleId = req.params.id;

    if (!role_name) {
      return res.status(400).json({
        message: 'กรุณาระบุชื่อบทบาท',
        error: 'Role name is required'
      });
    }

    const [result] = await db.query(
      'UPDATE roles SET role_name = ? WHERE role_id = ?',
      [role_name, roleId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'ไม่พบบทบาทที่ต้องการแก้ไข',
        error: 'Role not found'
      });
    }

    res.json({
      message: 'อัพเดทบทบาทสำเร็จ',
      affectedRows: result.affectedRows
    });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({
      message: 'เกิดข้อผิดพลาดในการอัพเดทบทบาท',
      error: error.message
    });
  }
});

// Delete role
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM roles WHERE role_id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'ไม่พบบทบาทที่ต้องการลบ',
        error: 'Role not found'
      });
    }

    res.json({
      message: 'ลบบทบาทสำเร็จ',
      affectedRows: result.affectedRows
    });
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({
      message: 'เกิดข้อผิดพลาดในการลบบทบาท',
      error: error.message
    });
  }
});

export default router;