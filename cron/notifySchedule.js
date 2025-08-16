import { Client } from '@line/bot-sdk';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { getActiveBorrows } from '../models/borrowModel.js';
import { formatDate, getDaysBetween, getDaysRemaining } from '../utils/dateHelper.js';
dotenv.config();

// ตรวจสอบ environment variables สำหรับ LINE Bot
const token = process.env.token;
const secretcode = process.env.secretcode;

let client = null;

// ถ้ามี LINE Bot configuration ให้สร้าง client
if (token && secretcode) {
  client = new Client({
    channelAccessToken: token,
    channelSecret: secretcode
  });
  console.log('✅ LINE Bot configured for scheduled notifications');
} else {
  console.warn('⚠️ LINE Bot configuration is missing. Scheduled notifications will be disabled.');
  console.warn('Please set "token" and "secretcode" in your .env file to enable LINE notifications.');
}

// รันทุกวันเวลา 20:35 น.
cron.schedule('00 12 * * *', async () => {
  // ถ้าไม่มี LINE Bot configuration ให้ข้ามการทำงาน
  if (!client) {
    console.log('Scheduled notification job skipped: LINE Bot not configured');
    return;
  }

  try {
    const borrows = await getActiveBorrows();
    console.log(`Found ${borrows.length} active borrows to notify`);
    for (const borrow of borrows) {
      if (borrow.line_id) {
        // จำนวนวันที่เหลือ: วันนี้ถึงวันคืน
        const daysRemaining = getDaysRemaining(borrow.return_date, new Date());
        // จำนวนวันที่ยืมทั้งหมด: borrow_date ถึง return_date
        const totalDays = getDaysBetween(borrow.borrow_date, borrow.return_date);
        console.log(`borrow_code: ${borrow.borrow_code}, borrow_date: ${borrow.borrow_date}, return_date: ${borrow.return_date}, daysRemaining: ${daysRemaining}, totalDays: ${totalDays}`);
        // ถ้าไม่เข้าเงื่อนไข 3 หรือ 1 ให้ข้าม
        if (!(daysRemaining === 3 || daysRemaining === 1)) {
          console.log(`SKIP: borrow_code: ${borrow.borrow_code} ไม่เข้าเงื่อนไข daysRemaining (${daysRemaining}) !== 3 หรือ 1`);
          continue;
        }
        // ส่งเฉพาะ 3 วัน และ 1 วันก่อนถึงวันคืน
        if (daysRemaining === 3 || daysRemaining === 1) {
          const message = {
            type: "flex",
            altText: "แจ้งเตือนการคืนครุภัณฑ์",
            contents: {
              type: "bubble",
              body: {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "text",
                    text: "📦 คุณกำลังยืมครุภัณฑ์",
                    weight: "bold",
                    size: "lg",
                    color: "#d84315",
                    wrap: true
                  },
                  {
                    type: "box",
                    layout: "baseline",
                    contents: [
                      { type: "text", text: "รหัสการยืม", size: "sm", color: "#888888", flex: 2 },
                      { type: "text", text: String(borrow.borrow_code || borrow.borrowid), size: "sm", color: "#222222", flex: 4, weight: "bold" }
                    ]
                  },
                  {
                    type: "box",
                    layout: "baseline",
                    contents: [
                      { type: "text", text: "กำหนดคืน", size: "sm", color: "#888888", flex: 2 },
                      { type: "text", text: formatDate(borrow.return_date), size: "sm", color: "#d84315", flex: 4, weight: "bold" }
                    ]
                  },
                  {
                    type: "box",
                    layout: "baseline",
                    contents: [
                      { type: "text", text: "จำนวนวันที่ยืมทั้งหมด", size: "sm", color: "#888888", flex: 2 },
                      { type: "text", text: `${totalDays} วัน`, size: "sm", color: "#222222", flex: 4, weight: "bold" }
                    ]
                  },
                  {
                    type: "text",
                    text: `เหลืออีก ${daysRemaining} วัน`,
                    size: "md",
                    margin: "sm",
                    color: daysRemaining > 4
                    ? "#00B900"     // เขียว
                    : daysRemaining <= 3
                    ? "#FF0000"     // แดง
                    : "#FFA500",    // ส้ม (กรณี = 4)
                    weight: "bold"
                  }
                ]
              },
              footer: {
                type: "box",
                layout: "vertical",
                spacing: "sm",
                contents: [
                  {
                    type: "button",
                    style: "primary",
                    color: "#0A8F08",
                    action: {
                      type: "uri",
                      label: "ดูรายละเอียด",
                      uri: "https://your-site.com/borrow/" + (borrow.borrow_code || borrow.borrowid)
                    }
                  }
                ]
              }
            }
          };

          try {
            console.log(`Sending to ${borrow.line_id}: ${message.altText || '[Flex Message]'}`);
            await client.pushMessage(borrow.line_id, message);
            await new Promise(resolve => setTimeout(resolve, 200));
          } catch (sendError) {
            console.error(`Error sending message to ${borrow.line_id}:`, sendError, sendError.response?.data);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in notification job:', error);
  }
});

// export default cron; // ไม่จำเป็นต้อง export ถ้าไม่ได้ import ไปใช้ที่อื่น
