-- สร้างตาราง rooms (สำหรับห้องเก็บครุภัณฑ์)
CREATE TABLE IF NOT EXISTS rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_code VARCHAR(50) UNIQUE NOT NULL,
  room_name VARCHAR(255) NOT NULL,
  room_type ENUM('storage', 'warehouse', 'equipment_room', 'maintenance_room', 'other') NOT NULL,
  capacity INT DEFAULT 1,
  floor VARCHAR(10),
  building VARCHAR(100),
  description TEXT,
  room_image VARCHAR(255),
  room_floor_plan VARCHAR(255),
  temperature VARCHAR(50),
  humidity VARCHAR(50),
  security_level ENUM('low', 'medium', 'high') DEFAULT 'medium',
  access_control BOOLEAN DEFAULT FALSE,
  fire_safety BOOLEAN DEFAULT TRUE,
  ventilation BOOLEAN DEFAULT TRUE,
  lighting BOOLEAN DEFAULT TRUE,
  status ENUM('available', 'occupied', 'maintenance', 'reserved', 'full') DEFAULT 'available',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- สร้างตาราง room_equipment สำหรับเก็บข้อมูลครุภัณฑ์ในห้อง
CREATE TABLE IF NOT EXISTS room_equipment (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_id INT NOT NULL,
  equipment_id INT NOT NULL,
  quantity INT DEFAULT 1,
  storage_location VARCHAR(255),
  storage_condition TEXT,
  last_maintenance_date DATE,
  next_maintenance_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE,
  UNIQUE KEY unique_room_equipment (room_id, equipment_id)
);

-- สร้าง index สำหรับการค้นหา
CREATE INDEX idx_rooms_room_code ON rooms(room_code);
CREATE INDEX idx_rooms_room_type ON rooms(room_type);
CREATE INDEX idx_rooms_status ON rooms(status);
CREATE INDEX idx_rooms_is_active ON rooms(is_active);
CREATE INDEX idx_rooms_security_level ON rooms(security_level);

CREATE INDEX idx_room_equipment_room_id ON room_equipment(room_id);
CREATE INDEX idx_room_equipment_equipment_id ON room_equipment(equipment_id);
CREATE INDEX idx_room_equipment_storage_location ON room_equipment(storage_location);

-- เพิ่มข้อมูลตัวอย่าง (ห้องเก็บครุภัณฑ์)
INSERT INTO rooms (room_code, room_name, room_type, capacity, floor, building, description, temperature, humidity, security_level, access_control, fire_safety, ventilation, lighting, status) VALUES
('RM-001', 'ห้องเก็บครุภัณฑ์ทั่วไป', 'storage', 100, '1', 'อาคารหลัก', 'ห้องเก็บครุภัณฑ์ทั่วไปสำหรับอุปกรณ์สำนักงาน', '25°C', '60%', 'medium', TRUE, TRUE, TRUE, TRUE, 'available'),
('RM-002', 'ห้องเก็บอุปกรณ์อิเล็กทรอนิกส์', 'equipment_room', 50, '1', 'อาคารหลัก', 'ห้องเก็บอุปกรณ์อิเล็กทรอนิกส์ที่มีการควบคุมอุณหภูมิและความชื้น', '22°C', '45%', 'high', TRUE, TRUE, TRUE, TRUE, 'available'),
('RM-003', 'คลังวัสดุสิ้นเปลือง', 'warehouse', 200, '1', 'อาคารหลัก', 'คลังเก็บวัสดุสิ้นเปลืองและอุปกรณ์สำนักงาน', '28°C', '65%', 'medium', FALSE, TRUE, TRUE, TRUE, 'available'),
('RM-004', 'ห้องซ่อมบำรุง', 'maintenance_room', 20, '1', 'อาคารหลัก', 'ห้องสำหรับซ่อมบำรุงและตรวจสอบครุภัณฑ์', '26°C', '55%', 'medium', TRUE, TRUE, TRUE, TRUE, 'available'),
('RM-005', 'ห้องเก็บเอกสารสำคัญ', 'storage', 30, '2', 'อาคารหลัก', 'ห้องเก็บเอกสารสำคัญที่มีระบบรักษาความปลอดภัย', '24°C', '50%', 'high', TRUE, TRUE, TRUE, TRUE, 'available'),
('RM-006', 'ห้องเก็บอุปกรณ์การแพทย์', 'equipment_room', 40, '1', 'อาคารหลัก', 'ห้องเก็บอุปกรณ์การแพทย์ที่มีการควบคุมอุณหภูมิพิเศษ', '20°C', '40%', 'high', TRUE, TRUE, TRUE, TRUE, 'available')
ON DUPLICATE KEY UPDATE room_name = VALUES(room_name);