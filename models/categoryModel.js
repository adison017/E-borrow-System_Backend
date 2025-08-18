import connection from '../db.js';

export const getAllCategories = async () => {
  try {
    const [rows] = await connection.query('SELECT * FROM category');
    return rows;
  } catch (error) {
    throw error;
  }
};

export const getCategoryById = async (category_id) => {
  try {
    const [rows] = await connection.query('SELECT * FROM category WHERE category_id = ?', [category_id]);
    return rows;
  } catch (error) {
    throw error;
  }
};

export const addCategory = async (category) => {
  try {
    const { category_code, name, created_at, updated_at } = category;

    // ตรวจสอบรหัสซ้ำ
    const [existingCode] = await connection.query(
      'SELECT category_id FROM category WHERE category_code = ?',
      [category_code]
    );
    if (existingCode.length > 0) {
      throw new Error('รหัสหมวดหมู่นี้มีอยู่แล้ว');
    }

    // ตรวจสอบชื่อซ้ำ (case-insensitive)
    const [existingName] = await connection.query(
      'SELECT category_id FROM category WHERE LOWER(name) = LOWER(?)',
      [name]
    );
    if (existingName.length > 0) {
      throw new Error('ชื่อหมวดหมู่นี้มีอยู่แล้ว');
    }

    const [result] = await connection.query(
      'INSERT INTO category (category_code, name, created_at, updated_at) VALUES (?, ?, ?, ?)',
      [category_code, name, created_at, updated_at]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

export const updateCategory = async (category_id, category) => {
  try {
    const { name, updated_at } = category;

    // ตรวจสอบชื่อซ้ำ (case-insensitive) ยกเว้นตัวเอง
    const [existingName] = await connection.query(
      'SELECT category_id FROM category WHERE LOWER(name) = LOWER(?) AND category_id != ?',
      [name, category_id]
    );
    if (existingName.length > 0) {
      throw new Error('ชื่อหมวดหมู่นี้มีอยู่แล้ว');
    }

    const [result] = await connection.query(
      'UPDATE category SET name=?, updated_at=? WHERE category_id=?',
      [name, updated_at, category_id]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

export const deleteCategory = async (category_id) => {
  try {
    const [result] = await connection.query('DELETE FROM category WHERE category_id = ?', [category_id]);
    return result;
  } catch (error) {
    throw error;
  }
};

// ฟังก์ชันตรวจสอบรหัสซ้ำ
export const checkCategoryCodeExists = async (category_code, exclude_id = null) => {
  try {
    let query = 'SELECT category_id FROM category WHERE category_code = ?';
    let params = [category_code];

    if (exclude_id) {
      query += ' AND category_id != ?';
      params.push(exclude_id);
    }

    const [rows] = await connection.query(query, params);
    return rows.length > 0;
  } catch (error) {
    throw error;
  }
};

// ฟังก์ชันตรวจสอบชื่อซ้ำ
export const checkCategoryNameExists = async (name, exclude_id = null) => {
  try {
    let query = 'SELECT category_id FROM category WHERE LOWER(name) = LOWER(?)';
    let params = [name];

    if (exclude_id) {
      query += ' AND category_id != ?';
      params.push(exclude_id);
    }

    const [rows] = await connection.query(query, params);
    return rows.length > 0;
  } catch (error) {
    throw error;
  }
};