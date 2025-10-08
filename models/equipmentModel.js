import connection from '../db.js';

export const getAllEquipment = async () => {
  try {
    console.log('getAllEquipment - Fetching all equipment...');
    const [rows] = await connection.query(`
      SELECT e.*, c.name as category_name, c.category_code,
             r.room_name, r.room_code, r.address as room_address, 
             r.detail as room_detail, r.image_url as room_image_url
      FROM equipment e 
      LEFT JOIN category c ON e.category_id = c.category_id
      LEFT JOIN room r ON e.room_id = r.room_id
    `);
    console.log('getAllEquipment - Total equipment found:', rows.length);
    console.log('getAllEquipment - Item codes:', rows.map(item => item.item_code));
    return rows;
  } catch (error) {
    console.error('getAllEquipment - Error:', error);
    throw error;
  }
};

// Use item_code as canonical identifier
export const getEquipmentByCode = async (item_code) => {
  try {
    console.log('getEquipmentByCode - Searching for item_code:', item_code);
    const [rows] = await connection.query(`
      SELECT e.*, c.name as category_name, c.category_code,
             r.room_name, r.room_code, r.address as room_address, 
             r.detail as room_detail, r.image_url as room_image_url
      FROM equipment e 
      LEFT JOIN category c ON e.category_id = c.category_id 
      LEFT JOIN room r ON e.room_id = r.room_id
      WHERE e.item_code = ?
    `, [item_code]);
    console.log('getEquipmentByCode - Found rows:', rows.length);
    if (rows.length > 0) {
      console.log('getEquipmentByCode - First row item_code:', rows[0].item_code);
    }
    return rows;
  } catch (error) {
    console.error('getEquipmentByCode - Error:', error);
    throw error;
  }
};

export const addEquipment = async (equipment) => {
  try {
    // Always use item_code as canonical code
    const item_code = equipment.item_code || equipment.id || equipment.item_id;
    const { name, category, category_id, description, quantity, unit, status, pic, price, purchaseDate, room_id } = equipment;
    const [result] = await connection.query(
      'INSERT INTO equipment (item_code, name, category, category_id, description, quantity, unit, status, pic, created_at, price, purchaseDate, room_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP(), ?, ?, ?)',
      [item_code, name, category, category_id, description, quantity, unit, status, pic, price, purchaseDate, room_id]
    );
    return result;
  } catch (error) {
    throw error;
  }
};



export const getEquipmentByItemId = async (item_id) => {
  try {
    console.log('getEquipmentByItemId - Searching for item_id:', item_id);
    const [rows] = await connection.query(`
      SELECT e.*, c.name as category_name, c.category_code,
             r.room_name, r.room_code, r.address as room_address, 
             r.detail as room_detail, r.image_url as room_image_url
      FROM equipment e 
      LEFT JOIN category c ON e.category_id = c.category_id 
      LEFT JOIN room r ON e.room_id = r.room_id
      WHERE e.item_id = ?
    `, [item_id]);
    console.log('getEquipmentByItemId - Found rows:', rows.length);
    if (rows.length > 0) {
      console.log('getEquipmentByItemId - First row item_id:', rows[0].item_id);
    }
    return rows;
  } catch (error) {
    console.error('getEquipmentByItemId - Error:', error);
    throw error;
  }
};

export const updateEquipmentByItemId = async (item_id, equipment) => {
  try {
    console.log('updateEquipmentByItemId Model - Equipment item_id:', item_id);
    console.log('updateEquipmentByItemId Model - Equipment data:', equipment);

    const { item_code, name, category, category_id, description, quantity, unit, status, pic, purchaseDate, price, room_id } = equipment;

    console.log('updateEquipmentByItemId Model - New item code:', item_code);

    // ถ้า item_code เปลี่ยน ให้ตรวจสอบว่าซ้ำหรือไม่
    if (item_code) {
      console.log('updateEquipmentByItemId Model - Checking for duplicate item_code:', item_code);
      const [existing] = await connection.query('SELECT item_code FROM equipment WHERE item_code = ? AND item_id != ?', [item_code, item_id]);
      console.log('updateEquipmentByItemId Model - Duplicate check result:', existing.length);
      if (existing.length > 0) {
        throw new Error('item_code ซ้ำในระบบ');
      }
    }

    console.log('updateEquipmentByItemId Model - Executing UPDATE query...');
    const [result] = await connection.query(
      'UPDATE equipment SET item_code=?, name=?, category=?, category_id=?, description=?, quantity=?, unit=?, status=?, pic=?, purchaseDate=?, price=?, room_id=? WHERE item_id=?',
      [item_code, name, category, category_id, description, quantity, unit, status, pic, purchaseDate, price, room_id, item_id]
    );
    console.log('updateEquipmentByItemId Model - Update result:', result);
    return result;
  } catch (error) {
    console.error('updateEquipmentByItemId Model - Error:', error);
    throw error;
  }
};

