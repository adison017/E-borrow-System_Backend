import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from 'cloudinary';
import path from 'path';

// ฟังก์ชันแปลงชื่อไฟล์เป็น slug (ตัวอักษรอังกฤษล้วน)
const slugify = (filename) => {
  // ตัดนามสกุลไฟล์ออกก่อน
  const nameWithoutExt = path.basename(filename, path.extname(filename));
  
  // แปลงเป็นตัวพิมพ์เล็ก
  let slug = nameWithoutExt.toLowerCase();
  
  // แทนที่อักขระพิเศษและภาษาไทยด้วยเครื่องหมายขีด
  slug = slug
    // แทนที่อักขระพิเศษและภาษาไทย
    .replace(/[^\w\s-]/g, '') // ลบอักขระพิเศษ
    .replace(/[ก-๙]/g, '') // ลบตัวอักษรไทย
    .replace(/[^\x00-\x7F]/g, '') // ลบอักขระที่ไม่ใช่ ASCII
    .replace(/[\s_-]+/g, '-') // แทนที่ช่องว่าง, ขีดล่าง, ขีดกลาง ด้วยขีดกลาง
    .replace(/^-+|-+$/g, ''); // ลบขีดกลางที่อยู่หน้าและท้าย
  
  // ถ้า slug ว่างเปล่า ให้ใช้ชื่อไฟล์เริ่มต้น
  if (!slug) {
    slug = 'document';
  }
  
  // จำกัดความยาวไม่เกิน 80 ตัวอักษร (เหลือที่สำหรับ borrow_code และ timestamp)
  if (slug.length > 80) {
    slug = slug.substring(0, 80);
  }
  
  return slug;
};

// ฟังก์ชันสร้างชื่อไฟล์สำหรับ Cloudinary (แก้ไข)
const generateCloudinaryFilename = (req, file, borrowCode) => {
  // แปลงชื่อไฟล์เป็น slug
  const slugifiedName = slugify(file.originalname);
  
  // สร้าง timestamp
  const timestamp = Date.now();
  
  // ดึงนามสกุลไฟล์จากไฟล์เดิม
  const extension = path.extname(file.originalname).toLowerCase();
  
  // สร้างชื่อไฟล์ในรูปแบบ: <borrow_code>_<ชื่อไฟล์ที่แก้ไขแล้ว>_<timestamp><นามสกุลไฟล์>
  const filename = `${borrowCode}_${slugifiedName}_${timestamp}${extension}`;
  
  return filename;
};

// สร้าง Cloudinary storage configuration สำหรับ important documents
export const createImportantDocumentsStorage = (borrowCode) => {
  // ตรวจสอบว่า Cloudinary ถูกตั้งค่าหรือไม่
  if (!process.env.CLOUDINARY_CLOUD_NAME || 
      !process.env.CLOUDINARY_API_KEY || 
      !process.env.CLOUDINARY_API_SECRET) {
    console.warn('⚠️ Cloudinary environment variables ไม่ครบถ้วน');
    return null;
  }

  try {
    // ตั้งค่า Cloudinary
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    // สร้าง CloudinaryStorage configuration
    const storage = new CloudinaryStorage({
      cloudinary: cloudinary.v2,
      params: {
        folder: 'e-borrow/important_documents',
        resource_type: 'auto', // ให้ Cloudinary จัดการเองเพื่อให้แสดงผลปกติ
        allowed_formats: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'txt', 'rtf', 'csv']
        // ไม่ใช้ transformation เพื่อให้แสดงผลปกติ
      },
      // กำหนด public_id แบบ custom function
      params: (req, file) => {
        const customFilename = generateCloudinaryFilename(req, file, borrowCode);
        console.log(`📝 สร้างชื่อไฟล์ Cloudinary: ${customFilename}`);
        return {
          folder: 'e-borrow/important_documents',
          resource_type: 'auto',
          allowed_formats: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'txt', 'rtf', 'csv'],
          // ไม่ใช้ transformation เพื่อให้แสดงผลปกติ
          public_id: customFilename
        };
      }
    });

    console.log(`✅ สร้าง Cloudinary storage สำหรับ borrow_code: ${borrowCode}`);
    return storage;

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการสร้าง Cloudinary storage:', error);
    return null;
  }
};

