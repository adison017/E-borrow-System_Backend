import * as ReturnModel from '../models/returnModel.js';
import * as BorrowModel from '../models/borrowModel.js';
import * as EquipmentModel from '../models/equipmentModel.js';
import * as DamageLevelModel from '../models/damageLevelModel.js';
import { updateProofImageAndPayStatus } from '../models/returnModel.js';
import User from '../models/userModel.js';
import { sendLineNotify } from '../utils/lineNotify.js';
import { broadcastBadgeCounts } from '../index.js';
import * as RepairRequest from '../models/repairRequestModel.js';

// Helper function for strict check
function isLineNotifyEnabled(val) {
  return val === 1 || val === true || val === '1';
}

export const getAllReturns = async (req, res) => {
  try {
    console.log('=== getAllReturns API Debug ===');
    const rows = await ReturnModel.getAllReturns();

    // Debug: Check if signature_image and handover_photo exist
    console.log('Total returns returned:', rows.length);
    if (rows.length > 0) {
      console.log('First return data:', {
        borrow_id: rows[0].borrow_id,
        borrow_code: rows[0].borrow_code,
        signature_image: rows[0].signature_image ? 'EXISTS' : 'NULL',
        handover_photo: rows[0].handover_photo ? 'EXISTS' : 'NULL',
        keys: Object.keys(rows[0])
      });
    }

    res.json(rows);
  } catch (err) {
    console.error('Error in getAllReturns:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};

export const createReturn = async (req, res) => {
  // DEBUG LOG
  console.log('==== [API] POST /api/returns ====');
  console.log('createReturn req.body:', req.body);
  console.log('createReturn item_conditions:', req.body.item_conditions);
  const {
    borrow_id,
    return_date,
    return_by,
    user_id, // เพิ่ม user_id
    fine_amount,
    damage_fine,
    late_fine,
    late_days,
    proof_image,
    status,
    notes,
    pay_status = 'pending',
    paymentMethod = 'cash',
    item_conditions // เพิ่มรับ item_conditions
  } = req.body;
  try {
    // 1. บันทึกการคืน
    const return_id = await ReturnModel.createReturn(
      borrow_id,
      return_date,
      return_by,
      user_id, // user_id ต้องอยู่ลำดับที่ 4
      fine_amount,
      damage_fine,
      late_fine,
      late_days,
      proof_image,
      status,
      notes,
      pay_status,
      paymentMethod
    );

    // 1.5 บันทึก return_items ทีละชิ้น
    if (item_conditions && typeof item_conditions === 'object') {
      for (const [item_id, cond] of Object.entries(item_conditions)) {
        await ReturnModel.createReturnItem(
          return_id,
          item_id,
          cond.damageLevelId || null,
          cond.note || '',
          cond.fine_amount || 0
        );
      }
    }

    // 2. อัปเดตสถานะ borrow
    let newStatus = null;
    if ((pay_status === 'pending') && (paymentMethod === 'online' || paymentMethod === 'transfer')) {
      console.log(`[RETURN] Set borrow_id=${borrow_id} status=waiting_payment (pay_status=${pay_status}, paymentMethod=${paymentMethod})`);
      await BorrowModel.updateBorrowStatus(borrow_id, 'waiting_payment');
      newStatus = 'waiting_payment';
    } else {
      console.log(`[RETURN] Set borrow_id=${borrow_id} status=completed (pay_status=${pay_status}, paymentMethod=${paymentMethod})`);
      await BorrowModel.updateBorrowStatus(borrow_id, 'completed');
      newStatus = 'completed';

      // === เพิ่ม logic ใหม่: ตรวจสอบสภาพครุภัณฑ์และอัปเดตสถานะ ===
      const borrow = await BorrowModel.getBorrowById(borrow_id);
      const equipmentList = borrow && borrow.equipment ? borrow.equipment : [];

             // ตรวจสอบสภาพครุภัณฑ์แต่ละชิ้น
       console.log(`[RETURN] Equipment list:`, equipmentList.map(eq => ({ item_id: eq.item_id, item_code: eq.item_code })));
       console.log(`[RETURN] Item conditions:`, item_conditions);

       for (const eq of equipmentList) {
         console.log(`[RETURN] Processing equipment: ${eq.item_code} (item_id: ${eq.item_id})`);
         const itemCondition = item_conditions && item_conditions[eq.item_id];
         console.log(`[RETURN] Item condition for ${eq.item_code}:`, itemCondition);

         if (itemCondition && itemCondition.damageLevelId) {
           console.log(`[RETURN] Found damageLevelId: ${itemCondition.damageLevelId} for equipment ${eq.item_code}`);
           // หา damage level เพื่อดู fine_percent
           const damageLevel = await DamageLevelModel.getDamageLevelById(itemCondition.damageLevelId);

           if (damageLevel && damageLevel.fine_percent !== null && damageLevel.fine_percent !== undefined) {
             const conditionPercent = Number(damageLevel.fine_percent);
             console.log(`[RETURN] Equipment ${eq.item_code} condition percent: ${conditionPercent}%`);

             // หากสภาพครุภัณฑ์มากกว่าหรือเท่ากับ 70% ให้อัปเดตสถานะเป็น 'ชำรุด'
             if (conditionPercent >= 70) {
               console.log(`[RETURN] Equipment ${eq.item_code} condition >= 70% (${conditionPercent}%), updating status to 'ชำรุด'`);
               await EquipmentModel.updateEquipmentStatus(eq.item_code, 'ชำรุด');
             } else {
               // สภาพปกติ ให้อัปเดตเป็น 'พร้อมใช้งาน'
               console.log(`[RETURN] Equipment ${eq.item_code} condition < 70% (${conditionPercent}%), updating status to 'พร้อมใช้งาน'`);
               await EquipmentModel.updateEquipmentStatus(eq.item_code, 'พร้อมใช้งาน');
             }
           } else {
             // ไม่มีข้อมูล fine_percent ให้ใช้ค่าเริ่มต้น
             console.log(`[RETURN] Equipment ${eq.item_code} no damage level info, updating status to 'พร้อมใช้งาน'`);
             await EquipmentModel.updateEquipmentStatus(eq.item_code, 'พร้อมใช้งาน');
           }
         } else {
           // ไม่มีข้อมูลสภาพ ให้ใช้ค่าเริ่มต้น
           console.log(`[RETURN] Equipment ${eq.item_code} no condition info, updating status to 'พร้อมใช้งาน'`);
           await EquipmentModel.updateEquipmentStatus(eq.item_code, 'พร้อมใช้งาน');
         }
       }
      // === จบ logic ใหม่ ===
    }

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

    // === แจ้งเตือน LINE ===
    if (newStatus === 'waiting_payment' || newStatus === 'completed') {
      const borrow = await BorrowModel.getBorrowById(borrow_id);
      const user = await User.findById(borrow.user_id);
      console.log('[DEBUG] LINE Notify user:', {
        user_id: user.user_id,
        line_id: user.line_id,
        line_notify_enabled: user.line_notify_enabled,
        type: typeof user.line_notify_enabled
      });
      if (user?.line_id && isLineNotifyEnabled(user.line_notify_enabled)) {
        let message;
        if (newStatus === 'waiting_payment') {
          message = {
            type: 'flex',
            altText: `แจ้งเตือนยอดค้างชำระ รหัสการยืม: ${borrow.borrow_code} กรุณาชำระเงินผ่านเว็บไซต์`,
            contents: {
              type: 'bubble',
              header: {
                type: 'box',
                layout: 'vertical',
                backgroundColor: '#d84315',
                contents: [
                  {
                    type: 'text',
                    text: '⚠️ แจ้งเตือนยอดค้างชำระ',
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
                      { type: 'text', text: 'รหัสการยืม', size: 'sm', color: '#888888', flex: 2 },
                      { type: 'text', text: borrow.borrow_code, size: 'sm', color: '#222222', flex: 4, weight: 'bold' }
                    ]
                  },
                  {
                    type: 'box',
                    layout: 'horizontal',
                    contents: [
                      { type: 'text', text: 'สถานะ', size: 'sm', color: '#888888', flex: 2 },
                      { type: 'text', text: 'ค้างชำระ', size: 'sm', color: '#d84315', flex: 4, weight: 'bold' }
                    ]
                  },
                  { type: 'separator', margin: 'md' },
                  {
                    "type": "text",
                    "text": "เรียนผู้ใช้บริการ\nระบบขอแจ้งให้ท่านทราบว่ามียอดค้างชำระสำหรับรายการยืมนี้ กรุณาตรวจสอบและดำเนินการชำระเงินผ่านเว็บไซต์ หากชำระเงินแล้วสามารถตรวจสอบสถานะได้ที่ระบบออนไลน์",
                    "size": "sm",
                    "color": "#222222",
                    "wrap": true,
                    "align": "center"
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
                    color: '#d84315',
                    action: {
                      type: 'uri',
                      label: 'ชำระเงิน/ดูรายละเอียด',
                      uri: 'https://your-website.com/payment'
                    }
                  },
                  {
                    type: 'text',
                    text: 'สอบถามข้อมูลเพิ่มเติม กรุณาติดต่อเจ้าหน้าที่',
                    size: 'xs',
                    color: '#888888',
                    align: 'center',
                    margin: 'md'
                  }
                ]
              }
            }
          };
        } else if (newStatus === 'completed') {
          message = {
            type: 'flex',
            altText: `รายการยืมเสร็จสิ้น รหัสการยืม: ${borrow.borrow_code} ขอบคุณที่ใช้บริการ`,
            contents: {
              type: 'bubble',
              header: {
                type: 'box',
                layout: 'vertical',
                backgroundColor: '#0A8F08',
                contents: [
                  {
                    type: 'text',
                    text: '✅ รายการยืมเสร็จสิ้น',
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
                      { type: 'text', text: 'รหัสการยืม', size: 'sm', color: '#888888', flex: 2 },
                      { type: 'text', text: borrow.borrow_code, size: 'sm', color: '#222222', flex: 4, weight: 'bold' }
                    ]
                  },
                  {
                    type: 'box',
                    layout: 'horizontal',
                    contents: [
                      { type: 'text', text: 'สถานะ', size: 'sm', color: '#888888', flex: 2 },
                      { type: 'text', text: 'เสร็จสิ้น', size: 'sm', color: '#0A8F08', flex: 4, weight: 'bold' }
                    ]
                  },
                  { type: 'separator', margin: 'md' },
                  {
                    "type": "text",
                    "text": "ขอขอบคุณที่ใช้บริการระบบยืม-คืนครุภัณฑ์\nหากมีข้อเสนอแนะหรือต้องการติชม\nกรุณาคลิกปุ่มด้านล่าง",
                    "size": "sm",
                    "color": "#222222",
                    "wrap": true,
                    "align": "center",   // จัดกลางแนวนอน
                    "gravity": "center"  // จัดกลางแนวตั้ง (เฉพาะใน box)
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
                    color: '#0A8F08',
                    action: {
                      type: 'uri',
                      label: 'ติชมระบบ',
                      uri: 'https://your-website.com/feedback'
                    }
                  },
                  {
                    type: 'text',
                    text: '🙏 ขอขอบคุณสำหรับข้อเสนอแนะของท่าน',
                    size: 'xs',
                    color: '#888888',
                    align: 'center',
                    margin: 'sm',
                    wrap: true
                  }
                ]
              }
            }
          };
        }
        try {
          await sendLineNotify(user.line_id, message);
        } catch (err) {
          console.error(`[LINE Notify] Error sending message for status ${newStatus}:`, err, err.response?.data);
        }
      } else {
        console.log(`[LINE Notify] No line_id for user:`, borrow.user_id);
      }
    }

    res.status(201).json({ return_id, user_id: return_by });
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};

export const getSuccessBorrows = async (req, res) => {
  try {
    console.log('=== getSuccessBorrows API Debug ===');
    const borrows = await BorrowModel.getBorrowsByStatus(['completed', 'rejected']);



    res.json(borrows);
  } catch (err) {
    console.error('Error in getSuccessBorrows:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};

export const updatePayStatus = async (req, res) => {
  const { return_id } = req.params;
  try {
    // 1. อัปเดต pay_status ใน returns เป็น 'paid'
    await ReturnModel.updatePayStatus(return_id, 'paid');
    // 2. หา borrow_id จาก return
    const ret = await ReturnModel.getReturnById(return_id);
    if (ret && ret.borrow_id) {
      console.log(`[PAY] Set borrow_id=${ret.borrow_id} status=completed (pay_status=paid)`);
      await BorrowModel.updateBorrowStatus(ret.borrow_id, 'completed');

      // === เพิ่ม logic ใหม่: ตรวจสอบสภาพครุภัณฑ์และอัปเดตสถานะ ===
      const borrow = await BorrowModel.getBorrowById(ret.borrow_id);
      const equipmentList = borrow && borrow.equipment ? borrow.equipment : [];

      // หา return items เพื่อดูสภาพครุภัณฑ์
      console.log(`[PAY] Getting return items for return_id: ${return_id}`);
      const returnItems = await ReturnModel.getReturnItemsByReturnId(return_id);
      console.log(`[PAY] Return items found:`, returnItems);

      const itemConditionsMap = {};

      // สร้าง map ของ item_id กับ damage level
      for (const item of returnItems) {
                 console.log(`[PAY] Processing return item:`, {
           item_id: item.item_id,
           damage_level_id: item.damage_level_id,
           damage_note: item.damage_note,
           fine_amount: item.fine_amount
         });
         itemConditionsMap[item.item_id] = {
           damageLevelId: item.damage_level_id,
           note: item.damage_note,
           fine_amount: item.fine_amount
         };
      }
      console.log(`[PAY] Final itemConditionsMap:`, itemConditionsMap);

             // ตรวจสอบสภาพครุภัณฑ์แต่ละชิ้น
       console.log(`[PAY] Equipment list:`, equipmentList.map(eq => ({ item_id: eq.item_id, item_code: eq.item_code })));
       console.log(`[PAY] Item conditions map:`, itemConditionsMap);

       for (const eq of equipmentList) {
         console.log(`[PAY] Processing equipment: ${eq.item_code} (item_id: ${eq.item_id})`);
         const itemCondition = itemConditionsMap[eq.item_id];
         console.log(`[PAY] Item condition for ${eq.item_code}:`, itemCondition);

         if (itemCondition && itemCondition.damageLevelId) {
           console.log(`[PAY] Found damageLevelId: ${itemCondition.damageLevelId} for equipment ${eq.item_code}`);
           // หา damage level เพื่อดู fine_percent
           const damageLevel = await DamageLevelModel.getDamageLevelById(itemCondition.damageLevelId);

           if (damageLevel && damageLevel.fine_percent !== null && damageLevel.fine_percent !== undefined) {
             const conditionPercent = Number(damageLevel.fine_percent);
             console.log(`[PAY] Equipment ${eq.item_code} condition percent: ${conditionPercent}%`);

             // หากสภาพครุภัณฑ์มากกว่าหรือเท่ากับ 70% ให้อัปเดตสถานะเป็น 'ชำรุด'
             if (conditionPercent >= 70) {
               console.log(`[PAY] Equipment ${eq.item_code} condition >= 70% (${conditionPercent}%), updating status to 'ชำรุด'`);
               await EquipmentModel.updateEquipmentStatus(eq.item_code, 'ชำรุด');
             } else {
               // สภาพปกติ ให้อัปเดตเป็น 'พร้อมใช้งาน'
               console.log(`[PAY] Equipment ${eq.item_code} condition < 70% (${conditionPercent}%), updating status to 'พร้อมใช้งาน'`);
               await EquipmentModel.updateEquipmentStatus(eq.item_code, 'พร้อมใช้งาน');
             }
           } else {
             // ไม่มีข้อมูล fine_percent ให้ใช้ค่าเริ่มต้น
             console.log(`[PAY] Equipment ${eq.item_code} no damage level info, updating status to 'พร้อมใช้งาน'`);
             await EquipmentModel.updateEquipmentStatus(eq.item_code, 'พร้อมใช้งาน');
           }
         } else {
           // ไม่มีข้อมูลสภาพ ให้ใช้ค่าเริ่มต้น
           console.log(`[PAY] Equipment ${eq.item_code} no condition info, updating status to 'พร้อมใช้งาน'`);
           await EquipmentModel.updateEquipmentStatus(eq.item_code, 'พร้อมใช้งาน');
         }
       }
      // === จบ logic ใหม่ ===

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
      // === แจ้งเตือน LINE ===
      const user = await User.findById(borrow.user_id);
      console.log('[DEBUG] LINE Notify user:', {
        user_id: user.user_id,
        line_id: user.line_id,
        line_notify_enabled: user.line_notify_enabled,
        type: typeof user.line_notify_enabled
      });
      if (user?.line_id && isLineNotifyEnabled(user.line_notify_enabled)) {
        const message = {
          type: 'flex',
          altText: `รายการยืมเสร็จสิ้น รหัสการยืม: ${borrow.borrow_code} ขอบคุณที่ใช้บริการ`,
          contents: {
            type: 'bubble',
            header: {
              type: 'box',
              layout: 'vertical',
              backgroundColor: '#0A8F08',
              contents: [
                {
                  type: 'text',
                  text: '✅ รายการยืมเสร็จสิ้น',
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
                    { type: 'text', text: 'รหัสการยืม', size: 'sm', color: '#888888', flex: 2 },
                    { type: 'text', text: borrow.borrow_code, size: 'sm', color: '#222222', flex: 4, weight: 'bold' }
                  ]
                },
                {
                  type: 'box',
                  layout: 'horizontal',
                  contents: [
                    { type: 'text', text: 'สถานะ', size: 'sm', color: '#888888', flex: 2 },
                    { type: 'text', text: 'เสร็จสิ้น', size: 'sm', color: '#0A8F08', flex: 4, weight: 'bold' }
                  ]
                },
                { type: 'separator', margin: 'md' },
                {
                  type: 'text',
                  text: 'ขอขอบคุณที่ใช้บริการระบบยืม-คืนครุภัณฑ์\nหากมีข้อเสนอแนะหรือต้องการติชม\nกรุณาคลิกปุ่มด้านล่าง',
                  size: 'sm',
                  color: '#222222',
                  wrap: true,
                  align: 'center',
                  gravity: 'center'
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
                  color: '#0A8F08',
                  action: {
                    type: 'uri',
                    label: 'ติชมระบบ',
                    uri: 'https://your-website.com/feedback'
                  }
                },
                {
                  type: 'text',
                  text: '🙏 ขอขอบคุณสำหรับข้อเสนอแนะของท่าน',
                  size: 'xs',
                  color: '#888888',
                  align: 'center',
                  margin: 'sm',
                  wrap: true
                }
              ]
            }
          }
        };
        console.log(`[LINE Notify] Preparing to send to line_id=${user.line_id}, borrow_id=${borrow.borrow_id}`);
        try {
          await sendLineNotify(user.line_id, message);
          console.log(`[LINE Notify] Sent successfully to line_id=${user.line_id}, borrow_id=${borrow.borrow_id}`);
        } catch (err) {
          console.error('[LINE Notify] Error sending message for status completed:', err, err.response?.data);
        }
      } else {
        console.log(`[LINE Notify] Not sending to user_id=${user.user_id} because line_notify_enabled=${user.line_notify_enabled}`);
      }
    }
    res.json({ success: true });
  } catch (err) {
    console.error('[updatePayStatus] error:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};

export const getReturnsByBorrowId = async (req, res) => {
  const { borrow_id } = req.params;
  try {
    const [rows] = await ReturnModel.getReturnsByBorrowId(borrow_id);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};

export const getAllReturns_pay = async (req, res) => {
  try {
    const user_id = req.query.user_id;
    const rows = await (await import('../models/returnModel.js')).getAllReturns_pay(user_id);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};

export const uploadSlip = async (req, res) => {
  try {
    console.log('UPLOAD SLIP req.body:', req.body);
    console.log('UPLOAD SLIP req.files:', req.files);
    const file = req.files?.slip?.[0];
    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    // ใช้ borrow_code จาก req.body
    // สามารถบันทึกชื่อไฟล์ลงฐานข้อมูลได้ที่นี่ (ถ้ามี borrow_id)
    // const borrow_id = req.body.borrow_id;
    // TODO: update return record with slip filename if needed
    res.json({ success: true, filename: file.filename });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Upload failed', error: err.message });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { borrow_id, proof_image, cloudinary_public_id } = req.body;
    console.log('[confirm-payment] req.body:', req.body);
    if (!borrow_id || !proof_image) {
      console.log('[confirm-payment] missing borrow_id or proof_image');
      return res.status(400).json({ success: false, message: 'Missing borrow_id or proof_image' });
    }

    // อัปเดต proof_image และ cloudinary_public_id (ถ้ามี)
    const affected = await updateProofImageAndPayStatus(borrow_id, proof_image, cloudinary_public_id);
    console.log('[confirm-payment] affected:', affected);
    if (affected > 0) {
      res.json({ success: true });
    } else {
      console.log('[confirm-payment] Return not found for borrow_id:', borrow_id);
      res.status(404).json({ success: false, message: 'Return not found' });
    }
  } catch (err) {
    console.error('[confirm-payment] error:', err);
    res.status(500).json({ success: false, message: 'Confirm payment failed', error: err.message });
  }
};