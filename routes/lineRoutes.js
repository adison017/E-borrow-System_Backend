import express from "express";
import * as line from "@line/bot-sdk";
import dotenv from "dotenv";
dotenv.config();
import User from "../models/userModel.js";
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// ตรวจสอบ environment variables สำหรับ LINE Bot
const token = process.env.token;
const secretcode = process.env.secretcode;

console.log('=== LINE Bot Configuration Check ===');
console.log('Token exists:', !!token);
console.log('Secret exists:', !!secretcode);
console.log('Token length:', token?.length || 0);
console.log('Secret length:', secretcode?.length || 0);
console.log('Token starts with:', token?.substring(0, 10) + '...');
console.log('Secret starts with:', secretcode?.substring(0, 10) + '...');
console.log('All environment variables:', Object.keys(process.env).filter(key => key.toLowerCase().includes('line') || key.toLowerCase().includes('token') || key.toLowerCase().includes('secret')));

// ถ้าไม่มี LINE Bot configuration ให้สร้าง router เปล่า
if (!token || !secretcode) {
  console.warn('⚠️ LINE Bot configuration is missing. LINE routes will be disabled.');
  console.warn('Please set "token" and "secretcode" in your .env file to enable LINE Bot features.');

  // สร้าง dummy routes เพื่อไม่ให้เซิร์ฟเวอร์ crash
  router.post("/", (req, res) => {
    console.log('LINE Bot not configured - rejecting webhook');
    res.status(503).json({
      success: false,
      message: 'LINE Bot is not configured. Please set token and secretcode in .env file.'
    });
  });

  // เพิ่ม route สำหรับทดสอบ
  router.get("/test", (req, res) => {
    res.json({
      success: false,
      message: 'LINE Bot is not configured',
      config: {
        token: !!token,
        secret: !!secretcode,
        envVars: Object.keys(process.env).filter(key => key.toLowerCase().includes('line') || key.toLowerCase().includes('token') || key.toLowerCase().includes('secret'))
      }
    });
  });

  // เพิ่ม route สำหรับตรวจสอบ server status
  router.get("/ping", (req, res) => {
    res.json({
      success: true,
      message: 'LINE routes are working (but not configured)',
      timestamp: new Date().toISOString(),
      config: {
        token: !!token,
        secret: !!secretcode
      }
    });
  });
} else {
  // มี LINE Bot configuration ปกติ
  const config = {
    channelAccessToken: token,
    channelSecret: secretcode,
  };

  const client = new line.Client(config);

  const handleLineEvent = async (event) => {
    console.log('=== LINE Event Received ===');
    console.log('Event type:', event.type);
    console.log('Event source:', event.source);
    console.log('Event message:', event.message);
    console.log('Reply token:', event.replyToken);

    // 📌 เมื่อมีคน Add Bot เป็นเพื่อน
    if (event.type === 'follow') {
      console.log('User followed the bot');
      return client.replyMessage(event.replyToken, {
        type: 'flex',
        altText: 'เชื่อมบัญชี LINE กับระบบแจ้งเตือน',
        contents: {
          type: 'bubble',
          hero: {
            type: 'image',
            url: 'https://e730ba43cf55.ngrok-free.app/uploads/logo/logo_w.png',
            size: 'full',
            aspectRatio: '1.51:1',
            aspectMode: 'cover',
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: 'เชื่อมบัญชี LINE กับระบบแจ้งเตือน',
                weight: 'bold',
                size: 'lg',
                align: 'center',
                wrap: true,
                color: '#1DB446',
              },
              {
                type: 'text',
                text: 'กรุณากรอก **ชื่อผู้ใช้งาน (username)** ของคุณในระบบ E-Borrow System ผ่าน LINE Bot นี้เท่านั้น',
                size: 'md',
                margin: 'md',
                wrap: true,
                align: 'center',
                weight: 'bold',
              },
              {
                type: 'text',
                text: 'เพื่อเชื่อมบัญชี LINE กับระบบแจ้งเตือน',
                size: 'sm',
                margin: 'md',
                wrap: true,
                align: 'center',
                color: '#888888',
              },
            ],
          },
          styles: {
            hero: { backgroundColor: '#EFEFEF' },
            body: { backgroundColor: '#F5F5F5' },
            footer: { backgroundColor: '#DDDDDD' }
          }
        },
      });
    }

    // ทดสอบ: ถ้าผู้ใช้พิมพ์ "test" ให้ส่ง Flex Message เดียวกับ follow
    if (event.type === "message" && event.message.type === "text" && event.message.text.trim().toLowerCase() === "test") {
      console.log('User sent test message');
      return client.replyMessage(event.replyToken, {
        type: 'flex',
        altText: 'เชื่อมบัญชี LINE กับระบบแจ้งเตือน',
        contents: {
          type: 'bubble',
          hero: {
            type: 'image',
            url: 'https://e730ba43cf55.ngrok-free.app/uploads/logo/logo_w.png',
            size: 'full',
            aspectRatio: '1.51:1',
            aspectMode: 'cover',
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: 'เชื่อมบัญชี LINE กับระบบแจ้งเตือน',
                weight: 'bold',
                size: 'lg',
                align: 'center',
                wrap: true,
                color: '#1DB446',
              },
              {
                type: 'text',
                text: 'กรุณากรอก ชื่อผู้ใช้งาน (username) ของคุณในระบบ E-Borrow System\nผ่าน LINE Bot นี้เท่านั้น',
                size: 'md',
                margin: 'md',
                wrap: true,
                align: 'center',
                weight: 'bold',
              },
              {
                type: 'text',
                text: 'เพื่อเชื่อมบัญชี LINE กับระบบแจ้งเตือน',
                size: 'sm',
                margin: 'md',
                wrap: true,
                align: 'center',
                color: '#888888',
              },
            ],
          },
          styles: {
            hero: { backgroundColor: '#0000CD' },
            body: { backgroundColor: '#FFFFF0' },
          }
        },
      });
    }

    // ตรวจสอบว่าเป็นข้อความหรือไม่
    if (event.type !== "message" || event.message.type !== "text") {
      console.log('Not a text message, ignoring');
      return Promise.resolve(null);
    }

    const line_id = event.source.userId;
    const username = event.message.text.trim();

    console.log('Processing username binding:');
    console.log('Line ID:', line_id);
    console.log('Username:', username);

    // พยายามอัปเดต line_id ให้ username
    try {
      console.log('Attempting to update user line_id...');
      const updated = await User.updateUserLineIdByUsername(username, line_id);
      console.log('Update result:', updated);

      if (updated) {
        console.log('Successfully bound LINE account');
        return client.replyMessage(event.replyToken, {
          type: "text",
          text: "✅ เชื่อมบัญชี LINE กับระบบสำเร็จ!\n\nตอนนี้คุณจะได้รับแจ้งเตือนจากระบบผ่าน LINE แล้ว",
        });
      } else {
        console.log('Username not found in system');
        return client.replyMessage(event.replyToken, {
          type: "text",
          text: "❌ ไม่พบชื่อผู้ใช้ในระบบ\n\nกรุณาตรวจสอบ username ของคุณอีกครั้ง หรือสอบถามเจ้าหน้าที่",
        });
      }
    } catch (error) {
      console.error("Error updating line_id:", error);
      return client.replyMessage(event.replyToken, {
        type: "text",
        text: "❌ เกิดข้อผิดพลาดในการเชื่อมบัญชี\n\nกรุณาลองใหม่อีกครั้ง หรือติดต่อเจ้าหน้าที่",
      });
    }
  };

  // Protect all line routes
  // router.use(authMiddleware);

  // เพิ่ม route สำหรับทดสอบ LINE Bot configuration
  router.get("/test", (req, res) => {
    res.json({
      success: true,
      message: 'LINE Bot is configured and ready',
      config: {
        token: !!token,
        secret: !!secretcode,
        tokenLength: token?.length || 0,
        secretLength: secretcode?.length || 0,
        envVars: Object.keys(process.env).filter(key => key.toLowerCase().includes('line') || key.toLowerCase().includes('token') || key.toLowerCase().includes('secret'))
      }
    });
  });

  // เพิ่ม route สำหรับตรวจสอบ LINE Bot status
  router.get("/status", async (req, res) => {
    try {
      const botInfo = await client.getBotInfo();
      res.json({
        success: true,
        message: 'LINE Bot is working',
        botInfo: botInfo
      });
    } catch (error) {
      console.error('Error getting bot info:', error);
      res.status(500).json({
        success: false,
        message: 'LINE Bot connection failed',
        error: error.message
      });
    }
  });

  // เพิ่ม route สำหรับตรวจสอบ server status
  router.get("/ping", (req, res) => {
    res.json({
      success: true,
      message: 'LINE routes are working',
      timestamp: new Date().toISOString(),
      config: {
        token: !!token,
        secret: !!secretcode
      }
    });
  });

  router.post("/", line.middleware(config), (req, res) => {
    console.log('=== LINE Webhook Received ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Events count:', req.body.events?.length || 0);

    if (!req.body.events || req.body.events.length === 0) {
      console.log('No events in request body');
      return res.status(200).json({ message: 'No events to process' });
    }

    Promise.all(req.body.events.map(handleLineEvent))
      .then((result) => {
        console.log('Webhook processing completed:', result);
        res.json(result);
      })
      .catch((err) => {
        console.error("Webhook handler error:", err);
        res.status(500).json({ error: err.message });
      });
  });

}

export default router;
