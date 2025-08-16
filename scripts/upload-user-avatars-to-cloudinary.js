import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import db from '../db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Function to upload a single file to Cloudinary
const uploadFileToCloudinary = async (filePath, userCode) => {
  try {
    console.log(`📤 อัปโหลดรูปภาพ: ${filePath}`);

    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'e-borrow/user',
      public_id: userCode,
      resource_type: 'auto',
      overwrite: false
    });

    console.log(`✅ อัปโหลดสำเร็จ: ${result.public_id}`);
    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    console.error(`❌ เกิดข้อผิดพลาดในการอัปโหลด ${filePath}:`, error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

// Function to extract public ID from Cloudinary URL
const extractPublicIdFromUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return null;
  }
  const parts = url.split('/');
  const uploadIndex = parts.indexOf('upload');
  if (uploadIndex === -1 || uploadIndex + 2 >= parts.length) {
    return null;
  }
  const publicIdParts = parts.slice(uploadIndex + 2);
  let publicId = publicIdParts.join('/');
  const lastDotIndex = publicId.lastIndexOf('.');
  if (lastDotIndex > -1) {
    publicId = publicId.substring(0, lastDotIndex);
  }
  return publicId;
};

// Function to delete image from Cloudinary
const deleteImageFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === 'ok') {
      console.log(`✅ ลบรูปภาพจาก Cloudinary สำเร็จ: ${publicId}`);
      return { success: true, message: 'Image deleted successfully' };
    } else {
      console.error(`❌ ไม่สามารถลบรูปภาพจาก Cloudinary: ${publicId}, ผลลัพธ์: ${result.result}`);
      return { success: false, message: `Failed to delete image: ${result.result}` };
    }
  } catch (error) {
    console.error(`❌ เกิดข้อผิดพลาดในการลบรูปภาพ ${publicId} จาก Cloudinary:`, error.message);
    return { success: false, message: error.message };
  }
};

// Main function to upload user avatars
const uploadUserAvatarsToCloudinary = async () => {
  try {
    console.log('🚀 เริ่มต้นการอัปโหลดรูปภาพ user ไปยัง Cloudinary...');

    // Test Cloudinary connection
    const pingResult = await cloudinary.api.ping();
    console.log('✅ เชื่อมต่อ Cloudinary สำเร็จ:', pingResult);

    // Get all users with local avatars
    const [users] = await db.query(`
      SELECT user_id, user_code, avatar
      FROM users
      WHERE avatar IS NOT NULL
      AND avatar != ''
      AND avatar NOT LIKE '%cloudinary.com%'
      AND avatar NOT LIKE '%profile.png%'
      AND avatar NOT LIKE '%logo_it.png%'
    `);

    console.log(`📊 พบผู้ใช้ ${users.length} คนที่มีรูปภาพ local`);

    if (users.length === 0) {
      console.log('✅ ไม่มีรูปภาพ local ที่ต้องอัปโหลด');
      return;
    }

    const uploadsDir = path.join(__dirname, '..', 'uploads', 'user');

    let successCount = 0;
    let errorCount = 0;

    for (const user of users) {
      try {
        const avatarPath = path.join(uploadsDir, user.avatar);

        // Check if file exists
        if (!fs.existsSync(avatarPath)) {
          console.log(`⚠️ ไม่พบไฟล์: ${avatarPath}`);
          continue;
        }

        // Upload to Cloudinary
        const result = await uploadFileToCloudinary(avatarPath, user.user_code);

        if (result.success) {
          // Update database with Cloudinary URL
          await db.query(
            'UPDATE users SET avatar = ? WHERE user_id = ?',
            [result.url, user.user_id]
          );

          console.log(`✅ อัปเดตฐานข้อมูลสำหรับ user: ${user.user_code}`);
          successCount++;

          // Delete local file after successful upload
          fs.unlinkSync(avatarPath);
          console.log(`🗑️ ลบไฟล์ local: ${avatarPath}`);

          // Add delay to respect API limits
          await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
          console.error(`❌ ไม่สามารถอัปโหลดรูปภาพสำหรับ user: ${user.user_code}`);
          errorCount++;
        }
      } catch (error) {
        console.error(`❌ เกิดข้อผิดพลาดสำหรับ user ${user.user_code}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n📊 สรุปผลการอัปโหลด:');
    console.log(`✅ สำเร็จ: ${successCount} รูปภาพ`);
    console.log(`❌ ล้มเหลว: ${errorCount} รูปภาพ`);
    console.log(`📁 รวม: ${users.length} รูปภาพ`);

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ user:', error);
  } finally {
    process.exit(0);
  }
};

// Run the script
uploadUserAvatarsToCloudinary();