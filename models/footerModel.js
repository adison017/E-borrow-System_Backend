import db from '../db.js';

const FooterModel = {
  // Get footer settings
  getFooterSettings: async () => {
    try {
      const [rows] = await db.query('SELECT * FROM footer_settings ORDER BY id DESC LIMIT 1');
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  },

  // Update footer settings
  updateFooterSettings: async (data) => {
    try {
      const {
        university_name,
        faculty_name,
        address,
        phone,
        email,
        website,
        facebook_url,
        line_url,
        instagram_url,
        copyright_text
      } = data;

      // Check if record exists
      const [existing] = await db.query('SELECT id FROM footer_settings LIMIT 1');
      
      if (existing.length > 0) {
        // Update existing record
        const [result] = await db.query(
          `UPDATE footer_settings SET 
           university_name = ?, faculty_name = ?, address = ?, phone = ?, 
           email = ?, website = ?, facebook_url = ?, line_url = ?, 
           instagram_url = ?, copyright_text = ?, updated_at = CURRENT_TIMESTAMP 
           WHERE id = ?`,
          [university_name, faculty_name, address, phone, email, website, 
           facebook_url, line_url, instagram_url, copyright_text, existing[0].id]
        );
        return result;
      } else {
        // Insert new record
        const [result] = await db.query(
          `INSERT INTO footer_settings 
           (university_name, faculty_name, address, phone, email, website, 
            facebook_url, line_url, instagram_url, copyright_text) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [university_name, faculty_name, address, phone, email, website, 
           facebook_url, line_url, instagram_url, copyright_text]
        );
        return result;
      }
    } catch (error) {
      throw error;
    }
  },

  // Initialize table if not exists
  initializeTable: async () => {
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS footer_settings (
          id INT AUTO_INCREMENT PRIMARY KEY,
          university_name VARCHAR(255) NOT NULL DEFAULT 'มหาวิทยาลัยมหาสารคาม',
          faculty_name VARCHAR(255) NOT NULL DEFAULT 'คณะวิทยาการสารสนเทศ',
          address TEXT,
          phone VARCHAR(50),
          email VARCHAR(100),
          website VARCHAR(255),
          facebook_url VARCHAR(255),
          line_url VARCHAR(255),
          instagram_url VARCHAR(255),
          copyright_text VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);

      // Insert default data if table is empty
      const [rows] = await db.query('SELECT COUNT(*) as count FROM footer_settings');
      if (rows[0].count === 0) {
        await db.query(`
          INSERT INTO footer_settings 
          (university_name, faculty_name, address, phone, email, website, 
           facebook_url, line_url, instagram_url, copyright_text) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          'มหาวิทยาลัยมหาสารคาม',
          'คณะวิทยาการสารสนเทศ',
          'ตำบลขามเรียง อำเภอกันทรวิชัย จังหวัดมหาสารคาม 44150',
          '+66 4375 4333',
          'equipment@msu.ac.th',
          'https://it.msu.ac.th',
          'https://facebook.com',
          'https://line.me',
          'https://www.instagram.com',
          'ระบบยืม-คืนครุภัณฑ์'
        ]);
      }
    } catch (error) {
      console.error('Error initializing footer_settings table:', error);
      throw error;
    }
  }
};

export default FooterModel;