-- ลบคอลัมน์ reason ที่ไม่ได้ใช้ในตาราง borrow_transactions
-- ตรวจสอบว่าคอลัมน์มีอยู่แล้วหรือไม่
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
     AND TABLE_NAME = 'borrow_transactions'
     AND COLUMN_NAME = 'reason') > 0,
    'ALTER TABLE borrow_transactions DROP COLUMN reason',
    'SELECT "Column reason does not exist" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- แสดงโครงสร้างตารางหลังจากลบ
DESCRIBE borrow_transactions;