-- Create news table
CREATE TABLE IF NOT EXISTS news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category ENUM('การบำรุงรักษา', 'อุปกรณ์ใหม่', 'กิจกรรม', 'ประกาศ') NOT NULL,
    image_url TEXT NULL,
    force_show TINYINT(1) NOT NULL DEFAULT 0,
    show_to_all TINYINT(1) NOT NULL DEFAULT 0,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data
INSERT INTO news (title, content, category, image_url, force_show, date) VALUES
('ปรับปรุงระบบครั้งใหญ่!', 'ระบบ E-borrow จะมีการปิดปรับปรุงเพื่อเพิ่มประสิทธิภาพและฟีเจอร์ใหม่ๆ ในวันที่ 30 เมษายน 2568 ตั้งแต่เวลา 00:00 ถึง 06:00 น. ขออภัยในความไม่สะดวก', 'การบำรุงรักษา', NULL, 0, '2025-04-25 00:00:00'),
('อุปกรณ์ใหม่: โดรนสำหรับการถ่ายภาพมุมสูง', 'เราได้เพิ่มโดรน DJI Mavic Air 3 เข้ามาในระบบ ท่านสามารถเริ่มยืมได้ตั้งแต่วันนี้เป็นต้นไป', 'อุปกรณ์ใหม่', NULL, 0, '2025-04-22 00:00:00'),
('อบรมการใช้งานโปรเจกเตอร์รุ่นใหม่', 'ขอเชิญผู้ที่สนใจเข้าร่วมอบรมการใช้งานโปรเจกเตอร์ Epson EB-L200SW ในวันที่ 5 พฤษภาคม 2568 เวลา 13:00 - 15:00 น. ณ ห้องประชุมใหญ่', 'กิจกรรม', NULL, 0, '2025-04-20 00:00:00'),
('ประกาศสำคัญตลอดเวลา', 'ประกาศนี้ต้องแสดงตลอดและไม่สามารถปิดได้', 'ประกาศ', NULL, 1, '2025-04-28 00:00:00');