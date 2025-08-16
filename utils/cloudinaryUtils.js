import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { SUPPORTED_MIME_TYPES } from './supported-file-types.js';

// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
} else {
  console.warn('⚠️ Cloudinary environment variables are not configured. File uploads will fail.');
  console.warn('Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file');
}

// Create Cloudinary storage configuration
const createCloudinaryStorage = (folder, allowedFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp'], customPublicId = null) => {
  // Check if Cloudinary is configured
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.warn('⚠️ Cloudinary is not configured. Using fallback storage.');
    return multer.memoryStorage();
  }

  try {
         // ตรวจสอบประเภทไฟล์เพื่อกำหนด resource_type
     const hasDocuments = allowedFormats.some(format =>
       ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'csv', 'html', 'rtf', 'xml', 'json'].includes(format)
     );

    // กำหนด resource_type ตามประเภทไฟล์
    let resourceType = 'image';
    if (hasDocuments) {
      // สำหรับไฟล์เอกสาร ใช้ 'auto' เพื่อให้ Cloudinary จัดการเอง
      resourceType = 'auto';
    }

    // สร้าง params สำหรับ CloudinaryStorage
    const params = {
      folder: folder,
      public_id: customPublicId ? () => customPublicId : undefined,
      resource_type: resourceType
    };

    // เพิ่ม transformation ตาม resource_type
    if (resourceType === 'image') {
      params.transformation = [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ];
      params.allowed_formats = allowedFormats;
    } else if (resourceType === 'auto') {
      // สำหรับไฟล์เอกสาร ใช้ 'auto' เพื่อให้ Cloudinary จัดการเอง
      // ไม่ต้องเพิ่ม transformation เพื่อให้แสดงผลปกติ
      console.log(`📄 ตั้งค่า resource_type เป็น 'auto' สำหรับไฟล์เอกสาร`);
    }

    return new CloudinaryStorage({
      cloudinary: cloudinary,
      params: params
    });
  } catch (error) {
    console.warn('⚠️ Error creating Cloudinary storage, using fallback storage:', error.message);
    return multer.memoryStorage();
  }
};

