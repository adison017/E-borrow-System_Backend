import multer from 'multer';
import path from 'path';
import fs from 'fs';

// ฟังก์ชันสร้างโฟลเดอร์ถ้ายังไม่มี
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// กำหนด storage สำหรับ multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const roomCode = req.body.room_code || req.params.room_code || 'temp';
    const uploadPath = path.join('uploads', 'roomimg', roomCode);

    // สร้างโฟลเดอร์ถ้ายังไม่มี
    ensureDirectoryExists(uploadPath);

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // สร้างชื่อไฟล์ใหม่เพื่อป้องกันการซ้ำ
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const ext = path.extname(file.originalname);
    const filename = `room_${timestamp}_${random}${ext}`;

    cb(null, filename);
  }
});

// ฟิลเตอร์ไฟล์รูปภาพ
const fileFilter = (req, file, cb) => {
  // ตรวจสอบประเภทไฟล์
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('รองรับเฉพาะไฟล์รูปภาพ (JPEG, JPG, PNG, GIF, WEBP)'), false);
  }
};

// สร้าง multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5 // สูงสุด 5 ไฟล์
  }
});

// Middleware สำหรับอัปโหลดรูปภาพเดียว
export const uploadSingleImage = upload.single('image');

// Middleware สำหรับอัปโหลดหลายรูปภาพ
export const uploadMultipleImages = upload.array('images', 5);

// ฟังก์ชันลบไฟล์รูปภาพ
export const deleteRoomImages = (roomCode) => {
  try {
    const roomImagePath = path.join('uploads', 'roomimg', roomCode);
    if (fs.existsSync(roomImagePath)) {
      fs.rmSync(roomImagePath, { recursive: true, force: true });
    }
  } catch (error) {
    console.error('Error deleting room images:', error);
  }
};

// ฟังก์ชันลบไฟล์รูปภาพเฉพาะ
export const deleteSpecificImage = (roomCode, filename) => {
  try {
    const imagePath = path.join('uploads', 'roomimg', roomCode, filename);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      return true;
    }
  } catch (error) {
    console.error('Error deleting specific image:', error);
  }
  return false;
};

// ฟังก์ชันดึงรายการไฟล์รูปภาพในโฟลเดอร์
export const getRoomImages = (roomCode) => {
  try {
    const roomImagePath = path.join('uploads', 'roomimg', roomCode);
    if (fs.existsSync(roomImagePath)) {
      const files = fs.readdirSync(roomImagePath);
      return files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
      });
    }
  } catch (error) {
    console.error('Error getting room images:', error);
  }
  return [];
};

export default upload;