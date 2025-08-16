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