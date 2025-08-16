import db from '../db.js';

// ดึงข้อมูลติดต่อเจ้าหน้าที่
export const getContactInfo = async () => {
  try {
    const [rows] = await db.query('SELECT * FROM contact_info ORDER BY id DESC LIMIT 1');
    if (rows.length > 0) {
      return {
        success: true,
        data: rows[0]
      };
    } else {
      return {
        success: false,
        message: 'ไม่พบข้อมูลติดต่อเจ้าหน้าที่'
      };
    }
  } catch (error) {
    console.error('Error getting contact info:', error);
    throw error;
  }
};

// อัปเดตข้อมูลติดต่อเจ้าหน้าที่
export const updateContactInfo = async (contactData) => {
  try {
    const { location, phone, hours } = contactData;

    // ตรวจสอบว่ามีข้อมูลอยู่แล้วหรือไม่
    const [existingRows] = await db.query('SELECT id FROM contact_info LIMIT 1');

    if (existingRows.length > 0) {
      // อัปเดตข้อมูลที่มีอยู่
      const [result] = await db.query(
        'UPDATE contact_info SET location = ?, phone = ?, hours = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [location, phone, hours, existingRows[0].id]
      );
      return {
        success: true,
        message: 'อัปเดตข้อมูลติดต่อสำเร็จ',
        data: {
          id: existingRows[0].id,
          location,
          phone,
          hours,
          updated_at: new Date()
        }
      };
    } else {
      // เพิ่มข้อมูลใหม่ถ้ายังไม่มี
      const [result] = await db.query(
        'INSERT INTO contact_info (location, phone, hours) VALUES (?, ?, ?)',
        [location, phone, hours]
      );
      return {
        success: true,
        message: 'เพิ่มข้อมูลติดต่อสำเร็จ',
        data: {
          id: result.insertId,
          location,
          phone,
          hours,
          created_at: new Date(),
          updated_at: new Date()
        }
      };
    }
  } catch (error) {
    console.error('Error updating contact info:', error);
    throw error;
  }
};

// เพิ่มข้อมูลติดต่อเจ้าหน้าที่ใหม่
export const addContactInfo = async (contactData) => {
  try {
    const { location, phone, hours } = contactData;

    const [result] = await db.query(
      'INSERT INTO contact_info (location, phone, hours) VALUES (?, ?, ?)',
      [location, phone, hours]
    );

    return result.insertId;
  } catch (error) {
    console.error('Error adding contact info:', error);
    throw error;
  }
};