// Create Cloudinary storage configuration with custom filename
const createCloudinaryStorageWithCustomName = (folder, allowedFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp'], borrowCode = null) => {
  // Check if Cloudinary is configured
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.warn('⚠️ Cloudinary is not configured. Using fallback storage.');
    return multer.memoryStorage();
  }

  try {
         // ตรวจสอบประเภทไฟล์เพื่อกำหนด resource_type
     const hasDocuments = allowedFormats.some(format =>
       ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'html', 'rtf', 'xml', 'json'].includes(format)
     );

    // กำหนด resource_type ตามประเภทไฟล์
    let resourceType = 'image';
    if (hasDocuments) {
      // สำหรับไฟล์เอกสาร ใช้ 'auto' เพื่อให้ Cloudinary จัดการเอง
      resourceType = 'auto';
    }

    // สร้าง params สำหรับ CloudinaryStorage
    const params = {
      folder: folder,
      resource_type: resourceType
    };

    // เพิ่ม transformation เฉพาะเมื่อเป็นรูปภาพ
    if (resourceType === 'image') {
      params.transformation = [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ];
    } else if (resourceType === 'auto') {
      // สำหรับไฟล์เอกสาร ใช้ 'auto' เพื่อให้ Cloudinary จัดการเอง
      // ไม่ต้องเพิ่ม transformation เพื่อให้แสดงผลปกติ
      console.log(`📄 ตั้งค่า resource_type เป็น 'auto' สำหรับไฟล์เอกสาร`);
    }

    // เพิ่ม custom public_id สำหรับ important documents หรือ pay slip
    if (borrowCode) {
      params.public_id = (req, file) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname).toLowerCase(); // ดึงนามสกุลไฟล์
        const originalName = path.basename(file.originalname, extension);

        // แปลงชื่อไฟล์เป็น slug (ตัวอักษรอังกฤษล้วน)
        let slug = originalName.toLowerCase()
          .replace(/[^\w\s-]/g, '') // ลบอักขระพิเศษ
          .replace(/[ก-๙]/g, '') // ลบตัวอักษรไทย
          .replace(/[^\x00-\x7F]/g, '') // ลบอักขระที่ไม่ใช่ ASCII
          .replace(/[\s_-]+/g, '-') // แทนที่ช่องว่าง, ขีดล่าง, ขีดกลาง ด้วยขีดกลาง
          .replace(/^-+|-+$/g, ''); // ลบขีดกลางที่อยู่หน้าและท้าย

        // ถ้า slug ว่างเปล่า ให้ใช้ชื่อไฟล์เริ่มต้น
        if (!slug) {
          slug = 'document';
        }

        // จำกัดความยาวไม่เกิน 50 ตัวอักษร
        if (slug.length > 50) {
          slug = slug.substring(0, 50);
        }

        // สร้างชื่อไฟล์โดยเพิ่มนามสกุลไฟล์ด้วย
        const customFilename = `${borrowCode}_${slug}_${uniqueSuffix}${extension}`;
        console.log(`📝 สร้างชื่อไฟล์ Cloudinary: ${customFilename} (จาก: ${file.originalname})`);
        
        return customFilename;
      };
    }

    // เพิ่ม allowed_formats เฉพาะเมื่อเป็นรูปภาพ
    if (resourceType === 'image') {
      params.allowed_formats = allowedFormats;
    } else if (resourceType === 'auto') {
      // สำหรับไฟล์เอกสาร ใช้ 'auto' และไม่จำกัดรูปแบบไฟล์
      console.log(`📄 ตั้งค่า resource_type เป็น 'auto' สำหรับไฟล์เอกสาร`);
    }

    return new CloudinaryStorage({
      cloudinary: cloudinary,
      params: params
    });
  } catch (error) {
    console.warn('⚠️ Error creating Cloudinary storage, using fallback storage:', error.message);
    return multer.memoryStorage();
  }
};

// Create local storage with custom filename (แก้ไข)
const createLocalStorageWithCustomName = (folder, borrowCode) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(process.cwd(), 'uploads', folder);
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      // สร้างชื่อไฟล์ตาม borrow code
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = path.extname(file.originalname).toLowerCase();
      const name = path.basename(file.originalname, extension);

      // ตรวจสอบว่าเป็น pay slip หรือ important documents
      const isPaySlip = file.fieldname === 'slip';
      const prefix = isPaySlip ? 'slip' : 'important_documents';

      // สร้างชื่อไฟล์โดยรักษานามสกุลไฟล์ไว้
      const customFilename = `${borrowCode}_${prefix}_${name}_${uniqueSuffix}${extension}`;
      cb(null, customFilename);
    }
  });
};

// File filter for different file types
const createFileFilter = (allowedTypes) => {
  return (req, file, cb) => {
    console.log(`การพยายามอัปโหลดไฟล์ - ชื่อไฟล์: ${file.originalname}, ประเภท MIME: ${file.mimetype}`);
    console.log(`ประเภทไฟล์ที่รองรับ: ${allowedTypes.join(', ')}`);

    // ตรวจสอบ MIME type
    const isMimeTypeSupported = allowedTypes.includes(file.mimetype);
    console.log(`ไฟล์นี้รองรับหรือไม่ (MIME): ${isMimeTypeSupported}`);

    // ตรวจสอบนามสกุลไฟล์
    const fileExtension = file.originalname.toLowerCase().split('.').pop();
    const isExtensionSupported = fileExtension && allowedTypes.some(type => {
      // ตรวจสอบว่า type เป็น MIME type หรือนามสกุลไฟล์
      if (type.includes('/')) {
        // เป็น MIME type
        return false;
      } else {
        // เป็นนามสกุลไฟล์
        return type.toLowerCase() === fileExtension;
      }
    });
    console.log(`นามสกุลไฟล์: ${fileExtension}, รองรับหรือไม่: ${isExtensionSupported}`);

    if (isMimeTypeSupported || isExtensionSupported) {
      console.log(`✅ ไฟล์ ${file.originalname} ผ่านการตรวจสอบ`);
      cb(null, true);
    } else {
      console.log(`❌ ไฟล์ ${file.originalname} ไม่ผ่านการตรวจสอบ`);
      const error = new Error(`รูปแบบไฟล์ไม่ได้รับอนุญาต ไฟล์ที่อัปโหลด: ${file.originalname} (ประเภท: ${file.mimetype}) ประเภทไฟล์ที่รองรับ: ${allowedTypes.join(', ')}`);
      error.http_code = 400;
      cb(error, false);
    }
  };
};

