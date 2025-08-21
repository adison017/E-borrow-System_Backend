-- SQL Script: ทดสอบความสัมพันธ์ระหว่าง equipment และ category
-- วันที่: 2024-08-21
-- คำอธิบาย: ทดสอบการทำงานของ foreign key relationship

-- 1. ตรวจสอบโครงสร้าง table
DESCRIBE equipment;
DESCRIBE category;

-- 2. ตรวจสอบ foreign key constraints
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'equipment' 
AND REFERENCED_TABLE_NAME IS NOT NULL;

-- 3. ตรวจสอบข้อมูล category
SELECT 
    category_id,
    category_code,
    name,
    created_at,
    updated_at
FROM category
ORDER BY category_id;

-- 4. ตรวจสอบข้อมูล equipment พร้อม category
SELECT 
    e.item_id,
    e.item_code,
    e.name,
    e.category,
    e.category_id,
    c.name as category_name,
    c.category_code,
    e.quantity,
    e.unit,
    e.status
FROM equipment e
LEFT JOIN category c ON e.category_id = c.category_id
ORDER BY e.item_id
LIMIT 20;

-- 5. นับจำนวน equipment ตาม category
SELECT 
    c.name as category_name,
    c.category_code,
    COUNT(e.item_id) as equipment_count
FROM category c
LEFT JOIN equipment e ON c.category_id = e.category_id
GROUP BY c.category_id, c.name, c.category_code
ORDER BY equipment_count DESC;

-- 6. ตรวจสอบ equipment ที่ไม่มี category_id
SELECT 
    item_id,
    item_code,
    name,
    category,
    category_id
FROM equipment 
WHERE category_id IS NULL;

-- 7. ทดสอบการเพิ่ม equipment ใหม่พร้อม category_id
-- INSERT INTO equipment (item_code, name, category, category_id, description, quantity, unit, status, pic, created_at, price, purchaseDate, room_id) 
-- VALUES ('EQ-TEST-001', 'เครื่องทดสอบ', 'คอมพิวเตอร์', 1, 'เครื่องทดสอบระบบ', 1, 'ชิ้น', 'พร้อมใช้งาน', 'default.jpg', NOW(), 50000, '2024-08-21', 1);

-- 8. ทดสอบการอัปเดต category_id
-- UPDATE equipment SET category_id = 1 WHERE item_code = 'EQ-TEST-001';

-- 9. ทดสอบการลบ category (ควร SET NULL category_id ใน equipment)
-- DELETE FROM category WHERE category_id = 1;

-- 10. ตรวจสอบ performance ของ index
EXPLAIN SELECT * FROM equipment WHERE category_id = 1;
