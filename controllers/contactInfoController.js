import * as ContactInfoModel from '../models/contactInfoModel.js';

// ดึงข้อมูลติดต่อเจ้าหน้าที่
export const getContactInfo = async (req, res) => {
  try {
    const result = await ContactInfoModel.getContactInfo();
    if (result.success) {
      res.json({
        success: true,
        data: result.data
      });
    } else {
      res.status(404).json({
        success: false,
        message: result.message
      });
    }
  } catch (err) {
    console.error('Error getting contact info:', err);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด',
      error: err.message
    });
  }
};

// อัปเดตข้อมูลติดต่อเจ้าหน้าที่
export const updateContactInfo = async (req, res) => {
  try {
    const { location, phone, hours } = req.body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!location || !phone || !hours) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลให้ครบถ้วน: location, phone, hours'
      });
    }

    const result = await ContactInfoModel.updateContactInfo({ location, phone, hours });
    res.json({
      success: true,
      message: result.message,
      data: result.data
    });
  } catch (err) {
    console.error('Error updating contact info:', err);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด',
      error: err.message
    });
  }
};

// เพิ่มข้อมูลติดต่อเจ้าหน้าที่ใหม่
export const addContactInfo = async (req, res) => {
  try {
    const { location, phone, hours } = req.body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!location || !phone || !hours) {
      return res.status(400).json({
        message: 'กรุณากรอกข้อมูลให้ครบถ้วน: location, phone, hours'
      });
    }

    const result = await ContactInfoModel.addContactInfo({ location, phone, hours });
    res.status(201).json({
      message: 'เพิ่มข้อมูลติดต่อเจ้าหน้าที่สำเร็จ',
      id: result
    });
  } catch (err) {
    console.error('Error adding contact info:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};