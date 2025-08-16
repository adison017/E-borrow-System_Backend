import { v2 as cloudinary } from 'cloudinary';
import { cloudinaryUtils } from './cloudinaryUtils.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Function to upload base64 image to Cloudinary with custom naming
export const uploadBase64ToCloudinary = async (base64Data, folder, customName = null) => {
  try {
    console.log(`📤 อัปโหลดรูปภาพไปยัง Cloudinary: ${folder}`);

    const uploadOptions = {
      folder: folder,
      resource_type: 'auto',
      overwrite: false
    };

    // If custom name is provided, use it as public_id
    if (customName) {
      uploadOptions.public_id = customName;
    }

    const result = await cloudinary.uploader.upload(base64Data, uploadOptions);

    console.log(`✅ อัปโหลดสำเร็จ: ${result.public_id}`);
    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      size: result.bytes
    };
  } catch (error) {
    console.error(`❌ เกิดข้อผิดพลาดในการอัปโหลด: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
};

// Function to upload equipment image
export const uploadEquipmentImage = async (base64Data, itemCode) => {
  return await uploadBase64ToCloudinary(base64Data, 'e-borrow/equipment', itemCode);
};

// Function to upload user avatar
export const uploadUserAvatar = async (base64Data, userCode) => {
  return await uploadBase64ToCloudinary(base64Data, 'e-borrow/user', userCode);
};

// Function to upload signature image
export const uploadSignatureImage = async (base64Data, borrowCode) => {
  const customName = `signature-${borrowCode}`;
  return await uploadBase64ToCloudinary(base64Data, 'e-borrow/signature', customName);
};

// Function to upload handover photo
export const uploadHandoverPhoto = async (base64Data, borrowCode) => {
  const customName = `handover-${borrowCode}`;
  return await uploadBase64ToCloudinary(base64Data, 'e-borrow/handover_photo', customName);
};

// Function to upload repair images
export const uploadRepairImages = async (base64DataArray, repairCode) => {
  const results = [];

  for (let i = 0; i < base64DataArray.length; i++) {
    const customName = `${repairCode}_${i + 1}`;
    const result = await uploadBase64ToCloudinary(base64DataArray[i], 'e-borrow/repair', customName);
    results.push(result);
  }

  return results;
};

// Function to upload room images
export const uploadRoomImages = async (base64DataArray, roomCode) => {
  const results = [];

  for (let i = 0; i < base64DataArray.length; i++) {
    // ใช้ timestamp เพื่อให้แต่ละรูปภาพมีชื่อที่ไม่ซ้ำกัน
    const timestamp = Date.now() + i; // เพิ่ม i เพื่อให้แน่ใจว่าไม่ซ้ำกัน
    const customName = `room_${roomCode}_${timestamp}`;
    const result = await uploadBase64ToCloudinary(base64DataArray[i], 'e-borrow/roomimg', customName);
    results.push(result);
  }

  return results;
};

// Function to upload pay slip
export const uploadPaySlip = async (base64Data, borrowCode) => {
  const customName = `${borrowCode}_slip`;
  return await uploadBase64ToCloudinary(base64Data, 'e-borrow/pay_slip', customName);
};

// Function to upload important documents
export const uploadImportantDocuments = async (base64Data, borrowCode, documentType = 'document') => {
  const customName = `${borrowCode}_${documentType}`;
  return await uploadBase64ToCloudinary(base64Data, 'e-borrow/important_documents', customName);
};

// Function to upload logo
export const uploadLogo = async (base64Data, logoName = 'logo') => {
  return await uploadBase64ToCloudinary(base64Data, 'e-borrow/logo', logoName);
};

// Function to delete image from Cloudinary
export const deleteImageFromCloudinary = async (publicId) => {
  try {
    console.log(`🗑️ ลบรูปภาพจาก Cloudinary: ${publicId}`);

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      console.log(`✅ ลบรูปภาพสำเร็จ: ${publicId}`);
      return { success: true };
    } else {
      console.log(`❌ ลบรูปภาพไม่สำเร็จ: ${publicId}`);
      return { success: false, error: 'Failed to delete image' };
    }
  } catch (error) {
    console.error(`❌ เกิดข้อผิดพลาดในการลบรูปภาพ: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Function to extract public_id from Cloudinary URL
export const extractPublicIdFromUrl = (url) => {
  try {
    if (!url || !url.includes('cloudinary.com')) {
      return null;
    }

    // Extract public_id from URL like: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/filename.jpg
    const urlParts = url.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');

    if (uploadIndex === -1 || uploadIndex + 2 >= urlParts.length) {
      return null;
    }

    // Get everything after 'upload/v1234567890/'
    const publicIdParts = urlParts.slice(uploadIndex + 2);
    const publicId = publicIdParts.join('/').replace(/\.[^/.]+$/, ''); // Remove file extension

    return publicId;
  } catch (error) {
    console.error('Error extracting public_id from URL:', error);
    return null;
  }
};

// Function to check if URL is from Cloudinary
export const isCloudinaryUrl = (url) => {
  return url && url.includes('cloudinary.com');
};

// Function to migrate local image to Cloudinary
export const migrateLocalImageToCloudinary = async (localPath, folder, customName = null) => {
  try {
    console.log(`🔄 เริ่มการย้ายรูปภาพจาก local ไป Cloudinary: ${localPath}`);

    // Read local file
    const fs = await import('fs/promises');
    const fileBuffer = await fs.readFile(localPath);
    const base64Data = `data:image/jpeg;base64,${fileBuffer.toString('base64')}`;

    // Upload to Cloudinary
    const result = await uploadBase64ToCloudinary(base64Data, folder, customName);

    if (result.success) {
      console.log(`✅ ย้ายรูปภาพสำเร็จ: ${localPath} -> ${result.public_id}`);

      // Delete local file after successful upload
      try {
        await fs.unlink(localPath);
        console.log(`🗑️ ลบไฟล์ local: ${localPath}`);
      } catch (deleteError) {
        console.warn(`⚠️ ไม่สามารถลบไฟล์ local ได้: ${deleteError.message}`);
      }
    }

    return result;
  } catch (error) {
    console.error(`❌ เกิดข้อผิดพลาดในการย้ายรูปภาพ: ${error.message}`);
    return { success: false, error: error.message };
  }
};