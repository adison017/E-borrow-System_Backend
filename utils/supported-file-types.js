/**
 * รายการประเภทไฟล์ที่รองรับสำหรับการอัปโหลดเอกสารสำคัญ
 * ไฟล์นี้ใช้สำหรับตรวจสอบประเภทไฟล์ที่อนุญาตให้อัปโหลดได้
 */

// รายการ MIME types ที่รองรับสำหรับเอกสารสำคัญ
export const SUPPORTED_MIME_TYPES = [
  // เอกสาร PDF
  'application/pdf',

  // เอกสาร Microsoft Office
  'application/msword', // ไฟล์ Word (.doc)
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // ไฟล์ Word (.docx)
  'application/vnd.ms-excel', // ไฟล์ Excel (.xls)
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // ไฟล์ Excel (.xlsx)
  'application/vnd.ms-powerpoint', // ไฟล์ PowerPoint (.ppt)
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // ไฟล์ PowerPoint (.pptx)

  // เอกสารข้อความ
  'text/plain', // ไฟล์ข้อความ (.txt)
  'text/csv', // ไฟล์ CSV (.csv)
  'text/html', // ไฟล์ HTML (.html)

  // รูปภาพ (สำหรับเอกสารที่สแกน)
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',

  // ไฟล์บีบอัด
  'application/zip', // ไฟล์ ZIP (.zip)
  'application/x-rar-compressed', // ไฟล์ RAR (.rar)
  'application/x-7z-compressed', // ไฟล์ 7-Zip (.7z)

  // รูปแบบเอกสารอื่นๆ
  'application/rtf', // ไฟล์ RTF (.rtf)
  'application/xml', // ไฟล์ XML (.xml)
  'text/xml', // ไฟล์ XML (.xml)
  'application/json', // ไฟล์ JSON (.json)
];

// รายการนามสกุลไฟล์ที่รองรับสำหรับการตรวจสอบ
export const SUPPORTED_EXTENSIONS = [
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.ppt',
  '.pptx',
  '.txt',
  '.csv',
  '.html',
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.zip',
  '.rar',
  '.7z',
  '.rtf',
  '.xml',
  '.json'
];

/**
 * ตรวจสอบว่า MIME type ที่ให้มารองรับหรือไม่
 * @param {string} mimeType - MIME type ที่ต้องการตรวจสอบ
 * @returns {boolean} - true ถ้ารองรับ, false ถ้าไม่รองรับ
 */
export const isSupportedFileType = (mimeType) => {
  return SUPPORTED_MIME_TYPES.includes(mimeType);
};

/**
 * ตรวจสอบว่านามสกุลไฟล์ที่ให้มารองรับหรือไม่
 * @param {string} filename - ชื่อไฟล์ที่ต้องการตรวจสอบ
 * @returns {boolean} - true ถ้ารองรับ, false ถ้าไม่รองรับ
 */
export const isSupportedExtension = (filename) => {
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return SUPPORTED_EXTENSIONS.includes(extension);
};

/**
 * แปลง MIME type เป็นนามสกุลไฟล์
 * @param {string} mimeType - MIME type ที่ต้องการแปลง
 * @returns {string} - นามสกุลไฟล์ (เช่น .pdf, .docx)
 */
export const getExtensionFromMimeType = (mimeType) => {
  const mimeToExtension = {
    'application/pdf': '.pdf',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'application/vnd.ms-excel': '.xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
    'application/vnd.ms-powerpoint': '.ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
    'text/plain': '.txt',
    'text/csv': '.csv',
    'text/html': '.html',
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'application/zip': '.zip',
    'application/x-rar-compressed': '.rar',
    'application/x-7z-compressed': '.7z',
    'application/rtf': '.rtf',
    'application/xml': '.xml',
    'text/xml': '.xml',
    'application/json': '.json'
  };

  return mimeToExtension[mimeType] || '';
};

/**
 * ตรวจสอบไฟล์ว่าสามารถอัปโหลดได้หรือไม่
 * @param {Object} file - ไฟล์ที่ต้องการตรวจสอบ (ต้องมี originalname และ mimetype)
 * @returns {Object} - ผลลัพธ์การตรวจสอบ { isValid: boolean, error: string }
 */
