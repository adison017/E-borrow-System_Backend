-- สร้างตารางสำหรับเก็บข้อมูลติดต่อเจ้าหน้าที่
CREATE TABLE IF NOT EXISTS contact_info (
    id INT PRIMARY KEY AUTO_INCREMENT,
    location VARCHAR(255) NOT NULL COMMENT 'สถานที่ติดต่อ',
    phone VARCHAR(50) NOT NULL COMMENT 'เบอร์โทรศัพท์',
    hours VARCHAR(100) NOT NULL COMMENT 'เวลาทำการ',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- เพิ่มข้อมูลเริ่มต้น
INSERT INTO contact_info (location, phone, hours) VALUES
('ห้องพัสดุ อาคาร 1 ชั้น 2', '02-123-4567', '8:30-16:30 น.');