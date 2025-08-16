import dotenv from 'dotenv';
import { uploadEquipmentImage, uploadUserAvatar, uploadSignatureImage, uploadHandoverPhoto } from '../utils/cloudinaryUploadUtils.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get the directory of the current script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the server directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Test function for equipment image upload
async function testEquipmentUpload() {
  console.log('🧪 ทดสอบการอัปโหลดรูปภาพครุภัณฑ์...');

  try {
    // Create a simple test image (1x1 pixel PNG)
    const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

    const result = await uploadEquipmentImage(testImageBase64, 'TEST-EQ-001');

    if (result.success) {
      console.log('✅ อัปโหลดรูปภาพครุภัณฑ์สำเร็จ:', result.url);
      return result;
    } else {
      console.log('❌ อัปโหลดรูปภาพครุภัณฑ์ไม่สำเร็จ:', result.error);
      return null;
    }
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการทดสอบ:', error);
    return null;
  }
}

// Test function for user avatar upload
async function testUserAvatarUpload() {
  console.log('🧪 ทดสอบการอัปโหลดรูปโปรไฟล์ผู้ใช้...');

  try {
    // Create a simple test image (1x1 pixel PNG)
    const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

    const result = await uploadUserAvatar(testImageBase64, 'TEST-USER-001');

    if (result.success) {
      console.log('✅ อัปโหลดรูปโปรไฟล์ผู้ใช้สำเร็จ:', result.url);
      return result;
    } else {
      console.log('❌ อัปโหลดรูปโปรไฟล์ผู้ใช้ไม่สำเร็จ:', result.error);
      return null;
    }
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการทดสอบ:', error);
    return null;
  }
}

// Test function for signature upload
async function testSignatureUpload() {
  console.log('🧪 ทดสอบการอัปโหลดลายเซ็น...');

  try {
    // Create a simple test image (1x1 pixel PNG)
    const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

    const result = await uploadSignatureImage(testImageBase64, 'TEST-BR-001');

    if (result.success) {
      console.log('✅ อัปโหลดลายเซ็นสำเร็จ:', result.url);
      return result;
    } else {
      console.log('❌ อัปโหลดลายเซ็นไม่สำเร็จ:', result.error);
      return null;
    }
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการทดสอบ:', error);
    return null;
  }
}

// Test function for handover photo upload
async function testHandoverPhotoUpload() {
  console.log('🧪 ทดสอบการอัปโหลดรูปภาพการส่งมอบ...');

  try {
    // Create a simple test image (1x1 pixel PNG)
    const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

    const result = await uploadHandoverPhoto(testImageBase64, 'TEST-BR-001');

    if (result.success) {
      console.log('✅ อัปโหลดรูปภาพการส่งมอบสำเร็จ:', result.url);
      return result;
    } else {
      console.log('❌ อัปโหลดรูปภาพการส่งมอบไม่สำเร็จ:', result.error);
      return null;
    }
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการทดสอบ:', error);
    return null;
  }
}

// Main test function
async function runTests() {
  console.log('🚀 เริ่มทดสอบการอัปโหลดรูปภาพไปยัง Cloudinary...\n');

  const results = {
    equipment: await testEquipmentUpload(),
    userAvatar: await testUserAvatarUpload(),
    signature: await testSignatureUpload(),
    handoverPhoto: await testHandoverPhotoUpload()
  };

  console.log('\n📋 สรุปผลการทดสอบ:');
  console.log('='.repeat(50));

  Object.entries(results).forEach(([testName, result]) => {
    const status = result ? '✅ สำเร็จ' : '❌ ล้มเหลว';
    console.log(`${testName.padEnd(15)}: ${status}`);
    if (result) {
      console.log(`  URL: ${result.url}`);
    }
  });

  const successCount = Object.values(results).filter(result => result !== null).length;
  const totalCount = Object.keys(results).length;

  console.log('='.repeat(50));
  console.log(`ผลการทดสอบ: ${successCount}/${totalCount} สำเร็จ`);

  if (successCount === totalCount) {
    console.log('🎉 การทดสอบทั้งหมดสำเร็จ! ระบบ Cloudinary พร้อมใช้งาน');
  } else {
    console.log('⚠️  มีการทดสอบบางส่วนล้มเหลว กรุณาตรวจสอบการตั้งค่า');
  }
}

// Run the tests
runTests().catch(error => {
  console.error('❌ เกิดข้อผิดพลาดในการทดสอบ:', error);
  process.exit(1);
});