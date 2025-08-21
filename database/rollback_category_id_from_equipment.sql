-- SQL Script: Rollback การเพิ่ม category_id ใน equipment table
-- วันที่: 2024-08-21
-- คำอธิบาย: ย้อนกลับการเพิ่ม category_id column และ foreign key

-- ⚠️  คำเตือน: การรัน script นี้จะลบ category_id column และข้อมูลที่เกี่ยวข้อง

-- 1. ลบ foreign key constraint
ALTER TABLE equipment 
DROP FOREIGN KEY fk_equipment_category;

-- 2. ลบ index
DROP INDEX idx_equipment_category_id ON equipment;

-- 3. ลบ category_id column
ALTER TABLE equipment 
DROP COLUMN category_id;

-- 4. ตรวจสอบโครงสร้าง table
DESCRIBE equipment;

-- 5. ตรวจสอบข้อมูล
SELECT 
    item_id,
    item_code,
    name,
    category,
    description,
    quantity,
    unit,
    status
FROM equipment 
LIMIT 10;
