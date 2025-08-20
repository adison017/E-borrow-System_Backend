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

// เพิ่มฟังก์ชันอัปเดต damage level
export const updateDamageLevel = async (damage_id, damageData) => {
  const { name, fine_percent, detail } = damageData;
  
  const [result] = await db.query(
    'UPDATE damage_levels SET name = ?, fine_percent = ?, detail = ? WHERE damage_id = ?',
    [name, fine_percent, detail, damage_id]
  );
  
  if (result.affectedRows === 0) {
    throw new Error('Damage level not found');
  }
  
  return {
    damage_id,
    name,
    fine_percent,
    detail
  };
};

// เพิ่มฟังก์ชันสร้าง damage level ใหม่
export const createDamageLevel = async (damageData) => {
  const { name, fine_percent, detail } = damageData;
  
  const [result] = await db.query(
    'INSERT INTO damage_levels (name, fine_percent, detail) VALUES (?, ?, ?)',
    [name, fine_percent, detail]
  );
  
  return {
    damage_id: result.insertId,
    name,
    fine_percent,
    detail
  };
};