export const validateFile = (file) => {
  if (!file) {
    return { isValid: false, error: 'ไม่พบไฟล์' };
  }

  if (!file.originalname) {
    return { isValid: false, error: 'ไม่พบชื่อไฟล์' };
  }

  if (!file.mimetype) {
    return { isValid: false, error: 'ไม่พบประเภทไฟล์' };
  }

  // ตรวจสอบ MIME type
  if (!isSupportedFileType(file.mimetype)) {
    return {
      isValid: false,
      error: `ประเภทไฟล์ไม่รองรับ: ${file.mimetype}. ประเภทที่รองรับ: ${SUPPORTED_MIME_TYPES.join(', ')}`
    };
  }

  // ตรวจสอบนามสกุลไฟล์
  if (!isSupportedExtension(file.originalname)) {
    return {
      isValid: false,
      error: `นามสกุลไฟล์ไม่รองรับ: ${file.originalname}. นามสกุลที่รองรับ: ${SUPPORTED_EXTENSIONS.join(', ')}`
    };
  }

  return { isValid: true, error: null };
};

/**
 * รับรายการประเภทไฟล์ที่รองรับพร้อมคำอธิบาย
 * @returns {Array} - รายการประเภทไฟล์พร้อมคำอธิบาย
 */
export const getSupportedFileTypesWithDescription = () => {
  return [
    { mimeType: 'application/pdf', extension: '.pdf', description: 'เอกสาร PDF' },
    { mimeType: 'application/msword', extension: '.doc', description: 'เอกสาร Word (เก่า)' },
    { mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', extension: '.docx', description: 'เอกสาร Word (ใหม่)' },
    { mimeType: 'application/vnd.ms-excel', extension: '.xls', description: 'เอกสาร Excel (เก่า)' },
    { mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', extension: '.xlsx', description: 'เอกสาร Excel (ใหม่)' },
    { mimeType: 'application/vnd.ms-powerpoint', extension: '.ppt', description: 'เอกสาร PowerPoint (เก่า)' },
    { mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', extension: '.pptx', description: 'เอกสาร PowerPoint (ใหม่)' },
    { mimeType: 'text/plain', extension: '.txt', description: 'ไฟล์ข้อความ' },
    { mimeType: 'text/csv', extension: '.csv', description: 'ไฟล์ CSV' },
    { mimeType: 'text/html', extension: '.html', description: 'ไฟล์ HTML' },
    { mimeType: 'image/jpeg', extension: '.jpg', description: 'รูปภาพ JPEG' },
    { mimeType: 'image/jpg', extension: '.jpg', description: 'รูปภาพ JPG' },
    { mimeType: 'image/png', extension: '.png', description: 'รูปภาพ PNG' },
    { mimeType: 'image/gif', extension: '.gif', description: 'รูปภาพ GIF' },
    { mimeType: 'image/webp', extension: '.webp', description: 'รูปภาพ WebP' },
    { mimeType: 'application/zip', extension: '.zip', description: 'ไฟล์บีบอัด ZIP' },
    { mimeType: 'application/x-rar-compressed', extension: '.rar', description: 'ไฟล์บีบอัด RAR' },
    { mimeType: 'application/x-7z-compressed', extension: '.7z', description: 'ไฟล์บีบอัด 7-Zip' },
    { mimeType: 'application/rtf', extension: '.rtf', description: 'เอกสาร RTF' },
    { mimeType: 'application/xml', extension: '.xml', description: 'ไฟล์ XML' },
    { mimeType: 'text/xml', extension: '.xml', description: 'ไฟล์ XML' },
    { mimeType: 'application/json', extension: '.json', description: 'ไฟล์ JSON' }
  ];
};

/**
 * สร้างข้อความแสดงประเภทไฟล์ที่รองรับ
 * @returns {string} - ข้อความแสดงประเภทไฟล์ที่รองรับ
 */
export const getSupportedFileTypesMessage = () => {
  const types = getSupportedFileTypesWithDescription();
  const descriptions = types.map(type => `${type.description} (${type.extension})`);
  return `ประเภทไฟล์ที่รองรับ: ${descriptions.join(', ')}`;
};