// Storage configurations for different file types (สร้างเมื่อต้องการใช้งาน)
const getEquipmentImageStorage = () => createCloudinaryStorage('e-borrow/equipment');
const getUserImageStorage = () => createCloudinaryStorage('e-borrow/user');
const getRepairImageStorage = () => createCloudinaryStorage('e-borrow/repair');
const getHandoverPhotoStorage = () => createCloudinaryStorage('e-borrow/handover_photo');
const getPaySlipStorage = () => createCloudinaryStorage('e-borrow/pay_slip');
const getRoomImageStorage = () => createCloudinaryStorage('e-borrow/roomimg');
const getSignatureStorage = () => createCloudinaryStorage('e-borrow/signature');
const getDocumentStorage = () => createCloudinaryStorage('e-borrow/important_documents', ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'rtf', 'xml', 'json']);
const getLogoStorage = () => createCloudinaryStorage('e-borrow/logo');

// Multer configurations for different file types
export const uploadEquipmentImage = multer({
  storage: getEquipmentImageStorage(),
  fileFilter: createFileFilter(['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
}).single('image');

// Function to create equipment upload with custom item_code
export const createEquipmentUploadWithItemCode = (itemCode) => {
  const customStorage = createCloudinaryStorage('e-borrow/equipment', ['jpg', 'jpeg', 'png', 'gif', 'webp'], itemCode);

  return multer({
    storage: customStorage,
    fileFilter: createFileFilter(['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
  }).single('image');
};

export const uploadUserImage = multer({
  storage: getUserImageStorage(),
  fileFilter: createFileFilter(['image/jpeg', 'image/jpg', 'image/png']),
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
}).single('avatar');

export const uploadRepairImages = multer({
  storage: getRepairImageStorage(),
  fileFilter: createFileFilter(['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']),
  limits: { fileSize: 5 * 1024 * 1024, files: 10 } // 5MB per file, max 10 files
}).array('images', 10);

export const uploadHandoverPhoto = multer({
  storage: getHandoverPhotoStorage(),
  fileFilter: createFileFilter(['image/jpeg', 'image/jpg', 'image/png']),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
}).single('handover_photo');

export const uploadPaySlip = multer({
  storage: getPaySlipStorage(),
  fileFilter: createFileFilter(['image/jpeg', 'image/jpg', 'image/png']),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
}).single('pay_slip');

export const uploadRoomImages = multer({
  storage: getRoomImageStorage(),
  fileFilter: createFileFilter(['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']),
  limits: { fileSize: 5 * 1024 * 1024, files: 5 } // 5MB per file, max 5 files
}).array('images', 5);

export const uploadSignature = multer({
  storage: getSignatureStorage(),
  fileFilter: createFileFilter(['image/jpeg', 'image/jpg', 'image/png']),
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
}).single('signature');

// Create a fallback storage for when Cloudinary is not configured
const createFallbackStorage = () => {
  return multer.memoryStorage();
};

// Create local storage for files that Cloudinary doesn't support
const createLocalStorage = (folder) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(process.cwd(), 'uploads', folder);
      // สร้างโฟลเดอร์ถ้ายังไม่มี
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      // สร้างชื่อไฟล์ที่ไม่ซ้ำกัน
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = path.extname(file.originalname);
      const name = path.basename(file.originalname, extension);
      cb(null, `${name}-${uniqueSuffix}${extension}`);
    }
  });
};

