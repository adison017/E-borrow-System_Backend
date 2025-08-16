import db from '../db.js';

export const createBorrowTransaction = async (user_id, borrow_date, return_date, borrow_code, purpose, important_documents = null) => {
  const [result] = await db.query(
    'INSERT INTO borrow_transactions (user_id, borrow_date, return_date, borrow_code, purpose, signature_image, handover_photo, important_documents) VALUES (?, ?, ?, ?, ?, NULL, NULL, ?)',
    [user_id, borrow_date, return_date, borrow_code, purpose, important_documents || null]
  );
  return result.insertId;
};

export const addBorrowItem = async (borrow_id, item_id, quantity, note) => {
  await db.query(
    'INSERT INTO borrow_items (borrow_id, item_id, quantity) VALUES (?, ?, ?)',
    [borrow_id, item_id, quantity]
  );
};

export const getAllBorrows = async () => {
  const [rows] = await db.query(
    `SELECT
  bt.borrow_id,
  bt.user_id,
  bt.borrow_code,
  u.fullname,
  b.branch_name,
  p.position_name,
  r.role_name,
  u.avatar,
  e.name,
  e.item_id,
  e.item_code,
  e.pic,
  e.room_id,
  rm.room_name,
  rm.room_code,
  rm.image_url,
  bi.quantity,
  bt.borrow_date,
  bt.return_date AS due_date,
  ret.return_date AS return_date,
  bt.status,
  bt.purpose,
  bt.rejection_reason,
  bt.signature_image,
  bt.handover_photo,
  bt.important_documents
FROM borrow_transactions bt
JOIN users u ON bt.user_id = u.user_id
JOIN borrow_items bi ON bt.borrow_id = bi.borrow_id
JOIN equipment e ON bi.item_id = e.item_id
LEFT JOIN branches b ON u.branch_id = b.branch_id
LEFT JOIN positions p ON u.position_id = p.position_id
LEFT JOIN roles r ON u.role_id = r.role_id
LEFT JOIN room rm ON e.room_id = rm.room_id
LEFT JOIN (
  SELECT r1.*
  FROM returns r1
  INNER JOIN (
    SELECT borrow_id, MAX(return_date) AS max_return_date
    FROM returns
    GROUP BY borrow_id
  ) r2 ON r1.borrow_id = r2.borrow_id AND r1.return_date = r2.max_return_date
) ret ON bt.borrow_id = ret.borrow_id;`
  );

  // Group by borrow_id
  const grouped = {};
  rows.forEach(row => {
    if (!grouped[row.borrow_id]) {
      grouped[row.borrow_id] = {
        borrow_id: row.borrow_id,
        user_id: row.user_id, // เพิ่ม user_id ใน object
        borrow_code: row.borrow_code,
        borrower: {
          name: row.fullname,
          position: row.position_name,
          department: row.branch_name,
          avatar: row.avatar,
          role: row.role_name,
        },
        equipment: [],
        borrow_date: row.borrow_date ? row.borrow_date.toISOString ? row.borrow_date.toISOString().split('T')[0] : String(row.borrow_date).split('T')[0] : null,
        due_date: row.due_date ? row.due_date.toISOString ? row.due_date.toISOString().split('T')[0] : String(row.due_date).split('T')[0] : null,
        return_date: row.return_date ? row.return_date.toISOString ? row.return_date.toISOString().split('T')[0] : String(row.return_date).split('T')[0] : null,
        status: row.status,
        purpose: row.purpose,
        rejection_reason: row.rejection_reason,
        signature_image: row.signature_image,
        handover_photo: row.handover_photo,
        important_documents: row.important_documents ? JSON.parse(row.important_documents) : [],
      };
    }
    grouped[row.borrow_id].equipment.push({
      item_id: row.item_id,
      item_code: row.item_code,
      name: row.name,
      quantity: row.quantity,
      pic:row.pic,
      room_id: row.room_id,
      room_name: row.room_name,
      room_code: row.room_code,
      image_url: row.image_url,
    });
  });
  return Object.values(grouped);
};

