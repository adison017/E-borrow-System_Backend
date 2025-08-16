import nodemailer from 'nodemailer';

export async function sendMail({ to, subject, text, html, attachments = [] }) {
  // ปรับ config ตามจริง
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // สร้าง HTML template เรียบง่าย ไม่ใช้รูปแนบ และใช้โทนสีระบบ
  const prettyHtml = html || `
    <div style="background:#f4f6fb;padding:32px 0;min-height:100vh;font-family:'Segoe UI',Arial,sans-serif;">
      <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;box-shadow:0 4px 24px #0001;border:1px solid #e5e7eb;overflow:hidden;">
        <div style="text-align:center;background:linear-gradient(90deg,#1e40af,#2563eb);color:#fff;padding:20px 16px;">
          <h2 style="margin:0;font-size:20px;letter-spacing:0.2px;">${subject || 'แจ้งเตือนระบบ E-borrow'}</h2>
          <div style="opacity:0.9;font-size:13px;margin-top:6px;">คณะวิทยาการสารสนเทศ มหาวิทยาลัยมหาสารคาม</div>
        </div>
        <div style="padding:24px 24px 8px 24px;color:#222;font-size:15px;line-height:1.7;text-align:left;">
          ${text ? `<div style='margin-bottom:12px;'>${text.replace(/\n/g,'<br>')}</div>` : ''}
          ${html || ''}
        </div>
        <div style="padding:0 24px 24px 24px;text-align:center;">
          <a href="https://mail.google.com" style="display:inline-block;padding:10px 22px;background:#2563eb;color:#fff;border-radius:8px;font-weight:600;text-decoration:none;font-size:14px;box-shadow:0 2px 8px #2563eb22;">เข้าสู่ระบบ E-borrow</a>
          <div style="margin-top:14px;color:#6b7280;font-size:12px;">หากคุณไม่ได้ร้องขอ สามารถละเว้นอีเมลนี้ได้</div>
        </div>
      </div>
      <div style="text-align:center;color:#9ca3af;font-size:12px;margin-top:16px;">&copy; ${new Date().getFullYear()} E-borrow System</div>
    </div>
  `;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html: prettyHtml
  };
  if (attachments && Array.isArray(attachments) && attachments.length > 0) {
    mailOptions.attachments = attachments;
  }

  return transporter.sendMail(mailOptions);
}