export const deleteEquipment = async (item_code) => {
  try {
    const [result] = await connection.query('DELETE FROM equipment WHERE item_code = ?', [item_code]);
    console.log('Delete result:', result);
    return result;
  } catch (error) {
    console.error('Delete equipment error:', error);
    throw error;
  }
};

export const updateEquipmentStatus = async (item_code, status) => {
  try {
    console.log(`[updateEquipmentStatus] Updating equipment ${item_code} status to: "${status}"`);
    const [result] = await connection.query(
      'UPDATE equipment SET status=? WHERE item_code=?',
      [status, item_code]
    );
    console.log(`[updateEquipmentStatus] Update result:`, result);
    console.log(`[updateEquipmentStatus] Affected rows:`, result.affectedRows);
    return result;
  } catch (error) {
    console.error(`[updateEquipmentStatus] Error updating equipment ${item_code} status to ${status}:`, error);
    throw error;
  }
};

export const getLastItemCode = async () => {
  try {
    const [rows] = await connection.query('SELECT item_code FROM equipment ORDER BY item_code DESC LIMIT 1');
    return rows.length > 0 ? rows[0].item_code : null;
  } catch (error) {
    throw error;
  }
};

// Get total borrow count for equipment
export const getEquipmentBorrowCount = async (item_code) => {
  try {
    const [rows] = await connection.query(`
      SELECT COUNT(*) as total_borrow_count
      FROM borrow_transactions bt
      JOIN borrow_items bi ON bt.borrow_id = bi.borrow_id
      JOIN equipment e ON bi.item_id = e.item_id
      WHERE e.item_code = ?
    `, [item_code]);
    return rows[0]?.total_borrow_count || 0;
  } catch (error) {
    throw error;
  }
};

// ดึงอุปกรณ์ทั้งหมด พร้อม dueDate (วันที่ต้องคืน) ถ้ามีการยืมที่ยังไม่คืน
export const getAllEquipmentWithDueDate = async () => {
  try {
    const [rows] = await connection.query(`
      SELECT
        e.*,
        c.name as category_name,
        c.category_code,
        r.room_name, 
        r.room_code, 
        r.address as room_address, 
        r.detail as room_detail, 
        r.image_url as room_image_url,
        (
          SELECT bt.return_date
          FROM borrow_items bi
          JOIN borrow_transactions bt ON bi.borrow_id = bt.borrow_id
          WHERE bi.item_id = e.item_id AND bt.status IN ('approved', 'waiting_payment', 'pending')
          ORDER BY bt.return_date DESC LIMIT 1
        ) AS dueDate
      FROM equipment e
      LEFT JOIN category c ON e.category_id = c.category_id
      LEFT JOIN room r ON e.room_id = r.room_id
    `);
    return rows;
  } catch (error) {
    throw error;
  }
};

