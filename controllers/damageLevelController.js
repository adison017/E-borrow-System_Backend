import { getAllDamageLevels } from '../models/damageLevelModel.js';

export const getDamageLevels = async (req, res) => {
  try {
    const levels = await getAllDamageLevels();
    res.json(levels);
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};