import connection from '../db.js';

export const getAllEquipment = async () => {
  try {
    console.log('getAllEquipment - Fetching all equipment...');
    const [rows] = await connection.query('SELECT * FROM equipment');
    console.log('getAllEquipment - Total equipment found:', rows.length);
    console.log('getAllEquipment - Item codes:', rows.map(item => item.item_code));
    return rows;
  } catch (error) {
    console.error('getAllEquipment - Error:', error);
    throw error;
  }
};

// Use item_code as canonical identifier
export const getEquipmentByCode = async (item_code) => {
  try {
    console.log('getEquipmentByCode - Searching for item_code:', item_code);
    const [rows] = await connection.query('SELECT * FROM equipment WHERE item_code = ?', [item_code]);
    console.log('getEquipmentByCode - Found rows:', rows.length);
    if (rows.length > 0) {
      console.log('getEquipmentByCode - First row item_code:', rows[0].item_code);
    }
    return rows;
  } catch (error) {
    console.error('getEquipmentByCode - Error:', error);
    throw error;
  }
};

export const addEquipment = async (equipment) => {
  try {
    // Always use item_code as canonical code
    const item_code = equipment.item_code || equipment.id || equipment.item_id;
    const { name, category, description, quantity, unit, status, pic, price, purchaseDate, room_id } = equipment;
    const [result] = await connection.query(
      'INSERT INTO equipment (item_code, name, category, description, quantity, unit, status, pic, created_at, price, purchaseDate, room_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP(), ?, ?, ?)',
      [item_code, name, category, description, quantity, unit, status, pic, price, purchaseDate, room_id]
    );
    return result;
  } catch (error) {
    throw error;
  }
};



export const getEquipmentByItemId = async (item_id) => {
  try {
    console.log('getEquipmentByItemId - Searching for item_id:', item_id);
    const [rows] = await connection.query('SELECT * FROM equipment WHERE item_id = ?', [item_id]);
    console.log('getEquipmentByItemId - Found rows:', rows.length);
    if (rows.length > 0) {
      console.log('getEquipmentByItemId - First row item_id:', rows[0].item_id);
    }
    return rows;
  } catch (error) {
    console.error('getEquipmentByItemId - Error:', error);
    throw error;
  }
};

export const updateEquipmentByItemId = async (item_id, equipment) => {
  try {
    console.log('updateEquipmentByItemId Model - Equipment item_id:', item_id);
    console.log('updateEquipmentByItemId Model - Equipment data:', equipment);

    const { item_code, name, category, description, quantity, unit, status, pic, purchaseDate, price, room_id } = equipment;

    console.log('updateEquipmentByItemId Model - New item code:', item_code);

    // ถ้า item_code เปลี่ยน ให้ตรวจสอบว่าซ้ำหรือไม่
    if (item_code) {
      console.log('updateEquipmentByItemId Model - Checking for duplicate item_code:', item_code);
      const [existing] = await connection.query('SELECT item_code FROM equipment WHERE item_code = ? AND item_id != ?', [item_code, item_id]);
      console.log('updateEquipmentByItemId Model - Duplicate check result:', existing.length);
      if (existing.length > 0) {
        throw new Error('item_code ซ้ำในระบบ');
      }
    }

    console.log('updateEquipmentByItemId Model - Executing UPDATE query...');
    const [result] = await connection.query(
      'UPDATE equipment SET item_code=?, name=?, category=?, description=?, quantity=?, unit=?, status=?, pic=?, purchaseDate=?, price=?, room_id=? WHERE item_id=?',
      [item_code, name, category, description, quantity, unit, status, pic, purchaseDate, price, room_id, item_id]
    );
    console.log('updateEquipmentByItemId Model - Update result:', result);
    return result;
  } catch (error) {
    console.error('updateEquipmentByItemId Model - Error:', error);
    throw error;
  }
};

export const deleteEquipment = async (item_code) => {
  try {
    const [result] = await connection.query('DELETE FROM equipment WHERE item_code = ?', [item_code]);
    console.log('Delete result:', result);
    return result;
  } catch (error) {
    console.error('Delete equipment error:', error);
    throw error;
  }
};

export const updateEquipmentStatus = async (item_code, status) => {
  try {
    console.log(`[updateEquipmentStatus] Updating equipment ${item_code} status to: "${status}"`);
    const [result] = await connection.query(
      'UPDATE equipment SET status=? WHERE item_code=?',
      [status, item_code]
    );
    console.log(`[updateEquipmentStatus] Update result:`, result);
    console.log(`[updateEquipmentStatus] Affected rows:`, result.affectedRows);
    return result;
  } catch (error) {
    console.error(`[updateEquipmentStatus] Error updating equipment ${item_code} status to ${status}:`, error);
    throw error;
  }
};

export const getLastItemCode = async () => {
  try {
    const [rows] = await connection.query('SELECT item_code FROM equipment ORDER BY item_code DESC LIMIT 1');
    return rows.length > 0 ? rows[0].item_code : null;
  } catch (error) {
    throw error;
  }
};

// ดึงอุปกรณ์ทั้งหมด พร้อม dueDate (วันที่ต้องคืน) ถ้ามีการยืมที่ยังไม่คืน
export const getAllEquipmentWithDueDate = async () => {
  try {
    const [rows] = await connection.query(`
      SELECT
        e.*,
        (
          SELECT bt.return_date
          FROM borrow_items bi
          JOIN borrow_transactions bt ON bi.borrow_id = bt.borrow_id
          WHERE bi.item_id = e.item_id AND bt.status IN ('approved', 'waiting_payment', 'pending')
          ORDER BY bt.return_date DESC LIMIT 1
        ) AS dueDate
      FROM equipment e
    `);
    return rows;
  } catch (error) {
    throw error;
  }
};