// Function to create upload middleware with borrow code
export const createImportantDocumentsUpload = (borrowCode) => {
  return multer({
    storage: (() => {
      try {
        // สร้าง Cloudinary storage สำหรับ important documents
                 const cloudinaryStorage = createCloudinaryStorageWithCustomName(
           'e-borrow/important_documents',
           ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'rtf', 'xml', 'json'],
           borrowCode
         );

        // ตรวจสอบว่าเป็น CloudinaryStorage หรือไม่
        if (cloudinaryStorage.constructor.name === 'CloudinaryStorage') {
          console.log(`☁️ Using Cloudinary storage for important documents (borrow_code: ${borrowCode})`);
          return cloudinaryStorage;
        } else {
          console.log(`📁 Using local storage for important documents (borrow_code: ${borrowCode})`);
          return createLocalStorageWithCustomName('important_documents', borrowCode);
        }
      } catch (error) {
        console.warn('⚠️ Error creating Cloudinary storage, using local storage:', error.message);
        return createLocalStorageWithCustomName('important_documents', borrowCode);
      }
    })(),
    fileFilter: createFileFilter([
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'text/csv',
      'text/html',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/rtf',
      'application/xml',
      'text/xml',
      'application/json',
      // เพิ่มนามสกุลไฟล์เพื่อรองรับกรณีที่ MIME type ไม่ถูกต้อง
      'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'html', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'rtf', 'xml', 'json'
    ]),
    limits: { fileSize: 10 * 1024 * 1024, files: 5 } // 10MB per file, max 5 files
  }).array('important_documents', 5);
};

// Function to create upload middleware with custom name for important documents
export const uploadImportantDocumentsWithCustomName = (req, res, next) => {
  // Generate borrow code first
  function generateBorrowCode() {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `BR-${random}`;
  }

  const borrowCode = generateBorrowCode();
  console.log(`Generated borrow_code for upload: ${borrowCode}`);

  // Store the borrow code in request for later use
  req.generatedBorrowCode = borrowCode;

  // Create upload middleware with the generated borrow code
  const uploadMiddleware = createImportantDocumentsUpload(borrowCode);

  // Use the upload middleware
  uploadMiddleware(req, res, next);
};

// Function to create pay slip upload middleware with borrow code
export const createPaySlipUploadWithBorrowCode = (borrowCode) => {
  return multer({
    storage: (() => {
      try {
        // สร้าง Cloudinary storage สำหรับ pay slip
        const cloudinaryStorage = createCloudinaryStorageWithCustomName(
          'e-borrow/pay_slip',
          ['jpg', 'jpeg', 'png', 'gif', 'webp'],
          borrowCode
        );

        // ตรวจสอบว่าเป็น CloudinaryStorage หรือไม่
        if (cloudinaryStorage.constructor.name === 'CloudinaryStorage') {
          console.log(`☁️ Using Cloudinary storage for pay slip (borrow_code: ${borrowCode})`);
          return cloudinaryStorage;
        } else {
          console.log(`📁 Using local storage for pay slip (borrow_code: ${borrowCode})`);
          return createLocalStorageWithCustomName('pay_slip', borrowCode);
        }
      } catch (error) {
        console.warn('⚠️ Error creating Cloudinary storage, using local storage:', error.message);
        return createLocalStorageWithCustomName('pay_slip', borrowCode);
      }
    })(),
    fileFilter: createFileFilter([
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      // เพิ่มนามสกุลไฟล์เพื่อรองรับกรณีที่ MIME type ไม่ถูกต้อง
      'jpg', 'jpeg', 'png', 'gif', 'webp'
    ]),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB per file
  }).single('slip');
};

