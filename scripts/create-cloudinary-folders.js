import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import { fileURLToPath } from 'url';

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

async function createCloudinaryFolders() {
  console.log('🚀 เริ่มสร้าง folder structure ใน Cloudinary...');

  try {
    // Test connection first
    console.log('📡 ทดสอบการเชื่อมต่อ Cloudinary...');
    const connectionTest = await cloudinary.api.ping();

    if (!connectionTest) {
      console.error('❌ ไม่สามารถเชื่อมต่อ Cloudinary ได้');
      process.exit(1);
    }

    console.log('✅ เชื่อมต่อ Cloudinary สำเร็จ');

    // Create folders
    console.log('📁 สร้าง folder structure...');
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
        console.log(`📁 สร้าง folder: ${folder}`);

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

        console.log(`✅ สร้าง folder ${folder} สำเร็จ`);
      } catch (error) {
        console.log(`❌ เกิดข้อผิดพลาดในการสร้าง folder ${folder}:`, error.message);
        results.push({
          folder: folder,
          status: 'error',
          message: error.message
        });
      }
    }

    console.log('\n📋 ผลลัพธ์การสร้าง folder:');
    results.forEach(folder => {
      const status = folder.status === 'created' ? '✅' : '❌';
      console.log(`${status} ${folder.folder}: ${folder.message}`);
    });

    console.log('\n🎉 สร้าง folder structure ใน Cloudinary เสร็จสิ้น!');

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.message);
    process.exit(1);
  }
}

// Run the script
createCloudinaryFolders();