-- แก้ไขคอลัมน์ handover_photo ให้มี default value เป็น NULL
ALTER TABLE borrow_transactions
MODIFY COLUMN handover_photo VARCHAR(255) NULL DEFAULT NULL
COMMENT 'รูปถ่ายส่งมอบครุภัณฑ์';

-- อัปเดตข้อมูลที่มีอยู่แล้วให้เป็น NULL (ถ้ามี)
UPDATE borrow_transactions
SET handover_photo = NULL
WHERE handover_photo = '' OR handover_photo IS NULL;

-- แสดงโครงสร้างตารางเพื่อยืนยัน
DESCRIBE borrow_transactions;