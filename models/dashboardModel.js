// --- Admin Dashboard Summary helpers ---
export async function countEquipment() {
  const [rows] = await db.query('SELECT COUNT(*) AS count FROM equipment');
  return rows[0].count;
}
export async function countAvailableEquipment() {
  const [rows] = await db.query("SELECT COUNT(*) AS count FROM equipment WHERE status = 'พร้อมใช้งาน'");
  return rows[0].count;
}
export async function countBorrowedEquipment() {
  const [rows] = await db.query("SELECT COUNT(*) AS count FROM equipment WHERE status = 'ถูกยืม'");
  return rows[0].count;
}
export async function countPendingRequests() {
  // นับเฉพาะ status ที่เป็น 'pending' หรือ 'pending_approval'
  const [rows] = await db.query("SELECT COUNT(*) AS count FROM borrow_transactions WHERE status IN ('pending', 'pending_approval')");
  return rows[0].count;
}
export async function countLateReturns() {
  const [rows] = await db.query("SELECT COUNT(*) AS count FROM borrow_transactions WHERE status = 'waiting_payment'");
  return rows[0].count;
}
export async function countUsers() {
  const [rows] = await db.query('SELECT COUNT(*) AS count FROM users');
  return rows[0].count;
}
export async function countCategories() {
  const [rows] = await db.query('SELECT COUNT(*) AS count FROM category');
  return rows[0].count;
}
export async function countPendingDelivery() {
  const [rows] = await db.query("SELECT COUNT(*) AS count FROM borrow_transactions WHERE status = 'carry'");
  return rows[0].count;
}
export async function countPendingReturn() {
  const [rows] = await db.query("SELECT COUNT(*) AS count FROM borrow_transactions WHERE status = 'approved'");
  return rows[0].count;
}
// Dashboard analytics SQL queries
// Each function returns a Promise with query result
import db from '../db.js';

export async function getMonthlyBorrow() {
  // รวม borrow_count และ return_count ต่อเดือน
  const [rows] = await db.query(`
    SELECT m.month,
      IFNULL(b.borrow_count, 0) AS borrow_count,
      IFNULL(r.return_count, 0) AS return_count
    FROM (
      SELECT DATE_FORMAT(borrow_date, '%Y-%m') AS month
      FROM borrow_transactions
      WHERE borrow_date IS NOT NULL
      GROUP BY month
      UNION
      SELECT DATE_FORMAT(return_date, '%Y-%m') AS month
      FROM returns
      WHERE return_date IS NOT NULL
      GROUP BY month
    ) m
    LEFT JOIN (
      SELECT DATE_FORMAT(borrow_date, '%Y-%m') AS month, COUNT(*) AS borrow_count
      FROM borrow_transactions
      WHERE borrow_date IS NOT NULL
      GROUP BY month
    ) b ON m.month = b.month
    LEFT JOIN (
      SELECT DATE_FORMAT(return_date, '%Y-%m') AS month, COUNT(*) AS return_count
      FROM returns
      WHERE return_date IS NOT NULL
      GROUP BY month
    ) r ON m.month = r.month
    ORDER BY m.month DESC
    LIMIT 12
  `);
  return rows;
}

export async function getReturnStatus() {
  // กำหนดสีพื้นฐานสำหรับแต่ละสถานะ
  const statusColor = {
    'พร้อมใช้งาน': '#10b981',
    'รออนุมัติ': '#f59e42',
    'ถูกยืม': '#3b82f6',
    'คืนเกินกำหนด': '#ef4444',
    'รอตรวจสอบ': '#6366f1',
    'รอชำระเงิน': '#fbbf24',
    'อื่นๆ': '#a3a3a3'
  };
  const [rows] = await db.query(`
    SELECT status, COUNT(*) AS count
    FROM equipment
    GROUP BY status
  `);
  // map key ให้ตรงกับ frontend
  return rows.map(row => ({
    name: row.status || 'อื่นๆ',
    value: row.count,
    color: statusColor[row.status] || statusColor['อื่นๆ']
  }));
}

export async function getTopBorrowedEquipment() {
  const [rows] = await db.query(`
    SELECT e.name, COUNT(*) AS count
    FROM borrow_items bi
    JOIN equipment e ON bi.item_id = e.item_id
    GROUP BY bi.item_id
    ORDER BY count DESC
    LIMIT 5
  `);
  return rows;
}

export async function getFineSummary() {
  const [rows] = await db.query(`
    SELECT 'damage_fine' AS type, IFNULL(SUM(damage_fine),0) AS amount FROM returns
    UNION ALL
    SELECT 'late_fine' AS type, IFNULL(SUM(late_fine),0) AS amount FROM returns
  `);
  return rows;
}

