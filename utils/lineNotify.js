import * as line from '@line/bot-sdk';
import dotenv from 'dotenv';
dotenv.config();

// ตรวจสอบ environment variables สำหรับ LINE Bot
const token = process.env.token;
const secretcode = process.env.secretcode;

let client = null;

// ถ้ามี LINE Bot configuration ให้สร้าง client
if (token && secretcode) {
  client = new line.Client({
    channelAccessToken: token,
    channelSecret: secretcode,
  });
} else {
  console.warn('⚠️ LINE Bot configuration is missing. LINE notifications will be disabled.');
  console.warn('Please set "token" and "secretcode" in your .env file to enable LINE notifications.');
}

export async function sendLineNotify(lineId, message) {
  if (!lineId || !client) {
    console.log('LINE notification skipped: No lineId or LINE Bot not configured');
    return;
  }

  try {
    await client.pushMessage(lineId, message);
    console.log(`LINE notification sent to ${lineId}`);
  } catch (err) {
    console.error('Error sending LINE message:', err);
  }
}