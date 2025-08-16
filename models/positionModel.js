import db from '../db.js';

const Position = {
  findAll: async () => {
    try {
      const [results] = await db.query('SELECT * FROM positions');
      return results;
    } catch (error) {
      throw error;
    }
  },

  findById: async (id) => {
    try {
      const [results] = await db.query('SELECT * FROM positions WHERE position_id = ?', [id]);
      return results[0];
    } catch (error) {
      throw error;
    }
  },

  create: async (positionData) => {
    try {
      const { position_name } = positionData;
      const [result] = await db.query(
        'INSERT INTO positions (position_name) VALUES (?)',
        [position_name]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  update: async (id, positionData) => {
    try {
      const { position_name } = positionData;
      const [result] = await db.query(
        'UPDATE positions SET position_name = ? WHERE position_id = ?',
        [position_name, id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const [result] = await db.query('DELETE FROM positions WHERE position_id = ?', [id]);
      return result;
    } catch (error) {
      throw error;
    }
  }
};

export default Position;