-- เพิ่ม category_id ใน equipment table
ALTER TABLE equipment 
ADD COLUMN category_id INT NULL AFTER category;

-- อัปเดตข้อมูลที่มีอยู่ - แมป category name กับ category_id
UPDATE equipment e 
INNER JOIN category c ON e.category = c.name 
SET e.category_id = c.category_id 
WHERE e.category_id IS NULL;

-- เปลี่ยน category_id เป็น NOT NULL หลังจากอัปเดตข้อมูลแล้ว
ALTER TABLE equipment 
MODIFY COLUMN category_id INT NOT NULL;

-- เพิ่ม foreign key constraint
ALTER TABLE equipment 
ADD CONSTRAINT fk_equipment_category 
FOREIGN KEY (category_id) REFERENCES category(category_id);

-- สร้าง index เพื่อเพิ่มประสิทธิภาพ
CREATE INDEX idx_equipment_category_id ON equipment(category_id);