export const getBorrowById = async (borrow_id) => {
  // Join users, equipment, branch, ... เหมือน getAllBorrows
  const [rows] = await db.query(
    `SELECT
      bt.borrow_id,
      bt.user_id,
      bt.borrow_code,
      u.fullname,
      b.branch_name,
      p.position_name,
      r.role_name,
      u.avatar,
      e.name,
      e.item_id,
      e.item_code,
      e.pic,
      e.room_id,
      rm.room_name,
      rm.room_code,
      rm.image_url,
      bi.quantity,
      bt.borrow_date,
      bt.return_date,
      bt.status,
      bt.purpose,
      bt.rejection_reason,
      bt.signature_image,
      bt.handover_photo,
      bt.important_documents
    FROM borrow_transactions bt
    JOIN users u ON bt.user_id = u.user_id
    JOIN borrow_items bi ON bt.borrow_id = bi.borrow_id
    JOIN equipment e ON bi.item_id = e.item_id
    LEFT JOIN branches b ON u.branch_id = b.branch_id
    LEFT JOIN positions p ON u.position_id = p.position_id
    LEFT JOIN roles r ON u.role_id = r.role_id
    LEFT JOIN room rm ON e.room_id = rm.room_id
    WHERE bt.borrow_id = ?`,
    [borrow_id]
  );
  if (!rows || rows.length === 0) return null;
  // Group
  const row = rows[0];
  const borrow = {
    borrow_id: row.borrow_id,
    user_id: row.user_id,
    borrow_code: row.borrow_code,
    borrower: {
      name: row.fullname,
      position: row.position_name,
      department: row.branch_name,
      avatar: row.avatar,
      role: row.role_name,
    },
    equipment: rows.map(r => ({
      item_id: r.item_id,
      item_code: r.item_code,
      name: r.name,
      quantity: r.quantity,
      pic: r.pic,
      room_id: r.room_id,
      room_name: r.room_name,
      room_code: r.room_code,
      image_url: r.image_url,
    })),
    borrow_date: row.borrow_date ? row.borrow_date.toISOString ? row.borrow_date.toISOString().split('T')[0] : String(row.borrow_date).split('T')[0] : null,
    due_date: row.return_date ? row.return_date.toISOString ? row.return_date.toISOString().split('T')[0] : String(row.return_date).split('T')[0] : null,
    status: row.status,
    purpose: row.purpose,
    rejection_reason: row.rejection_reason,
    signature_image: row.signature_image,
    handover_photo: row.handover_photo,
    important_documents: row.important_documents ? JSON.parse(row.important_documents) : [],
  };
  return borrow;
};

export const updateBorrowStatus = async (borrow_id, status, rejection_reason = null, signature_image = null, handover_photo = null) => {
  console.log('=== updateBorrowStatus Model Debug ===');
  console.log('borrow_id:', borrow_id);
  console.log('status:', status);
  console.log('signature_image:', signature_image);
  console.log('handover_photo:', handover_photo);
  console.log('rejection_reason:', rejection_reason);

  try {
    // ตรวจสอบข้อมูลก่อนอัปเดต
    const [beforeUpdate] = await db.query('SELECT borrow_id, status, signature_image, handover_photo FROM borrow_transactions WHERE borrow_id = ?', [borrow_id]);
    console.log('Data before update:', beforeUpdate[0]);

    let query, params;
    if (signature_image && typeof signature_image === 'string' && signature_image.trim() !== '') {
      if (handover_photo && typeof handover_photo === 'string' && handover_photo.trim() !== '') {
        query = 'UPDATE borrow_transactions SET status = ?, signature_image = ?, handover_photo = ?, rejection_reason = ? WHERE borrow_id = ?';
        params = [status, signature_image, handover_photo, rejection_reason, borrow_id];
        console.log('Query: Both signature and handover_photo');
      } else {
        query = 'UPDATE borrow_transactions SET status = ?, signature_image = ?, rejection_reason = ? WHERE borrow_id = ?';
        params = [status, signature_image, rejection_reason, borrow_id];
        console.log('Query: Only signature');
      }
    } else if (handover_photo && typeof handover_photo === 'string' && handover_photo.trim() !== '') {
      query = 'UPDATE borrow_transactions SET status = ?, handover_photo = ?, rejection_reason = ? WHERE borrow_id = ?';
      params = [status, handover_photo, rejection_reason, borrow_id];
      console.log('Query: Only handover_photo');
    } else if (rejection_reason !== null && rejection_reason !== undefined) {
      query = 'UPDATE borrow_transactions SET status = ?, rejection_reason = ? WHERE borrow_id = ?';
      params = [status, rejection_reason, borrow_id];
      console.log('Query: Only rejection_reason');
    } else {
      query = 'UPDATE borrow_transactions SET status = ? WHERE borrow_id = ?';
      params = [status, borrow_id];
      console.log('Query: Only status');
    }

    console.log('Final query:', query);
    console.log('Final params:', params);
    console.log('signature_image length:', signature_image ? signature_image.length : 0);
    console.log('handover_photo length:', handover_photo ? handover_photo.length : 0);

    const [result] = await db.query(query, params);
    console.log('Query result:', result);
    console.log('Affected rows:', result.affectedRows);

    if (result.affectedRows === 0) {
      console.log('WARNING: No rows were updated!');
      // ตรวจสอบว่า borrow_id มีอยู่จริงหรือไม่
      const [checkResult] = await db.query('SELECT borrow_id FROM borrow_transactions WHERE borrow_id = ?', [borrow_id]);
      console.log('Check if borrow_id exists:', checkResult);
    } else {
      // ตรวจสอบข้อมูลหลังอัปเดต
      const [afterUpdate] = await db.query('SELECT borrow_id, status, signature_image, handover_photo FROM borrow_transactions WHERE borrow_id = ?', [borrow_id]);
      console.log('Data after update:', afterUpdate[0]);
    }

    return result.affectedRows;
  } catch (error) {
    console.error('Error in updateBorrowStatus:', error);
    throw error;
  }
};

