// ดึงเฉพาะรายการที่ status เป็น approved, completed, incomplete
export const getHistoryRequests = async () => {
  try {
    const [rows] = await connection.query(`
      SELECT
        rr.id,
        rr.id AS repair_id,
        requester.Fullname AS requester_name,
        requester.avatar,
        b.branch_name,
        r.role_name,
        e.name AS equipment_name,
        e.item_code AS equipment_code,
        e.category AS equipment_category,
        e.item_id,
        rr.problem_description,
        rr.request_date,
        rr.estimated_cost,
        rr.pic_filename AS repair_pic,
        rr.status,
        rr.repair_code,
        e.pic AS equipment_pic
      FROM repair_requests rr
      JOIN users requester ON rr.user_id = requester.user_id
      LEFT JOIN branches b ON requester.branch_id = b.branch_id
      LEFT JOIN roles r ON requester.role_id = r.role_id
      LEFT JOIN equipment e ON rr.item_id = e.item_id
      WHERE rr.status IN ('approved', 'completed', 'incomplete','rejected')
    `);

    // Parse images for each repair request
    const parsedRows = rows.map(row => {
      const parsedImages = parseRepairImages(row.repair_pic);
      return {
        ...row,
        equipment_name: row.equipment_name || '',
        equipment_code: row.equipment_code || '',
        equipment_category: row.equipment_category || '',
        equipment_pic: row.equipment_pic || '',
        repair_pic: parsedImages,
        repair_pic_raw: row.repair_pic
      };
    });

    return parsedRows;
  } catch (error) {
    console.error('getApprovedCompletedIncompleteRequests error:', error);
    throw error;
  }
};
import connection from '../db.js';

export const getAllRepairRequests = async () => {
  try {
    const [rows] = await connection.query(`SELECT
  rr.id,
  rr.id AS repair_id,
  requester.Fullname AS requester_name,
  requester.avatar,
  b.branch_name,
  r.role_name,
  e.name AS equipment_name,
  e.item_code AS equipment_code,
  e.category AS equipment_category,
  e.item_id,
  rr.problem_description,
  rr.request_date,
  rr.estimated_cost,
  rr.pic_filename AS repair_pic,
  rr.status,
  rr.repair_code,
  e.pic AS equipment_pic
FROM repair_requests rr
JOIN users requester ON rr.user_id = requester.user_id
LEFT JOIN branches b ON requester.branch_id = b.branch_id
LEFT JOIN roles r ON requester.role_id = r.role_id
LEFT JOIN equipment e ON rr.item_id = e.item_id
WHERE rr.status = "รออนุมัติซ่อม";
`);

    // Parse images for each repair request
    const parsedRows = rows.map(row => {
      const parsedImages = parseRepairImages(row.repair_pic);
      return {
        ...row,
        equipment_name: row.equipment_name || '',
        equipment_code: row.equipment_code || '',
        equipment_category: row.equipment_category || '',
        equipment_pic: row.equipment_pic || '',
        repair_pic: parsedImages, // Return parsed images array instead of raw JSON string
        repair_pic_raw: row.repair_pic // Keep original for debugging
      };
    });

    return parsedRows;
  } catch (error) {
    console.error('getAllRepairRequests error:', error);
    throw error;
  }
};

export const getRepairRequestById = async (id) => {
  try {
    const [rows] = await connection.query('SELECT * FROM repair_requests WHERE id = ?', [id]);
    return rows;
  } catch (error) {
    throw error;
  }
};

export const getRepairRequestsByUserId = async (user_id) => {
  try {
    const [rows] = await connection.query('SELECT * FROM repair_requests WHERE user_id = ?', [user_id]);
    return rows;
  } catch (error) {
    throw error;
  }
};

export const getRepairRequestsByItemId = async (item_id) => {
  try {
    const [rows] = await connection.query('SELECT * FROM repair_requests WHERE item_id = ?', [item_id]);
    return rows;
  } catch (error) {
    throw error;
  }
};

// Function to parse images from pic_filename field
export const parseRepairImages = (pic_filename) => {
  if (!pic_filename) return [];

  try {
    // Check if it's a JSON string
    if (pic_filename.startsWith('[') || pic_filename.startsWith('{')) {
      const images = JSON.parse(pic_filename);
      // Ensure each image has the correct structure
      return images.map((image, index) => ({
        filename: image.filename || image,
        original_name: image.original_name || image,
        file_path: image.file_path || `uploads/repair/${image.filename || image}`,
        url: image.url || `http://localhost:5000/uploads/repair/${image.filename || image}`,
        repair_code: image.repair_code,
        index: image.index || index
      }));
    }

    // If it's a single filename, convert to array format
    return [{
      filename: pic_filename,
      original_name: pic_filename,
      file_path: `uploads/repair/${pic_filename}`,
      url: `http://localhost:5000/uploads/repair/${pic_filename}`,
      repair_code: null,
      index: 0
    }];
  } catch (error) {
    console.error('Error parsing repair images:', error);
    console.error('Problematic pic_filename:', pic_filename);
    console.error('pic_filename length:', pic_filename?.length);
    console.error('First 100 chars:', pic_filename?.substring(0, 100));
    console.error('Last 100 chars:', pic_filename?.substring(pic_filename.length - 100));

    // Return empty array instead of crashing
    return [];
  }
};

