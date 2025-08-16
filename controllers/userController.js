
import bcrypt from 'bcrypt';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/userModel.js';
import { sendMail } from '../utils/emailUtils.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

// สำหรับเก็บ OTP ชั่วคราว (ใน production ควรใช้ redis หรือ db)
const otpStore = new Map();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// สำหรับเก็บ OTP สมัครสมาชิก (แยกจาก OTP เปลี่ยนรหัสผ่าน)
const registerOtpStore = new Map();

// สำหรับเก็บ login attempts และ device tracking
const loginAttempts = new Map();
const activeSessions = new Map();

// JWT Secret - ต้องตั้งค่าใน environment variable
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET || (JWT_SECRET + '_refresh');
if (!JWT_SECRET || JWT_SECRET === 'your_jwt_secret_key') {
  console.error('⚠️ WARNING: JWT_SECRET not properly configured!');
  console.error('Please set JWT_SECRET environment variable');
  process.exit(1);
}

// Helper function สำหรับสร้าง device fingerprint
function generateDeviceFingerprint(req) {
  const userAgent = req.headers['user-agent'] || '';
  
  // แก้ไขการดึง IP Address ให้ถูกต้อง
  let ip = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || 'unknown';
  
  // แปลง IPv6 localhost เป็น IPv4
  if (ip === '::1' || ip === '::ffff:127.0.0.1') {
    ip = '127.0.0.1 (localhost)';
  } else if (ip.startsWith('::ffff:')) {
    ip = ip.replace('::ffff:', '');
  }
  
  const acceptLanguage = req.headers['accept-language'] || '';
  const acceptEncoding = req.headers['accept-encoding'] || '';
  
  const fingerprint = crypto
    .createHash('sha256')
    .update(`${userAgent}${ip}${acceptLanguage}${acceptEncoding}`)
    .digest('hex');
    
  return {
    fingerprint,
    userAgent,
    ip,
    timestamp: Date.now()
  };
}

// Helper function สำหรับตรวจสอบ login attempts
function checkLoginAttempts(username, ip) {
  const key = `${username}:${ip}`;
  const attempts = loginAttempts.get(key) || { count: 0, lastAttempt: 0, blockedUntil: 0 };
  
  // ตรวจสอบว่าถูกบล็อกหรือไม่
  if (attempts.blockedUntil > Date.now()) {
    const remainingTime = Math.ceil((attempts.blockedUntil - Date.now()) / 1000 / 60);
    throw new Error(`บัญชีถูกบล็อกชั่วคราว กรุณาลองใหม่ใน ${remainingTime} นาที`);
  }
  
  // รีเซ็ตถ้าผ่านไป 15 นาทีแล้ว
  if (Date.now() - attempts.lastAttempt > 15 * 60 * 1000) {
    attempts.count = 0;
  }
  
  return attempts;
}

// Helper function สำหรับอัปเดต login attempts
function updateLoginAttempts(username, ip, success = false) {
  const key = `${username}:${ip}`;
  const attempts = loginAttempts.get(key) || { count: 0, lastAttempt: 0, blockedUntil: 0 };
  
  if (success) {
    // รีเซ็ตเมื่อ login สำเร็จ
    loginAttempts.delete(key);
  } else {
    // เพิ่มจำนวนครั้งที่ผิด
    attempts.count += 1;
    attempts.lastAttempt = Date.now();
    
    // บล็อกถ้าผิด 5 ครั้ง
    if (attempts.count >= 5) {
      attempts.blockedUntil = Date.now() + (15 * 60 * 1000); // บล็อก 15 นาที
    }
    
    loginAttempts.set(key, attempts);
  }
}

// Helper function สำหรับดึงข้อมูลติดต่อจาก API
async function getContactInfo() {
  const defaultContactInfo = {
    email: 'support@it.msu.ac.th',
    phone: '043-754-321',
    hours: 'จันทร์-ศุกร์ 8:30-16:30 น.',
    location: 'คณะวิทยาการสารสนเทศ มหาวิทยาลัยมหาสารคาม'
  };
  
  try {
    const ContactInfoModel = await import('../models/contactInfoModel.js');
    const result = await ContactInfoModel.getContactInfo();
    if (result.success && result.data) {
      // ใช้ข้อมูลจากฐานข้อมูล contact_info
      return {
        email: defaultContactInfo.email, // อีเมลใช้ค่าเริ่มต้นเสมอ
        phone: result.data.phone || defaultContactInfo.phone,
        hours: result.data.hours || defaultContactInfo.hours,
        location: result.data.location || defaultContactInfo.location
      };
    }
  } catch (error) {
    console.error('Error fetching contact info:', error);
    // ใช้ค่าเริ่มต้นหากเกิด error
  }
  
  return defaultContactInfo;
}

