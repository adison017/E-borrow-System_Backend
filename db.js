import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true // คืนวันที่เป็น string ตรงจาก DB
});


// Test the connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connection Successful!');
    connection.release();
  } catch (err) {
    console.error('เชื่อมต่อฐานข้อมูลล้มเหลว: ', err);
  }
};

testConnection();

export default pool;