export const deleteBorrow = async (borrow_id) => {
  await db.query('DELETE FROM borrow_transactions WHERE borrow_id = ?', [borrow_id]);
};

export const getBorrowsByStatus = async (statusArray) => {
  const placeholders = statusArray.map(() => '?').join(',');

  const [rows] = await db.query(
    `SELECT
      bt.borrow_id,
      bt.borrow_code,
      u.fullname,
      b.branch_name,
      p.position_name,
      r.role_name,
      u.avatar,
      e.name,
      e.item_id,
      e.item_code,
      e.pic,
      bi.quantity,
      bt.borrow_date,
      bt.return_date AS due_date,
      ret.return_date AS return_date,
      bt.status,
      bt.purpose,
      bt.rejection_reason,
      bt.signature_image,
      bt.handover_photo,
      bt.important_documents,
      ret.proof_image
    FROM borrow_transactions bt
    JOIN users u ON bt.user_id = u.user_id
    JOIN borrow_items bi ON bt.borrow_id = bi.borrow_id
    JOIN equipment e ON bi.item_id = e.item_id
    LEFT JOIN branches b ON u.branch_id = b.branch_id
    LEFT JOIN positions p ON u.position_id = p.position_id
    LEFT JOIN roles r ON u.role_id = r.role_id
    LEFT JOIN (
      SELECT r1.*
      FROM returns r1
      INNER JOIN (
        SELECT borrow_id, MAX(return_date) AS max_return_date
        FROM returns
        GROUP BY borrow_id
      ) r2 ON r1.borrow_id = r2.borrow_id AND r1.return_date = r2.max_return_date
    ) ret ON bt.borrow_id = ret.borrow_id
    WHERE bt.status IN (${placeholders})`,
    statusArray
  );

  // Group by borrow_id
  const grouped = {};
  rows.forEach(row => {
    if (!grouped[row.borrow_id]) {
      grouped[row.borrow_id] = {
        borrow_id: row.borrow_id,
        borrow_code: row.borrow_code,
        borrower: {
          name: row.fullname,
          position: row.position_name,
          department: row.branch_name,
          avatar: row.avatar,
          role: row.role_name,
        },
        equipment: [],
        borrow_date: row.borrow_date ? row.borrow_date.toISOString ? row.borrow_date.toISOString().split('T')[0] : String(row.borrow_date).split('T')[0] : null,
        due_date: row.due_date ? row.due_date.toISOString ? row.due_date.toISOString().split('T')[0] : String(row.due_date).split('T')[0] : null,
        return_date: row.return_date, // วันคืนจริงจากตาราง returns
        status: row.status,
        purpose: row.purpose,
        rejection_reason: row.rejection_reason,
        signature_image: row.signature_image,
        handover_photo: row.handover_photo,
        important_documents: row.important_documents ? JSON.parse(row.important_documents) : [],
        proof_image: row.proof_image
      };
    }
    grouped[row.borrow_id].equipment.push({
      item_id: row.item_id,
      item_code: row.item_code,
      name: row.name,
      quantity: row.quantity,
      pic: row.pic,
      room_id: row.room_id,
    });
  });

  return Object.values(grouped);
};

export const getActiveBorrows = async () => {
  const [rows] = await db.query(
    `SELECT bt.borrow_id, bt.borrow_code, bt.borrow_date, bt.return_date, u.line_id
     FROM borrow_transactions bt
     JOIN users u ON bt.user_id = u.user_id
     WHERE bt.status = 'approved'`
  );
  return rows;
};
