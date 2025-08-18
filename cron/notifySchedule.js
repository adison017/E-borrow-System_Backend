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
  // ตรวจสอบความถูกต้องของ Channel Access Token ทันทีเมื่อเริ่มระบบ
  (async () => {
    try {
      if (typeof client.getBotInfo === 'function') {
        const info = await client.getBotInfo();
        console.log(`✅ LINE token valid. Bot: ${info?.basicId || 'unknown'}`);
      } else {
        // fallback: เรียก endpoint ที่ใช้โควต้า เพื่อยืนยัน token
        const quota = await client.getMessageQuota();
        if (quota) console.log('✅ LINE token valid (quota endpoint reachable).');
      }
    } catch (e) {
      console.error('❌ LINE token invalid or revoked. Please refresh Channel Access Token.');
      console.error('Detail:', e?.statusCode || e?.status || '', e?.message || e);
    }
  })();
} else {
  console.warn('⚠️ LINE Bot configuration is missing. Scheduled notifications will be disabled.');
  console.warn('Please set "token" and "secretcode" in your .env file to enable LINE notifications.');
}

// รันทุกวันเวลา 00:05 น. ของวันนั้นๆ (ตามโซนเวลาเอเชีย/กรุงเทพฯ)
cron.schedule('29 0 * * *', async () => {
  // ถ้าไม่มี LINE Bot configuration ให้ข้ามการทำงาน
  if (!client) {
    console.log('Scheduled notification job skipped: LINE Bot not configured');
    return;
  }

  try {
    // ตรวจสอบ token ก่อนส่งทุกครั้ง (กันกรณี token หมดอายุกลางทาง)
    try {
      if (typeof client.getBotInfo === 'function') {
        await client.getBotInfo();
      } else {
        await client.getMessageQuota();
      }
    } catch (verifyErr) {
      console.error('❌ Skip job: LINE token invalid/revoked.', verifyErr?.statusCode || verifyErr?.status || '', verifyErr?.message || verifyErr);
      return;
    }

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
          const accentColor = daysRemaining === 1 ? '#d32f2f' : '#FB8C00';
          const message = {
            type: "flex",
            altText: `แจ้งเตือนการคืนครุภัณฑ์ (เหลือ ${daysRemaining} วัน)` ,
            contents: {
              type: "bubble",
              header: {
                type: "box",
                layout: "vertical",
                backgroundColor: accentColor,
                paddingAll: "18px",
                contents: [
                  {
                    type: "text",
                    text: "🔔 แจ้งเตือนการคืนครุภัณฑ์",
                    weight: "bold",
                    size: "lg",
                    color: "#ffffff"
                  },
                  {
                    type: "box",
                    layout: "vertical",
                    backgroundColor: "#ffffff",
                    cornerRadius: "lg",
                    paddingAll: "8px",
                    margin: "md",
                    contents: [
                      {
                        type: "text",
                        text: `เหลืออีก ${daysRemaining} วัน`,
                        weight: "bold",
                        size: "xxl",
                        color: accentColor,
                        align: "center"
                      }
                    ]
                  }
                ]
              },
              body: {
                type: "box",
                layout: "vertical",
                spacing: "md",
                contents: [
                  {
                    type: "box",
                    layout: "baseline",
                    contents: [
                      { type: "text", text: "รหัสการยืม", size: "sm", color: "#888888", flex: 3 },
                      { type: "text", text: String(borrow.borrow_code || borrow.borrowid), size: "sm", color: "#111111", flex: 5, weight: "bold", wrap: true }
                    ]
                  },
                  {
                    type: "box",
                    layout: "baseline",
                    contents: [
                      { type: "text", text: "กำหนดคืน", size: "sm", color: "#888888", flex: 3 },
                      { type: "text", text: formatDate(borrow.return_date), size: "sm", color: accentColor, flex: 5, weight: "bold" }
                    ]
                  },
                  {
                    type: "box",
                    layout: "baseline",
                    contents: [
                      { type: "text", text: "ระยะเวลายืม", size: "sm", color: "#888888", flex: 3 },
                      { type: "text", text: `${totalDays} วัน`, size: "sm", color: "#111111", flex: 5, weight: "bold" }
                    ]
                  },
                  { type: "separator", margin: "md" },
                  {
                    type: "text",
                    text: "กรุณาตรวจสอบอุปกรณ์และเตรียมส่งคืนตามกำหนด",
                    size: "sm",
                    color: "#666666",
                    wrap: true
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
                    color: accentColor,
                    action: {
                      type: "uri",
                      label: "ดูรายละเอียด",
                      uri: "https://e-borrow-system.vercel.app"
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
}, { timezone: 'Asia/Bangkok' });

// export default cron; // ไม่จำเป็นต้อง export ถ้าไม่ได้ import ไปใช้ที่อื่น