// ดึงประวัติการยืมของครุภัณฑ์
export const getEquipmentBorrowHistory = async (item_code) => {
  try {
    console.log('Fetching borrow history for item_code:', item_code);
    
    // First, get the equipment item_id
    const [equipmentRows] = await connection.query(
      'SELECT item_id FROM equipment WHERE item_code = ?', 
      [item_code]
    );
    
    if (equipmentRows.length === 0) {
      console.log('Equipment not found for item_code:', item_code);
      return [];
    }
    
    const equipmentItemId = equipmentRows[0].item_id;
    console.log('Found equipment item_id:', equipmentItemId);
    
    // Get borrow history
    const [rows] = await connection.query(`
      SELECT 
        bt.borrow_id,
        bt.borrow_code,
        bt.borrow_date,
        bt.return_date as due_date,
        bt.status,
        bt.purpose,
        bt.signature_image,
        bt.handover_photo,
        bt.created_at,
        bt.updated_at,
        bt.user_id,
        bi.quantity,
        e.name as equipment_name,
        e.item_code,
        e.pic as equipment_pic
      FROM borrow_transactions bt
      JOIN borrow_items bi ON bt.borrow_id = bi.borrow_id
      JOIN equipment e ON bi.item_id = e.item_id
      WHERE bi.item_id = ?
        AND bt.status IN ('pending','pending_approval','approved','rejected','carry','completed','waiting_payment')
      ORDER BY bt.borrow_date DESC
    `, [equipmentItemId]);
    
    console.log('Found', rows.length, 'borrow records');
    
    // Get unique user IDs to fetch user data
    const userIds = [...new Set(rows.map(row => row.user_id).filter(Boolean))];
    console.log('User IDs to fetch:', userIds);
    
    // Fetch user data using existing API pattern
    let userData = {};
    if (userIds.length > 0) {
      try {
        // Use the same query pattern as other working endpoints
        const [userRows] = await connection.query(
          'SELECT * FROM users WHERE user_id IN (' + userIds.map(() => '?').join(',') + ')',
          userIds
        );
        
        console.log('Raw user data:', userRows);
        
        userData = userRows.reduce((acc, user) => {
          acc[user.user_id] = {
            user_id: user.user_id,
            name: user.Fullname || user.fullname || user.name || user.username || 'ไม่ระบุ',
            email: user.email || user.Email || null,
            department: user.department || user.Department || null,
            position: user.position || user.Position || user.role || null,
            avatar: user.avatar || user.Avatar || user.profile_picture || null
          };
          return acc;
        }, {});
        
        console.log('Processed user data:', userData);
      } catch (userError) {
        console.warn('Could not fetch user data:', userError.message);
        console.warn('Error details:', userError);
      }
    }
    
    // Group by borrow_id to handle multiple equipment items
    const borrowMap = new Map();
    
    rows.forEach(row => {
      if (!borrowMap.has(row.borrow_id)) {
        // Calculate overdue status
        let finalStatus = row.status;
        if ((row.status === 'approved' || row.status === 'carry') && row.due_date) {
          const currentDate = new Date();
          const dueDate = new Date(row.due_date);
          if (currentDate > dueDate) {
            finalStatus = 'overdue';
          }
        }
        
        const user = userData[row.user_id] || {};
        
        borrowMap.set(row.borrow_id, {
          borrow_id: row.borrow_id,
          borrow_code: row.borrow_code,
          borrow_date: row.borrow_date,
          due_date: row.due_date,
          status: finalStatus,
          purpose: row.purpose,
          signature_image: row.signature_image,
          handover_photo: row.handover_photo,
          created_at: row.created_at,
          updated_at: row.updated_at,
          borrower: {
            user_id: row.user_id,
            name: user.name || 'ไม่ระบุ',
            email: user.email || null,
            department: user.department || null,
            position: user.position || null,
            avatar: user.avatar || null
          },
          equipment: [],
          important_documents: [],
          return_items: []
        });
      }
      
      // Add equipment to the borrow record
      borrowMap.get(row.borrow_id).equipment.push({
        item_code: row.item_code,
        name: row.equipment_name,
        quantity: row.quantity || 1,
        pic: row.equipment_pic
      });
    });
    
    // Fetch important documents for each borrow transaction
    const borrowIds = Array.from(borrowMap.keys());
    if (borrowIds.length > 0) {
      try {
        const [documentRows] = await connection.query(`
          SELECT borrow_id, file_name, original_name, file_path, file_type, file_size, upload_date
          FROM borrow_documents 
          WHERE borrow_id IN (${borrowIds.map(() => '?').join(',')})
          ORDER BY upload_date ASC
        `, borrowIds);
        
        console.log('Found', documentRows.length, 'documents');
        
        // Group documents by borrow_id
        documentRows.forEach(doc => {
          if (borrowMap.has(doc.borrow_id)) {
            borrowMap.get(doc.borrow_id).important_documents.push({
              file_name: doc.file_name,
              original_name: doc.original_name,
              file_path: doc.file_path,
              file_type: doc.file_type,
              file_size: doc.file_size,
              upload_date: doc.upload_date
            });
          }
        });
      } catch (docError) {
        console.warn('Could not fetch documents:', docError.message);
      }
      
      // Fetch return items with damage photos for completed transactions
      try {
        const [returnRows] = await connection.query(`
          SELECT 
            ri.borrow_id,
            ri.item_id,
            ri.damage_level,
            ri.damage_photos,
            e.name as equipment_name,
            e.item_code
          FROM return_items ri
          JOIN equipment e ON ri.item_id = e.item_id
          WHERE ri.borrow_id IN (${borrowIds.map(() => '?').join(',')})
        `, borrowIds);
        
        console.log('Found', returnRows.length, 'return items');
        
        // Group return items by borrow_id
        returnRows.forEach(returnItem => {
          if (borrowMap.has(returnItem.borrow_id)) {
            let damagePhotos = [];
            if (returnItem.damage_photos) {
              try {
                damagePhotos = JSON.parse(returnItem.damage_photos);
              } catch (e) {
                console.warn('Could not parse damage_photos:', returnItem.damage_photos);
                damagePhotos = [];
              }
            }
            
            borrowMap.get(returnItem.borrow_id).return_items.push({
              item_id: returnItem.item_id,
              equipment_name: returnItem.equipment_name,
              item_code: returnItem.item_code,
              damage_level: returnItem.damage_level,
              damage_photos: damagePhotos
            });
          }
        });
      } catch (returnError) {
        console.warn('Could not fetch return items:', returnError.message);
      }
    }
    
    const formattedHistory = Array.from(borrowMap.values());
    
    console.log('Formatted history:', formattedHistory.length, 'records');
    console.log('Sample record:', formattedHistory[0]);
    console.log('Sample borrower data:', formattedHistory[0]?.borrower);
    return formattedHistory;
  } catch (error) {
    console.error('getEquipmentBorrowHistory - Error:', error);
    console.error('Stack trace:', error.stack);
    throw error;
  }
};