// Helper function สำหรับส่งแจ้งเตือน login ใหม่
async function sendLoginNotification(user, deviceInfo, isNewDevice = false) {
  try {
    const subject = isNewDevice ? '🔐 แจ้งเตือนความปลอดภัย: เข้าสู่ระบบจากอุปกรณ์ใหม่' : '🔐 แจ้งเตือนความปลอดภัย: เข้าสู่ระบบ';
    const brandLogo = '';
    const currentTime = new Date(deviceInfo.timestamp).toLocaleString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Bangkok'
    });
    
    // แยก User Agent ให้อ่านง่ายขึ้น
    const userAgent = deviceInfo.userAgent;
    const browserInfo = userAgent.includes('Chrome') ? 'Google Chrome' :
                       userAgent.includes('Firefox') ? 'Mozilla Firefox' :
                       userAgent.includes('Safari') ? 'Safari' :
                       userAgent.includes('Edge') ? 'Microsoft Edge' :
                       userAgent.includes('Opera') ? 'Opera' : 'Unknown Browser';
    
    const osInfo = userAgent.includes('Windows') ? 'Windows' :
                   userAgent.includes('Mac') ? 'macOS' :
                   userAgent.includes('Linux') ? 'Linux' :
                   userAgent.includes('Android') ? 'Android' :
                   userAgent.includes('iOS') ? 'iOS' : 'Unknown OS';
    
    const deviceInfoText = `
      🌐 เบราว์เซอร์: ${browserInfo}
      💻 ระบบปฏิบัติการ: ${osInfo}
      📍 IP Address: ${deviceInfo.ip}
      🕐 เวลา: ${currentTime}
    `;
    
    // ดึงข้อมูลติดต่อจาก API
    const contactInfo = await getContactInfo();
    
    const emailHtml = `
      <!DOCTYPE html>
      <html lang="th">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>แจ้งเตือนความปลอดภัย</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .container {
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border: 1px solid #e9ecef;
          }
          .header {
            text-align: center;
            background: linear-gradient(135deg, #1e3a8a, #2563eb);
            color: #ffffff;
            padding: 30px 20px;
            margin-bottom: 30px;
            border-bottom: 5px solid #3b82f6;
          }
          .logo {
            width: 80px;
            height: 80px;
            background: #ffffff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            color: #2563eb;
            font-size: 36px;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          }
          .title {
            color: #ffffff;
            font-size: 24px;
            font-weight: bold;
            margin: 0;
          }
          .subtitle {
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
            margin: 10px 0 0 0;
          }
          .greeting {
            font-size: 18px;
            color: #495057;
            margin-bottom: 25px;
          }
          .alert-box {
            background: linear-gradient(135deg, #fff3cd, #ffeaa7);
            border: 2px solid #ffc107;
            border-radius: 10px;
            padding: 20px;
            margin: 25px 0;
            position: relative;
          }
          .alert-icon {
            position: absolute;
            top: -15px;
            left: 20px;
            background: #ffc107;
            color: white;
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
          }
          .device-info {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .info-item {
            display: flex;
            align-items: center;
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
          }
          .info-item:last-child {
            border-bottom: none;
          }
          .info-icon {
            width: 24px;
            margin-right: 12px;
            color: #2563eb;
            font-size: 16px;
          }
          .info-label {
            font-weight: bold;
            color: #495057;
            min-width: 120px;
          }
          .info-value {
            color: #6c757d;
            flex: 1;
          }
          .warning-box {
            background: linear-gradient(135deg, #f8d7da, #f5c6cb);
            border: 2px solid #dc3545;
            border-radius: 10px;
            padding: 20px;
            margin: 25px 0;
            text-align: center;
          }
          .warning-icon {
            font-size: 24px;
            color: #dc3545;
            margin-bottom: 10px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 14px;
          }
          .contact-info {
            background: #e9ecef;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
          }
          .btn {
            display: inline-block;
            padding: 12px 24px;
            background: linear-gradient(135deg, #2563eb, #1e40af);
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 10px 5px;
            transition: all 0.3s ease;
          }
          .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🔐</div>
            <h1 class="title">ระบบยืม-คืนครุภัณฑ์</h1>
            <p class="subtitle">คณะวิทยาการสารสนเทศ มหาวิทยาลัยมหาสารคาม</p>
          </div>
          
          <div class="greeting">
            สวัสดี <strong>${user.Fullname}</strong>
          </div>
          
          <div class="alert-box">
            <div class="alert-icon">⚠️ แจ้งเตือนความปลอดภัย</div>
            <h2 style="color: #856404; margin-top: 20px;">
              ${isNewDevice ? '🔍 ตรวจพบการเข้าสู่ระบบจากอุปกรณ์ใหม่' : '🔐 การเข้าสู่ระบบสำเร็จ'}
            </h2>
            <p style="color: #856404; margin: 15px 0;">
              ${isNewDevice ? 
                'เราได้ตรวจพบการเข้าสู่ระบบจากอุปกรณ์ที่ไม่เคยใช้กับบัญชีนี้มาก่อน หากไม่ใช่คุณ กรุณาติดต่อผู้ดูแลระบบทันที' :
                'บัญชีของคุณได้เข้าสู่ระบบสำเร็จ หากไม่ใช่คุณ กรุณาติดต่อผู้ดูแลระบบทันที'
              }
            </p>
          </div>
          
          <div class="device-info">
            <h3 style="color: #495057; margin-top: 0; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
              📊 รายละเอียดการเข้าสู่ระบบ
            </h3>
            <div class="info-item">
              <span class="info-icon">🌐</span>
              <span class="info-label">เบราว์เซอร์:</span>
              <span class="info-value">${browserInfo}</span>
            </div>
            <div class="info-item">
              <span class="info-icon">💻</span>
              <span class="info-label">ระบบปฏิบัติการ:</span>
              <span class="info-value">${osInfo}</span>
            </div>
            <div class="info-item">
              <span class="info-icon">📍</span>
              <span class="info-label">IP Address:</span>
              <span class="info-value">${deviceInfo.ip}</span>
            </div>
            <div class="info-item">
              <span class="info-icon">🕐</span>
              <span class="info-label">เวลา:</span>
              <span class="info-value">${currentTime}</span>
            </div>
          </div>
          
          ${isNewDevice ? `
          <div class="warning-box">
            <div class="warning-icon">🚨</div>
            <h3 style="color: #721c24; margin: 10px 0;">การแจ้งเตือนความปลอดภัย</h3>
            <p style="color: #721c24; margin: 0;">
              หากไม่ใช่คุณที่เข้าสู่ระบบ กรุณาติดต่อผู้ดูแลระบบทันทีเพื่อความปลอดภัยของบัญชี
            </p>
          </div>
          ` : ''}
          
          <div class="contact-info">
            <h4 style="color: #495057; margin: 0 0 10px 0;">📞 ติดต่อผู้ดูแลระบบ</h4>
            <p style="margin: 5px 0;">
              <strong>สถานที่:</strong> ${contactInfo.location}<br>
              <strong>โทรศัพท์:</strong> ${contactInfo.phone}<br>
              <strong>เวลาทำการ:</strong> ${contactInfo.hours}
            </p>
          </div>
          
          <div style="text-align: center; margin: 25px 0;">
            <a href="mailto:${contactInfo.email}" class="btn">📧 ติดต่อผู้ดูแลระบบ</a>
            <a href="https://it.msu.ac.th" class="btn">🌐 ไปยังเว็บไซต์</a>
          </div>
          
          <div class="footer">
            <p>📧 อีเมลนี้ถูกส่งโดยระบบอัตโนมัติ กรุณาอย่าตอบกลับ</p>
            <p>🔒 ข้อมูลของคุณได้รับการปกป้องตามมาตรฐานความปลอดภัย</p>
            <p style="font-size: 12px; color: #adb5bd;">
              © 2025 คณะวิทยาการสารสนเทศ มหาวิทยาลัยมหาสารคาม<br>
              ระบบยืม-คืนครุภัณฑ์ | เวอร์ชัน 1.0.0
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const emailText = `
🔐 แจ้งเตือนความปลอดภัย: ระบบยืม-คืนครุภัณฑ์
คณะวิทยาการสารสนเทศ มหาวิทยาลัยมหาสารคาม

สวัสดี ${user.Fullname},

${isNewDevice ? '🔍 ตรวจพบการเข้าสู่ระบบจากอุปกรณ์ใหม่' : '🔐 การเข้าสู่ระบบสำเร็จ'}

${deviceInfoText}