// Function to stringify images for storage
export const stringifyRepairImages = (images) => {
  console.log('stringifyRepairImages called with:', images);

  if (!images || images.length === 0) {
    console.log('No images to stringify, returning null');
    return null;
  }

  try {
    // Ensure each image has the required structure
    const processedImages = images.map((image, index) => ({
      filename: image.filename,
      original_name: image.original_name,
      file_path: image.file_path,
      url: image.url,
      repair_code: image.repair_code,
      index: image.index || index
    }));

    const result = JSON.stringify(processedImages);
    console.log('Stringified images result:', result);
    return result;
  } catch (error) {
    console.error('Error stringifying repair images:', error);
    return null;
  }
};

export const addRepairRequest = async (repairRequest) => {
  try {
    const {
      repair_code,
      user_id,
      item_id,
      problem_description,
      request_date,
      estimated_cost,
      status,
      pic_filename,
      images = [],
      note = '',
      budget = 0,
      responsible_person = '',
      approval_date = new Date()
    } = repairRequest;

    console.log('=== Adding Repair Request to Database ===');
    console.log('Repair Code:', repair_code);
    console.log('Images Count:', images.length);
    console.log('Images:', images);

    const imagesJson = stringifyRepairImages(images);
    const mainPicFilename = images.length > 0 ? images[0].filename : pic_filename;

    console.log('Images JSON:', imagesJson);
    console.log('Main Pic Filename:', mainPicFilename);

    const [result] = await connection.query(
      `INSERT INTO repair_requests
      (repair_code, user_id, item_id, problem_description, request_date, estimated_cost, status, pic_filename, note, budget, responsible_person, approval_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [repair_code, user_id, item_id, problem_description, request_date, estimated_cost, status, imagesJson || mainPicFilename, note, budget, responsible_person, approval_date]
    );

    return { ...result, repair_id: result.insertId };
  } catch (error) {
    console.error('Database error in addRepairRequest:', error);
    throw error;
  }
};

export const updateRepairRequest = async (id, repairRequest) => {
  try {
    console.log('=== Updating Repair Request ===');
    console.log('ID:', id);
    console.log('Repair Request Data:', repairRequest);

    // Validate input parameters
    if (!id || isNaN(id)) {
      throw new Error('Invalid repair request ID');
    }

    const {
      problem_description,
      request_date,
      estimated_cost,
      status,
      pic_filename,
      note = '',
      budget = 0,
      responsible_person = '',
      approval_date = new Date(),
      images = []
    } = repairRequest;

    // Validate required fields
    if (!problem_description || !request_date || estimated_cost === undefined || !status) {
      throw new Error('Missing required fields for repair request update');
    }

    // --- แก้ไขตรงนี้ ---
    // pic_filename ต้องเป็น string เสมอ
    let picFilenameToSave = pic_filename;
    if (Array.isArray(pic_filename) || typeof pic_filename === 'object') {
      picFilenameToSave = JSON.stringify(pic_filename);
    }

    const imagesJson = stringifyRepairImages(images);
    const mainPicFilename = images.length > 0 ? images[0].filename : picFilenameToSave;

    console.log('Processed data for update:', {
      imagesJson,
      mainPicFilename,
      approval_date
    });

    // Convert approval_date to proper format if it's a string
    let formattedApprovalDate = approval_date;
    if (typeof approval_date === 'string') {
      formattedApprovalDate = new Date(approval_date);
    }

    const [result] = await connection.query(
      `UPDATE repair_requests
      SET problem_description = ?,
          request_date = ?,
          estimated_cost = ?,
          status = ?,
          pic_filename = ?,
          note = ?,
          budget = ?,
          responsible_person = ?,
          approval_date = ?
      WHERE id = ?`,
      [problem_description, request_date, estimated_cost, status, imagesJson || mainPicFilename, note, budget, responsible_person, formattedApprovalDate, id]
    );

    console.log('Update result:', result);

    if (result.affectedRows === 0) {
      throw new Error('No repair request found with the specified ID');
    }

    return result;
  } catch (error) {
    console.error('Database error in updateRepairRequest:', error);
    console.error('Error stack:', error.stack);
    throw error;
  }
};

export const deleteRepairRequest = async (id) => {
  try {
    const [result] = await connection.query('DELETE FROM repair_requests WHERE id = ?', [id]);
    return result;
  } catch (error) {
    throw error;
  }
};