// ดึงประวัติการซ่อมของครุภัณฑ์
export const getEquipmentRepairHistory = async (item_code) => {
  try {
    console.log('Fetching repair history for item_code:', item_code);
    
    const [rows] = await connection.query(`
      SELECT 
        rr.id,
        rr.repair_code,
        rr.user_id,
        rr.item_id,
        rr.problem_description,
        rr.request_date,
        rr.estimated_cost,
        rr.status,
        rr.pic_filename,
        rr.budget,
        rr.responsible_person,
        rr.approval_date,
        rr.rejection_reason,
        rr.inspection_notes,
        e.item_code as equipment_code,
        e.name as equipment_name,
        e.category as equipment_category,
        e.pic as equipment_pic,
        u.Fullname as requester_name,
        u.avatar
      FROM repair_requests rr
      JOIN equipment e ON rr.item_id = e.item_id
      LEFT JOIN users u ON rr.user_id = u.user_id
      WHERE e.item_code = ?
      ORDER BY rr.request_date DESC
    `, [item_code]);
    
    console.log('Found', rows.length, 'repair records');
    
    const formattedHistory = rows.map(row => ({
      id: row.id,
      repair_code: row.repair_code,
      user_id: row.user_id,
      item_id: row.item_id,
      problem_description: row.problem_description,
      request_date: row.request_date,
      estimated_cost: row.estimated_cost,
      status: row.status,
      pic_filename: row.pic_filename,
      budget: row.budget,
      responsible_person: row.responsible_person,
      approval_date: row.approval_date,
      rejection_reason: row.rejection_reason,
      inspection_notes: row.inspection_notes,
      equipment_code: row.equipment_code,
      equipment_name: row.equipment_name,
      equipment_category: row.equipment_category,
      equipment_pic: row.equipment_pic,
      requester: {
        name: row.requester_name || 'ไม่ระบุ',
        avatar: row.avatar
      }
    }));
    
    return formattedHistory;
  } catch (error) {
    console.error('getEquipmentRepairHistory - Error:', error);
    throw error;
  }
};
