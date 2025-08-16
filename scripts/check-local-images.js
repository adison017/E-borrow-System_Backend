import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get the directory of the current script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define folder mappings
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

// Supported file extensions
const supportedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt'];

// Function to get all files in a directory recursively
function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) {
    return arrayOfFiles;
  }

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

// Function to get file size
function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  return stats.size;
}

// Function to format file size
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Main function to check local images
function checkLocalImages() {
  console.log('🔍 ตรวจสอบรูปภาพใน Local Server...\n');

  const uploadsPath = path.join(__dirname, '..', 'uploads');
  let totalFiles = 0;
  let totalSize = 0;

  console.log('📁 โครงสร้างโฟลเดอร์:');
  console.log('='.repeat(80));

  for (const [localFolder, cloudinaryFolder] of Object.entries(folderMappings)) {
    const localFolderPath = path.join(uploadsPath, localFolder);

    if (!fs.existsSync(localFolderPath)) {
      console.log(`❌ ${localFolder.padEnd(20)} -> ${cloudinaryFolder.padEnd(30)} | ไม่พบโฟลเดอร์`);
      continue;
    }

    const files = getAllFiles(localFolderPath);
    const folderSize = files.reduce((sum, filePath) => sum + getFileSize(filePath), 0);

    totalFiles += files.length;
    totalSize += folderSize;

    const status = files.length > 0 ? '✅' : 'ℹ️ ';
    console.log(`${status} ${localFolder.padEnd(20)} -> ${cloudinaryFolder.padEnd(30)} | ${files.length.toString().padStart(3)} ไฟล์ | ${formatFileSize(folderSize)}`);
  }

  console.log('='.repeat(80));
  console.log(`📊 สรุป: ไฟล์ทั้งหมด ${totalFiles} ไฟล์ | ขนาดรวม ${formatFileSize(totalSize)}`);

  if (totalFiles > 0) {
    console.log('\n💡 คำแนะนำ:');
    console.log('   - ใช้คำสั่ง "npm run upload-local-images" เพื่ออัปโหลดรูปภาพทั้งหมดขึ้น Cloudinary');
    console.log('   - การอัปโหลดจะใช้เวลาประมาณ 2-3 วินาทีต่อไฟล์');
    console.log('   - ไฟล์จะถูกอัปโหลดเป็น batch ละ 5 ไฟล์');
  } else {
    console.log('\nℹ️  ไม่พบไฟล์รูปภาพในโฟลเดอร์ uploads');
  }
}

// Run the script
checkLocalImages();