// Legacy uploadImportantDocuments (for backward compatibility)
export const uploadImportantDocuments = multer({
  storage: (() => {
    try {
      // สร้าง Cloudinary storage สำหรับ important documents โดยไม่ระบุ allowed_formats
      const cloudinaryStorage = createCloudinaryStorage('e-borrow/important_documents', ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'rtf', 'xml', 'json']);

      // ตรวจสอบว่าเป็น CloudinaryStorage หรือไม่
      if (cloudinaryStorage.constructor.name === 'CloudinaryStorage') {
        console.log('☁️ Using Cloudinary storage for important documents');
        return cloudinaryStorage;
      } else {
        console.log('📁 Using fallback storage for important documents');
        return cloudinaryStorage; // จะเป็น multer.memoryStorage()
      }
    } catch (error) {
      console.warn('⚠️ Error creating Cloudinary storage, using fallback storage:', error.message);
      return multer.memoryStorage();
    }
  })(),
  fileFilter: createFileFilter([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
    'text/html',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/rtf',
    'application/xml',
    'text/xml',
    'application/json',
    // เพิ่มนามสกุลไฟล์เพื่อรองรับกรณีที่ MIME type ไม่ถูกต้อง
    'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'html', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'rtf', 'xml', 'json'
  ]),
  limits: { fileSize: 10 * 1024 * 1024, files: 5 } // 10MB per file, max 5 files
}).array('important_documents', 5);

