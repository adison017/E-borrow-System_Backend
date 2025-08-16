import * as BorrowModel from '../models/borrowModel.js';
import { saveBase64Image } from '../utils/saveBase64Image.js';
import User from '../models/userModel.js';
import { sendLineNotify } from '../utils/lineNotify.js';
import * as EquipmentModel from '../models/equipmentModel.js'; // เพิ่ม import นี้
import { broadcastBadgeCounts } from '../index.js';
import * as RepairRequest from '../models/repairRequestModel.js';
import * as ContactInfoModel from '../models/contactInfoModel.js';
import { createImportantDocumentsUpload } from '../utils/cloudinaryUtils.js';
import path from 'path';
import fs from 'fs';

// สร้างรายการยืมใหม่
export const createBorrow = async (req, res) => {
  console.log('==== [API] POST /api/borrows ====');
  console.log('payload:', req.body);
  console.log('files:', req.files);
  const { user_id, borrow_date, return_date, items, purpose, borrow_code: existingBorrowCode } = req.body;

  // Parse items if it's a JSON string
  let parsedItems = items;
  if (typeof items === 'string') {
    try {
      parsedItems = JSON.parse(items);
    } catch (error) {
      console.error('Error parsing items JSON:', error);
      return res.status(400).json({ message: 'รูปแบบข้อมูล items ไม่ถูกต้อง' });
    }
  }

  // items = [{ item_id, quantity, note }]
  if (!user_id || !borrow_date || !return_date || !Array.isArray(parsedItems) || parsedItems.length === 0) {
    return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน' });
  }
  // ตรวจสอบ item_id ใน items ว่าต้องไม่เป็น null หรือ undefined
  const invalidItem = parsedItems.find(item => !item.item_id);
  if (invalidItem) {
    return res.status(400).json({ message: 'item_id ของอุปกรณ์ต้องไม่เป็น null หรือว่าง' });
  }

  // ใช้ borrow_code ที่มีอยู่หรือจาก middleware หรือสร้างใหม่
  let borrow_code;
  if (existingBorrowCode) {
    borrow_code = existingBorrowCode;
    console.log(`Using existing borrow_code: ${borrow_code}`);
  } else if (req.generatedBorrowCode) {
    borrow_code = req.generatedBorrowCode;
    console.log(`Using generated borrow_code from middleware: ${borrow_code}`);
  } else {
    // สุ่ม borrow_code
    function generateBorrowCode() {
      const random = Math.floor(1000 + Math.random() * 9000);
      return `BR-${random}`;
    }
    borrow_code = generateBorrowCode();
    console.log(`Generated new borrow_code: ${borrow_code}`);
  }

  // ลบ logic ตรวจสอบรหัสซ้ำ (findByBorrowCode)
  try {
    // Handle important documents if any
    let importantDocumentsJson = null;
    if (req.files && req.files.length > 0) {
      console.log(`Processing ${req.files.length} important documents for borrow_code: ${borrow_code}`);

      // Process uploaded files (Cloudinary or local storage)
      const documents = [];
      for (const file of req.files) {
        const documentInfo = {
          filename: file.filename || `${borrow_code}_important_documents`,
          original_name: file.originalname,
          file_size: file.size,
          mime_type: file.mimetype
        };

        // Check if file was uploaded to Cloudinary
        if (file.secure_url && file.public_id) {
          // Cloudinary upload
          documentInfo.cloudinary_url = file.secure_url;
          documentInfo.cloudinary_public_id = file.public_id;
          documentInfo.file_path = null;
          console.log(`☁️ File uploaded to Cloudinary: ${file.originalname} -> ${file.secure_url}`);
        } else if (file.path) {
          // Local storage (fallback)
          documentInfo.file_path = file.path;
          documentInfo.cloudinary_url = null;
          documentInfo.cloudinary_public_id = null;
          documentInfo.stored_locally = true;
          console.log(`📁 File stored locally: ${file.originalname} -> ${file.filename}`);
        } else {
          // Memory storage (fallback)
          console.warn('⚠️ File stored in memory - Cloudinary not configured');
          documentInfo.file_path = null;
          documentInfo.cloudinary_url = null;
          documentInfo.cloudinary_public_id = null;
          documentInfo.stored_in_memory = true;
        }

        documents.push(documentInfo);
      }

      importantDocumentsJson = JSON.stringify(documents);
      console.log('Important documents JSON:', importantDocumentsJson);
    } else {
      importantDocumentsJson = null;
    }

    const borrow_id = await BorrowModel.createBorrowTransaction(user_id, borrow_date, return_date, borrow_code, purpose, importantDocumentsJson);
    for (const item of parsedItems) {
      await BorrowModel.addBorrowItem(borrow_id, item.item_id, item.quantity || 1, item.note || null);
    }
    // แจ้งเตือน LINE ไปยัง admin ทุกคน
    try {
      // ดึงข้อมูล borrow ล่าสุด (ที่เพิ่งสร้าง)
      const borrow = await BorrowModel.getBorrowById(borrow_id);
      const equipmentList = borrow.equipment.map(eq =>
        `• ${eq.name} (${eq.item_code}) x${eq.quantity}`
      ).join('\n');
      const flexMessage = {
        type: 'flex',
        altText: '📢 ด่วน! มีคำขอยืมใหม่เข้ามาในระบบ',
        contents: {
          type: 'bubble',
          size: 'mega',
          header: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: '🚨 ด่วน! คำขอยืมใหม่',
                weight: 'bold',
                size: 'xl',
                color: '#ffffff',
                align: 'center',
                margin: 'md',
              }
            ],
            backgroundColor: '#00B900', // LINE green
            paddingAll: '20px',
          },
          body: {
            type: 'box',
            layout: 'vertical',
            spacing: 'md',
            backgroundColor: '#ffffff',
            borderColor: '#e0e0e0',
            borderWidth: '2px',
            cornerRadius: 'lg',
            contents: [
              {
                type: 'text',
                text: 'โปรดตรวจสอบคำขอยืมอุปกรณ์ใหม่',
                weight: 'bold',
                size: 'md',
                color: '#00B900',
                align: 'center',
                margin: 'md',
              },
              { type: 'separator', margin: 'md' },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  { type: 'text', text: 'รหัสการยืม', size: 'sm', color: '#888888', flex: 2, weight: 'bold' },
                  { type: 'text', text: borrow.borrow_code || '-', size: 'sm', color: '#222222', flex: 4, weight: 'bold' }
                ]
              },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  { type: 'text', text: 'ชื่อผู้ยืม', size: 'sm', color: '#888888', flex: 2, weight: 'bold' },
                  { type: 'text', text: borrow.borrower?.name || '-', size: 'sm', color: '#222222', flex: 4 }
                ]
              },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  { type: 'text', text: 'ตำแหน่ง', size: 'sm', color: '#888888', flex: 2 },
                  { type: 'text', text: borrow.borrower?.position || '-', size: 'sm', color: '#222222', flex: 4 }
                ]
              },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  { type: 'text', text: 'สาขา', size: 'sm', color: '#888888', flex: 2 },
                  { type: 'text', text: borrow.borrower?.department || '-', size: 'sm', color: '#222222', flex: 4 }
                ]
              },
              { type: 'separator', margin: 'md' },
              {
                type: 'text',
                text: '📋 รายการอุปกรณ์',
                size: 'sm',
                color: '#00B900',
                weight: 'bold',
                margin: 'md',
              },
              {
                type: 'text',
                text: equipmentList,
                size: 'sm',
                color: '#222222',
                wrap: true
              },
              { type: 'separator', margin: 'md' },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  { type: 'text', text: 'วันที่ยืม', size: 'sm', color: '#888888', flex: 2 },
                  { type: 'text', text: borrow.borrow_date || '-', size: 'sm', color: '#222222', flex: 4 }
                ]
              },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  { type: 'text', text: 'กำหนดคืน', size: 'sm', color: '#888888', flex: 2, weight: 'bold' },
                  { type: 'text', text: borrow.due_date || '-', size: 'sm', color: '#d32f2f', flex: 4, weight: 'bold' }
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
                color: '#00B900',
                action: {
                  type: 'uri',
                  label: 'ดูรายละเอียด',
                  uri: 'https://your-system-url/borrows/' + borrow.borrow_code // เปลี่ยน url ตามจริง
                }
              }
            ]
          }
        }
      };
      // ส่ง LINE Notify ไปยัง admin ทุกคน
      const admins = await User.getAdmins();
      for (const admin of admins) {
        if (admin.line_id && (admin.line_notify_enabled === 1 || admin.line_notify_enabled === true || admin.line_notify_enabled === '1')) {
          await sendLineNotify(admin.line_id, flexMessage);
        }
      }
    } catch (notifyErr) {
      console.error('Error sending LINE notify to admin:', notifyErr);
    }
    // ส่ง response กลับทันที
    res.status(201).json({ borrow_id, borrow_code });

    // อัปเดต badge counts แบบ async (ไม่ต้องรอ)
    setImmediate(async () => {
      try {
        const [pending, carry, pendingApproval] = await Promise.all([
          BorrowModel.getBorrowsByStatus(['pending']),
          BorrowModel.getBorrowsByStatus(['carry']),
          BorrowModel.getBorrowsByStatus(['pending_approval'])
        ]);
        const allRepairs = await RepairRequest.getAllRepairRequests();
        const repairApprovalCount = allRepairs.length;
        broadcastBadgeCounts({
          pendingCount: pending.length + pendingApproval.length,
          carryCount: carry.length,
          borrowApprovalCount: pendingApproval.length,
          repairApprovalCount
        });
      } catch (err) {
        console.error('Error updating badge counts:', err);
      }
    });
  } catch (err) {
    console.error('เกิดข้อผิดพลาดใน createBorrow:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};

// ดูรายการยืมทั้งหมด
export const getAllBorrows = async (req, res) => {
  try {
    const rows = await BorrowModel.getAllBorrows();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};

// ดูรายละเอียดการยืม (รวมรายการอุปกรณ์)
export const getBorrowById = async (req, res) => {
  const { id } = req.params;
  try {
    const borrow = await BorrowModel.getBorrowById(id);
    if (!borrow) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    res.json(borrow);
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};

// อัปเดตสถานะ
export const updateBorrowStatus = async (req, res) => {
  const { id } = req.params;
  const { status, rejection_reason, signature_image, handover_photo } = req.body;

  console.log('=== updateBorrowStatus Debug ===');
  console.log('borrow_id:', id);
  console.log('status:', status);
  console.log('rejection_reason:', rejection_reason);
  console.log('signature_image exists:', !!signature_image);
  console.log('handover_photo exists:', !!handover_photo);

  try {
    // ดึงข้อมูล borrow เพื่อได้ borrow_code
    const borrow = await BorrowModel.getBorrowById(id);
    if (!borrow) {
      return res.status(404).json({
        message: 'ไม่พบรายการการยืมที่ระบุ',
        error: 'Borrow not found'
      });
    }

    const borrowCode = borrow.borrow_code;
    console.log('Borrow code:', borrowCode);

    let signaturePath = null;
    let handoverPhotoPath = null;

    // ถ้าเป็นการส่งมอบครุภัณฑ์ (approved) ต้องมีรูปภาพครบถ้วน
    if (status === 'approved') {
      console.log('=== Processing approved status with images ===');
      console.log('signature_image type:', typeof signature_image);
      console.log('signature_image starts with data:image/:', signature_image?.startsWith('data:image/'));
      console.log('handover_photo type:', typeof handover_photo);
      console.log('handover_photo starts with data:image/:', handover_photo?.startsWith('data:image/'));

      if (signature_image) {
        if (typeof signature_image === 'string' && signature_image.startsWith('data:image/')) {
          console.log('Saving signature image...');
          signaturePath = await saveBase64Image(signature_image, 'uploads/signature', null, borrowCode);
          console.log('signature saved to:', signaturePath);
        } else {
          console.log('Signature image is already a path:', signature_image);
          signaturePath = signature_image; // already a path
        }
      } else {
        console.log('❌ No signature_image provided');
      }

      if (handover_photo) {
        if (typeof handover_photo === 'string' && handover_photo.startsWith('data:image/')) {
          console.log('Saving handover photo...');
          handoverPhotoPath = await saveBase64Image(handover_photo, 'uploads/handover_photo', null, borrowCode);
          console.log('handover_photo saved to:', handoverPhotoPath);
        } else {
          console.log('Handover photo is already a path:', handover_photo);
          handoverPhotoPath = handover_photo; // already a path
        }
      } else {
        console.log('❌ No handover_photo provided');
      }

      // ตรวจสอบว่ามีรูปภาพครบถ้วนหรือไม่
      console.log('Final paths - signaturePath:', signaturePath, 'handoverPhotoPath:', handoverPhotoPath);
      if (!signaturePath || !handoverPhotoPath) {
        console.log('ERROR: Missing required images for delivery!');
        return res.status(400).json({
          message: 'กรุณาแนบรูปภาพบัตรนักศึกษาและรูปถ่ายส่งมอบครุภัณฑ์',
          error: 'Missing required images'
        });
      }
    }

    console.log('Updating database with status:', status);

    // อัปเดตฐานข้อมูล
    const affectedRows = await BorrowModel.updateBorrowStatus(id, status, rejection_reason, signaturePath, handoverPhotoPath);
    console.log('Database update affected rows:', affectedRows);

    if (affectedRows === 0) {
      console.log('ERROR: No rows were updated in database!');
      return res.status(400).json({
        message: 'ไม่สามารถอัปเดตข้อมูลได้ - ไม่พบรายการที่ตรงกับ ID ที่ระบุ',
        error: 'No rows affected'
      });
    }

    console.log('Status update completed successfully! Status:', status);

    // ตรวจสอบข้อมูลที่บันทึกในฐานข้อมูล
    try {
      const updatedBorrow = await BorrowModel.getBorrowById(id);
      console.log('=== Verification after update ===');
      console.log('Updated borrow data:', {
        borrow_id: updatedBorrow?.borrow_id,
        status: updatedBorrow?.status,
        signature_image: updatedBorrow?.signature_image ? 'EXISTS' : 'NULL',
        handover_photo: updatedBorrow?.handover_photo ? 'EXISTS' : 'NULL',
        rejection_reason: updatedBorrow?.rejection_reason || 'NULL'
      });
    } catch (verifyError) {
      console.log('Error during verification:', verifyError);
    }

    // ถ้าปฏิเสธ ให้อัปเดตสถานะครุภัณฑ์เป็น 'พร้อมใช้งาน'
    if (status === 'rejected') {
      const borrow = await BorrowModel.getBorrowById(id);
      if (borrow && borrow.equipment && Array.isArray(borrow.equipment)) {
        for (const eq of borrow.equipment) {
          await EquipmentModel.updateEquipmentStatus(eq.item_code, 'พร้อมใช้งาน');
        }
      }
    }
    // === เพิ่มส่วนนี้: แจ้ง user เมื่อสถานะเป็น pending_approval ===
    if (status === 'pending_approval') {
      const borrow = await BorrowModel.getBorrowById(id);
      const equipmentList = borrow.equipment.map(eq =>
        `• ${eq.name} (${eq.item_code}) x${eq.quantity}`
      ).join('\n');
      // ส่งให้ executive (เดิม)
      const flexMessageExecutive = {
        type: 'flex',
        altText: '📢 แจ้งเตือนผู้บริหาร: มีคำขออนุมัติการยืมใหม่',
        contents: {
          type: 'bubble',
          size: 'mega',
          header: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: '📝 คำขออนุมัติการยืม',
                weight: 'bold',
                size: 'xl',
                color: '#ffffff',
                align: 'center',
                margin: 'md',
              }
            ],
            backgroundColor: '#1976D2',
            paddingAll: '20px',
          },
          body: {
            type: 'box',
            layout: 'vertical',
            spacing: 'md',
            backgroundColor: '#ffffff',
            borderColor: '#e0e0e0',
            borderWidth: '2px',
            cornerRadius: 'lg',
            contents: [
              {
                type: 'text',
                text: 'มีคำขออนุมัติการยืมอุปกรณ์ใหม่ โปรดตรวจสอบ',
                weight: 'bold',
                size: 'md',
                color: '#1976D2',
                align: 'center',
                margin: 'md',
              },
              { type: 'separator', margin: 'md' },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  { type: 'text', text: 'รหัสการยืม', size: 'sm', color: '#888888', flex: 2, weight: 'bold' },
                  { type: 'text', text: borrow.borrow_code || '-', size: 'sm', color: '#222222', flex: 4, weight: 'bold' }
                ]
              },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  { type: 'text', text: 'ชื่อผู้ยืม', size: 'sm', color: '#888888', flex: 2, weight: 'bold' },
                  { type: 'text', text: borrow.borrower?.name || '-', size: 'sm', color: '#222222', flex: 4 }
                ]
              },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  { type: 'text', text: 'ตำแหน่ง', size: 'sm', color: '#888888', flex: 2 },
                  { type: 'text', text: borrow.borrower?.position || '-', size: 'sm', color: '#222222', flex: 4 }
                ]
              },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  { type: 'text', text: 'สาขา', size: 'sm', color: '#888888', flex: 2 },
                  { type: 'text', text: borrow.borrower?.department || '-', size: 'sm', color: '#222222', flex: 4 }
                ]
              },
              { type: 'separator', margin: 'md' },
              {
                type: 'text',
                text: '📋 รายการอุปกรณ์',
                size: 'sm',
                color: '#1976D2',
                weight: 'bold',
                margin: 'md',
              },
              {
                type: 'text',
                text: equipmentList,
                size: 'sm',
                color: '#222222',
                wrap: true
              },
              { type: 'separator', margin: 'md' },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  { type: 'text', text: 'วันที่ยืม', size: 'sm', color: '#888888', flex: 2 },
                  { type: 'text', text: borrow.borrow_date || '-', size: 'sm', color: '#222222', flex: 4 }
                ]
              },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  { type: 'text', text: 'กำหนดคืน', size: 'sm', color: '#888888', flex: 2, weight: 'bold' },
                  { type: 'text', text: borrow.due_date || '-', size: 'sm', color: '#d32f2f', flex: 4, weight: 'bold' }
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
                  uri: 'https://your-system-url/borrows/' + borrow.borrow_code
                }
              }
            ]
          }
        }
      };
      // ส่งให้ executive
      const executives = await User.getExecutives();
      for (const executive of executives) {
        if (executive.line_id && (executive.line_notify_enabled === 1 || executive.line_notify_enabled === true || executive.line_notify_enabled === '1')) {
          await sendLineNotify(executive.line_id, flexMessageExecutive);
        }
      }
      // ส่งให้ user (ผู้ยืม)
      // ดึง line_id จาก user_id โดยตรง
      const user = await User.findById(borrow.user_id);
      if (user?.line_id && (user.line_notify_enabled === 1 || user.line_notify_enabled === true || user.line_notify_enabled === '1')) {
        const flexMessageUser = {
          type: 'flex',
          altText: '📢 แจ้งสถานะคำขอยืมของคุณ',
          contents: {
            type: 'bubble',
            size: 'mega',
            header: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: '📦 สถานะคำขอยืมของคุณ',
                  weight: 'bold',
                  size: 'xl',
                  color: '#ffffff',
                  align: 'center',
                  margin: 'md',
                }
              ],
              backgroundColor: '#009688',
              paddingAll: '20px',
            },
            body: {
              type: 'box',
              layout: 'vertical',
              spacing: 'md',
              backgroundColor: '#ffffff',
              borderColor: '#e0e0e0',
              borderWidth: '2px',
              cornerRadius: 'lg',
              contents: [
                {
                  type: 'text',
                  text: 'สถานะ:รออนุมัติจากผู้บริหาร',
                  weight: 'bold',
                  size: 'md',
                  color: '#009688',
                  align: 'center',
                  margin: 'md',
                },
                { type: 'separator', margin: 'md' },
                {
                  type: 'box',
                  layout: 'baseline',
                  contents: [
                    { type: 'text', text: 'รหัสการยืม', size: 'sm', color: '#888888', flex: 2, weight: 'bold' },
                    { type: 'text', text: borrow.borrow_code || '-', size: 'sm', color: '#222222', flex: 4, weight: 'bold' }
                  ]
                },
                {
                  type: 'box',
                  layout: 'baseline',
                  contents: [
                    { type: 'text', text: 'วันที่ยืม', size: 'sm', color: '#888888', flex: 2 },
                    { type: 'text', text: borrow.borrow_date || '-', size: 'sm', color: '#222222', flex: 4 }
                  ]
                },
                {
                  type: 'box',
                  layout: 'baseline',
                  contents: [
                    { type: 'text', text: 'กำหนดคืน', size: 'sm', color: '#888888', flex: 2, weight: 'bold' },
                    { type: 'text', text: borrow.due_date || '-', size: 'sm', color: '#d32f2f', flex: 4, weight: 'bold' }
                  ]
                },
                { type: 'separator', margin: 'md' },
                {
                  type: 'text',
                  text: 'รายการอุปกรณ์ที่ขอยืม:',
                  size: 'sm',
                  color: '#009688',
                  weight: 'bold',
                  margin: 'md',
                },
                {
                  type: 'text',
                  text: equipmentList,
                  size: 'sm',
                  color: '#222222',
                  wrap: true
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
                  color: '#009688',
                  action: {
                    type: 'uri',
                    label: 'ดูรายละเอียด',
                    uri: 'https://your-system-url/borrows/' + borrow.borrow_code
                  }
                }
              ]
            }
          }
        };
        console.log('[DEBUG] เตรียมส่ง LINE Notify ถึง user:', user.user_id, user.line_id);
        console.log('[DEBUG] flexMessageUser:', JSON.stringify(flexMessageUser));
        try {
          await sendLineNotify(user.line_id, flexMessageUser);
          console.log('[DEBUG] ส่ง LINE Notify ถึง user สำเร็จ');
        } catch (err) {
          console.error('[DEBUG] ส่ง LINE Notify ถึง user ไม่สำเร็จ:', err);
        }
      }
    }
    // === แจ้ง user เมื่อสถานะเป็น carry (อนุมัติแล้ว) ===
    if (status === 'carry') {
      console.log('[DEBUG] === เริ่มส่ง LINE Notify สำหรับ carry ===');
      const borrow = await BorrowModel.getBorrowById(id);
      console.log('[DEBUG] borrow data:', JSON.stringify(borrow, null, 2));

      const equipmentList = borrow.equipment.map(eq =>
        `• ${eq.name} (${eq.item_code}) x${eq.quantity}`
      ).join('\n');
      const user = await User.findById(borrow.user_id);
      console.log('[DEBUG] user data:', {
        user_id: user?.user_id,
        line_id: user?.line_id,
        line_notify_enabled: user?.line_notify_enabled,
        type: typeof user?.line_notify_enabled
      });

             if (user?.line_id && (user.line_notify_enabled === 1 || user.line_notify_enabled === true || user.line_notify_enabled === '1')) {
         console.log('[DEBUG] เงื่อนไขผ่าน - จะส่ง LINE Notify');

         // ดึงข้อมูลติดต่อเจ้าหน้าที่จาก Database
         let contactText = '• ห้องพัสดุ อาคาร 1 ชั้น 2\n• โทร: 02-123-4567\n• เวลา: 8:30-16:30 น.';
         try {
           const contactInfoResult = await ContactInfoModel.getContactInfo();
           console.log('[DEBUG] Contact info result:', contactInfoResult);

           if (contactInfoResult && contactInfoResult.success && contactInfoResult.data) {
             const contactInfo = contactInfoResult.data;
             contactText = `• ${contactInfo.location}\n• โทร: ${contactInfo.phone}\n• เวลา: ${contactInfo.hours}`;
             console.log('[DEBUG] Contact text generated:', contactText);
           } else {
             console.log('[DEBUG] No contact info found, using default');
           }
         } catch (error) {
           console.error('Error getting contact info:', error);
         }

         // สร้างข้อความแยกแต่ละชิ้นพร้อมสถานที่รับและรูปห้อง
         const equipmentWithRoom = borrow.equipment.map(eq => {
          const roomText = eq.room_name
            ? `${eq.room_name}${eq.room_code ? ' (' + eq.room_code + ')' : ''}`
            : 'ไม่ระบุห้อง';
          return {
            type: 'text',
            text: `• ${eq.name} (${eq.item_code}) x${eq.quantity} รับที่: ${roomText}`,
            size: 'sm',
            color: '#222222',
            wrap: true
          };
        });
        const flexMessageUser = {
          type: 'flex',
          altText: '📢 แจ้งสถานะคำขอยืมของคุณ',
          contents: {
            type: 'bubble',
            size: 'mega',
            header: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: '📦 สถานะคำขอยืมของคุณ',
                  weight: 'bold',
                  size: 'xl',
                  color: '#ffffff',
                  align: 'center',
                  margin: 'md',
                }
              ],
              backgroundColor: '#388e3c',
              paddingAll: '20px',
            },
            body: {
              type: 'box',
              layout: 'vertical',
              spacing: 'md',
              backgroundColor: '#ffffff',
              borderColor: '#e0e0e0',
              borderWidth: '2px',
              cornerRadius: 'lg',
              contents: [
                {
                  type: 'text',
                  text: 'สถานะ: อนุมัติแล้ว ',
                  weight: 'bold',
                  size: 'md',
                  color: '#388e3c',
                  align: 'center',
                  margin: 'md',
                },
                { type: 'separator', margin: 'md' },
                {
                  type: 'box',
                  layout: 'baseline',
                  contents: [
                    { type: 'text', text: 'รหัสการยืม', size: 'sm', color: '#888888', flex: 2, weight: 'bold' },
                    { type: 'text', text: borrow.borrow_code || '-', size: 'sm', color: '#222222', flex: 4, weight: 'bold' }
                  ]
                },
                {
                  type: 'box',
                  layout: 'baseline',
                  contents: [
                    { type: 'text', text: 'วันที่ยืม', size: 'sm', color: '#888888', flex: 2 },
                    { type: 'text', text: borrow.borrow_date || '-', size: 'sm', color: '#222222', flex: 4 }
                  ]
                },
                {
                  type: 'box',
                  layout: 'baseline',
                  contents: [
                    { type: 'text', text: 'กำหนดคืน', size: 'sm', color: '#888888', flex: 2, weight: 'bold' },
                    { type: 'text', text: borrow.due_date || '-', size: 'sm', color: '#d32f2f', flex: 4, weight: 'bold' }
                  ]
                },
                { type: 'separator', margin: 'md' },
                {
                  type: 'text',
                  text: 'สถานที่รับครุภัณฑ์:',
                  size: 'sm',
                  color: '#388e3c',
                  weight: 'bold',
                  margin: 'md',
                },
                {
                  type: 'text',
                  text: 'รายการอุปกรณ์และสถานที่รับ:',
                  size: 'sm',
                  color: '#388e3c',
                  weight: 'bold',
                  margin: 'md',
                },
                ...equipmentWithRoom,
                { type: 'separator', margin: 'md' },
                {
                  type: 'text',
                  text: '📞 ติดต่อเจ้าหน้าที่:',
                  size: 'sm',
                  color: '#388e3c',
                  weight: 'bold',
                  margin: 'md',
                },
                                 {
                   type: 'text',
                   text: contactText,
                   size: 'sm',
                   color: '#222222',
                   wrap: true
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
                  color: '#388e3c',
                  action: {
                    type: 'uri',
                    label: 'ดูรายละเอียด',
                    uri: 'https://your-system-url/borrows/' + borrow.borrow_code
                  }
                }
              ]
            }
          }
        };
        console.log('[DEBUG] เตรียมส่ง LINE Notify ถึง user (carry):', user.user_id, user.line_id);
        console.log('[DEBUG] flexMessageUser (carry):', JSON.stringify(flexMessageUser));
        try {
          await sendLineNotify(user.line_id, flexMessageUser);
          console.log('[DEBUG] ส่ง LINE Notify ถึง user (carry) สำเร็จ');
        } catch (err) {
          console.error('[DEBUG] ส่ง LINE Notify ถึง user (carry) ไม่สำเร็จ:', err);
        }
      } else {
        console.log('[DEBUG] เงื่อนไขไม่ผ่าน - ไม่ส่ง LINE Notify');
        console.log('[DEBUG] เหตุผล:');
        console.log('  - line_id exists:', !!user?.line_id);
        console.log('  - line_notify_enabled value:', user?.line_notify_enabled);
        console.log('  - line_notify_enabled type:', typeof user?.line_notify_enabled);
        console.log('  - line_notify_enabled === 1:', user?.line_notify_enabled === 1);
        console.log('  - line_notify_enabled === true:', user?.line_notify_enabled === true);
        console.log('  - line_notify_enabled === "1":', user?.line_notify_enabled === '1');
      }
    }
    // === แจ้ง user เมื่อสถานะเป็น rejected (ไม่อนุมัติ) ===
    if (status === 'rejected') {
      const borrow = await BorrowModel.getBorrowById(id);
      const equipmentList = borrow.equipment.map(eq =>
        `• ${eq.name} (${eq.item_code}) x${eq.quantity}`
      ).join('\n');
      const user = await User.findById(borrow.user_id);
      if (
        user?.line_id &&
        (user.line_notify_enabled === 1 || user.line_notify_enabled === true || user.line_notify_enabled === '1')
      ) {
        const flexMessageUser = {
          type: 'flex',
          altText: '📢 แจ้งสถานะคำขอยืมของคุณ',
          contents: {
            type: 'bubble',
            size: 'mega',
            header: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: '❌ ไม่อนุมัติการยืม',
                  weight: 'bold',
                  size: 'xl',
                  color: '#ffffff',
                  align: 'center',
                  margin: 'md',
                }
              ],
              backgroundColor: '#d32f2f',
              paddingAll: '20px',
            },
            body: {
              type: 'box',
              layout: 'vertical',
              spacing: 'md',
              backgroundColor: '#ffffff',
              borderColor: '#e0e0e0',
              borderWidth: '2px',
              cornerRadius: 'lg',
              contents: [
                {
                  type: 'text',
                  text: 'สถานะ: ไม่อนุมัติการยืม',
                  weight: 'bold',
                  size: 'md',
                  color: '#d32f2f',
                  align: 'center',
                  margin: 'md',
                },
                ...(borrow.rejection_reason ? [{
                  type: 'text',
                  text: 'เหตุผล: ' + borrow.rejection_reason,
                  size: 'sm',
                  color: '#d32f2f',
                  margin: 'md',
                  wrap: true
                }] : []),
                {
                  type: 'text',
                  text: 'กรุณาทำรายการใหม่',
                  size: 'sm',
                  color: '#d32f2f',
                  weight: 'bold',
                  align: 'center',
                  margin: 'md',
                },
                { type: 'separator', margin: 'md' },
                {
                  type: 'box',
                  layout: 'baseline',
                  contents: [
                    { type: 'text', text: 'รหัสการยืม', size: 'sm', color: '#888888', flex: 2, weight: 'bold' },
                    { type: 'text', text: borrow.borrow_code || '-', size: 'sm', color: '#222222', flex: 4, weight: 'bold' }
                  ]
                },
                {
                  type: 'box',
                  layout: 'baseline',
                  contents: [
                    { type: 'text', text: 'วันที่ยืม', size: 'sm', color: '#888888', flex: 2 },
                    { type: 'text', text: borrow.borrow_date || '-', size: 'sm', color: '#222222', flex: 4 }
                  ]
                },
                {
                  type: 'box',
                  layout: 'baseline',
                  contents: [
                    { type: 'text', text: 'กำหนดคืน', size: 'sm', color: '#888888', flex: 2, weight: 'bold' },
                    { type: 'text', text: borrow.due_date || '-', size: 'sm', color: '#d32f2f', flex: 4, weight: 'bold' }
                  ]
                },
                { type: 'separator', margin: 'md' },
                {
                  type: 'text',
                  text: 'รายการอุปกรณ์ที่ขอยืม:',
                  size: 'sm',
                  color: '#d32f2f',
                  weight: 'bold',
                  margin: 'md',
                },
                {
                  type: 'text',
                  text: equipmentList,
                  size: 'sm',
                  color: '#222222',
                  wrap: true
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
                  color: '#d32f2f',
                  action: {
                    type: 'uri',
                    label: 'ดูรายละเอียด',
                    uri: 'https://your-system-url/borrows/' + borrow.borrow_code
                  }
                }
              ]
            }
          }
        };
        await sendLineNotify(user.line_id, flexMessageUser);
      }
    }
    // ลบส่วนแจ้งเตือน LINE สำหรับ waiting_payment และ completed ออก (ย้ายไป handle ที่ returnController.js แล้ว)
    // === ลบส่วนแจ้งเตือน LINE สำหรับ completed (ให้เหลือเฉพาะใน returnController.js) ===

    // หลังอัปเดตสถานะ borrow ให้ query count ใหม่แล้ว broadcast
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

    res.json({ affectedRows, signaturePath, handoverPhotoPath });
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};

// ลบรายการยืม
export const deleteBorrow = async (req, res) => {
  const { id } = req.params;
  try {
    await BorrowModel.deleteBorrow(id);
    res.json({ message: 'ลบสำเร็จ' });
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};