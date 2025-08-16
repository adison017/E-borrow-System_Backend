import { uploadSignatureImage, uploadHandoverPhoto } from './cloudinaryUploadUtils.js';

export const saveBase64Image = async (base64String, folder = 'uploads/signature', filename = null, borrowCode = null) => {
  console.log('=== saveBase64Image Debug ===');
  console.log('folder:', folder);
  console.log('filename:', filename);
  console.log('borrowCode:', borrowCode);
  console.log('base64String length:', base64String ? base64String.length : 0);

  if (!borrowCode) {
    throw new Error('borrowCode is required for Cloudinary upload');
  }

  try {
    let result;

    if (folder.includes('handover_photo')) {
      // Upload handover photo to Cloudinary
      result = await uploadHandoverPhoto(base64String, borrowCode);
    } else {
      // Upload signature to Cloudinary
      result = await uploadSignatureImage(base64String, borrowCode);
    }

    if (result.success) {
      console.log('✅ อัปโหลดรูปภาพไปยัง Cloudinary สำเร็จ:', result.url);
      return result.url; // Return Cloudinary URL for DB
    } else {
      console.error('❌ อัปโหลดรูปภาพไปยัง Cloudinary ไม่สำเร็จ:', result.error);
      throw new Error(`Failed to upload image to Cloudinary: ${result.error}`);
    }
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ:', error);
    throw error;
  }
};