export async function getRepairStatus() {
  // ดึงสถานะจาก repair_requests
  const [repairRows] = await db.query(`
    SELECT status, COUNT(*) AS count
    FROM repair_requests
    GROUP BY status
  `);

  // ดึงจำนวนอุปกรณ์ที่ status = 'ชำรุด' จาก equipment
  const [equipmentRows] = await db.query(`
    SELECT 'ชำรุด' AS status, COUNT(*) AS count
    FROM equipment
    WHERE status = 'ชำรุด'
  `);

  // รวมผลลัพธ์
  let result = [...repairRows];
  if (equipmentRows[0] && equipmentRows[0].count > 0) {
    // ถ้ามีอุปกรณ์ชำรุด ให้เพิ่มเข้าไปในผลลัพธ์
    result.push(equipmentRows[0]);
  }
  return result;
}

export async function getWeeklyBorrowTrend() {
  const [rows] = await db.query(`
    SELECT YEARWEEK(borrow_date, 1) AS week, COUNT(*) AS count
    FROM borrow_transactions
    WHERE borrow_date >= DATE_SUB(CURDATE(), INTERVAL 6 WEEK)
    GROUP BY week
    ORDER BY week DESC
    LIMIT 6
  `);
  return rows;
}

export async function getBorrowForecast() {
  const [rows] = await db.query(`
    SELECT IFNULL(AVG(monthly_count),0) AS forecast
    FROM (
      SELECT COUNT(*) AS monthly_count
      FROM borrow_transactions
      WHERE borrow_date >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)
      GROUP BY DATE_FORMAT(borrow_date, '%Y-%m')
    ) AS sub
  `);
  return rows[0];
}

export async function getTopDamagedEquipment() {
  const [rows] = await db.query(`
    SELECT e.name, COUNT(*) AS damage_count
    FROM return_items ri
    JOIN equipment e ON ri.item_id = e.item_id
    WHERE ri.damage_level_id IS NOT NULL AND ri.damage_level_id > 1
    GROUP BY ri.item_id
    ORDER BY damage_count DESC
    LIMIT 5
  `);
  return rows;
}

export async function getTopRiskUsers() {
  const [rows] = await db.query(`
    SELECT u.Fullname, SUM(r.fine_amount) AS total_fine
    FROM returns r
    JOIN users u ON r.user_id = u.user_id
    GROUP BY r.user_id
    ORDER BY total_fine DESC
    LIMIT 5
  `);
  return rows;
}

export async function getTotalEquipmentValue() {
  const [rows] = await db.query(`
    SELECT IFNULL(SUM(price),0) AS total_value FROM equipment
  `);
  return rows[0];
}

export async function getTotalDamagedValue() {
  const [rows] = await db.query(`
    SELECT IFNULL(SUM(e.price),0) AS damaged_value
    FROM return_items ri
    JOIN equipment e ON ri.item_id = e.item_id
    WHERE ri.damage_level_id IN (8,9)
  `);
  return rows[0];
}

export async function getTotalRepairCost() {
  const [rows] = await db.query(`
    SELECT IFNULL(SUM(estimated_cost),0) AS total_repair_cost
    FROM repair_requests
    WHERE status != 'rejected'
  `);
  return rows[0];
}

export async function getDepreciation() {
  const [rows] = await db.query(`
    SELECT YEAR(purchaseDate) AS year, SUM(price * quantity * 0.2) AS depreciation
    FROM equipment
    WHERE purchaseDate IS NOT NULL
    GROUP BY year
    ORDER BY year
  `);
  return rows;
}

export async function getRepairVsBorrowRatio() {
  const [rows] = await db.query(`
    SELECT (
      SELECT COUNT(*) FROM repair_requests
    ) AS repair,
    (
      SELECT COUNT(*) FROM borrow_transactions
    ) AS borrow
  `);
  return rows[0];
}

export async function getTopFineCategories() {
  const [rows] = await db.query(`
    SELECT c.name AS category,
      IFNULL(SUM(CAST(ri.fine_amount AS DECIMAL(10,2))),0) AS total_fine
      FROM return_items ri
      JOIN equipment e ON ri.item_id = e.item_id
      JOIN category c ON e.category = c.name
      GROUP BY c.name
      ORDER BY total_fine DESC
      LIMIT 5;
  `);
  return rows;
}

export async function getFrequentDamageUsers() {
  const [rows] = await db.query(`
    SELECT u.Fullname, COUNT(*) AS damage_count
    FROM return_items ri
    JOIN returns r ON ri.return_id = r.return_id
    JOIN users u ON r.user_id = u.user_id
    WHERE ri.damage_level_id > 5
    GROUP BY u.user_id
    ORDER BY damage_count DESC
    LIMIT 5
  `);
  return rows;
}

export async function getBranchBorrowSummary() {
  const [rows] = await db.query(`
    SELECT b.branch_name, COUNT(*) AS borrow_count
    FROM borrow_transactions bt
    JOIN users u ON bt.user_id = u.user_id
    JOIN branches b ON u.branch_id = b.branch_id
    GROUP BY b.branch_id
    ORDER BY borrow_count DESC
  `);
  return rows;
}
