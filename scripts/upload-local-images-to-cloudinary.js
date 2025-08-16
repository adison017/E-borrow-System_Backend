import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get the directory of the current script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the server directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Configure Cloudinary after loading environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Define folder mappings from local to Cloudinary
const folderMappings = {
  'equipment': 'e-borrow/equipment',
  'user': 'e-borrow/user',
  'repair': 'e-borrow/repair',
  'handover_photo': 'e-borrow/handover_photo',
  'pay_slip': 'e-borrow/pay_slip',
  'roomimg': 'e-borrow/roomimg',
  'signature': 'e-borrow/signature',
  'important_documents': 'e-borrow/important_documents',
  'logo': 'e-borrow/logo'
};

// Supported image extensions
const supportedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt'];

// Function to get all files in a directory recursively
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (supportedExtensions.includes(ext)) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

// Function to upload a single file to Cloudinary
async function uploadFileToCloudinary(filePath, cloudinaryFolder) {
  try {
    console.log(`📤 อัปโหลด: ${filePath}`);

    const result = await cloudinary.uploader.upload(filePath, {
      folder: cloudinaryFolder,
      resource_type: 'auto',
      overwrite: false // Don't overwrite existing files
    });

    console.log(`✅ สำเร็จ: ${result.public_id}`);
    return {
      success: true,
      localPath: filePath,
      cloudinaryId: result.public_id,
      url: result.secure_url
    };
  } catch (error) {
    console.log(`❌ ผิดพลาด: ${filePath} - ${error.message}`);
    return {
      success: false,
      localPath: filePath,
      error: error.message
    };
  }
}

// Main function to upload all local images
async function uploadLocalImagesToCloudinary() {
  console.log('🚀 เริ่มอัปโหลดรูปภาพจาก Local Server ขึ้น Cloudinary...');

  try {
    // Test connection first
    console.log('📡 ทดสอบการเชื่อมต่อ Cloudinary...');
    const connectionTest = await cloudinary.api.ping();

    if (!connectionTest) {
      console.error('❌ ไม่สามารถเชื่อมต่อ Cloudinary ได้');
      process.exit(1);
    }

    console.log('✅ เชื่อมต่อ Cloudinary สำเร็จ');

    const uploadsPath = path.join(__dirname, '..', 'uploads');
    const results = {
      success: [],
      failed: [],
      summary: {
        total: 0,
        successful: 0,
        failed: 0
      }
    };

    // Process each folder
    for (const [localFolder, cloudinaryFolder] of Object.entries(folderMappings)) {
      const localFolderPath = path.join(uploadsPath, localFolder);

      if (!fs.existsSync(localFolderPath)) {
        console.log(`⚠️  ไม่พบโฟลเดอร์: ${localFolderPath}`);
        continue;
      }

      console.log(`\n📁 ประมวลผลโฟลเดอร์: ${localFolder} -> ${cloudinaryFolder}`);

      const files = getAllFiles(localFolderPath);
      console.log(`📊 พบไฟล์ ${files.length} ไฟล์ใน ${localFolder}`);

      if (files.length === 0) {
        console.log(`ℹ️  ไม่มีไฟล์ในโฟลเดอร์ ${localFolder}`);
        continue;
      }

      // Upload files in batches to avoid overwhelming the API
      const batchSize = 5;
      for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);

        console.log(`\n📦 อัปโหลด batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(files.length / batchSize)}`);

        const batchPromises = batch.map(filePath => uploadFileToCloudinary(filePath, cloudinaryFolder));
        const batchResults = await Promise.all(batchPromises);

        batchResults.forEach(result => {
          if (result.success) {
            results.success.push(result);
            results.summary.successful++;
          } else {
            results.failed.push(result);
            results.summary.failed++;
          }
          results.summary.total++;
        });

        // Add a small delay between batches to be respectful to the API
        if (i + batchSize < files.length) {
          console.log('⏳ รอ 2 วินาที...');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }

    // Print summary
    console.log('\n📋 สรุปผลการอัปโหลด:');
    console.log(`📊 ไฟล์ทั้งหมด: ${results.summary.total}`);
    console.log(`✅ สำเร็จ: ${results.summary.successful}`);
    console.log(`❌ ผิดพลาด: ${results.summary.failed}`);

    if (results.success.length > 0) {
      console.log('\n✅ ไฟล์ที่อัปโหลดสำเร็จ:');
      results.success.forEach(result => {
        console.log(`  - ${result.cloudinaryId}`);
      });
    }

    if (results.failed.length > 0) {
      console.log('\n❌ ไฟล์ที่อัปโหลดไม่สำเร็จ:');
      results.failed.forEach(result => {
        console.log(`  - ${result.localPath}: ${result.error}`);
      });
    }

    console.log('\n🎉 การอัปโหลดรูปภาพเสร็จสิ้น!');

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.message);
    process.exit(1);
  }
}

// Run the script
uploadLocalImagesToCloudinary();