${isNewDevice ? 
  '⚠️  หากไม่ใช่คุณ กรุณาติดต่อผู้ดูแลระบบทันทีเพื่อความปลอดภัยของบัญชี' :
  '✅ การเข้าสู่ระบบสำเร็จ หากไม่ใช่คุณ กรุณาติดต่อผู้ดูแลระบบทันที'
}

📞 ติดต่อผู้ดูแลระบบ:
   สถานที่: ${contactInfo.location}
   โทรศัพท์: ${contactInfo.phone}
   เวลาทำการ: ${contactInfo.hours}

🔒 ข้อมูลของคุณได้รับการปกป้องตามมาตรฐานความปลอดภัย

---
© 2025 คณะวิทยาการสารสนเทศ มหาวิทยาลัยมหาสารคาม
ระบบยืม-คืนครุภัณฑ์ | เวอร์ชัน 1.0.0
    `;
    
    await sendMail({
      to: user.email,
      subject: subject,
      text: emailText,
      html: emailHtml
    });
  } catch (error) {
    console.error('Error sending login notification:', error);
  }
}

// POST /api/users/request-otp
// ส่ง OTP ไปอีเมลสำหรับสมัครสมาชิก
async function requestRegisterOtp(req, res) {
  try {
    const { contact } = req.body;
    if (!contact || !/@msu\.ac\.th$/.test(contact)) {
      return res.status(400).json({ message: 'ต้องใช้อีเมล @msu.ac.th เท่านั้น' });
    }
    // สร้าง otp 6 หลัก
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    registerOtpStore.set(contact, { otp, expires: Date.now() + 5 * 60 * 1000 });
    // ดึงข้อมูลติดต่อจาก API
    const contactInfo = await getContactInfo();
    
    // ส่งอีเมล
    const brandLogo = '';
    const emailHtml = `
      <!DOCTYPE html>
      <html lang="th">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OTP สำหรับสมัครสมาชิก</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .container {
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border: 1px solid #e9ecef;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #28a745;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #28a745, #20c997);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            color: white;
            font-size: 32px;
            font-weight: bold;
          }
          .title {
            color: #28a745;
            font-size: 24px;
            font-weight: bold;
            margin: 0;
          }
          .subtitle {
            color: #6c757d;
            font-size: 16px;
            margin: 10px 0 0 0;
          }
          .otp-box {
            background: linear-gradient(135deg, #d4edda, #c3e6cb);
            border: 2px solid #28a745;
            border-radius: 10px;
            padding: 30px;
            margin: 25px 0;
            text-align: center;
          }
          .otp-code {
            font-size: 48px;
            font-weight: bold;
            color: #155724;
            letter-spacing: 8px;
            margin: 20px 0;
            font-family: 'Courier New', monospace;
          }
          .info-box {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .warning-box {
            background: linear-gradient(135deg, #fff3cd, #ffeaa7);
            border: 2px solid #ffc107;
            border-radius: 10px;
            padding: 20px;
            margin: 25px 0;
            text-align: center;
          }
          .contact-info {
            background: #e9ecef;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">📧</div>
            <h1 class="title">ระบบยืม-คืนครุภัณฑ์</h1>
            <p class="subtitle">คณะวิทยาการสารสนเทศ มหาวิทยาลัยมหาสารคาม</p>
          </div>
          
          <h2 style="color: #495057; text-align: center;">🔐 ยืนยันการสมัครสมาชิก</h2>
          
          <div class="otp-box">
            <h3 style="color: #155724; margin: 0 0 15px 0;">รหัส OTP ของคุณ</h3>
            <div class="otp-code">${otp}</div>
            <p style="color: #155724; margin: 15px 0 0 0; font-size: 16px;">
              รหัสนี้จะหมดอายุใน 5 นาที
            </p>
          </div>
          
          <div class="info-box">
            <h4 style="color: #495057; margin: 0 0 15px 0;">📋 วิธีการใช้งาน</h4>
            <ol style="color: #6c757d; margin: 0; padding-left: 20px;">
              <li>คัดลอกรหัส OTP ด้านบน</li>
              <li>กลับไปยังหน้าเว็บไซต์</li>
              <li>วางรหัส OTP ในช่องที่กำหนด</li>
              <li>กดปุ่ม "ยืนยัน" เพื่อดำเนินการต่อ</li>
            </ol>
          </div>
          
          <div class="warning-box">
            <h4 style="color: #856404; margin: 0 0 10px 0;">⚠️ ข้อควรระวัง</h4>
            <p style="color: #856404; margin: 0;">
              • อย่าแชร์รหัส OTP กับผู้อื่น<br>
              • รหัสนี้ใช้สำหรับการสมัครสมาชิกเท่านั้น<br>
              • หากไม่ใช่คุณ กรุณาละเว้นการใช้งาน
            </p>
          </div>
          
          <div class="contact-info">
            <h4 style="color: #495057; margin: 0 0 10px 0;">📞 ติดต่อผู้ดูแลระบบ</h4>
            <p style="margin: 5px 0;">
              <strong>สถานที่:</strong> ${contactInfo.location}<br>
              <strong>โทรศัพท์:</strong> ${contactInfo.phone}<br>
              <strong>เวลาทำการ:</strong> ${contactInfo.hours}
            </p>
          </div>
          
          <div class="footer">
            <p>📧 อีเมลนี้ถูกส่งโดยระบบอัตโนมัติ กรุณาอย่าตอบกลับ</p>
            <p>🔒 ข้อมูลของคุณได้รับการปกป้องตามมาตรฐานความปลอดภัย</p>
            <p style="font-size: 12px; color: #adb5bd;">
              © 2025 คณะวิทยาการสารสนเทศ มหาวิทยาลัยมหาสารคาม<br>
              ระบบยืม-คืนครุภัณฑ์ | เวอร์ชัน 1.0.0
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const emailText = `
📧 OTP สำหรับสมัครสมาชิก: ระบบยืม-คืนครุภัณฑ์
คณะวิทยาการสารสนเทศ มหาวิทยาลัยมหาสารคาม

🔐 ยืนยันการสมัครสมาชิก

รหัส OTP ของคุณ: ${otp}

⏰ รหัสนี้จะหมดอายุใน 5 นาที

📋 วิธีการใช้งาน:
1. คัดลอกรหัส OTP ด้านบน
2. กลับไปยังหน้าเว็บไซต์
3. วางรหัส OTP ในช่องที่กำหนด
4. กดปุ่ม "ยืนยัน" เพื่อดำเนินการต่อ

⚠️ ข้อควรระวัง:
• อย่าแชร์รหัส OTP กับผู้อื่น
• รหัสนี้ใช้สำหรับการสมัครสมาชิกเท่านั้น
• หากไม่ใช่คุณ กรุณาละเว้นการใช้งาน

📞 ติดต่อผู้ดูแลระบบ:
   สถานที่: ${contactInfo.location}
   โทรศัพท์: ${contactInfo.phone}
   เวลาทำการ: ${contactInfo.hours}

🔒 ข้อมูลของคุณได้รับการปกป้องตามมาตรฐานความปลอดภัย

---
© 2025 คณะวิทยาการสารสนเทศ มหาวิทยาลัยมหาสารคาม
ระบบยืม-คืนครุภัณฑ์ | เวอร์ชัน 1.0.0
    `;
    
    await sendMail({
      to: contact,
      subject: '📧 OTP สำหรับยืนยันการสมัครสมาชิก - ระบบยืม-คืนครุภัณฑ์',
      text: emailText,
      html: emailHtml
    });
    res.json({ message: 'ส่ง OTP ไปยังอีเมลแล้ว' });
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการส่ง OTP', error: err.message });
  }
}

// POST /api/users/verify-otp
// ตรวจสอบ OTP สำหรับสมัครสมาชิก
async function verifyRegisterOtp(req, res) {
  try {
    const { contact, otp } = req.body;
    if (!contact || !otp) {
      return res.status(400).json({ message: 'ข้อมูลไม่ครบ' });
    }
    const record = registerOtpStore.get(contact);
    if (!record) {
      return res.status(400).json({ message: 'ไม่พบ OTP หรือหมดอายุ' });
    }
    if (record.otp !== otp) {
      return res.status(400).json({ message: 'OTP ไม่ถูกต้อง' });
    }
    if (Date.now() > record.expires) {
      registerOtpStore.delete(contact);
      return res.status(400).json({ message: 'OTP หมดอายุ' });
    }
    // OTP ถูกต้อง
    registerOtpStore.delete(contact);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการตรวจสอบ OTP', error: err.message });
  }
}



// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  // ในส่วน filename function ของ userController.js
// เปลี่ยนจากโค้ดเดิม:
filename: function (req, file, cb) {
  // Get user_code from request body
  const userCode = req.body.user_code;
  console.log('Received user_code:', userCode); // Debug log
  if (!userCode) {
    return cb(new Error('User code is required'));
  }
  // ใช้นามสกุลไฟล์จริง
  const extension = path.extname(file.originalname).toLowerCase();
  const filename = `${userCode}${extension}`;
  console.log('Generated filename:', filename); // Debug log
  cb(null, filename);
}
});

