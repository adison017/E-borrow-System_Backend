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
  connectionLimit: 20, // Increased from 10 to 20 connections
  queueLimit: 0,
  dateStrings: true, // คืนวันที่เป็น string ตรงจาก DB
  // Correct MySQL2 configuration options
  acquireTimeout: 60000, // 60 seconds to acquire connection
  // Remove invalid options that cause warnings
  charset: 'utf8mb4_unicode_ci'
});

// Monitor pool events for debugging
if (process.env.NODE_ENV === 'development') {
  pool.on('connection', (connection) => {
    console.log(`✅ New DB connection established (ID: ${connection.threadId})`);
  });

  pool.on('acquire', (connection) => {
    console.log(`🔒 Connection ${connection.threadId} acquired`);
  });

  pool.on('release', (connection) => {
    console.log(`🔓 Connection ${connection.threadId} released`);
  });

  pool.on('enqueue', () => {
    console.log('⏳ Waiting for available connection slot');
  });
}

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