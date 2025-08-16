import db from '../db.js';

export const getAllDamageLevels = async () => {
  const [rows] = await db.query('SELECT * FROM damage_levels');
  return rows;
};

export const getDamageLevelById = async (damage_id) => {
  console.log(`[getDamageLevelById] Searching for damage_id: ${damage_id}`);
  const [rows] = await db.query('SELECT * FROM damage_levels WHERE damage_id = ?', [damage_id]);
  console.log(`[getDamageLevelById] Found rows:`, rows.length);
  if (rows.length > 0) {
    console.log(`[getDamageLevelById] Damage level data:`, {
      damage_id: rows[0].damage_id,
      level_name: rows[0].level_name,
      fine_percent: rows[0].fine_percent,
      fine_amount: rows[0].fine_amount
    });
  }
  return rows.length > 0 ? rows[0] : null;
};