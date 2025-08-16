-- สร้างตาราง room (สำหรับห้อง)
CREATE TABLE IF NOT EXISTS room (
    room_id INT AUTO_INCREMENT PRIMARY KEY,
    room_name VARCHAR(100) NOT NULL,
    room_code VARCHAR(20) UNIQUE,
    address TEXT,
    detail TEXT,
    image_url VARCHAR(255),
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- สร้าง index สำหรับการค้นหา
CREATE INDEX idx_room_room_code ON room(room_code);
CREATE INDEX idx_room_room_name ON room(room_name);

-- เพิ่มข้อมูลตัวอย่าง
INSERT INTO room (room_name, room_code, address, detail, note) VALUES
('ห้องประชุมใหญ่', 'RM-001', 'ชั้น 1 อาคารหลัก', 'ห้องประชุมขนาดใหญ่สำหรับการประชุมทั่วไป', 'รองรับผู้เข้าร่วมได้ 50 คน'),
('ห้องประชุมเล็ก', 'RM-002', 'ชั้น 2 อาคารหลัก', 'ห้องประชุมขนาดเล็กสำหรับการประชุมกลุ่มย่อย', 'รองรับผู้เข้าร่วมได้ 10 คน'),
('ห้องทำงาน', 'RM-003', 'ชั้น 3 อาคารหลัก', 'ห้องทำงานสำหรับพนักงาน', 'มีโต๊ะทำงาน 5 ชุด'),
('ห้องเก็บเอกสาร', 'RM-004', 'ชั้น 1 อาคารหลัก', 'ห้องเก็บเอกสารสำคัญ', 'มีระบบรักษาความปลอดภัย'),
('ห้องพักผ่อน', 'RM-005', 'ชั้น 2 อาคารหลัก', 'ห้องพักผ่อนสำหรับพนักงาน', 'มีเครื่องดื่มและอาหารว่าง')
ON DUPLICATE KEY UPDATE room_name = VALUES(room_name);