import { roomModel } from '../models/roomModel.js';
import { getRoomImages, deleteRoomImages, deleteSpecificImage } from '../middleware/roomImageUpload.js';
import { uploadRoomImages as uploadRoomToCloudinary, deleteImageFromCloudinary, extractPublicIdFromUrl } from '../utils/cloudinaryUploadUtils.js';
import path from 'path';

// ฟังก์ชันสร้างรหัสห้อง
const generateRoomCode = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `RM-${timestamp}-${random}`;
};

// ฟังก์ชันตรวจสอบจำนวนรูปภาพ
const validateImageCount = (imageUrl) => {
  if (!imageUrl) return { valid: true }; // ถ้าไม่มีรูปภาพให้ผ่าน

  try {
    const imageUrls = JSON.parse(imageUrl);
    if (Array.isArray(imageUrls)) {
      // ตรวจสอบจำนวนรูปภาพ
      if (imageUrls.length > 5) {
        return { valid: false, message: 'ไม่สามารถอัปโหลดรูปภาพได้เกิน 5 รูป' };
      }

      // ตรวจสอบ URL ที่ซ้ำกัน
      const uniqueUrls = [...new Set(imageUrls)];
      if (imageUrls.length !== uniqueUrls.length) {
        return { valid: false, message: 'ไม่สามารถใช้ URL รูปภาพที่ซ้ำกันได้' };
      }
    }
  } catch (parseError) {
    // ถ้าไม่ใช่ JSON array ให้ถือว่าเป็น URL เดียว (ไม่เกิน 5 รูป)
  }

  return { valid: true };
};