// ฟังก์ชันสร้าง multer configuration สำหรับ important documents
export const createImportantDocumentsMulterConfig = (borrowCode) => {
  const storage = createImportantDocumentsStorage(borrowCode);
  
  if (!storage) {
    console.warn('⚠️ ไม่สามารถสร้าง Cloudinary storage ได้ ใช้ memory storage แทน');
    return {
      storage: multer.memoryStorage(),
      fileFilter: createFileFilter(),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 5 // สูงสุด 5 ไฟล์
      }
    };
  }

  return {
    storage: storage,
    fileFilter: createFileFilter(),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
      files: 5 // สูงสุด 5 ไฟล์
    }
  };
};

// ฟังก์ชันตรวจสอบประเภทไฟล์
const createFileFilter = () => {
  return (req, file, cb) => {
    console.log(`📁 กำลังอัปโหลดไฟล์: ${file.originalname} (${file.mimetype})`);
    
    // รายการ MIME types ที่อนุญาต
    const allowedMimeTypes = [
      // PDF
      'application/pdf',
      // Microsoft Office
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      // รูปภาพ
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp',
      // ไฟล์ข้อความ
      'text/plain',
      'text/csv',
      'application/rtf'
    ];

    // รายการนามสกุลไฟล์ที่อนุญาต
    const allowedExtensions = [
      'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
      'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp',
      'txt', 'rtf', 'csv'
    ];

    // ตรวจสอบ MIME type
    const isMimeTypeAllowed = allowedMimeTypes.includes(file.mimetype);
    
    // ตรวจสอบนามสกุลไฟล์
    const fileExtension = path.extname(file.originalname).toLowerCase().substring(1);
    const isExtensionAllowed = allowedExtensions.includes(fileExtension);

    if (isMimeTypeAllowed || isExtensionAllowed) {
      console.log(`✅ ไฟล์ ${file.originalname} ผ่านการตรวจสอบ`);
      cb(null, true);
    } else {
      console.log(`❌ ไฟล์ ${file.originalname} ไม่ผ่านการตรวจสอบ (MIME: ${file.mimetype}, Extension: ${fileExtension})`);
      cb(new Error(`ประเภทไฟล์ ${file.originalname} ไม่ได้รับอนุญาต`), false);
    }
  };
};

// ฟังก์ชันทดสอบการสร้างชื่อไฟล์
export const testFilenameGeneration = () => {
  const testFiles = [
    'เอกสารสำคัญ.pdf',
    'รายงานประจำเดือน.docx',
    'ข้อมูลการขาย.xlsx',
    'รูปภาพอุปกรณ์.jpg',
    'ไฟล์ที่มีอักขระพิเศษ!@#$%.png',
    'ไฟล์ที่มีช่องว่างและขีดกลาง - version 2.0.pdf',
    'document with spaces and special chars (v1.0).docx',
    'ไฟล์ภาษาไทยและอังกฤษ mixed.pdf'
  ];

  console.log('🧪 ทดสอบการสร้างชื่อไฟล์:');
  testFiles.forEach(filename => {
    const slugified = slugify(filename);
    const cloudinaryName = generateCloudinaryFilename({}, { originalname: filename }, 'BR-1234');
    console.log(`📄 ${filename}`);
    console.log(`   → Slug: ${slugified}`);
    console.log(`   → Cloudinary: ${cloudinaryName}`);
    console.log('');
  });
};

// ตัวอย่างการใช้งาน
export const exampleUsage = () => {
  console.log('📝 ตัวอย่างการใช้งาน:');
  console.log('');
  console.log('1. สร้าง storage configuration:');
  console.log('   const storage = createImportantDocumentsStorage("BR-1234");');
  console.log('');
  console.log('2. สร้าง multer configuration:');
  console.log('   const multerConfig = createImportantDocumentsMulterConfig("BR-1234");');
  console.log('');
  console.log('3. ใช้กับ multer:');
  console.log('   const upload = multer(multerConfig);');
  console.log('');
  console.log('4. ใช้ใน route:');
  console.log('   router.post("/upload", upload.array("important_documents", 5), uploadHandler);');
};

// ทดสอบการทำงานเมื่อ import ไฟล์นี้
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 โหลด Cloudinary Storage Configuration...');
  testFilenameGeneration();
  exampleUsage();
} 