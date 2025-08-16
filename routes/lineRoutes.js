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

// ถ้าไม่มี LINE Bot configuration ให้สร้าง router เปล่า
if (!token || !secretcode) {
  console.warn('⚠️ LINE Bot configuration is missing. LINE routes will be disabled.');
  console.warn('Please set "token" and "secretcode" in your .env file to enable LINE Bot features.');

  // สร้าง dummy routes เพื่อไม่ให้เซิร์ฟเวอร์ crash
  router.post("/", (req, res) => {
    res.status(503).json({
      success: false,
      message: 'LINE Bot is not configured. Please set token and secretcode in .env file.'
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
    // 📌 เมื่อมีคน Add Bot เป็นเพื่อน
    if (event.type === 'follow') {
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
    if (event.type !== "message" || event.message.type !== "text") {
      return Promise.resolve(null);
    }
    const line_id = event.source.userId;
    const username = event.message.text.trim();

    // พยายามอัปเดต line_id ให้ username
    try {
      const updated = await User.updateUserLineIdByUsername(username, line_id);
      if (updated) {
        return client.replyMessage(event.replyToken, {
          type: "text",
          text: "เชื่อมบัญชี LINE กับระบบสำเร็จ!",
        });
      } else {
        return client.replyMessage(event.replyToken, {
          type: "text",
          text: "ไม่พบชื่อผู้ใช้ในระบบ กรุณาตรวจสอบ username ของคุณอีกครั้ง หรือสอบถามเจ้าหน้าที่",
        });
      }
    } catch (error) {
      console.error("Error updating line_id:", error);
      return client.replyMessage(event.replyToken, {
        type: "text",
        text: "เกิดข้อผิดพลาดในการเชื่อมบัญชี กรุณาลองใหม่อีกครั้ง",
      });
    }
  };

  // Protect all line routes
  // router.use(authMiddleware);

  router.post("/", line.middleware(config), (req, res) => {
    Promise.all(req.body.events.map(handleLineEvent))
      .then((result) => res.json(result))
      .catch((err) => {
        console.error("Webhook handler error:", err);
        res.status(500).end();
      });
  });
}

export default router;
