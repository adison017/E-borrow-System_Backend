import db from '../db.js';

const Role = {
  findAll: async () => {
    try {
      const [results] = await db.query(`
        SELECT
          role_id,
          role_name,
          description,
          created_at,
          updated_at
        FROM roles
        ORDER BY role_id ASC
      `);
      return results;
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  },

  findById: async (id) => {
    try {
      const [results] = await db.query(`
        SELECT
          role_id,
          role_name,
          description,
          created_at,
          updated_at
        FROM roles
        WHERE role_id = ?
      `, [id]);
      return results[0];
    } catch (error) {
      console.error('Error in findById:', error);
      throw error;
    }
  },

  create: async (roleData) => {
    try {
      const { role_name, description } = roleData;
      const [result] = await db.query(
        `INSERT INTO roles (role_name, description) VALUES (?, ?)`,
        [role_name, description || null]
      );
      return result;
    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
  },

  update: async (id, roleData) => {
    try {
      const { role_name, description } = roleData;
      const [result] = await db.query(
        `UPDATE roles
         SET role_name = ?,
             description = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE role_id = ?`,
        [role_name, description || null, id]
      );
      return result;
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const [result] = await db.query('DELETE FROM roles WHERE role_id = ?', [id]);
      return result;
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  }
};

export default Role;