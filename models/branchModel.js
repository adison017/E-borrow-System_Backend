import db from '../db.js';

const Branch = {
  findAll: async () => {
    try {
      const [results] = await db.query('SELECT * FROM branches');
      return results;
    } catch (error) {
      throw error;
    }
  },

  findById: async (id) => {
    try {
      const [results] = await db.query('SELECT * FROM branches WHERE branch_id = ?', [id]);
      return results[0];
    } catch (error) {
      throw error;
    }
  },

  create: async (branchData) => {
    try {
      const { branch_name } = branchData;
      const [result] = await db.query(
        'INSERT INTO branches (branch_name) VALUES (?)',
        [branch_name]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  update: async (id, branchData) => {
    try {
      const { branch_name } = branchData;
      const [result] = await db.query(
        'UPDATE branches SET branch_name = ? WHERE branch_id = ?',
        [branch_name, id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const [result] = await db.query('DELETE FROM branches WHERE branch_id = ?', [id]);
      return result;
    } catch (error) {
      throw error;
    }
  }
};

export default Branch;