// Utility functions for Cloudinary operations
export const cloudinaryUtils = {
  // Test Cloudinary connection
  testConnection: async () => {
    try {
      if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        return {
          success: false,
          error: 'Cloudinary environment variables are not configured',
          suggestion: 'Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file'
        };
      }

      const result = await cloudinary.api.ping();
      return {
        success: true,
        message: 'Cloudinary connection successful',
        data: result
      };
    } catch (error) {
      console.error('Cloudinary connection test failed:', error);
      return {
        success: false,
        error: error.message,
        suggestion: 'Please check your Cloudinary credentials and internet connection'
      };
    }
  },

  // Upload file to Cloudinary (for direct uploads without multer)
  uploadFile: async (filePath, folder = 'e-borrow/general', options = {}) => {
    try {
      // ตรวจสอบนามสกุลไฟล์เพื่อกำหนด resource_type
      const fileExtension = path.extname(filePath).toLowerCase();
      const isDocument = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'html', 'rtf', 'xml', 'json'].includes(fileExtension.substring(1));
      
      const uploadOptions = {
        folder: folder,
        resource_type: isDocument ? 'auto' : 'auto',
        ...options
      };

      const result = await cloudinary.uploader.upload(filePath, uploadOptions);

      return {
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        size: result.bytes,
        width: result.width,
        height: result.height
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Upload base64 image
  uploadBase64: async (base64Data, folder = 'e-borrow/general', options = {}) => {
    try {
      // สำหรับ base64 upload ใช้ 'auto' เพราะส่วนใหญ่เป็นรูปภาพ
      const uploadOptions = {
        folder: folder,
        resource_type: 'auto',
        ...options
      };

      const result = await cloudinary.uploader.upload(base64Data, uploadOptions);

      return {
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        size: result.bytes,
        width: result.width,
        height: result.height
      };
    } catch (error) {
      console.error('Cloudinary base64 upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Delete file from Cloudinary
  deleteFile: async (publicId) => {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return {
        success: true,
        result: result
      };
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get file info from Cloudinary
  getFileInfo: async (publicId) => {
    try {
      const result = await cloudinary.api.resource(publicId);
      return {
        success: true,
        info: result
      };
    } catch (error) {
      console.error('Cloudinary get info error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Generate signed upload URL
  generateUploadUrl: (folder = 'e-borrow/general') => {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: folder
      },
      process.env.CLOUDINARY_API_SECRET
    );

    return {
      timestamp: timestamp,
      signature: signature,
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      folder: folder
    };
  },

  // Transform image URL
  transformImage: (url, transformations = {}) => {
    if (!url || !url.includes('cloudinary.com')) {
      return url;
    }

    const defaultTransformations = {
      fetch_format: 'auto',
      ...transformations
    };

    return cloudinary.url(url, {
      transformation: [defaultTransformations]
    });
  },

  // Get Cloudinary account info
  getAccountInfo: async () => {
    try {
      const result = await cloudinary.api.ping();
      return {
        success: true,
        info: result
      };
    } catch (error) {
      console.error('Cloudinary account info error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Create folder structure in Cloudinary
  createFolders: async () => {
    try {
      const folders = [
        'e-borrow',
        'e-borrow/equipment',
        'e-borrow/user',
        'e-borrow/repair',
        'e-borrow/handover_photo',
        'e-borrow/pay_slip',
        'e-borrow/roomimg',
        'e-borrow/signature',
        'e-borrow/important_documents',
        'e-borrow/logo',
        'e-borrow/general'
      ];

      const results = [];

      for (const folder of folders) {
        try {
          // Create a placeholder image to establish the folder
          const placeholderDataUri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
          const result = await cloudinary.uploader.upload(placeholderDataUri, {
            folder: folder,
            public_id: '.folder_placeholder',
            overwrite: true,
            resource_type: 'image'
          });

          // Delete the placeholder immediately
          await cloudinary.uploader.destroy(result.public_id);

          results.push({
            folder: folder,
            status: 'created',
            message: 'Folder created successfully'
          });
        } catch (error) {
          results.push({
            folder: folder,
            status: 'error',
            message: error.message
          });
        }
      }

      return {
        success: true,
        results: results
      };
    } catch (error) {
      console.error('Cloudinary create folders error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // List all folders in Cloudinary
  listFolders: async () => {
    try {
      const result = await cloudinary.api.root_folders();
      return {
        success: true,
        folders: result.folders
      };
    } catch (error) {
      console.error('Cloudinary list folders error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};

// Middleware to handle Cloudinary upload errors
export const handleCloudinaryUpload = (uploadMiddleware) => {
  return (req, res, next) => {
    uploadMiddleware(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        console.error('Multer error:', err);
        return res.status(400).json({
          success: false,
          message: 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์',
          error: err.message
        });
      } else if (err) {
        console.error('Upload error:', err);
        console.error('Error details:', {
          message: err.message,
          name: err.name,
          http_code: err.http_code,
          storageErrors: err.storageErrors || []
        });

        // ตรวจสอบว่าเป็น error จาก Cloudinary หรือไม่
        if (err.message && err.message.includes('An unknown file format not allowed')) {
          console.error('❌ Cloudinary file format error detected');
          console.error('File details:', {
            originalname: req.files ? req.files.map(f => f.originalname) : 'No files',
            mimetype: req.files ? req.files.map(f => f.mimetype) : 'No files'
          });

          return res.status(400).json({
            success: false,
            message: 'รูปแบบไฟล์ไม่รองรับโดย Cloudinary',
            error: err.message,
                         suggestion: 'Cloudinary รองรับไฟล์: PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, PNG, GIF, RTF, XML, JSON',
            supportedFormats: [
              'PDF (.pdf)',
              'Microsoft Word (.doc, .docx)',
              'Microsoft Excel (.xls, .xlsx)',
              'Text files (.txt, .csv, .html)',
              'Images (.jpg, .jpeg, .png, .gif, .webp)',
              
              'Other (.rtf, .xml, .json)'
            ]
          });
        }

        // ตรวจสอบ error อื่นๆ จาก Cloudinary
        if (err.message && (err.message.includes('Cloudinary') || err.message.includes('cloudinary'))) {
          return res.status(400).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์ไปยัง Cloudinary',
            error: err.message,
            suggestion: 'กรุณาตรวจสอบการตั้งค่า Cloudinary หรือลองอัปโหลดไฟล์ใหม่'
          });
        }

        // ตรวจสอบ error ทั่วไป
        return res.status(500).json({
          success: false,
          message: 'เกิดข้อผิดพลาดในระบบ',
          error: err.message,
          suggestion: 'กรุณาลองใหม่อีกครั้งหรือติดต่อผู้ดูแลระบบ'
        });
      }

      // ถ้าไม่มี error ให้ log ข้อมูลไฟล์ที่อัปโหลดสำเร็จ
      if (req.files && req.files.length > 0) {
        console.log('✅ Files uploaded successfully:', req.files.map(f => f.originalname));
      }

      next();
    });
  };
};

export default cloudinary;