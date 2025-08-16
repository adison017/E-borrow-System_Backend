import Role from '../models/roleModel.js';

const roleController = {
  // ดึงข้อมูลบทบาททั้งหมด
  getAllRoles: async (req, res) => {
    try {
      const roles = await Role.findAll();
      res.json(roles);
    } catch (error) {
      console.error('Error in getAllRoles:', error);
      res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลบทบาท' });
    }
  },

  // ดึงข้อมูลบทบาทตาม ID
  getRoleById: async (req, res) => {
    try {
      const { id } = req.params;
      const role = await Role.findById(id);

      if (!role) {
        return res.status(404).json({ message: 'ไม่พบข้อมูลบทบาท' });
      }

      res.json(role);
    } catch (error) {
      console.error('Error in getRoleById:', error);
      res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลบทบาท' });
    }
  },

  // สร้างบทบาทใหม่
  createRole: async (req, res) => {
    try {
      const { role_name, description } = req.body;

      if (!role_name) {
        return res.status(400).json({ message: 'กรุณาระบุชื่อบทบาท' });
      }

      const newRole = await Role.create({ role_name, description });
      res.status(201).json(newRole);
    } catch (error) {
      console.error('Error in createRole:', error);
      res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสร้างบทบาท' });
    }
  },

  // อัปเดตข้อมูลบทบาท
  updateRole: async (req, res) => {
    try {
      const { id } = req.params;
      const { role_name, description } = req.body;

      if (!role_name) {
        return res.status(400).json({ message: 'กรุณาระบุชื่อบทบาท' });
      }

      const updatedRole = await Role.update(id, { role_name, description });

      if (!updatedRole) {
        return res.status(404).json({ message: 'ไม่พบข้อมูลบทบาท' });
      }

      res.json(updatedRole);
    } catch (error) {
      console.error('Error in updateRole:', error);
      res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลบทบาท' });
    }
  },

  // ลบบทบาท
  deleteRole: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Role.delete(id);

      if (!result) {
        return res.status(404).json({ message: 'ไม่พบข้อมูลบทบาท' });
      }

      res.json({ message: 'ลบข้อมูลบทบาทสำเร็จ' });
    } catch (error) {
      console.error('Error in deleteRole:', error);
      res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบข้อมูลบทบาท' });
    }
  }
};

export default roleController;