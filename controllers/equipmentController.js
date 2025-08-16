import fs from 'fs';
import path from 'path';
import * as Equipment from '../models/equipmentModel.js';
import { getPicUrl } from '../utils/imageUtils.js';

export const getAllEquipment = async (req, res) => {
  try {
    console.log('Getting all equipment...');
    const results = await Equipment.getAllEquipmentWithDueDate();
    console.log('Total equipment found:', results.length);
    console.log('Equipment codes:', results.map(item => item.item_code));
    const mapped = results.map(item => ({
      ...item,
      pic: getPicUrl(item.pic)
    }));
    res.json(mapped);
  } catch (err) {
    console.error('Error in getAllEquipment:', err);
    res.status(500).json({ error: err.message });
  }
};



// Use item_code as canonical identifier for all CRUD
export const getEquipmentByCode = async (req, res) => {
  try {
    console.log('Getting equipment by code:', req.params.item_code);
    const results = await Equipment.getEquipmentByCode(req.params.item_code);
    console.log('Database results:', results);
    if (results.length === 0) {
      console.log('Equipment not found for code:', req.params.item_code);
      return res.status(404).json({ error: 'Equipment not found', item_code: req.params.item_code });
    }
    const item = results[0];
    const mapped = {
      ...item,
      pic: getPicUrl(item.pic)
    };
    console.log('Returning equipment:', mapped);
    res.json(mapped);
  } catch (err) {
    console.error('Error in getEquipmentByCode:', err);
    res.status(500).json({ error: err.message });
  }
};

export const addEquipment = async (req, res) => {
  try {
    const data = req.body;
    // Generate item_code อัตโนมัติ
    let lastCode = await Equipment.getLastItemCode();
    let nextNumber = 1;
    if (lastCode) {
      const match = lastCode.match(/EQ-(\d{3})/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }
    const newItemCode = `EQ-${String(nextNumber).padStart(3, '0')}`;
    // ตรวจสอบซ้ำอีกชั้น
    const exist = await Equipment.getEquipmentByCode(newItemCode);
    if (exist && exist.length > 0) {
      return res.status(400).json({ error: 'item_code ซ้ำในระบบ' });
    }
    data.item_code = newItemCode;
    if (data.pic && typeof data.pic === 'string') {
      if (!data.pic.startsWith('http')) {
        data.pic = `http://localhost:5000/uploads/${data.pic.replace(/^\/?uploads\//, '')}`;
      }
    }
    data.purchaseDate = data.purchaseDate || null;
    data.price = data.price || null;
    data.room_id = data.room_id || null;
    await Equipment.addEquipment(data);
    res.status(201).json({ message: 'Equipment added', item_code: data.item_code });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateEquipment = async (req, res) => {
  try {
    console.log('updateEquipment - Request params:', req.params);
    console.log('updateEquipment - Request body:', req.body);

    const data = req.body;
    const equipmentItemId = req.params.item_id;
    console.log('updateEquipment - Equipment Item ID:', equipmentItemId);

    if (!equipmentItemId) {
      console.log('updateEquipment - No item_id provided in params');
      return res.status(400).json({ error: 'item_id is required in URL params' });
    }

    if (!data.item_code) {
      console.log('updateEquipment - No item_code in request body');
      return res.status(400).json({ error: 'item_code is required in request body' });
    }

    console.log('updateEquipment - New item code:', data.item_code);

    // Handle image upload if provided
    if (data.pic && data.pic.startsWith('data:image')) {
      const imagePath = await saveBase64Image(data.pic, data.item_code);
      data.pic = imagePath;
    }

    // Set default values for null fields
    data.name = data.name || '';
    data.category = data.category || '';
    data.description = data.description || '';
    data.quantity = data.quantity || 0;
    data.unit = data.unit || '';
    data.status = data.status || 'available';
    data.purchaseDate = data.purchaseDate || null;
    data.price = data.price || 0;
    data.room_id = data.room_id || '';

    console.log('updateEquipment - Looking for equipment with item_id:', equipmentItemId);
    const results = await Equipment.getEquipmentByItemId(equipmentItemId);
    console.log('updateEquipment - Found equipment:', results.length > 0 ? 'Yes' : 'No');

    if (results.length === 0) {
      console.log('updateEquipment - Equipment not found');
      return res.status(404).json({ error: 'Equipment not found', item_id: equipmentItemId });
    }

    const oldPic = results[0].pic;
    // Delete old image if new image is provided and old image exists
    if (data.pic && oldPic && oldPic !== data.pic) {
      try {
        const fs = await import('fs');
        const path = await import('path');
        const oldImagePath = path.join(process.cwd(), 'uploads', 'equipment', oldPic);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log('Old image deleted:', oldImagePath);
        }
      } catch (error) {
        console.error('Error deleting old image:', error);
      }
    }

    console.log('updateEquipment - Updating equipment...');
    await Equipment.updateEquipmentByItemId(equipmentItemId, data);
    console.log('updateEquipment - Equipment updated successfully');
    res.json({ message: 'Equipment updated' });
  } catch (err) {
    console.error('updateEquipment - Error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const updateEquipmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    // ดึงข้อมูลเดิมก่อนอัปเดต
    const results = await Equipment.getEquipmentByCode(req.params.item_code);
    if (results.length === 0) {
      return res.status(404).json({ error: 'Equipment not found' });
    }
    // อัปเดตเฉพาะสถานะ
    await Equipment.updateEquipmentStatus(req.params.item_code, status);
    res.json({ message: 'Equipment status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteEquipment = async (req, res) => {
  try {
    // ดึงข้อมูลก่อนลบ เพื่อรู้ชื่อไฟล์
    const results = await Equipment.getEquipmentByCode(req.params.item_code);
    if (results.length === 0) return res.status(404).json({ error: 'Not found' });

    const picUrl = results[0].pic;
    // ตัดให้เหลือแค่ชื่อไฟล์
    let filename = picUrl;
    if (typeof filename === 'string' && filename.startsWith('http')) {
      filename = filename.replace(/^https?:\/\/[^/]+\/uploads\//, '');
    } else if (typeof filename === 'string' && filename.startsWith('/uploads/')) {
      filename = filename.replace(/^\/uploads\//, '');
    }

    // ลบไฟล์ (ถ้าไม่ใช่ default)
    if (
      filename &&
      filename !== 'https://cdn-icons-png.flaticon.com/512/3474/3474360.png'
    ) {
      const filePath = path.join(process.cwd(), 'server', 'uploads', filename);
      fs.unlink(filePath, (err) => {});
    }

    // สมมติ filename ไม่มีนามสกุล ลองเติม .png หรือ .jpg ตรวจสอบก่อนลบ
    const tryExtensions = ['', '.png', '.jpg', '.jpeg', '.webp'];
    let found = false;
    for (const ext of tryExtensions) {
      const tryPath = path.join(process.cwd(), 'server', 'uploads', filename + ext);
      if (fs.existsSync(tryPath)) {
        fs.unlink(tryPath, (err) => {
          if (err) console.error('ลบไฟล์ไม่สำเร็จ:', tryPath, err.message);
        });
        found = true;
        break;
      }
    }
    // ลบข้อมูลใน DB
    await Equipment.deleteEquipment(req.params.item_code);
    res.json({ message: 'Equipment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};