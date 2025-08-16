import * as RepairRequest from '../models/repairRequestModel.js';
import { getHistoryRequests as getHistoryRequestsModel } from '../models/repairRequestModel.js';
import User from '../models/userModel.js';
import { sendLineNotify } from '../utils/lineNotify.js';
import { broadcastBadgeCounts } from '../index.js';
import * as BorrowModel from '../models/borrowModel.js';

// ดึงเฉพาะรายการที่ status เป็น approved, completed, incomplete
export const getHistoryRequests = async (req, res) => {
  try {
    const results = await getHistoryRequestsModel();
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllRepairRequests = async (req, res) => {
  try {
    const results = await RepairRequest.getAllRepairRequests();
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getRepairRequestById = async (req, res) => {
  try {
    const results = await RepairRequest.getRepairRequestById(req.params.id);
    if (results.length === 0) return res.status(404).json({ error: 'Not found' });

    // Parse images from pic_filename field
    const repairRequest = results[0];
    const images = RepairRequest.parseRepairImages(repairRequest.pic_filename);

    const responseData = {
      ...repairRequest,
      images: images
    };

    res.json(responseData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Endpoint to get repair request images (parsed from pic_filename)
export const getRepairRequestImages = async (req, res) => {
  try {
    const results = await RepairRequest.getRepairRequestById(req.params.id);
    if (results.length === 0) return res.status(404).json({ error: 'Not found' });

    const images = RepairRequest.parseRepairImages(results[0].pic_filename);
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getRepairRequestsByUserId = async (req, res) => {
  try {
    const results = await RepairRequest.getRepairRequestsByUserId(req.params.user_id);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getRepairRequestsByItemId = async (req, res) => {
  try {
    const results = await RepairRequest.getRepairRequestsByItemId(req.params.item_id);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addRepairRequest = async (req, res) => {
  try {
    const data = req.body;
    // Set default status if not provided
    if (!data.status) {
      data.status = 'รอดำเนินการ';
    }
    if (!data.request_date) {
      data.request_date = new Date().toISOString().split('T')[0];
    }
    // Ensure all NOT NULL fields are present
    if (!('note' in data)) data.note = '';
    if (!('budget' in data)) data.budget = 0;
    if (!('responsible_person' in data)) data.responsible_person = '';
    if (!('approval_date' in data)) data.approval_date = new Date();
    const images = data.images || [];
    const result = await RepairRequest.addRepairRequest({
      ...data,
      images: images
    });
    // === แจ้งเตือน executive ทุกคน ===
    try {
      // ดึง Fullname ของผู้แจ้ง
      let requesterName = data.requester_name || '-';
      if (data.user_id) {
        const requester = await User.findById?.(data.user_id);
        if (requester && requester.Fullname) {
          requesterName = requester.Fullname;
        }
      }
      const executives = await User.getExecutives();
      const message = {
        type: 'flex',
        altText: `แจ้งเตือนซ่อมครุภัณฑ์ใหม่ รหัส: ${data.repair_code || result.repair_id}`,
        contents: {
          type: 'bubble',
          header: {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#1976D2',
            contents: [
              {
                type: 'text',
                text: '🛠️ แจ้งซ่อมครุภัณฑ์ใหม่',
                weight: 'bold',
                size: 'xl',
                color: '#ffffff',
                align: 'center'
              }
            ]
          },
          body: {
            type: 'box',
            layout: 'vertical',
            spacing: 'md',
            contents: [
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  { type: 'text', text: 'รหัสแจ้งซ่อม', size: 'sm', color: '#888888', flex: 2 },
                  { type: 'text', text: data.repair_code || result.repair_id, size: 'sm', color: '#222222', flex: 4, weight: 'bold' }
                ]
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  { type: 'text', text: 'วันที่แจ้ง', size: 'sm', color: '#888888', flex: 2 },
                  { type: 'text', text: data.request_date, size: 'sm', color: '#222222', flex: 4 }
                ]
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  { type: 'text', text: 'รายละเอียด', size: 'sm', color: '#888888', flex: 2 },
                  { type: 'text', text: data.problem_description || '-', size: 'sm', color: '#222222', flex: 4, wrap: true }
                ]
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  { type: 'text', text: 'ผู้แจ้ง', size: 'sm', color: '#888888', flex: 2 },
                  { type: 'text', text: requesterName, size: 'sm', color: '#222222', flex: 4 }
                ]
              }
            ]
          },
          footer: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'button',
                style: 'primary',
                color: '#1976D2',
                action: {
                  type: 'uri',
                  label: 'ดูรายละเอียด',
                  uri: 'https://your-website.com/repairs/' + (data.repair_code || result.repair_id)
                }
              },
              {
                type: 'text',
                text: '🔔โปรดตรวจสอบและดำเนินการขอบคุณครับ',
                size: 'sm',
                color: '#1976D2',
                align: 'center',
                margin: 'md',
                wrap: true
              }
            ]
          }
        }
      };
      for (const executive of executives) {
        if (executive.line_id && (executive.line_notify_enabled === 1 || executive.line_notify_enabled === true || executive.line_notify_enabled === '1')) {
          await sendLineNotify(executive.line_id, message);
        }
      }
    } catch (notifyErr) {
      console.error('Error sending LINE notify to executive:', notifyErr);
    }
    // === จบแจ้งเตือน ===
    res.status(201).json({
      message: 'Repair request added successfully',
      repair_id: result.repair_id,
      repair_code: data.repair_code,
      images_count: images.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateRepairRequest = async (req, res) => {
  try {
    const id = req.params.id;
    console.log('Updating repair request with ID:', id);
    console.log('Request body:', req.body);

    // Validate ID parameter
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid repair request ID' });
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
    } = req.body;

    // Validate required fields
    const requiredFields = {
      problem_description,
      request_date,
      estimated_cost,
      status
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => value === undefined || value === null || value === '')
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate status values
    const validStatuses = ['approved', 'rejected', 'pending', 'incomplete', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Validate numeric fields
    if (isNaN(estimated_cost) || estimated_cost < 0) {
      return res.status(400).json({ error: 'Invalid estimated_cost value' });
    }

    if (isNaN(budget) || budget < 0) {
      return res.status(400).json({ error: 'Invalid budget value' });
    }

    console.log('Extracted data:', {
      problem_description,
      request_date,
      estimated_cost,
      status,
      pic_filename,
      note,
      budget,
      responsible_person,
      approval_date,
      images
    });

    // Check if repair request exists
    const results = await RepairRequest.getRepairRequestById(id);
    if (results.length === 0) {
      return res.status(404).json({ error: 'Repair request not found' });
    }

    // Update the repair request
    await RepairRequest.updateRepairRequest(id, {
      problem_description,
      request_date,
      estimated_cost,
      status,
      pic_filename,
      note,
      budget,
      responsible_person,
      approval_date,
      images
    });

    // หลังอัปเดตสถานะ repair ให้ query count ใหม่แล้ว broadcast
    const [pending, carry, pendingApproval] = await Promise.all([
      BorrowModel.getBorrowsByStatus(['pending']),
      BorrowModel.getBorrowsByStatus(['carry']),
      BorrowModel.getBorrowsByStatus(['pending_approval'])
    ]);
    const allRepairs = await RepairRequest.getAllRepairRequests();
    const repairApprovalCount = allRepairs.length;
    broadcastBadgeCounts({
      pendingCount: pending.length + pendingApproval.length, // รวม pending + pending_approval สำหรับ admin
      carryCount: carry.length,
      borrowApprovalCount: pendingApproval.length, // สำหรับ executive
      repairApprovalCount
    });

    res.json({
      message: 'Repair request updated successfully',
      repair_id: id,
      status: status
    });
  } catch (err) {
    console.error('Error in updateRepairRequest:', err);
    console.error('Error stack:', err.stack);

    // Handle specific database errors
    if (err.code === 'ER_NO_SUCH_TABLE') {
      return res.status(500).json({ error: 'Database table not found' });
    }

    if (err.code === 'ER_BAD_FIELD_ERROR') {
      return res.status(500).json({ error: 'Invalid database field' });
    }

    if (err.code === 'ER_DATA_TOO_LONG') {
      return res.status(400).json({ error: 'Data too long for field' });
    }

    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const deleteRepairRequest = async (req, res) => {
  try {
    const results = await RepairRequest.getRepairRequestById(req.params.id);
    if (results.length === 0) return res.status(404).json({ error: 'Not found' });

    await RepairRequest.deleteRepairRequest(req.params.id);
    res.json({ message: 'Repair request deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};