// File filter for image upload
const fileFilter = (req, file, cb) => {
  // Accept only jpg and png
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Only .jpg and .png files are allowed!'), false);
  }
};

// Configure multer upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  }
}).single('avatar');

const userController = {
  // POST /api/users/reset-password
  resetPassword: async (req, res) => {
    try {
      const { email, otp, password } = req.body;
      if (!email || !otp || !password) {
        return res.status(400).json({ message: 'ข้อมูลไม่ครบ' });
      }
      const record = otpStore.get(email);
      if (!record) {
        return res.status(400).json({ message: 'ไม่พบ OTP หรือหมดอายุ' });
      }
      if (record.otp !== otp) {
        return res.status(400).json({ message: 'OTP ไม่ถูกต้อง' });
      }
      if (Date.now() > record.expires) {
        otpStore.delete(email);
        return res.status(400).json({ message: 'OTP หมดอายุ' });
      }
      // Hash new password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Update user password
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'ไม่พบผู้ใช้งานนี้' });
      }
      await User.update(user.user_id, { password: hashedPassword });
      otpStore.delete(email);
      res.json({ success: true, message: 'เปลี่ยนรหัสผ่านสำเร็จ' });
    } catch (err) {
      res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน', error: err.message });
    }
  },
  // POST /api/users/verify-otp (เปลี่ยนรหัสผ่าน)
  verifyPasswordOtp: async (req, res) => {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        return res.status(400).json({ message: 'ข้อมูลไม่ครบ' });
      }
      const record = otpStore.get(email);
      if (!record) {
        return res.status(400).json({ message: 'ไม่พบ OTP หรือหมดอายุ' });
      }
      if (record.otp !== otp) {
        return res.status(400).json({ message: 'OTP ไม่ถูกต้อง' });
      }
      if (Date.now() > record.expires) {
        otpStore.delete(email);
        return res.status(400).json({ message: 'OTP หมดอายุ' });
      }
      // OTP ถูกต้อง
      // ไม่ลบ otpStore ทันที ให้ลบตอนเปลี่ยนรหัสผ่านสำเร็จ
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ message: 'เกิดข้อผิดพลาดในการตรวจสอบ OTP', error: err.message });
    }
  },
  // POST /api/users/request-otp (สมัครสมาชิก)
  requestRegisterOtp,
  // POST /api/users/verify-otp (สมัครสมาชิก)
  verifyRegisterOtp,
  // POST /api/users/request-password-otp
  requestPasswordOtp: async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ message: 'กรุณาระบุอีเมล' });
      // หา user จากอีเมล
      const user = await User.findByEmail(email);
      if (!user) return res.status(404).json({ message: 'ไม่พบผู้ใช้งานนี้' });
      // สร้าง otp 6 หลัก
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      otpStore.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 });
      
      // ดึงข้อมูลติดต่อจาก API
      const contactInfo = await getContactInfo();
      
      // ส่งอีเมล
      const emailHtml = `
      <!DOCTYPE html>
      <html lang="th">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OTP สำหรับยืนยันการสมัครสมาชิก</title>
        <style>
          /* Base Styles */
          body {
            font-family: 'Segoe UI', 'Tahoma', 'Geneva', 'Verdana', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 0;
            background-color: #f8fafc;
          }
          
          /* Container */
          .container {
            background: white;
            border-radius: 12px;
            padding: 0;
            box-shadow: 0 4px 20px rgba(0, 75, 150, 0.1);
            border: 1px solid #e0e7ff;
            overflow: hidden;
          }
          
          /* Header */
          .header {
            background: linear-gradient(135deg, #1e3a8a, #2563eb);
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-bottom: 5px solid #3b82f6;
          }
          
          .logo {
            width: 80px;
            height: 80px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            color: #2563eb;
            font-size: 36px;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          
          .title {
            color: white;
            font-size: 24px;
            font-weight: bold;
            margin: 0;
          }
          
          .subtitle {
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
            margin: 10px 0 0 0;
          }
          
          /* Content */
          .content {
            padding: 30px;
          }
          
          /* OTP Box */
          .otp-box {
            background: #f0f7ff;
            border: 2px solid #3b82f6;
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
            text-align: center;
          }
          
          .otp-code {
            font-size: 42px;
            font-weight: bold;
            color: #1e40af;
            letter-spacing: 8px;
            margin: 15px 0;
            font-family: 'Courier New', monospace;
            background: white;
            padding: 10px;
            border-radius: 8px;
            display: inline-block;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          
          /* Info Box */
          .info-box {
            background: #f8fafc;
            border: 1px solid #e0e7ff;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
          }
          
          .info-box h4 {
            color: #1e3a8a;
            margin-top: 0;
            border-bottom: 2px solid #e0e7ff;
            padding-bottom: 10px;
          }
          
          .info-box ol {
            color: #4b5563;
            margin: 0;
            padding-left: 20px;
          }
          
          .info-box li {
            margin-bottom: 8px;
          }
          
          /* Warning Box */
          .warning-box {
            background: #fff7ed;
            border: 2px solid #f97316;
            border-radius: 10px;
            padding: 20px;
            margin: 25px 0;
          }
          
          .warning-box h4 {
            color: #9a3412;
            margin-top: 0;
          }
          
          .warning-box p {
            color: #9a3412;
            margin: 0;
          }
          
          /* Contact Info */
          .contact-info {
            background: #f0f7ff;
            border-radius: 10px;
            padding: 20px;
            margin: 25px 0;
          }
          
          .contact-info h4 {
            color: #1e3a8a;
            margin-top: 0;
          }
          
          /* Footer */
          .footer {
            text-align: center;
            padding: 20px;
            background: #f8fafc;
            border-top: 1px solid #e0e7ff;
            color: #64748b;
            font-size: 14px;
          }
          
          /* Responsive */
          @media (max-width: 480px) {
            .container {
              border-radius: 0;
            }
            
            .content {
              padding: 20px;
            }
            
            .otp-code {
              font-size: 32px;
              letter-spacing: 5px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🔐</div>
            <h1 class="title">ระบบยืม-คืนครุภัณฑ์</h1>
            <p class="subtitle">คณะวิทยาการสารสนเทศ มหาวิทยาลัยมหาสารคาม</p>
          </div>
          
          <div class="content">
            <h2 style="color: #1e3a8a; text-align: center; margin-top: 0;">🔐 ยืนยันการสมัครสมาชิก</h2>
            
            <div class="otp-box">
              <h3 style="color: #1e3a8a; margin: 0 0 15px 0;">รหัส OTP ของคุณ</h3>
              <div class="otp-code">${otp}</div>
              <p style="color: #1e3a8a; margin: 15px 0 0 0; font-size: 16px;">
                ⏰ รหัสนี้จะหมดอายุใน 5 นาที
              </p>
            </div>
            
            <div class="info-box">
              <h4>📋 วิธีการใช้งาน</h4>
              <ol>
                <li>คัดลอกรหัส OTP ด้านบน</li>
                <li>กลับไปยังหน้าเว็บไซต์</li>
                <li>วางรหัส OTP ในช่องที่กำหนด</li>
                <li>กดปุ่ม "ยืนยัน" เพื่อดำเนินการต่อ</li>
              </ol>
            </div>
            
            <div class="warning-box">
              <h4>⚠️ ข้อควรระวัง</h4>
              <p>
                • อย่าแชร์รหัส OTP กับผู้อื่น<br>
                • รหัสนี้ใช้สำหรับการสมัครสมาชิกเท่านั้น<br>
                • หากไม่ใช่คุณ กรุณาละเว้นการใช้งาน
              </p>
            </div>
            
            <div class="contact-info">
              <h4>📞 ติดต่อผู้ดูแลระบบ</h4>
              <p style="margin: 5px 0;">
                <strong>สถานที่:</strong> ${contactInfo.location}<br>
                <strong>โทรศัพท์:</strong> ${contactInfo.phone}<br>
                <strong>เวลาทำการ:</strong> ${contactInfo.hours}
              </p>
            </div>
          </div>
          
          <div class="footer">
            <p>📧 อีเมลนี้ถูกส่งโดยระบบอัตโนมัติ กรุณาอย่าตอบกลับ</p>
            <p>🔒 ข้อมูลของคุณได้รับการปกป้องตามมาตรฐานความปลอดภัย</p>
            <p style="font-size: 12px; color: #94a3b8;">
              © ${new Date().getFullYear()} คณะวิทยาการสารสนเทศ มหาวิทยาลัยมหาสารคาม<br>
              ระบบยืม-คืนครุภัณฑ์ | เวอร์ชัน 1.0.0
            </p>
          </div>
        </div>
      </body>
      </html>
      `;
      
      const emailText = `
      📧 OTP สำหรับสมัครสมาชิก: ระบบยืม-คืนครุภัณฑ์
      คณะวิทยาการสารสนเทศ มหาวิทยาลัยมหาสารคาม
      
      🔐 ยืนยันการสมัครสมาชิก
      
      รหัส OTP ของคุณ: ${otp}
      
      ⏰ รหัสนี้จะหมดอายุใน 5 นาที
      
      📋 วิธีการใช้งาน:
      1. คัดลอกรหัส OTP ด้านบน
      2. กลับไปยังหน้าเว็บไซต์
      3. วางรหัส OTP ในช่องที่กำหนด
      4. กดปุ่ม "ยืนยัน" เพื่อดำเนินการต่อ
      
      ⚠️ ข้อควรระวัง:
      • อย่าแชร์รหัส OTP กับผู้อื่น
      • รหัสนี้ใช้สำหรับการสมัครสมาชิกเท่านั้น
      • หากไม่ใช่คุณ กรุณาละเว้นการใช้งาน
      
      📞 ติดต่อผู้ดูแลระบบ:
         สถานที่: ${contactInfo.location}
         โทรศัพท์: ${contactInfo.phone}
         เวลาทำการ: ${contactInfo.hours}
      
      🔒 ข้อมูลของคุณได้รับการปกป้องตามมาตรฐานความปลอดภัย
      
      ---
      © ${new Date().getFullYear()} คณะวิทยาการสารสนเทศ มหาวิทยาลัยมหาสารคาม
      ระบบยืม-คืนครุภัณฑ์ | เวอร์ชัน 1.0.0
      `;
      
      await sendMail({
        to: email,
        subject: '🔑 OTP สำหรับเปลี่ยนรหัสผ่าน - ระบบยืม-คืนครุภัณฑ์',
        text: emailText,
        html: emailHtml
      });
      res.json({ message: 'ส่ง OTP ไปยังอีเมลแล้ว' });
    } catch (err) {
      res.status(500).json({ message: 'เกิดข้อผิดพลาดในการส่ง OTP', error: err.message });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({
        message: 'An error occurred while fetching users',
        error: err.message
      });
    }
  },

  getUserByUsername: async (req, res) => {
    try {
      const username = req.params.username;
      const user = await User.findByUsername(username);
      res.json(user);
    } catch (err) {
      console.error('Error fetching user:', err);
      res.status(500).json({
        message: 'An error occurred while fetching user',
        error: err.message
      });
    }
  },

  getUserById: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          message: 'User not found',
          error: 'No user found with the provided ID'
        });
      }

      // ปรับโครงสร้างข้อมูลตำแหน่งและสาขาให้ frontend ใช้งานง่าย
      const userOut = {
        ...user,
        position: user.position_id ? { id: user.position_id, name: user.position_name } : null,
        branch: user.branch_id ? { id: user.branch_id, name: user.branch_name } : null
      };

      res.json(userOut);
    } catch (err) {
      console.error('Error fetching user:', err);
      res.status(500).json({
        message: 'An error occurred while fetching user',
        error: err.message
      });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: 'กรุณากรอก username และ password' });
      }
      // เพิ่ม validation username: ต้องเป็น a-zA-Z0-9 เท่านั้น
      const usernamePattern = /^[a-zA-Z0-9]+$/;
      if (!usernamePattern.test(username)) {
        return res.status(400).json({ message: 'ชื่อผู้ใช้ไม่ถูกต้อง' });
      }

      // ตรวจสอบ login attempts
      const ip = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || 'unknown';
      try {
        checkLoginAttempts(username, ip);
      } catch (error) {
        updateLoginAttempts(username, ip, false); // เพิ่มครั้งที่ผิด
        return res.status(401).json({ message: error.message });
      }

      const user = await User.findByUsername(username);
      if (!user) {
        updateLoginAttempts(username, ip, false); // เพิ่มครั้งที่ผิด
        return res.status(401).json({ message: 'ไม่พบผู้ใช้งานนี้' });
      }

      // Debug log เพื่อตรวจสอบข้อมูลที่ได้จาก database
      console.log('=== Debug: User data from database ===');
      console.log('Full user object:', user);
      console.log('branch_name from DB:', user.branch_name);
      console.log('position_name from DB:', user.position_name);
      console.log('branch_id from DB:', user.branch_id);
      console.log('position_id from DB:', user.position_id);

      // ตรวจสอบรหัสผ่าน (hash)
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        updateLoginAttempts(username, ip, false); // เพิ่มครั้งที่ผิด
        return res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
      }

      // กำหนด role string สำหรับ frontend
      let role = 'user';
      if (user.role_name && user.role_name.toLowerCase().includes('admin')) role = 'admin';
      else if (user.role_name && user.role_name.toLowerCase().includes('executive')) role = 'executive';

      // สร้าง device fingerprint
      const deviceInfo = generateDeviceFingerprint(req);
      
      // ตรวจสอบว่าเป็นอุปกรณ์ใหม่หรือไม่
      const userSessions = activeSessions.get(user.user_id) || [];
      const isNewDevice = !userSessions.some(session => session.fingerprint === deviceInfo.fingerprint);
      
      // สร้าง Access Token อายุสั้น และ Refresh Token ในคุกกี้
      const token = jwt.sign({ 
        user_id: user.user_id, 
        username: user.username, 
        role,
        deviceFingerprint: deviceInfo.fingerprint,
        loginTime: Date.now()
      }, JWT_SECRET, { expiresIn: '15m' });

      const refreshToken = jwt.sign({ user_id: user.user_id, tokenId: crypto.randomUUID() }, REFRESH_SECRET, { expiresIn: '7d' });
      
      // บันทึก session ใหม่
      const newSession = {
        token,
        deviceInfo,
        loginTime: Date.now(),
        lastActivity: Date.now()
      };
      
      userSessions.push(newSession);
      activeSessions.set(user.user_id, userSessions);
      
      // ส่งแจ้งเตือนถ้าเป็นอุปกรณ์ใหม่
      if (isNewDevice) {
        sendLoginNotification(user, deviceInfo, true);
      }
      
      // รีเซ็ต login attempts เมื่อสำเร็จ
      updateLoginAttempts(username, ip, true);
      
      // ส่งข้อมูล user (ไม่รวม password) + token + เฉพาะ field ที่จำเป็น
      const { user_id, user_code, username: userUsername, Fullname, email, phone, avatar, street, parish, district, province, postal_no, branch_name, position_name } = user;
      console.log('LOGIN RESPONSE:', {
        message: 'เข้าสู่ระบบสำเร็จ',
        token,
        user: {
          user_id,
          user_code,
          username: userUsername,
          Fullname,
          email,
          phone,
          avatar,
          street,
          parish,
          district,
          province,
          postal_no,
          branch_name,
          position_name,
          role
        }
      });
      // เซ็ต HttpOnly Secure Cookie สำหรับ refresh token
      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/api/users/auth/refresh',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json({
        message: 'เข้าสู่ระบบสำเร็จ',
        token,
        user: {
          user_id,
          user_code,
          username: userUsername,
          Fullname,
          email,
          phone,
          avatar,
          street,
          parish,
          district,
          province,
          postal_no,
          branch_name,
          position_name,
          role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ', error: error.message });
    }
  },

  // POST /api/users/verify-password
  verifyPassword: async (req, res) => {
    try {
      const { password } = req.body;
      const user_id = req.user.user_id; // จาก JWT token

      if (!password) {
        return res.status(400).json({ message: 'กรุณากรอกรหัสผ่าน' });
      }

      const user = await User.findById(user_id);
      if (!user) {
        return res.status(404).json({ message: 'ไม่พบผู้ใช้งานนี้' });
      }

      // ตรวจสอบรหัสผ่าน
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
      }

      res.json({
        success: true,
        message: 'รหัสผ่านถูกต้อง'
      });
    } catch (error) {
      console.error('Password verification error:', error);
      res.status(500).json({ message: 'เกิดข้อผิดพลาดในการตรวจสอบรหัสผ่าน', error: error.message });
    }
  },

  // GET /api/users/profile
  getProfile: async (req, res) => {
    try {
      const user_id = req.user.user_id; // จาก JWT token

      console.log('=== Debug: Getting profile for user_id ===');
      console.log('user_id from token:', user_id);

      const user = await User.findById(user_id);
      if (!user) {
        return res.status(404).json({ message: 'ไม่พบผู้ใช้งานนี้' });
      }

      console.log('=== Debug: User data from database ===');
      console.log('Full user object:', user);
      console.log('branch_name from DB:', user.branch_name);
      console.log('position_name from DB:', user.position_name);

      // ส่งข้อมูล user (ไม่รวม password)
      const { user_id: userId, user_code, username, Fullname, email, phone, avatar, street, parish, district, province, postal_no, branch_name, position_name, role_name, line_notify_enabled, line_id, branch_id, position_id, role_id, created_at, updated_at } = user;

      // กำหนด role string สำหรับ frontend
      let role = 'user';
      if (role_name && role_name.toLowerCase().includes('admin')) role = 'admin';
      else if (role_name && role_name.toLowerCase().includes('executive')) role = 'executive';

      const userProfile = {
        user_id: userId,
        user_code,
        username,
        Fullname,
        email,
        phone,
        avatar,
        street,
        parish,
        district,
        province,
        postal_no,
        branch_name,
        position_name,
        role_name,
        line_notify_enabled,
        line_id,
        branch_id,
        position_id,
        role_id,
        created_at,
        updated_at,
        role
      };

      console.log('=== Debug: Profile response ===');
      console.log('User profile being sent:', userProfile);

      res.json({
        message: 'ดึงข้อมูลผู้ใช้สำเร็จ',
        user: userProfile
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้', error: error.message });
    }
  },

  createUser: async (req, res) => {
    try {
      const userData = req.body;
      if (!userData || typeof userData !== 'object') {
        return res.status(400).json({
          message: 'ไม่พบข้อมูลผู้ใช้ที่ส่งมา',
          error: 'Request body is missing or invalid'
        });
      }
      console.log('Creating user with data:', userData);

      // ตรวจสอบฟิลด์ที่จำเป็น
      const requiredFields = [
        { key: 'user_code', label: 'รหัสนิสิต/บุคลากร' },
        { key: 'username', label: 'ชื่อผู้ใช้' },
        { key: 'password', label: 'รหัสผ่าน' },
        { key: 'email', label: 'อีเมล' },
        { key: 'phone', label: 'เบอร์โทรศัพท์' },
        { key: 'Fullname', label: 'ชื่อ-นามสกุล' },
        { key: 'position_id', label: 'ตำแหน่ง' },
        { key: 'branch_id', label: 'สาขา' },
        { key: 'street', label: 'ที่อยู่' },
        { key: 'province', label: 'จังหวัด' },
        { key: 'district', label: 'อำเภอ' },
        { key: 'parish', label: 'ตำบล' },
        { key: 'postal_no', label: 'รหัสไปรษณีย์' }
      ];
      const missing = requiredFields.filter(f => !userData[f.key] || userData[f.key].toString().trim() === '');
      if (missing.length > 0) {
        return res.status(400).json({
          message: 'กรุณากรอก: ' + missing.map(f => f.label).join(', '),
          missing: missing.map(f => f.key)
        });
      }

      // ตรวจสอบความยาวรหัสผ่าน
      if (userData.password && userData.password.length < 6) {
        return res.status(400).json({
          message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร',
          field: 'password'
        });
      }
      // hash password ก่อนบันทึก
      if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
      }

      // ตรวจสอบรูปแบบ username: ต้องเป็น a-zA-Z0-9 เท่านั้น
      const usernamePattern = /^[a-zA-Z0-9]+$/;
      if (!usernamePattern.test(userData.username)) {
        return res.status(400).json({
          message: 'ชื่อผู้ใช้ไม่ถูกต้อง',
          field: 'username'
        });
      }

      // ตรวจสอบ username ซ้ำ
      const existUser = await User.findByUsername(userData.username);
      if (existUser) {
        return res.status(400).json({
          message: 'ชื่อผู้ใช้งานนี้ถูกใช้ไปแล้ว กรุณาเลือกชื่อใหม่',
          field: 'username'
        });
      }

      // ตรวจสอบ user_code ซ้ำ
      const existUserCode = await User.findByUserCode(userData.user_code);
      if (existUserCode) {
        return res.status(400).json({
          message: 'รหัสนิสิต/บุคลากรนี้ถูกใช้ไปแล้ว กรุณาใช้รหัสอื่น',
          field: 'user_code'
        });
      }

      // ตรวจสอบเบอร์โทรศัพท์ต้องเป็นตัวเลขเท่านั้น
      if (userData.phone && !/^[0-9]+$/.test(userData.phone)) {
        return res.status(400).json({
          message: 'เบอร์โทรศัพท์ต้องเป็นตัวเลขเท่านั้น',
          field: 'phone'
        });
      }

      // ตรวจสอบอีเมลซ้ำ
      const existEmail = await User.findByEmail(userData.email);
      if (existEmail) {
        return res.status(400).json({
          message: 'อีเมลนี้ถูกใช้ไปแล้ว กรุณาใช้อีเมลอื่น',
          field: 'email'
        });
      }

      // Create the user
      const createdUser = await User.create(userData);

      if (!createdUser) {
        return res.status(500).json({
          message: 'ไม่สามารถสร้างผู้ใช้งานได้',
          error: 'Failed to create user'
        });
      }

      // Return the created user data
      res.status(201).json({
        message: 'สร้างผู้ใช้งานสำเร็จ',
        user: createdUser
      });

    } catch (error) {
      console.error('Error creating user:', error);

      // Handle duplicate email error
      if (error.code === 'ER_DUP_ENTRY' && error.sqlMessage.includes('email')) {
        return res.status(400).json({
          message: 'อีเมลนี้ถูกใช้งานแล้ว',
          error: 'Email already exists'
        });
      }

      // Handle other errors
      res.status(500).json({
        message: 'เกิดข้อผิดพลาดในการสร้างผู้ใช้งาน',
        error: error.message
      });
    }
  },

  updateUser: async (req, res) => {
    try {
      console.log('=== ENTER updateUser ===', new Date().toISOString());
      const userId = parseInt(req.params.id, 10);
      console.log('Updating user with ID:', userId);
      console.log('Request body:', req.body);

      // Remove otp from req.body before updating DB
      if ('otp' in req.body) {
        console.log('otp field exists in req.body at start');
      }

      // ตรวจสอบว่ามี ID หรือไม่
      if (!userId) {
        console.log('Return: Invalid user ID');
        return res.status(400).json({
          message: 'Invalid user ID',
          error: 'User ID is required'
        });
      }

      // ตรวจสอบว่ามีข้อมูลที่จะอัพเดทหรือไม่
      if (Object.keys(req.body).length === 0) {
        console.log('Return: No data provided for update');
        return res.status(400).json({
          message: 'No data provided for update',
          error: 'Request body is empty'
        });
      }

      // ตรวจสอบ OTP เฉพาะกรณีเปลี่ยนรหัสผ่าน
      if (req.body.password) {
        if (!req.body.otp) {
          console.log('Return: Missing OTP');
          return res.status(400).json({ message: 'กรุณากรอก OTP เพื่อยืนยันการเปลี่ยนรหัสผ่าน' });
        }
        const user = await User.findById(userId);
        if (!user) {
          console.log('Return: User not found for OTP check');
          return res.status(404).json({ message: 'ไม่พบผู้ใช้งาน' });
        }
        // Debug log for OTP validation (ละเอียด)
        console.log('==== OTP DEBUG', new Date().toISOString(), '====');
        console.log('otpStore:', Array.from(otpStore.entries()));
        console.log('user.email:', user.email);
        console.log('req.body.otp:', req.body.otp);
        const otpData = otpStore.get(user.email);
        console.log('otpData:', otpData);
        if (otpData) {
          console.log('otpData.otp:', otpData.otp, 'otpData.expires:', otpData.expires, 'now:', Date.now(), 'expired:', Date.now() > otpData.expires);
        }
        if (!otpData || otpData.otp !== req.body.otp || Date.now() > otpData.expires) {
          console.log('OTP validation failed');
          return res.status(400).json({ message: 'OTP ไม่ถูกต้องหรือหมดอายุ' });
        }
        console.log('OTP validation success, deleting from otpStore');
        otpStore.delete(user.email); // ใช้แล้วลบ
        // Remove otp from req.body after validation
        delete req.body.otp;
        // hash password ก่อน update (เหมือน createUser)
        try {
          req.body.password = await bcrypt.hash(req.body.password, 10);
          console.log('Password hashed before update');
        } catch (err) {
          console.error('Error hashing password:', err);
          return res.status(500).json({ message: 'Error hashing password', error: err.message });
        }
      }

      const result = await User.updateById(userId, req.body);
      console.log('Update result:', result);

      if (!result || result.affectedRows === 0) {
        console.log('Return: User not found or no changes made');
        return res.status(404).json({
          message: 'User not found or no changes made',
          error: 'Update operation did not affect any rows'
        });
      }

      // ดึงข้อมูลผู้ใช้ที่อัพเดทแล้ว
      const updatedUser = await User.findById(userId);
      if (!updatedUser) {
        console.log('Return: Failed to fetch updated user data');
        return res.status(404).json({
          message: 'Failed to fetch updated user data',
          error: 'User not found after update'
        });
      }

      console.log('Return: User updated successfully');
      res.json({
        message: 'User updated successfully',
        user: updatedUser
      });

    } catch (error) {
      console.error('Error in updateUser:', error);
      res.status(500).json({
        message: 'Error updating user',
        error: error.message || 'Unknown error occurred'
      });
    }
  },

  updateLineNotifyEnabled: async (req, res) => {
    const userId = req.params.id;
    const { line_notify_enabled } = req.body;
    try {
      if (typeof line_notify_enabled === 'undefined') {
        return res.status(400).json({ message: 'Missing line_notify_enabled' });
      }
      const result = await User.updateLineNotifyEnabled(userId, line_notify_enabled);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'อัปเดตสถานะแจ้งเตือน LINE สำเร็จ' });
    } catch (err) {
      res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const result = await User.delete(userId);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: 'User not found',
          error: 'No user found with the provided ID'
        });
      }

      res.json({
        message: 'User deleted successfully',
        affectedRows: result.affectedRows
      });
    } catch (err) {
      console.error('Error deleting user:', err);
      res.status(500).json({
        message: 'An error occurred while deleting user',
        error: err.message
      });
    }
  },

  uploadImage: (req, res) => {
    console.log('Received request body:', req.body); // Debug log
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            message: 'ขนาดไฟล์ต้องไม่เกิน 2MB',
            error: err.message
          });
        }
        return res.status(400).json({
          message: 'เกิดข้อผิดพลาดในการอัพโหลดไฟล์',
          error: err.message
        });
      } else if (err) {
        // An unknown error occurred
        console.error('Upload error:', err);
        return res.status(500).json({
          message: 'เกิดข้อผิดพลาดในการอัพโหลดไฟล์',
          error: err.message
        });
      }

      // Everything went fine
      if (!req.file) {
        return res.status(400).json({
          message: 'ไม่พบไฟล์ที่อัพโหลด',
          error: 'กรุณาเลือกไฟล์ที่ต้องการอัพโหลด'
        });
      }

      try {
        // Get the filename from multer
        const filename = req.file.filename;
        console.log('Uploaded filename:', filename); // Debug log

        // สร้าง URL สำหรับรูปภาพ
        const imageUrl = `http://localhost:5000/uploads/${filename}`;

        // ส่งข้อมูลกลับไป
        res.json({
          message: 'อัพโหลดรูปภาพสำเร็จ',
          filename: filename,
          imageUrl: imageUrl
        });
      } catch (error) {
        console.error('Error processing upload response:', error);
        res.status(500).json({
          message: 'เกิดข้อผิดพลาดในการประมวลผลไฟล์',
          error: error.message
        });
      }
    });
  },

  // Get users by role
  getUsersByRole: async (req, res) => {
    try {
      const results = await User.getUsersByRole(req.params.role);

      // Return empty array instead of 404 if no results found
      const mapped = results.map(user => ({
        ...user,
        avatar: user.avatar ? `http://localhost:5000/uploads/${user.avatar}` : null
      }));

      res.json(mapped);
    } catch (err) {
      console.error('Error in getUsersByRole:', err);
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/users/sessions - ดู session ที่ใช้งานอยู่
  getActiveSessions: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const userSessions = activeSessions.get(userId) || [];
      
      const sessions = userSessions.map(session => ({
        deviceInfo: session.deviceInfo,
        loginTime: session.loginTime,
        lastActivity: session.lastActivity,
        isCurrent: session.token === req.headers.authorization?.replace('Bearer ', '')
      }));
      
      res.json({ sessions });
    } catch (err) {
      console.error('Error getting active sessions:', err);
      res.status(500).json({ error: err.message });
    }
  },

  // POST /api/users/logout - ออกจากระบบ
  logout: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (token) {
        // ลบ session ที่ตรงกับ token
        const userSessions = activeSessions.get(userId) || [];
        const updatedSessions = userSessions.filter(session => session.token !== token);
        
        if (updatedSessions.length === 0) {
          activeSessions.delete(userId);
        } else {
          activeSessions.set(userId, updatedSessions);
        }
      }
      
      res.json({ message: 'ออกจากระบบสำเร็จ' });
    } catch (err) {
      console.error('Error during logout:', err);
      res.status(500).json({ error: err.message });
    }
  },

  // POST /api/users/logout-all - ออกจากระบบทุกอุปกรณ์
  logoutAll: async (req, res) => {
    try {
      const userId = req.user.user_id;
      activeSessions.delete(userId);
      
      res.json({ message: 'ออกจากระบบทุกอุปกรณ์สำเร็จ' });
    } catch (err) {
      console.error('Error during logout all:', err);
      res.status(500).json({ error: err.message });
    }
  }
};

export default userController;