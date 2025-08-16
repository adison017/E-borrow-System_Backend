import { cloudinaryUtils } from '../utils/cloudinaryUtils.js';
import pool from '../db.js';

const cloudinaryController = {
  // Get Cloudinary configuration
  getConfig: async (req, res) => {
    try {
      const config = {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        // Don't expose api_secret in frontend
        is_configured: !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
      };

      res.json({
        success: true,
        data: config
      });
    } catch (error) {
      console.error('Error getting Cloudinary config:', error);
      res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการดึงข้อมูลการตั้งค่า Cloudinary',
        error: error.message
      });
    }
  },

  // Test Cloudinary connection
  testConnection: async (req, res) => {
    try {
      const result = await cloudinaryUtils.getAccountInfo();

      if (result.success) {
        res.json({
          success: true,
          message: 'เชื่อมต่อ Cloudinary สำเร็จ',
          data: result.info
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'ไม่สามารถเชื่อมต่อ Cloudinary ได้',
          error: result.error
        });
      }
    } catch (error) {
      console.error('Error testing Cloudinary connection:', error);
      res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการทดสอบการเชื่อมต่อ',
        error: error.message
      });
    }
  },

  // Upload single file
  uploadFile: async (req, res) => {
    try {
      // Check for file in different possible field names
      const file = req.file || req.files?.[0];

      if (!file) {
        return res.status(400).json({
          success: false,
          message: 'ไม่พบไฟล์ที่อัปโหลด กรุณาใช้ field name: file, image, หรือ photo'
        });
      }

      const { folder = 'e-borrow/general' } = req.body;

      // For memory storage, we need to upload to Cloudinary manually
      const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      const result = await cloudinaryUtils.uploadBase64(dataUri, folder);

      if (result.success) {
        res.json({
          success: true,
          message: 'อัปโหลดไฟล์สำเร็จ',
          data: {
            url: result.url,
            public_id: result.public_id,
            format: result.format,
            size: result.size,
            width: result.width,
            height: result.height
          }
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์',
          error: result.error
        });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในระบบ',
        error: error.message
      });
    }
  },

  // Upload multiple files
  uploadMultipleFiles: async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'ไม่พบไฟล์ที่อัปโหลด'
        });
      }

      const { folder = 'e-borrow/general' } = req.body;
      const results = [];

      // Upload each file to Cloudinary
      for (const file of req.files) {
        const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        const result = await cloudinaryUtils.uploadBase64(dataUri, folder);
        results.push({
          originalName: file.originalname,
          ...result
        });
      }

      const successCount = results.filter(r => r.success).length;
      const failedCount = results.length - successCount;

      res.json({
        success: true,
        message: `อัปโหลดไฟล์สำเร็จ ${successCount} ไฟล์${failedCount > 0 ? `, ล้มเหลว ${failedCount} ไฟล์` : ''}`,
        data: results
      });
    } catch (error) {
      console.error('Error uploading multiple files:', error);
      res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในระบบ',
        error: error.message
      });
    }
  },

  // Delete file
  deleteFile: async (req, res) => {
    try {
      const { public_id } = req.params;

      if (!public_id) {
        return res.status(400).json({
          success: false,
          message: 'ต้องระบุ public_id ของไฟล์'
        });
      }

      const result = await cloudinaryUtils.deleteFile(public_id);

      if (result.success) {
        res.json({
          success: true,
          message: 'ลบไฟล์สำเร็จ',
          data: result.result
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'เกิดข้อผิดพลาดในการลบไฟล์',
          error: result.error
        });
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในระบบ',
        error: error.message
      });
    }
  },

  // Get file info
  getFileInfo: async (req, res) => {
    try {
      const { public_id } = req.params;

      if (!public_id) {
        return res.status(400).json({
          success: false,
          message: 'ต้องระบุ public_id ของไฟล์'
        });
      }

      const result = await cloudinaryUtils.getFileInfo(public_id);

      if (result.success) {
        res.json({
          success: true,
          data: result.info
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'เกิดข้อผิดพลาดในการดึงข้อมูลไฟล์',
          error: result.error
        });
      }
    } catch (error) {
      console.error('Error getting file info:', error);
      res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในระบบ',
        error: error.message
      });
    }
  },

  // Generate upload URL for client-side upload
  generateUploadUrl: async (req, res) => {
    try {
      const { folder = 'e-borrow/general' } = req.body;
      const uploadData = cloudinaryUtils.generateUploadUrl(folder);

      res.json({
        success: true,
        data: uploadData
      });
    } catch (error) {
      console.error('Error generating upload URL:', error);
      res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการสร้าง URL สำหรับอัปโหลด',
        error: error.message
      });
    }
  },

  // Transform image URL
  transformImage: async (req, res) => {
    try {
      const { url, transformations = {} } = req.body;

      if (!url) {
        return res.status(400).json({
          success: false,
          message: 'ต้องระบุ URL ของรูปภาพ'
        });
      }

      const transformedUrl = cloudinaryUtils.transformImage(url, transformations);

      res.json({
        success: true,
        data: {
          original_url: url,
          transformed_url: transformedUrl
        }
      });
    } catch (error) {
      console.error('Error transforming image:', error);
      res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการแปลงรูปภาพ',
        error: error.message
      });
    }
  },

  // Get Cloudinary usage statistics
  getUsageStats: async (req, res) => {
    try {
      // This would require additional Cloudinary API calls to get usage statistics
      // For now, return basic info
      const accountInfo = await cloudinaryUtils.getAccountInfo();

      res.json({
        success: true,
        data: {
          account_info: accountInfo.success ? accountInfo.info : null,
          is_configured: !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
        }
      });
    } catch (error) {
      console.error('Error getting usage stats:', error);
      res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสถิติการใช้งาน',
        error: error.message
      });
    }
  },

  // Migrate existing local files to Cloudinary
  migrateFiles: async (req, res) => {
    try {
      // This is a placeholder for file migration functionality
      // In a real implementation, you would:
      // 1. Scan local uploads directory
      // 2. Upload each file to Cloudinary
      // 3. Update database records with new URLs
      // 4. Delete local files after successful migration

      res.json({
        success: true,
        message: 'ฟีเจอร์การย้ายไฟล์จะเปิดให้ใช้งานเร็วๆ นี้',
        data: {
          status: 'not_implemented'
        }
      });
    } catch (error) {
      console.error('Error migrating files:', error);
      res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการย้ายไฟล์',
        error: error.message
      });
    }
  },

  // Create folder structure in Cloudinary
  createFolders: async (req, res) => {
    try {
      const result = await cloudinaryUtils.createFolders();

      if (result.success) {
        res.json({
          success: true,
          message: 'สร้าง folder structure ใน Cloudinary สำเร็จ',
          data: {
            results: result.results
          }
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'เกิดข้อผิดพลาดในการสร้าง folder structure',
          error: result.error
        });
      }
    } catch (error) {
      console.error('Error creating folders:', error);
      res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการสร้าง folder structure',
        error: error.message
      });
    }
  },

  // List folders in Cloudinary
  listFolders: async (req, res) => {
    try {
      const result = await cloudinaryUtils.listFolders();

      if (result.success) {
        res.json({
          success: true,
          data: {
            folders: result.folders
          }
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'เกิดข้อผิดพลาดในการดึงรายการ folder',
          error: result.error
        });
      }
    } catch (error) {
      console.error('Error listing folders:', error);
      res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการดึงรายการ folder',
        error: error.message
      });
    }
  }
};

export default cloudinaryController;