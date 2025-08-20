import { getAllDamageLevels, updateDamageLevel, createDamageLevel } from '../models/damageLevelModel.js';

export const getDamageLevels = async (req, res) => {
  try {
    const levels = await getAllDamageLevels();
    
    // เพิ่ม color class ตาม fine_percent
    const levelsWithColor = levels.map(level => {
      let colorClass = 'bg-green-100 text-green-700 border-green-400'; // default
      
      if (level.fine_percent >= 80) {
        colorClass = 'bg-red-100 text-red-700 border-red-400';
      } else if (level.fine_percent >= 60) {
        colorClass = 'bg-orange-100 text-orange-800 border-orange-400';
      } else if (level.fine_percent >= 40) {
        colorClass = 'bg-yellow-100 text-yellow-800 border-yellow-400';
      } else if (level.fine_percent >= 20) {
        colorClass = 'bg-blue-100 text-blue-700 border-blue-400';
      }
      
      return {
        ...level,
        color_class: colorClass
      };
    });
    
    res.json({
      success: true,
      data: levelsWithColor
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'เกิดข้อผิดพลาด', 
      error: err.message 
    });
  }
};

// สร้าง damage level ใหม่
export const createDamageLevelController = async (req, res) => {
  try {
    const { name, fine_percent, detail } = req.body;
    
    // Validation
    if (!name || !fine_percent) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลให้ครบถ้วน (ชื่อระดับ, เปอร์เซ็นต์ค่าปรับ)'
      });
    }
    
    if (fine_percent < 0 || fine_percent > 100) {
      return res.status(400).json({
        success: false,
        message: 'เปอร์เซ็นต์ค่าปรับต้องอยู่ระหว่าง 0-100'
      });
    }
    
    // ตรวจสอบว่าไม่ซ้ำกับระดับที่ห้ามแก้ไข
    if (fine_percent === 50 || fine_percent === 100) {
      return res.status(400).json({
        success: false,
        message: 'ไม่สามารถใช้เปอร์เซ็นต์ 50% หรือ 100% ได้'
      });
    }
    
    const newDamageLevel = await createDamageLevel({
      name,
      fine_percent,
      detail: detail || ''
    });
    
    res.status(201).json({
      success: true,
      data: newDamageLevel,
      message: 'สร้างระดับความเสียหายใหม่สำเร็จ'
    });
  } catch (error) {
    console.error('Error creating damage level:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการสร้างระดับความเสียหาย'
    });
  }
};

// อัปเดต damage level
export const updateDamageLevelController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, fine_percent, detail } = req.body;
    
    // Validation
    if (!name || !fine_percent) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลให้ครบถ้วน (ชื่อระดับ, เปอร์เซ็นต์ค่าปรับ)'
      });
    }
    
    if (fine_percent < 0 || fine_percent > 100) {
      return res.status(400).json({
        success: false,
        message: 'เปอร์เซ็นต์ค่าปรับต้องอยู่ระหว่าง 0-100'
      });
    }
    
    const updatedDamageLevel = await updateDamageLevel(id, {
      name,
      fine_percent,
      detail: detail || ''
    });
    
    res.json({
      success: true,
      data: updatedDamageLevel,
      message: 'อัปเดตระดับความเสียหายสำเร็จ'
    });
  } catch (error) {
    console.error('Error updating damage level:', error);
    if (error.message === 'Damage level not found') {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบระดับความเสียหายที่ระบุ'
      });
    }
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัปเดตระดับความเสียหาย'
    });
  }
};