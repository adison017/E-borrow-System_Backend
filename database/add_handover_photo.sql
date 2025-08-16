-- เพิ่มคอลัมน์ handover_photo ในตาราง borrow_transactions
ALTER TABLE borrow_transactions
ADD COLUMN handover_photo VARCHAR(255) NULL
COMMENT 'รูปถ่ายส่งมอบครุภัณฑ์';

-- อัปเดตข้อมูลที่มีอยู่แล้ว (ถ้ามี)
-- UPDATE borrow_transactions SET handover_photo = NULL WHERE handover_photo IS NULL;