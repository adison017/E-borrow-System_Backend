import db from '../db.js';

// ฟังก์ชันสำหรับจัดการห้อง
export const roomModel = {
  // ฟังก์ชันสำหรับ initialize ตาราง (ไม่สร้างซ้ำถ้ามีอยู่แล้ว)
  initialize: async () => {
    try {
      // ตรวจสอบว่าตาราง room มีอยู่แล้วหรือไม่
      const [rows] = await db.query("SHOW TABLES LIKE 'room'");
      if (rows.length > 0) {
        console.log('✅ Room table already exists, skipping creation');
        return;
      }

      // สร้างตาราง room ถ้ายังไม่มี
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS room (
          room_id INT AUTO_INCREMENT PRIMARY KEY,
          room_name VARCHAR(100) NOT NULL,
          room_code VARCHAR(20) UNIQUE,
          address TEXT,
          detail TEXT,
          image_url VARCHAR(255),
          note TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `;

      await db.query(createTableQuery);
      console.log('✅ Room table created successfully');
    } catch (error) {
      console.error('❌ Error initializing room table:', error.message);
      console.warn('⚠️ Room features may not work properly');
    }
  },

  // ดึงข้อมูลห้องทั้งหมด
  getAllRooms: async () => {
    const query = `
      SELECT
        room_id,
        room_name,
        room_code,
        address,
        detail,
        image_url,
        note,
        created_at,
        updated_at
      FROM room
      ORDER BY room_name
    `;

    try {
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error('Error getting all rooms:', error);
      throw error;
    }
  },

  // ดึงข้อมูลห้องตาม ID
  getRoomById: async (id) => {
    const query = `
      SELECT
        room_id,
        room_name,
        room_code,
        address,
        detail,
        image_url,
        note,
        created_at,
        updated_at
      FROM room
      WHERE room_id = ?
    `;

    try {
      const [rows] = await db.query(query, [id]);
      return rows[0];
    } catch (error) {
      console.error('Error getting room by ID:', error);
      throw error;
    }
  },

  // ดึงข้อมูลห้องตามรหัสห้อง
  getRoomByCode: async (roomCode) => {
    const query = `
      SELECT
        room_id,
        room_name,
        room_code,
        address,
        detail,
        image_url,
        note,
        created_at,
        updated_at
      FROM room
      WHERE room_code = ?
    `;

    try {
      const [rows] = await db.query(query, [roomCode]);
      return rows[0];
    } catch (error) {
      console.error('Error getting room by code:', error);
      throw error;
    }
  },

  // เพิ่มห้องใหม่
  createRoom: async (roomData) => {
    const query = `
      INSERT INTO room (room_name, room_code, address, detail, image_url, note)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    try {
      const [result] = await db.query(query, [
        roomData.room_name,
        roomData.room_code,
        roomData.address,
        roomData.detail,
        roomData.image_url,
        roomData.note
      ]);
      return result.insertId;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  },

  // อัปเดตข้อมูลห้อง
  updateRoom: async (id, roomData) => {
    const query = `
      UPDATE room
      SET room_name = ?, room_code = ?, address = ?, detail = ?, image_url = ?, note = ?
      WHERE room_id = ?
    `;

    try {
      const [result] = await db.query(query, [
        roomData.room_name,
        roomData.room_code,
        roomData.address,
        roomData.detail,
        roomData.image_url,
        roomData.note,
        id
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating room:', error);
      throw error;
    }
  },

  // ลบห้อง
  deleteRoom: async (id) => {
    const query = `DELETE FROM room WHERE room_id = ?`;

    try {
      const [result] = await db.query(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error;
    }
  },

  // ตรวจสอบว่าห้องมีอยู่หรือไม่
  roomExists: async (roomCode) => {
    const query = `SELECT COUNT(*) as count FROM room WHERE room_code = ?`;

    try {
      const [rows] = await db.query(query, [roomCode]);
      return rows[0].count > 0;
    } catch (error) {
      console.error('Error checking room existence:', error);
      throw error;
    }
  }
};

export default roomModel;