// ฟังก์ชันสร้าง image_url จากไฟล์ที่อัปโหลด
const createImageUrlFromFiles = async (files, roomCode) => {
  if (!files || files.length === 0) return null;

  try {
    // Convert files to base64 and upload to Cloudinary
    const base64DataArray = files.map(file =>
      `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
    );

    const results = await uploadRoomToCloudinary(base64DataArray, roomCode);

    // Check if all uploads were successful
    const successfulUploads = results.filter(result => result.success);
    const failedUploads = results.filter(result => !result.success);

    if (failedUploads.length > 0) {
      console.error('Some uploads failed:', failedUploads);
      throw new Error('Some images failed to upload to Cloudinary');
    }

    // Return Cloudinary URLs
    const imageUrls = successfulUploads.map(result => result.url);
    return JSON.stringify(imageUrls);
  } catch (error) {
    console.error('Error uploading room images to Cloudinary:', error);
    throw error;
  }
};

// ฟังก์ชันลบรูปภาพเก่าจาก Cloudinary
const deleteOldImages = async (oldImageUrl) => {
  if (!oldImageUrl) return;

  try {
    const oldUrls = JSON.parse(oldImageUrl);
    if (Array.isArray(oldUrls)) {
      for (const url of oldUrls) {
        if (url.includes('cloudinary.com')) {
          const publicId = extractPublicIdFromUrl(url);
          if (publicId) {
            await deleteImageFromCloudinary(publicId);
          }
        }
      }
    }
  } catch (parseError) {
    // ถ้าไม่ใช่ JSON array ให้ลบไฟล์เดียว
    if (oldImageUrl.includes('cloudinary.com')) {
      const publicId = extractPublicIdFromUrl(oldImageUrl);
      if (publicId) {
        await deleteImageFromCloudinary(publicId);
      }
    }
  }
};

export const roomController = {
  // ดึงข้อมูลห้องทั้งหมด
  getAllRooms: async (req, res) => {
    try {
      const rooms = await roomModel.getAllRooms();
      res.json(rooms);
    } catch (error) {
      console.error('Error in getAllRooms:', error);
      res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลห้อง' });
    }
  },

  // ดึงข้อมูลห้องตาม ID
  getRoomById: async (req, res) => {
    try {
      const { id } = req.params;
      const room = await roomModel.getRoomById(id);

      if (!room) {
        return res.status(404).json({ message: 'ไม่พบข้อมูลห้อง' });
      }

      res.json(room);
    } catch (error) {
      console.error('Error in getRoomById:', error);
      res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลห้อง' });
    }
  },

  // ดึงข้อมูลห้องตามรหัสห้อง
  getRoomByCode: async (req, res) => {
    try {
      const { code } = req.params;
      const room = await roomModel.getRoomByCode(code);

      if (!room) {
        return res.status(404).json({ message: 'ไม่พบข้อมูลห้อง' });
      }

      res.json(room);
    } catch (error) {
      console.error('Error in getRoomByCode:', error);
      res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลห้อง' });
    }
  },

  // ค้นหาห้อง
  searchRooms: async (req, res) => {
    try {
      const { search } = req.query;

      if (!search) {
        return res.status(400).json({ message: 'กรุณาระบุคำค้นหา' });
      }

      const rooms = await roomModel.searchRooms(search);
      res.json(rooms);
    } catch (error) {
      console.error('Error in searchRooms:', error);
      res.status(500).json({ message: 'เกิดข้อผิดพลาดในการค้นหาห้อง' });
    }
  },

  // สร้างห้องใหม่
  createRoom: async (req, res) => {
    try {
      const {
        room_name,
        room_code,
        address,
        detail,
        image_url,
        note
      } = req.body;

      // ตรวจสอบข้อมูลที่จำเป็น
      if (!room_name) {
        return res.status(400).json({ message: 'กรุณากรอกชื่อห้อง' });
      }

      // สร้างรหัสห้องถ้าไม่ได้ระบุ
      const finalRoomCode = room_code || generateRoomCode();

      // จัดการรูปภาพที่อัปโหลด
      let finalImageUrl = image_url;
      if (req.files && req.files.length > 0) {
        // ตรวจสอบจำนวนไฟล์
        if (req.files.length > 5) {
          return res.status(400).json({ message: 'ไม่สามารถอัปโหลดรูปภาพได้เกิน 5 รูป' });
        }

        try {
          // สร้าง image_url จากไฟล์ที่อัปโหลด
          finalImageUrl = await createImageUrlFromFiles(req.files, finalRoomCode);
        } catch (uploadError) {
          console.error('Error uploading room images:', uploadError);
          return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ' });
        }
      } else if (image_url) {
        // ตรวจสอบจำนวนรูปภาพจาก URL
        const imageValidation = validateImageCount(image_url);
        if (!imageValidation.valid) {
          return res.status(400).json({ message: imageValidation.message });
        }
      }

      const roomData = {
        room_name,
        room_code: finalRoomCode,
        address,
        detail,
        image_url: finalImageUrl,
        note
      };

      const roomId = await roomModel.createRoom(roomData);
      const newRoom = await roomModel.getRoomById(roomId);

      res.status(201).json({
        message: 'สร้างห้องเรียบร้อยแล้ว',
        room: newRoom
      });
    } catch (error) {
      console.error('Error in createRoom:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'รหัสห้องซ้ำ กรุณาลองใหม่อีกครั้ง' });
      }
      res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสร้างห้อง' });
    }
  },

  // อัปเดตข้อมูลห้อง
  updateRoom: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        room_name,
        room_code,
        address,
        detail,
        image_url,
        note
      } = req.body;

      // ตรวจสอบข้อมูลที่จำเป็น
      if (!room_name) {
        return res.status(400).json({ message: 'กรุณากรอกชื่อห้อง' });
      }

      // ตรวจสอบว่าห้องมีอยู่จริงหรือไม่
      const existingRoom = await roomModel.getRoomById(id);
      if (!existingRoom) {
        return res.status(404).json({ message: 'ไม่พบข้อมูลห้อง' });
      }

      // จัดการรูปภาพที่อัปโหลด
      let finalImageUrl = image_url;
      if (req.files && req.files.length > 0) {
        // 1. ดึง image_url เดิม (ที่เหลือ/แก้ไขแล้ว) จาก req.body
        let oldUrls = [];
        if (image_url) {
          try {
            oldUrls = JSON.parse(image_url);
            if (!Array.isArray(oldUrls)) oldUrls = [image_url];
          } catch {
            oldUrls = [image_url];
          }
        }

        try {
          // 2. อัปโหลดไฟล์ใหม่ไปยัง Cloudinary
          const newUrls = await createImageUrlFromFiles(req.files, existingRoom.room_code);
          const newUrlArray = JSON.parse(newUrls);

          // 3. รวมรูปเดิม+ใหม่
          const mergedUrls = [...oldUrls, ...newUrlArray];

          // 4. ตรวจสอบจำนวนรวม
          if (mergedUrls.length > 5) {
            return res.status(400).json({ message: 'ไม่สามารถอัปโหลดรูปภาพได้เกิน 5 รูป' });
          }

          finalImageUrl = JSON.stringify(mergedUrls);
        } catch (uploadError) {
          console.error('Error uploading room images:', uploadError);
          return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ' });
        }
      } else if (image_url) {
        // ตรวจสอบจำนวนรูปภาพจาก URL
        const imageValidation = validateImageCount(image_url);
        if (!imageValidation.valid) {
          return res.status(400).json({ message: imageValidation.message });
        }
      }

      const roomData = {
        room_name,
        room_code,
        address,
        detail,
        image_url: finalImageUrl,
        note
      };

      const success = await roomModel.updateRoom(id, roomData);

      if (success) {
        const updatedRoom = await roomModel.getRoomById(id);
        res.json({
          message: 'อัปเดตข้อมูลห้องเรียบร้อยแล้ว',
          room: updatedRoom
        });
      } else {
        res.status(400).json({ message: 'ไม่สามารถอัปเดตข้อมูลห้องได้' });
      }
    } catch (error) {
      console.error('Error in updateRoom:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'รหัสห้องซ้ำ กรุณาลองใหม่อีกครั้ง' });
      }
      res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลห้อง' });
    }
  },

  // ลบห้อง
  deleteRoom: async (req, res) => {
    try {
      const { id } = req.params;

      // ตรวจสอบว่าห้องมีอยู่จริงหรือไม่
      const existingRoom = await roomModel.getRoomById(id);
      if (!existingRoom) {
        return res.status(404).json({ message: 'ไม่พบข้อมูลห้อง' });
      }

      const success = await roomModel.deleteRoom(id);

      if (success) {
        // ลบรูปภาพของห้องจาก Cloudinary
        if (existingRoom.image_url) {
          try {
            await deleteOldImages(existingRoom.image_url);
          } catch (deleteError) {
            console.error('Error deleting room images from Cloudinary:', deleteError);
          }
        }
        res.json({ message: 'ลบห้องเรียบร้อยแล้ว' });
      } else {
        res.status(400).json({ message: 'ไม่สามารถลบห้องได้' });
      }
    } catch (error) {
      console.error('Error in deleteRoom:', error);
      res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบห้อง' });
    }
  },

  // อัปโหลดรูปภาพห้อง
  uploadRoomImages: async (req, res) => {
    try {
      const { room_code } = req.params;

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'กรุณาเลือกไฟล์รูปภาพ' });
      }

      // ตรวจสอบจำนวนไฟล์
      if (req.files.length > 5) {
        return res.status(400).json({ message: 'ไม่สามารถอัปโหลดรูปภาพได้เกิน 5 รูป' });
      }

      try {
        // สร้าง image_url จากไฟล์ที่อัปโหลด
        const imageUrl = await createImageUrlFromFiles(req.files, room_code);

        res.json({
          message: 'อัปโหลดรูปภาพเรียบร้อยแล้ว',
          image_url: imageUrl,
          files: req.files.map(file => ({
            filename: file.filename,
            originalname: file.originalname,
            size: file.size,
            mimetype: file.mimetype
          }))
        });
      } catch (uploadError) {
        console.error('Error uploading room images:', uploadError);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ' });
      }
    } catch (error) {
      console.error('Error in uploadRoomImages:', error);
      res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ' });
    }
  },

  // ดึงรายการรูปภาพของห้อง
  getRoomImages: async (req, res) => {
    try {
      const { room_code } = req.params;

      // ดึงข้อมูลห้องจาก database
      const room = await roomModel.getRoomByCode(room_code);

      if (!room) {
        return res.status(404).json({ message: 'ไม่พบข้อมูลห้อง' });
      }

      let images = [];
      if (room.image_url) {
        try {
          const imageUrls = JSON.parse(room.image_url);
          if (Array.isArray(imageUrls)) {
            images = imageUrls.map((url, index) => ({
              filename: `image_${index + 1}`,
              url: url
            }));
          } else {
            images = [{
              filename: 'image_1',
              url: room.image_url
            }];
          }
        } catch (parseError) {
          // ถ้าไม่ใช่ JSON array ให้ถือว่าเป็น URL เดียว
          images = [{
            filename: 'image_1',
            url: room.image_url
          }];
        }
      }

      res.json({
        room_code,
        images: images
      });
    } catch (error) {
      console.error('Error in getRoomImages:', error);
      res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงรายการรูปภาพ' });
    }
  },

  // ลบรูปภาพเฉพาะ
  deleteRoomImage: async (req, res) => {
    try {
      const { room_code, filename } = req.params;

      // ดึงข้อมูลห้องจาก database
      const room = await roomModel.getRoomByCode(room_code);

      if (!room) {
        return res.status(404).json({ message: 'ไม่พบข้อมูลห้อง' });
      }

      if (!room.image_url) {
        return res.status(404).json({ message: 'ไม่พบรูปภาพในห้องนี้' });
      }

      try {
        // แปลง filename เป็น index (image_1 -> 0, image_2 -> 1, etc.)
        const indexMatch = filename.match(/image_(\d+)/);
        if (!indexMatch) {
          return res.status(400).json({ message: 'ชื่อไฟล์ไม่ถูกต้อง' });
        }

        const imageIndex = parseInt(indexMatch[1]) - 1; // Convert to 0-based index

        // Parse image URLs
        const imageUrls = JSON.parse(room.image_url);
        if (!Array.isArray(imageUrls) || imageIndex >= imageUrls.length) {
          return res.status(404).json({ message: 'ไม่พบรูปภาพที่ระบุ' });
        }

        // ลบรูปภาพจาก Cloudinary
        const imageUrl = imageUrls[imageIndex];
        if (imageUrl.includes('cloudinary.com')) {
          const publicId = extractPublicIdFromUrl(imageUrl);
          if (publicId) {
            await deleteImageFromCloudinary(publicId);
          }
        }

        // ลบ URL ออกจาก array
        imageUrls.splice(imageIndex, 1);

        // อัปเดต database
        const updatedImageUrl = imageUrls.length > 0 ? JSON.stringify(imageUrls) : null;
        await roomModel.updateRoom(room.id, { image_url: updatedImageUrl });

        res.json({ message: 'ลบรูปภาพเรียบร้อยแล้ว' });
      } catch (parseError) {
        console.error('Error parsing image URLs:', parseError);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบรูปภาพ' });
      }
    } catch (error) {
      console.error('Error in deleteRoomImage:', error);
      res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบรูปภาพ' });
    }
  }
};

export default roomController;