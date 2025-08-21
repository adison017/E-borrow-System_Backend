-- SQL Script: เพิ่ม category_id ใน equipment table
-- วันที่: 2024-08-21
-- คำอธิบาย: เพิ่ม foreign key relationship ระหว่าง equipment และ category

-- 1. เพิ่ม category_id column ใน equipment table
ALTER TABLE equipment 
ADD COLUMN category_id INT NULL AFTER category;

-- 2. เพิ่ม foreign key constraint
ALTER TABLE equipment 
ADD CONSTRAINT fk_equipment_category 
FOREIGN KEY (category_id) REFERENCES category(category_id) 
ON DELETE SET NULL 
ON UPDATE CASCADE;

-- 3. สร้าง index เพื่อเพิ่มประสิทธิภาพการค้นหา
CREATE INDEX idx_equipment_category_id ON equipment(category_id);

-- 4. อัปเดตข้อมูลที่มีอยู่ (ถ้ามี) - แมป category name กับ category_id
-- ตัวอย่าง: อัปเดต equipment ที่มี category = 'คอมพิวเตอร์' ให้มี category_id ที่ตรงกัน
UPDATE equipment e 
INNER JOIN category c ON e.category = c.name 
SET e.category_id = c.category_id 
WHERE e.category_id IS NULL;

-- 5. ตรวจสอบผลลัพธ์
SELECT 
    e.item_id,
    e.item_code,
    e.name,
    e.category,
    e.category_id,
    c.name as category_name,
    c.category_code
FROM equipment e
LEFT JOIN category c ON e.category_id = c.category_id
LIMIT 10;

-- 6. แสดงสถิติ
SELECT 
    COUNT(*) as total_equipment,
    COUNT(category_id) as equipment_with_category_id,
    COUNT(*) - COUNT(category_id) as equipment_without_category_id
FROM equipment;
