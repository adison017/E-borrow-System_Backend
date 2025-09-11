-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 11, 2025 at 11:46 AM
-- Server version: 10.4.20-MariaDB
-- PHP Version: 8.0.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db65011211033`
--

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `log_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action_type` enum('login','logout','create','update','delete','view','borrow','return','approve','reject','upload','download','permission_change','status_change','system_setting','other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `table_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `record_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `old_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`old_values`)),
  `new_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`new_values`)),
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `request_method` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `request_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status_code` int(11) DEFAULT 200,
  `response_time_ms` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `severity` enum('low','medium','high') COLLATE utf8mb4_unicode_ci DEFAULT 'low',
  `risk_level` enum('normal','suspicious','critical') COLLATE utf8mb4_unicode_ci DEFAULT 'normal',
  `session_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`location_data`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `audit_logs`
--

INSERT INTO `audit_logs` (`log_id`, `user_id`, `username`, `action_type`, `table_name`, `record_id`, `description`, `old_values`, `new_values`, `ip_address`, `user_agent`, `request_method`, `request_url`, `status_code`, `response_time_ms`, `created_at`, `severity`, `risk_level`, `session_id`, `location_data`) VALUES
(1330, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/users/login', 200, 419, '2025-09-07 22:19:45', 'low', 'normal', NULL, NULL),
(1333, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/users/login', 200, 275, '2025-09-07 22:19:56', 'low', 'normal', NULL, NULL),
(1336, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 291, '2025-09-07 22:20:22', 'low', 'normal', NULL, NULL),
(1339, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 517, '2025-09-07 22:35:32', 'low', 'normal', NULL, NULL),
(1341, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 281, '2025-09-07 22:41:19', 'low', 'normal', NULL, NULL),
(1343, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 327, '2025-09-07 22:44:45', 'low', 'normal', NULL, NULL),
(1345, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 291, '2025-09-07 22:47:03', 'low', 'normal', NULL, NULL),
(1348, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ admin เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":124,\"username\":\"admin\",\"login_time\":\"2025-09-07T23:21:28.476Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/users/login', 200, 1386, '2025-09-07 23:21:30', 'low', 'normal', NULL, NULL),
(1349, NULL, NULL, 'login', NULL, NULL, 'User admin logged in successfully', NULL, '{\"user_id\":124,\"username\":\"admin\",\"login_time\":\"2025-09-07T23:21:29.781Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/users/login', 200, 2677, '2025-09-07 23:21:30', 'low', 'normal', NULL, NULL),
(1350, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/users/login', 200, 2783, '2025-09-07 23:21:30', 'low', 'normal', NULL, NULL),
(1351, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ x เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-07T23:21:52.737Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/users/login', 200, 469, '2025-09-07 23:21:53', 'low', 'normal', NULL, NULL),
(1352, NULL, NULL, 'login', NULL, NULL, 'User x logged in successfully', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-07T23:21:52.947Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/users/login', 200, 679, '2025-09-07 23:21:53', 'low', 'normal', NULL, NULL),
(1353, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/users/login', 200, 740, '2025-09-07 23:21:53', 'low', 'normal', NULL, NULL),
(1354, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ admin เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":124,\"username\":\"admin\",\"login_time\":\"2025-09-07T23:36:26.934Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 559, '2025-09-07 23:36:27', 'low', 'normal', NULL, NULL),
(1355, NULL, NULL, 'login', NULL, NULL, 'User admin logged in successfully', NULL, '{\"user_id\":124,\"username\":\"admin\",\"login_time\":\"2025-09-07T23:36:27.130Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 753, '2025-09-07 23:36:28', 'low', 'normal', NULL, NULL),
(1356, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 822, '2025-09-07 23:36:28', 'low', 'normal', NULL, NULL),
(1357, 126, '65011211033', 'borrow', NULL, NULL, 'POST /api/borrows', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/borrows', 201, 831, '2025-09-07 23:38:21', 'low', 'normal', NULL, NULL),
(1358, 126, '65011211033', 'borrow', 'borrows', '349', 'สร้างคำขอยืมใหม่: BR-7460', NULL, '{\"borrow_id\":349,\"borrow_code\":\"BR-7460\",\"user_id\":\"126\",\"equipment_items\":\"item_id: 15, quantity: 1\",\"borrow_date\":\"2025-09-09\",\"return_date\":\"2025-09-15\",\"purpose\":\"แแอปอปแอ\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/borrows', 200, 835, '2025-09-07 23:38:21', 'low', 'normal', NULL, NULL),
(1359, 126, '65011211033', 'update', NULL, NULL, 'PUT /api/equipment/EQ-005/status', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'PUT', '/api/equipment/EQ-005/status', 200, 120, '2025-09-07 23:38:22', 'low', 'normal', NULL, NULL),
(1360, 124, 'admin', 'update', NULL, NULL, 'PUT /api/borrows/349/status', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'PUT', '/api/borrows/349/status', 200, 359, '2025-09-07 23:38:32', 'low', 'normal', NULL, NULL),
(1361, 124, 'admin', 'approve', 'borrows', '349', 'อนุมัติคำขอยืม: BR-7460 ส่งตรวจสอบ', '{\"status\":\"pending\"}', '{\"borrow_id\":\"349\",\"borrow_code\":\"BR-7460\",\"old_status\":\"pending\",\"new_status\":\"pending_approval\",\"rejection_reason\":null,\"has_signature\":false,\"has_handover_photo\":false}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'PUT', '/api/borrows/349/status', 200, 365, '2025-09-07 23:38:32', 'low', 'normal', NULL, NULL),
(1362, 125, 'x', 'update', NULL, NULL, 'PUT /api/borrows/349/status', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'PUT', '/api/borrows/349/status', 200, 937, '2025-09-07 23:52:20', 'low', 'normal', NULL, NULL),
(1363, 125, 'x', 'approve', 'borrows', '349', 'อนุมัติและส่งมอบครุภัณฑ์: BR-7460', '{\"status\":\"pending_approval\"}', '{\"borrow_id\":\"349\",\"borrow_code\":\"BR-7460\",\"old_status\":\"pending_approval\",\"new_status\":\"carry\",\"rejection_reason\":null,\"has_signature\":false,\"has_handover_photo\":false}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'PUT', '/api/borrows/349/status', 200, 1108, '2025-09-07 23:52:20', 'low', 'normal', NULL, NULL),
(1364, 124, 'admin', 'update', 'borrows', '349', 'อัปเดตสถานะการยืมเป็น: approved', '{\"status\":\"carry\"}', '{\"borrow_id\":\"349\",\"borrow_code\":\"BR-7460\",\"old_status\":\"carry\",\"new_status\":\"approved\",\"rejection_reason\":null,\"has_signature\":true,\"has_handover_photo\":true}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'PUT', '/api/borrows/349/status', 200, 5225, '2025-09-07 23:52:48', 'low', 'normal', NULL, NULL),
(1365, 124, 'admin', 'update', NULL, NULL, 'PUT /api/borrows/349/status', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'PUT', '/api/borrows/349/status', 200, 5224, '2025-09-07 23:52:48', 'low', 'normal', NULL, NULL),
(1366, 124, 'admin', 'return', 'returns', '266', 'บันทึกการคืนครุภัณฑ์: BR-5210', NULL, '{\"borrow_id\":348,\"borrow_code\":\"BR-5210\",\"return_id\":266,\"return_date\":\"2025-09-08 06:52:55\",\"fine_amount\":0,\"damage_fine\":0,\"late_fine\":0,\"late_days\":0,\"status\":\"completed\",\"payment_method\":\"cash\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/returns', 200, 515, '2025-09-07 23:52:57', 'low', 'normal', NULL, NULL),
(1367, 124, 'admin', 'return', 'returns', '267', 'บันทึกการคืนครุภัณฑ์: BR-7460', NULL, '{\"borrow_id\":349,\"borrow_code\":\"BR-7460\",\"return_id\":267,\"return_date\":\"2025-09-08 06:53:05\",\"fine_amount\":0,\"damage_fine\":0,\"late_fine\":0,\"late_days\":0,\"status\":\"completed\",\"payment_method\":\"cash\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/returns', 200, 571, '2025-09-07 23:53:06', 'low', 'normal', NULL, NULL),
(1368, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ 65011211033 เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":126,\"username\":\"65011211033\",\"login_time\":\"2025-09-07T23:55:30.492Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 448, '2025-09-07 23:55:31', 'low', 'normal', NULL, NULL),
(1369, NULL, NULL, 'login', NULL, NULL, 'User 65011211033 logged in successfully', NULL, '{\"user_id\":126,\"username\":\"65011211033\",\"login_time\":\"2025-09-07T23:55:30.694Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 648, '2025-09-07 23:55:31', 'low', 'normal', NULL, NULL),
(1370, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 693, '2025-09-07 23:55:31', 'low', 'normal', NULL, NULL),
(1371, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ x เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-08T00:24:19.833Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/users/login', 200, 1272, '2025-09-08 00:24:20', 'low', 'normal', NULL, NULL),
(1372, NULL, NULL, 'login', NULL, NULL, 'User x logged in successfully', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-08T00:24:22.348Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/users/login', 200, 3784, '2025-09-08 00:24:23', 'low', 'normal', NULL, NULL),
(1373, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/users/login', 200, 4404, '2025-09-08 00:24:24', 'low', 'normal', NULL, NULL),
(1374, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ x เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-08T01:24:38.326Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/users/login', 200, 252, '2025-09-08 01:24:39', 'low', 'normal', NULL, NULL),
(1375, NULL, NULL, 'login', NULL, NULL, 'User x logged in successfully', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-08T01:24:38.496Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/users/login', 200, 422, '2025-09-08 01:24:39', 'low', 'normal', NULL, NULL),
(1376, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/users/login', 200, 547, '2025-09-08 01:24:39', 'low', 'normal', NULL, NULL),
(1377, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ x เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-08T01:29:46.700Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 159, '2025-09-08 01:29:47', 'low', 'normal', NULL, NULL),
(1378, NULL, NULL, 'login', NULL, NULL, 'User x logged in successfully', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-08T01:29:46.776Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 235, '2025-09-08 01:29:47', 'low', 'normal', NULL, NULL),
(1379, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 297, '2025-09-08 01:29:47', 'low', 'normal', NULL, NULL),
(1380, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ x เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-08T11:14:47.709Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 202, '2025-09-08 11:14:47', 'low', 'normal', NULL, NULL),
(1381, NULL, NULL, 'login', NULL, NULL, 'User x logged in successfully', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-08T11:14:47.793Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 285, '2025-09-08 11:14:47', 'low', 'normal', NULL, NULL),
(1382, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 313, '2025-09-08 11:14:47', 'low', 'normal', NULL, NULL),
(1383, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ x เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-08T11:19:50.885Z\"}', '10.210.14.0', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 430, '2025-09-08 11:19:50', 'low', 'normal', NULL, NULL),
(1384, NULL, NULL, 'login', NULL, NULL, 'User x logged in successfully', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-08T11:19:51.028Z\"}', '10.210.14.0', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 573, '2025-09-08 11:19:51', 'low', 'normal', NULL, NULL),
(1385, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '10.210.14.0', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 612, '2025-09-08 11:19:51', 'low', 'normal', NULL, NULL),
(1386, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ x เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-08T11:21:01.028Z\"}', '10.210.49.237', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 349, '2025-09-08 11:21:01', 'low', 'normal', NULL, NULL),
(1387, NULL, NULL, 'login', NULL, NULL, 'User x logged in successfully', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-08T11:21:01.067Z\"}', '10.210.49.237', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 388, '2025-09-08 11:21:01', 'low', 'normal', NULL, NULL),
(1388, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '10.210.49.237', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 441, '2025-09-08 11:21:01', 'low', 'normal', NULL, NULL),
(1389, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ x เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-08T11:22:11.333Z\"}', '10.210.49.237', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 293, '2025-09-08 11:22:11', 'low', 'normal', NULL, NULL),
(1390, NULL, NULL, 'login', NULL, NULL, 'User x logged in successfully', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-08T11:22:11.420Z\"}', '10.210.49.237', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 380, '2025-09-08 11:22:11', 'low', 'normal', NULL, NULL),
(1391, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '10.210.49.237', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 419, '2025-09-08 11:22:11', 'low', 'normal', NULL, NULL),
(1392, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ x เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-08T11:32:23.431Z\"}', '10.210.51.23', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 339, '2025-09-08 11:32:23', 'low', 'normal', NULL, NULL),
(1393, NULL, NULL, 'login', NULL, NULL, 'User x logged in successfully', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-08T11:32:23.520Z\"}', '10.210.51.23', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 428, '2025-09-08 11:32:23', 'low', 'normal', NULL, NULL),
(1394, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '10.210.51.23', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 465, '2025-09-08 11:32:23', 'low', 'normal', NULL, NULL),
(1395, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ x เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-08T12:04:15.382Z\"}', '10.210.51.23', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 418, '2025-09-08 12:04:15', 'low', 'normal', NULL, NULL),
(1396, NULL, NULL, 'login', NULL, NULL, 'User x logged in successfully', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-08T12:04:15.479Z\"}', '10.210.51.23', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 515, '2025-09-08 12:04:15', 'low', 'normal', NULL, NULL),
(1397, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '10.210.51.23', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 554, '2025-09-08 12:04:15', 'low', 'normal', NULL, NULL),
(1398, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ 65011211033 เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":126,\"username\":\"65011211033\",\"login_time\":\"2025-09-08T12:14:08.230Z\"}', '10.210.14.0', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/users/login', 200, 354, '2025-09-08 12:14:08', 'low', 'normal', NULL, NULL),
(1399, NULL, NULL, 'login', NULL, NULL, 'User 65011211033 logged in successfully', NULL, '{\"user_id\":126,\"username\":\"65011211033\",\"login_time\":\"2025-09-08T12:14:08.419Z\"}', '10.210.14.0', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/users/login', 200, 543, '2025-09-08 12:14:08', 'low', 'normal', NULL, NULL),
(1400, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '10.210.14.0', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/users/login', 200, 583, '2025-09-08 12:14:08', 'low', 'normal', NULL, NULL),
(1401, 126, '65011211033', 'borrow', 'borrows', '350', 'สร้างคำขอยืมใหม่: BR-8748', NULL, '{\"borrow_id\":350,\"borrow_code\":\"BR-8748\",\"user_id\":\"126\",\"equipment_items\":\"item_id: 3, quantity: 1\",\"borrow_date\":\"2025-09-09\",\"return_date\":\"2025-09-16\",\"purpose\":\"ฟหก\"}', '10.210.49.237', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/borrows', 200, 161, '2025-09-08 12:14:18', 'low', 'normal', NULL, NULL),
(1402, 126, '65011211033', 'borrow', NULL, NULL, 'POST /api/borrows', NULL, NULL, '10.210.49.237', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/borrows', 201, 160, '2025-09-08 12:14:18', 'low', 'normal', NULL, NULL),
(1403, 126, '65011211033', 'update', NULL, NULL, 'PUT /api/equipment/EQ-002/status', NULL, NULL, '10.210.14.0', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'PUT', '/api/equipment/EQ-002/status', 200, 74, '2025-09-08 12:14:19', 'low', 'normal', NULL, NULL),
(1404, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ admin เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":124,\"username\":\"admin\",\"login_time\":\"2025-09-08T12:14:27.029Z\"}', '10.210.49.237', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/users/login', 200, 336, '2025-09-08 12:14:27', 'low', 'normal', NULL, NULL),
(1405, NULL, NULL, 'login', NULL, NULL, 'User admin logged in successfully', NULL, '{\"user_id\":124,\"username\":\"admin\",\"login_time\":\"2025-09-08T12:14:27.116Z\"}', '10.210.49.237', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/users/login', 200, 423, '2025-09-08 12:14:27', 'low', 'normal', NULL, NULL),
(1406, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '10.210.49.237', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/users/login', 200, 462, '2025-09-08 12:14:27', 'low', 'normal', NULL, NULL),
(1407, 124, 'admin', 'update', NULL, NULL, 'PUT /api/borrows/350/status', NULL, NULL, '10.210.51.23', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'PUT', '/api/borrows/350/status', 200, 200, '2025-09-08 12:14:35', 'low', 'normal', NULL, NULL),
(1408, 124, 'admin', 'approve', 'borrows', '350', 'อนุมัติคำขอยืม: BR-8748 ส่งตรวจสอบ', '{\"status\":\"pending\"}', '{\"borrow_id\":\"350\",\"borrow_code\":\"BR-8748\",\"old_status\":\"pending\",\"new_status\":\"pending_approval\",\"rejection_reason\":null,\"has_signature\":false,\"has_handover_photo\":false}', '10.210.51.23', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'PUT', '/api/borrows/350/status', 200, 200, '2025-09-08 12:14:35', 'low', 'normal', NULL, NULL),
(1409, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ x เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-08T12:14:51.219Z\"}', '10.210.27.189', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 352, '2025-09-08 12:14:51', 'low', 'normal', NULL, NULL),
(1410, NULL, NULL, 'login', NULL, NULL, 'User x logged in successfully', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-08T12:14:51.259Z\"}', '10.210.27.189', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 392, '2025-09-08 12:14:51', 'low', 'normal', NULL, NULL),
(1411, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '10.210.27.189', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 432, '2025-09-08 12:14:51', 'low', 'normal', NULL, NULL),
(1412, 125, 'x', 'update', NULL, NULL, 'PUT /api/borrows/350/status', NULL, NULL, '10.210.14.0', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'PUT', '/api/borrows/350/status', 200, 200, '2025-09-08 12:15:01', 'low', 'normal', NULL, NULL),
(1413, 125, 'x', 'approve', 'borrows', '350', 'อนุมัติและส่งมอบครุภัณฑ์: BR-8748', '{\"status\":\"pending_approval\"}', '{\"borrow_id\":\"350\",\"borrow_code\":\"BR-8748\",\"old_status\":\"pending_approval\",\"new_status\":\"carry\",\"rejection_reason\":null,\"has_signature\":false,\"has_handover_photo\":false}', '10.210.14.0', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'PUT', '/api/borrows/350/status', 200, 201, '2025-09-08 12:15:01', 'low', 'normal', NULL, NULL),
(1414, 124, 'admin', 'update', NULL, NULL, 'PUT /api/borrows/350/status', NULL, NULL, '10.210.49.237', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'PUT', '/api/borrows/350/status', 200, 2401, '2025-09-08 12:15:54', 'low', 'normal', NULL, NULL),
(1415, 124, 'admin', 'update', 'borrows', '350', 'อัปเดตสถานะการยืมเป็น: approved', '{\"status\":\"carry\"}', '{\"borrow_id\":\"350\",\"borrow_code\":\"BR-8748\",\"old_status\":\"carry\",\"new_status\":\"approved\",\"rejection_reason\":null,\"has_signature\":true,\"has_handover_photo\":true}', '10.210.49.237', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'PUT', '/api/borrows/350/status', 200, 2401, '2025-09-08 12:15:54', 'low', 'normal', NULL, NULL),
(1416, 124, 'admin', 'return', 'returns', '268', 'บันทึกการคืนครุภัณฑ์: BR-8748', NULL, '{\"borrow_id\":350,\"borrow_code\":\"BR-8748\",\"return_id\":268,\"return_date\":\"2025-09-08 19:16:24\",\"fine_amount\":0,\"damage_fine\":0,\"late_fine\":0,\"late_days\":0,\"status\":\"completed\",\"payment_method\":\"cash\"}', '10.210.51.23', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/returns', 200, 506, '2025-09-08 12:16:25', 'low', 'normal', NULL, NULL),
(1417, 124, 'admin', 'update', 'equipment', '3610-013-0001 ', 'แก้ไขครุภัณฑ์: ขาตั้งกล้อง (3610-013-0001 )', '{\"item_code\":\"EQ-0010\",\"name\":\"ขาตั้งกล้อง\",\"category\":\"ครุภัณฑ์คอมพิวเตอร์และอุปกรณ์ต่อพ่วง\",\"quantity\":\"1\",\"status\":\"พร้อมใช้งาน\",\"price\":\"1500\",\"room_id\":2}', '{\"item_code\":\"3610-013-0001 \",\"name\":\"ขาตั้งกล้อง\",\"category\":\"ครุภัณฑ์คอมพิวเตอร์และอุปกรณ์ต่อพ่วง\",\"quantity\":\"1\",\"status\":\"พร้อมใช้งาน\",\"price\":\"1500\",\"room_id\":2}', '10.210.14.0', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'PUT', '/api/equipment/14', 200, 121, '2025-09-08 12:17:07', 'low', 'normal', NULL, NULL),
(1418, 124, 'admin', 'update', NULL, NULL, 'PUT /api/equipment/14', NULL, NULL, '10.210.14.0', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'PUT', '/api/equipment/14', 200, 161, '2025-09-08 12:17:07', 'low', 'normal', NULL, NULL),
(1419, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ 65011211033 เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":126,\"username\":\"65011211033\",\"login_time\":\"2025-09-08T12:17:26.780Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 266, '2025-09-08 12:17:26', 'low', 'normal', NULL, NULL),
(1420, NULL, NULL, 'login', NULL, NULL, 'User 65011211033 logged in successfully', NULL, '{\"user_id\":126,\"username\":\"65011211033\",\"login_time\":\"2025-09-08T12:17:26.863Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 348, '2025-09-08 12:17:26', 'low', 'normal', NULL, NULL),
(1421, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 375, '2025-09-08 12:17:26', 'low', 'normal', NULL, NULL),
(1422, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ x เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-09T04:04:36.279Z\"}', '10.210.27.189', 'Mozilla/5.0 (Linux; Android 15; 24095PCADG Build/AP3A.240905.015.A2; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/139.0.7258.158 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/523.0.0.53.109;]', 'POST', '/api/users/login', 200, 488, '2025-09-09 04:04:36', 'low', 'normal', NULL, NULL),
(1423, NULL, NULL, 'login', NULL, NULL, 'User x logged in successfully', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-09T04:04:36.368Z\"}', '10.210.27.189', 'Mozilla/5.0 (Linux; Android 15; 24095PCADG Build/AP3A.240905.015.A2; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/139.0.7258.158 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/523.0.0.53.109;]', 'POST', '/api/users/login', 200, 577, '2025-09-09 04:04:36', 'low', 'normal', NULL, NULL),
(1424, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '10.210.27.189', 'Mozilla/5.0 (Linux; Android 15; 24095PCADG Build/AP3A.240905.015.A2; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/139.0.7258.158 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/523.0.0.53.109;]', 'POST', '/api/users/login', 200, 619, '2025-09-09 04:04:36', 'low', 'normal', NULL, NULL),
(1425, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '10.210.51.23', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36', 'POST', '/api/users/login', 500, 2, '2025-09-09 04:16:09', 'low', 'normal', NULL, NULL),
(1426, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ x เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-09T04:16:15.630Z\"}', '10.210.27.189', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36', 'POST', '/api/users/login', 200, 349, '2025-09-09 04:16:15', 'low', 'normal', NULL, NULL),
(1427, NULL, NULL, 'login', NULL, NULL, 'User x logged in successfully', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-09T04:16:15.715Z\"}', '10.210.27.189', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36', 'POST', '/api/users/login', 200, 434, '2025-09-09 04:16:15', 'low', 'normal', NULL, NULL),
(1428, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '10.210.27.189', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36', 'POST', '/api/users/login', 200, 474, '2025-09-09 04:16:15', 'low', 'normal', NULL, NULL),
(1429, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ x เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-11T04:36:09.324Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 102, '2025-09-11 04:36:11', 'low', 'normal', NULL, NULL),
(1430, NULL, NULL, 'login', NULL, NULL, 'User x logged in successfully', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-11T04:36:09.395Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 173, '2025-09-11 04:36:11', 'low', 'normal', NULL, NULL),
(1431, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 205, '2025-09-11 04:36:11', 'low', 'normal', NULL, NULL),
(1432, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ admin เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":124,\"username\":\"admin\",\"login_time\":\"2025-09-11T04:48:52.396Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 97, '2025-09-11 04:48:54', 'low', 'normal', NULL, NULL),
(1433, NULL, NULL, 'login', NULL, NULL, 'User admin logged in successfully', NULL, '{\"user_id\":124,\"username\":\"admin\",\"login_time\":\"2025-09-11T04:48:52.473Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 174, '2025-09-11 04:48:54', 'low', 'normal', NULL, NULL),
(1434, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 209, '2025-09-11 04:48:54', 'low', 'normal', NULL, NULL),
(1435, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ x เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-11T04:49:10.681Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 90, '2025-09-11 04:49:12', 'low', 'normal', NULL, NULL),
(1436, NULL, NULL, 'login', NULL, NULL, 'User x logged in successfully', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-11T04:49:10.740Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 150, '2025-09-11 04:49:12', 'low', 'normal', NULL, NULL),
(1437, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 182, '2025-09-11 04:49:12', 'low', 'normal', NULL, NULL),
(1438, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ x เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-11T05:51:27.315Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 92, '2025-09-11 05:51:28', 'low', 'normal', NULL, NULL),
(1439, NULL, NULL, 'login', NULL, NULL, 'User x logged in successfully', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-11T05:51:27.375Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 152, '2025-09-11 05:51:29', 'low', 'normal', NULL, NULL),
(1440, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 182, '2025-09-11 05:51:29', 'low', 'normal', NULL, NULL),
(1441, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ x เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-11T06:51:29.893Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 113, '2025-09-11 06:51:31', 'low', 'normal', NULL, NULL),
(1442, NULL, NULL, 'login', NULL, NULL, 'User x logged in successfully', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-11T06:51:29.995Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 215, '2025-09-11 06:51:31', 'low', 'normal', NULL, NULL),
(1443, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 264, '2025-09-11 06:51:31', 'low', 'normal', NULL, NULL),
(1444, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ x เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-11T06:57:49.829Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 101, '2025-09-11 06:57:51', 'low', 'normal', NULL, NULL),
(1445, NULL, NULL, 'login', NULL, NULL, 'User x logged in successfully', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-11T06:57:49.864Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 136, '2025-09-11 06:57:51', 'low', 'normal', NULL, NULL),
(1446, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 170, '2025-09-11 06:57:51', 'low', 'normal', NULL, NULL),
(1447, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ admin เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":124,\"username\":\"admin\",\"login_time\":\"2025-09-11T06:57:55.938Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 92, '2025-09-11 06:57:57', 'low', 'normal', NULL, NULL),
(1448, NULL, NULL, 'login', NULL, NULL, 'User admin logged in successfully', NULL, '{\"user_id\":124,\"username\":\"admin\",\"login_time\":\"2025-09-11T06:57:56.011Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 165, '2025-09-11 06:57:57', 'low', 'normal', NULL, NULL),
(1449, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 202, '2025-09-11 06:57:57', 'low', 'normal', NULL, NULL),
(1450, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ x เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-11T06:58:21.454Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 92, '2025-09-11 06:58:23', 'low', 'normal', NULL, NULL),
(1451, NULL, NULL, 'login', NULL, NULL, 'User x logged in successfully', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-11T06:58:21.520Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 158, '2025-09-11 06:58:23', 'low', 'normal', NULL, NULL),
(1452, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 193, '2025-09-11 06:58:23', 'low', 'normal', NULL, NULL),
(1453, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ x เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-11T07:04:54.093Z\"}', '10.210.148.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36', 'POST', '/api/users/login', 200, 586, '2025-09-11 07:04:54', 'low', 'normal', NULL, NULL),
(1454, NULL, NULL, 'login', NULL, NULL, 'User x logged in successfully', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-11T07:04:54.222Z\"}', '10.210.148.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36', 'POST', '/api/users/login', 200, 715, '2025-09-11 07:04:54', 'low', 'normal', NULL, NULL),
(1455, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '10.210.148.56', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36', 'POST', '/api/users/login', 200, 775, '2025-09-11 07:04:54', 'low', 'normal', NULL, NULL),
(1456, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ admin เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":124,\"username\":\"admin\",\"login_time\":\"2025-09-11T07:07:56.188Z\"}', '10.210.197.54', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36', 'POST', '/api/users/login', 200, 349, '2025-09-11 07:07:56', 'low', 'normal', NULL, NULL),
(1457, NULL, NULL, 'login', NULL, NULL, 'User admin logged in successfully', NULL, '{\"user_id\":124,\"username\":\"admin\",\"login_time\":\"2025-09-11T07:07:56.316Z\"}', '10.210.197.54', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36', 'POST', '/api/users/login', 200, 477, '2025-09-11 07:07:56', 'low', 'normal', NULL, NULL),
(1458, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '10.210.197.54', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36', 'POST', '/api/users/login', 200, 523, '2025-09-11 07:07:56', 'low', 'normal', NULL, NULL),
(1459, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ 65011211033 เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":126,\"username\":\"65011211033\",\"login_time\":\"2025-09-11T07:08:41.287Z\"}', '10.210.49.73', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36', 'POST', '/api/users/login', 200, 324, '2025-09-11 07:08:41', 'low', 'normal', NULL, NULL),
(1460, NULL, NULL, 'login', NULL, NULL, 'User 65011211033 logged in successfully', NULL, '{\"user_id\":126,\"username\":\"65011211033\",\"login_time\":\"2025-09-11T07:08:41.380Z\"}', '10.210.49.73', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36', 'POST', '/api/users/login', 200, 417, '2025-09-11 07:08:41', 'low', 'normal', NULL, NULL),
(1461, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '10.210.49.73', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36', 'POST', '/api/users/login', 200, 464, '2025-09-11 07:08:41', 'low', 'normal', NULL, NULL),
(1462, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ x เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-11T07:28:59.347Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 95, '2025-09-11 07:29:00', 'low', 'normal', NULL, NULL),
(1463, NULL, NULL, 'login', NULL, NULL, 'User x logged in successfully', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-11T07:28:59.430Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 178, '2025-09-11 07:29:00', 'low', 'normal', NULL, NULL),
(1464, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 220, '2025-09-11 07:29:00', 'low', 'normal', NULL, NULL),
(1465, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ x เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-11T07:29:39.398Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 109, '2025-09-11 07:29:40', 'low', 'normal', NULL, NULL),
(1466, NULL, NULL, 'login', NULL, NULL, 'User x logged in successfully', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-11T07:29:39.456Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 167, '2025-09-11 07:29:40', 'low', 'normal', NULL, NULL),
(1467, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 208, '2025-09-11 07:29:41', 'low', 'normal', NULL, NULL),
(1468, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ admin เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":124,\"username\":\"admin\",\"login_time\":\"2025-09-11T07:32:21.588Z\"}', '10.210.132.240', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/users/login', 200, 469, '2025-09-11 07:32:21', 'low', 'normal', NULL, NULL),
(1469, NULL, NULL, 'login', NULL, NULL, 'User admin logged in successfully', NULL, '{\"user_id\":124,\"username\":\"admin\",\"login_time\":\"2025-09-11T07:32:21.667Z\"}', '10.210.132.240', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/users/login', 200, 548, '2025-09-11 07:32:21', 'low', 'normal', NULL, NULL),
(1470, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '10.210.132.240', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/users/login', 200, 595, '2025-09-11 07:32:21', 'low', 'normal', NULL, NULL),
(1471, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ admin เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":124,\"username\":\"admin\",\"login_time\":\"2025-09-11T07:35:12.777Z\"}', '10.210.132.240', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 424, '2025-09-11 07:35:12', 'low', 'normal', NULL, NULL),
(1472, NULL, NULL, 'login', NULL, NULL, 'User admin logged in successfully', NULL, '{\"user_id\":124,\"username\":\"admin\",\"login_time\":\"2025-09-11T07:35:12.857Z\"}', '10.210.132.240', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 504, '2025-09-11 07:35:12', 'low', 'normal', NULL, NULL),
(1473, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '10.210.132.240', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 562, '2025-09-11 07:35:12', 'low', 'normal', NULL, NULL),
(1474, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ admin เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":124,\"username\":\"admin\",\"login_time\":\"2025-09-11T07:35:20.191Z\"}', '10.210.132.240', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 305, '2025-09-11 07:35:20', 'low', 'normal', NULL, NULL),
(1475, NULL, NULL, 'login', NULL, NULL, 'User admin logged in successfully', NULL, '{\"user_id\":124,\"username\":\"admin\",\"login_time\":\"2025-09-11T07:35:20.281Z\"}', '10.210.132.240', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 395, '2025-09-11 07:35:20', 'low', 'normal', NULL, NULL);
INSERT INTO `audit_logs` (`log_id`, `user_id`, `username`, `action_type`, `table_name`, `record_id`, `description`, `old_values`, `new_values`, `ip_address`, `user_agent`, `request_method`, `request_url`, `status_code`, `response_time_ms`, `created_at`, `severity`, `risk_level`, `session_id`, `location_data`) VALUES
(1476, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '10.210.132.240', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 433, '2025-09-11 07:35:20', 'low', 'normal', NULL, NULL),
(1477, NULL, NULL, 'login', NULL, NULL, 'พยายามเข้าสู่ระบบล้มเหลว - รหัสผ่านไม่ถูกต้อง: 65011211022', NULL, '{\"username\":\"65011211022\",\"user_id\":119,\"reason\":\"incorrect_password\",\"attempt_time\":\"2025-09-11T07:36:34.486Z\"}', '10.210.49.73', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/users/login', 200, 348, '2025-09-11 07:36:34', 'low', 'normal', NULL, NULL),
(1478, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '10.210.49.73', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/users/login', 401, 387, '2025-09-11 07:36:34', 'low', 'normal', NULL, NULL),
(1479, NULL, NULL, 'login', NULL, NULL, 'พยายามเข้าสู่ระบบล้มเหลว - รหัสผ่านไม่ถูกต้อง: 65011211022', NULL, '{\"username\":\"65011211022\",\"user_id\":119,\"reason\":\"incorrect_password\",\"attempt_time\":\"2025-09-11T07:36:35.589Z\"}', '10.210.49.73', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/users/login', 200, 363, '2025-09-11 07:36:35', 'low', 'normal', NULL, NULL),
(1480, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '10.210.49.73', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/users/login', 401, 436, '2025-09-11 07:36:35', 'low', 'normal', NULL, NULL),
(1481, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ 65011211022 เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":119,\"username\":\"65011211022\",\"login_time\":\"2025-09-11T07:36:39.876Z\"}', '10.210.49.73', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/users/login', 200, 426, '2025-09-11 07:36:39', 'low', 'normal', NULL, NULL),
(1482, NULL, NULL, 'login', NULL, NULL, 'User 65011211022 logged in successfully', NULL, '{\"user_id\":119,\"username\":\"65011211022\",\"login_time\":\"2025-09-11T07:36:39.943Z\"}', '10.210.49.73', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/users/login', 200, 493, '2025-09-11 07:36:39', 'low', 'normal', NULL, NULL),
(1483, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '10.210.49.73', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/users/login', 200, 555, '2025-09-11 07:36:40', 'low', 'normal', NULL, NULL),
(1484, 119, '65011211022', 'borrow', 'borrows', '351', 'สร้างคำขอยืมใหม่: BR-5018', NULL, '{\"borrow_id\":351,\"borrow_code\":\"BR-5018\",\"user_id\":\"119\",\"equipment_items\":\"item_id: 4, quantity: 1\",\"borrow_date\":\"2025-09-12\",\"return_date\":\"2025-09-19\",\"purpose\":\"asfdasf\"}', '10.210.148.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/borrows', 200, 162, '2025-09-11 07:36:55', 'low', 'normal', NULL, NULL),
(1485, 119, '65011211022', 'borrow', NULL, NULL, 'POST /api/borrows', NULL, NULL, '10.210.148.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/borrows', 201, 161, '2025-09-11 07:36:55', 'low', 'normal', NULL, NULL),
(1486, 119, '65011211022', 'update', NULL, NULL, 'PUT /api/equipment/EQ-003/status', NULL, NULL, '10.210.49.73', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'PUT', '/api/equipment/EQ-003/status', 200, 82, '2025-09-11 07:36:56', 'low', 'normal', NULL, NULL),
(1487, 124, 'admin', 'approve', 'borrows', '351', 'อนุมัติคำขอยืม: BR-5018 ส่งตรวจสอบ', '{\"status\":\"pending\"}', '{\"borrow_id\":\"351\",\"borrow_code\":\"BR-5018\",\"old_status\":\"pending\",\"new_status\":\"pending_approval\",\"rejection_reason\":null,\"has_signature\":false,\"has_handover_photo\":false}', '10.210.132.240', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'PUT', '/api/borrows/351/status', 200, 197, '2025-09-11 07:37:01', 'low', 'normal', NULL, NULL),
(1488, 124, 'admin', 'update', NULL, NULL, 'PUT /api/borrows/351/status', NULL, NULL, '10.210.132.240', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'PUT', '/api/borrows/351/status', 200, 197, '2025-09-11 07:37:01', 'low', 'normal', NULL, NULL),
(1489, 125, 'x', 'approve', 'borrows', '351', 'อนุมัติและส่งมอบครุภัณฑ์: BR-5018', '{\"status\":\"pending_approval\"}', '{\"borrow_id\":\"351\",\"borrow_code\":\"BR-5018\",\"old_status\":\"pending_approval\",\"new_status\":\"carry\",\"rejection_reason\":null,\"has_signature\":false,\"has_handover_photo\":false}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'PUT', '/api/borrows/351/status', 200, 185, '2025-09-11 07:37:06', 'low', 'normal', NULL, NULL),
(1490, 125, 'x', 'update', NULL, NULL, 'PUT /api/borrows/351/status', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'PUT', '/api/borrows/351/status', 200, 185, '2025-09-11 07:37:06', 'low', 'normal', NULL, NULL),
(1491, 124, 'admin', 'update', 'borrows', '351', 'อัปเดตสถานะการยืมเป็น: approved', '{\"status\":\"carry\"}', '{\"borrow_id\":\"351\",\"borrow_code\":\"BR-5018\",\"old_status\":\"carry\",\"new_status\":\"approved\",\"rejection_reason\":null,\"has_signature\":true,\"has_handover_photo\":true}', '10.210.132.240', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'PUT', '/api/borrows/351/status', 200, 2703, '2025-09-11 07:37:17', 'low', 'normal', NULL, NULL),
(1492, 124, 'admin', 'update', NULL, NULL, 'PUT /api/borrows/351/status', NULL, NULL, '10.210.132.240', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'PUT', '/api/borrows/351/status', 200, 2702, '2025-09-11 07:37:17', 'low', 'normal', NULL, NULL),
(1493, 124, 'admin', 'return', 'returns', '269', 'บันทึกการคืนครุภัณฑ์: BR-5018', NULL, '{\"borrow_id\":351,\"borrow_code\":\"BR-5018\",\"return_id\":269,\"return_date\":\"2025-09-11 14:37:23\",\"fine_amount\":1500,\"damage_fine\":1500,\"late_fine\":0,\"late_days\":0,\"status\":\"waiting_payment\",\"payment_method\":\"online\"}', '10.210.49.73', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/returns', 200, 407, '2025-09-11 07:37:25', 'low', 'normal', NULL, NULL),
(1494, 124, 'admin', 'approve', NULL, NULL, 'อนุมัติสลิปการชำระเงิน: BR-5018', NULL, '{\"borrow_id\":351,\"borrow_code\":\"BR-5018\",\"return_id\":\"269\",\"action\":\"slip_approved\"}', '10.210.132.240', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/returns/269/admin-approve-slip', 200, 577, '2025-09-11 07:39:02', 'low', 'normal', NULL, NULL),
(1495, 124, 'admin', 'update', 'equipment', 'EQ-002', 'แก้ไขครุภัณฑ์: MSI notebool (EQ-002)', '{\"item_code\":\"EQ-002\",\"name\":\"MSI notebool\",\"category\":\"ครุภัณฑ์คอมพิวเตอร์และอุปกรณ์ต่อพ่วง\",\"quantity\":\"1\",\"status\":\"พร้อมใช้งาน\",\"price\":\"30000\",\"room_id\":12}', '{\"item_code\":\"EQ-002\",\"name\":\"MSI notebool\",\"category\":\"ครุภัณฑ์คอมพิวเตอร์และอุปกรณ์ต่อพ่วง\",\"quantity\":\"1\",\"status\":\"ชำรุด\",\"price\":\"30000\",\"room_id\":12}', '10.210.148.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'PUT', '/api/equipment/3', 200, 119, '2025-09-11 07:39:53', 'low', 'normal', NULL, NULL),
(1496, 124, 'admin', 'update', NULL, NULL, 'PUT /api/equipment/3', NULL, NULL, '10.210.148.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'PUT', '/api/equipment/3', 200, 158, '2025-09-11 07:39:53', 'low', 'normal', NULL, NULL),
(1497, 124, 'admin', 'update', NULL, NULL, 'PUT /api/equipment/EQ-002/status', NULL, NULL, '10.210.49.73', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'PUT', '/api/equipment/EQ-002/status', 200, 78, '2025-09-11 07:39:59', 'low', 'normal', NULL, NULL),
(1498, 124, 'admin', 'update', 'equipment', 'EQ-002', 'แก้ไขครุภัณฑ์: MSI notebool (EQ-002)', '{\"item_code\":\"EQ-002\",\"name\":\"MSI notebool\",\"category\":\"ครุภัณฑ์คอมพิวเตอร์และอุปกรณ์ต่อพ่วง\",\"quantity\":\"1\",\"status\":\"รออนุมัติซ่อม\",\"price\":\"30000\",\"room_id\":12}', '{\"item_code\":\"EQ-002\",\"name\":\"MSI notebool\",\"category\":\"ครุภัณฑ์คอมพิวเตอร์และอุปกรณ์ต่อพ่วง\",\"quantity\":\"1\",\"status\":\"รออนุมัติซ่อม\",\"price\":\"30000\",\"room_id\":12}', '10.210.148.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'PUT', '/api/equipment/3', 200, 113, '2025-09-11 07:40:00', 'low', 'normal', NULL, NULL),
(1499, 124, 'admin', 'update', NULL, NULL, 'PUT /api/equipment/3', NULL, NULL, '10.210.148.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'PUT', '/api/equipment/3', 200, 156, '2025-09-11 07:40:00', 'low', 'normal', NULL, NULL),
(1500, 125, 'x', 'update', NULL, NULL, 'PUT /api/equipment/EQ-002/status', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'PUT', '/api/equipment/EQ-002/status', 200, 88, '2025-09-11 07:40:13', 'low', 'normal', NULL, NULL),
(1501, 124, 'admin', 'update', 'equipment', '3610-013-0001 ', 'แก้ไขครุภัณฑ์: ขาตั้งกล้อง (3610-013-0001 )', '{\"item_code\":\"3610-013-0001 \",\"name\":\"ขาตั้งกล้อง\",\"category\":\"ครุภัณฑ์คอมพิวเตอร์และอุปกรณ์ต่อพ่วง\",\"quantity\":\"1\",\"status\":\"พร้อมใช้งาน\",\"price\":\"1500\",\"room_id\":2}', '{\"item_code\":\"3610-013-0001 \",\"name\":\"ขาตั้งกล้อง\",\"category\":\"ครุภัณฑ์คอมพิวเตอร์และอุปกรณ์ต่อพ่วง\",\"quantity\":\"1\",\"status\":\"ชำรุด\",\"price\":\"1500\",\"room_id\":2}', '10.210.49.73', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'PUT', '/api/equipment/14', 200, 125, '2025-09-11 07:41:49', 'low', 'normal', NULL, NULL),
(1502, 124, 'admin', 'update', NULL, NULL, 'PUT /api/equipment/14', NULL, NULL, '10.210.49.73', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'PUT', '/api/equipment/14', 200, 164, '2025-09-11 07:41:49', 'low', 'normal', NULL, NULL),
(1503, 124, 'admin', 'update', NULL, NULL, 'PUT /api/equipment/3610-013-0001%20/status', NULL, NULL, '10.210.197.54', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'PUT', '/api/equipment/3610-013-0001%20/status', 200, 84, '2025-09-11 07:41:57', 'low', 'normal', NULL, NULL),
(1504, 124, 'admin', 'update', 'equipment', '3610-013-0001 ', 'แก้ไขครุภัณฑ์: ขาตั้งกล้อง (3610-013-0001 )', '{\"item_code\":\"3610-013-0001 \",\"name\":\"ขาตั้งกล้อง\",\"category\":\"ครุภัณฑ์คอมพิวเตอร์และอุปกรณ์ต่อพ่วง\",\"quantity\":\"1\",\"status\":\"รออนุมัติซ่อม\",\"price\":\"1500\",\"room_id\":2}', '{\"item_code\":\"3610-013-0001 \",\"name\":\"ขาตั้งกล้อง\",\"category\":\"ครุภัณฑ์คอมพิวเตอร์และอุปกรณ์ต่อพ่วง\",\"quantity\":\"1\",\"status\":\"รออนุมัติซ่อม\",\"price\":\"1500\",\"room_id\":2}', '10.210.49.73', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'PUT', '/api/equipment/14', 200, 120, '2025-09-11 07:41:57', 'low', 'normal', NULL, NULL),
(1505, 124, 'admin', 'update', NULL, NULL, 'PUT /api/equipment/14', NULL, NULL, '10.210.49.73', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'PUT', '/api/equipment/14', 200, 162, '2025-09-11 07:41:57', 'low', 'normal', NULL, NULL),
(1506, 125, 'x', 'update', NULL, NULL, 'PUT /api/equipment/3610-013-0001%20/status', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'PUT', '/api/equipment/3610-013-0001%20/status', 200, 68, '2025-09-11 07:42:18', 'low', 'normal', NULL, NULL),
(1507, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ x เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-11T07:45:18.645Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 161, '2025-09-11 07:45:18', 'low', 'normal', NULL, NULL),
(1508, NULL, NULL, 'login', NULL, NULL, 'User x logged in successfully', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-11T07:45:18.735Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 250, '2025-09-11 07:45:18', 'low', 'normal', NULL, NULL),
(1509, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 292, '2025-09-11 07:45:18', 'low', 'normal', NULL, NULL),
(1510, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ admin เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":124,\"username\":\"admin\",\"login_time\":\"2025-09-11T07:46:03.214Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/users/login', 200, 1335, '2025-09-11 07:46:03', 'low', 'normal', NULL, NULL),
(1511, NULL, NULL, 'login', NULL, NULL, 'User admin logged in successfully', NULL, '{\"user_id\":124,\"username\":\"admin\",\"login_time\":\"2025-09-11T07:46:03.348Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/users/login', 200, 1469, '2025-09-11 07:46:03', 'low', 'normal', NULL, NULL),
(1512, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/users/login', 200, 1904, '2025-09-11 07:46:03', 'low', 'normal', NULL, NULL),
(1513, 124, 'admin', 'update', 'equipment', '3610-013-0001 ', 'แก้ไขครุภัณฑ์: ขาตั้งกล้อง (3610-013-0001 )', '{\"item_code\":\"3610-013-0001 \",\"name\":\"ขาตั้งกล้อง\",\"category\":\"ครุภัณฑ์คอมพิวเตอร์และอุปกรณ์ต่อพ่วง\",\"quantity\":\"1\",\"status\":\"กำลังซ่อม\",\"price\":\"1500\",\"room_id\":2}', '{\"item_code\":\"3610-013-0001 \",\"name\":\"ขาตั้งกล้อง\",\"category\":\"ครุภัณฑ์คอมพิวเตอร์และอุปกรณ์ต่อพ่วง\",\"quantity\":\"1\",\"status\":\"ชำรุด\",\"price\":\"1500\",\"room_id\":2}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'PUT', '/api/equipment/14', 200, 131, '2025-09-11 07:47:52', 'low', 'normal', NULL, NULL),
(1514, 124, 'admin', 'update', NULL, NULL, 'PUT /api/equipment/14', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'PUT', '/api/equipment/14', 200, 218, '2025-09-11 07:47:52', 'low', 'normal', NULL, NULL),
(1515, 124, 'admin', 'update', NULL, NULL, 'PUT /api/equipment/3610-013-0001%20/status', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'PUT', '/api/equipment/3610-013-0001%20/status', 200, 98, '2025-09-11 07:48:32', 'low', 'normal', NULL, NULL),
(1516, 124, 'admin', 'update', 'equipment', '3610-013-0001 ', 'แก้ไขครุภัณฑ์: ขาตั้งกล้อง (3610-013-0001 )', '{\"item_code\":\"3610-013-0001 \",\"name\":\"ขาตั้งกล้อง\",\"category\":\"ครุภัณฑ์คอมพิวเตอร์และอุปกรณ์ต่อพ่วง\",\"quantity\":\"1\",\"status\":\"รออนุมัติซ่อม\",\"price\":\"1500\",\"room_id\":2}', '{\"item_code\":\"3610-013-0001 \",\"name\":\"ขาตั้งกล้อง\",\"category\":\"ครุภัณฑ์คอมพิวเตอร์และอุปกรณ์ต่อพ่วง\",\"quantity\":\"1\",\"status\":\"รออนุมัติซ่อม\",\"price\":\"1500\",\"room_id\":2}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'PUT', '/api/equipment/14', 200, 144, '2025-09-11 07:48:32', 'low', 'normal', NULL, NULL),
(1517, 124, 'admin', 'update', NULL, NULL, 'PUT /api/equipment/14', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'PUT', '/api/equipment/14', 200, 234, '2025-09-11 07:48:32', 'low', 'normal', NULL, NULL),
(1518, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ 65011211033 เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":126,\"username\":\"65011211033\",\"login_time\":\"2025-09-11T08:00:33.129Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 275, '2025-09-11 08:00:33', 'low', 'normal', NULL, NULL),
(1519, NULL, NULL, 'login', NULL, NULL, 'User 65011211033 logged in successfully', NULL, '{\"user_id\":126,\"username\":\"65011211033\",\"login_time\":\"2025-09-11T08:00:33.220Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 365, '2025-09-11 08:00:33', 'low', 'normal', NULL, NULL),
(1520, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 418, '2025-09-11 08:00:33', 'low', 'normal', NULL, NULL),
(1521, 126, '65011211033', 'borrow', 'borrows', '352', 'สร้างคำขอยืมใหม่: BR-4666', NULL, '{\"borrow_id\":352,\"borrow_code\":\"BR-4666\",\"user_id\":\"126\",\"equipment_items\":\"item_id: 4, quantity: 1\",\"borrow_date\":\"2025-09-12\",\"return_date\":\"2025-09-19\",\"purpose\":\"asd\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/borrows', 200, 239, '2025-09-11 08:00:54', 'low', 'normal', NULL, NULL),
(1522, 126, '65011211033', 'borrow', NULL, NULL, 'POST /api/borrows', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/borrows', 201, 238, '2025-09-11 08:00:54', 'low', 'normal', NULL, NULL),
(1523, 126, '65011211033', 'update', NULL, NULL, 'PUT /api/equipment/EQ-003/status', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'PUT', '/api/equipment/EQ-003/status', 200, 834, '2025-09-11 08:00:55', 'low', 'normal', NULL, NULL),
(1524, 124, 'admin', 'update', 'equipment', 'EQ-004', 'แก้ไขครุภัณฑ์: router (EQ-004)', '{\"item_code\":\"EQ-004\",\"name\":\"router\",\"category\":\"ครุภัณฑ์เครือข่าย (Networking)\",\"quantity\":\"1\",\"status\":\"พร้อมใช้งาน\",\"price\":\"9000\",\"room_id\":2}', '{\"item_code\":\"EQ-004\",\"name\":\"router\",\"category\":\"ครุภัณฑ์เครือข่าย (Networking)\",\"quantity\":\"1\",\"status\":\"ชำรุด\",\"price\":\"9000\",\"room_id\":2}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'PUT', '/api/equipment/6', 200, 167, '2025-09-11 08:02:56', 'low', 'normal', NULL, NULL),
(1525, 124, 'admin', 'update', NULL, NULL, 'PUT /api/equipment/6', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'PUT', '/api/equipment/6', 200, 203, '2025-09-11 08:02:56', 'low', 'normal', NULL, NULL),
(1526, 125, 'x', 'update', NULL, NULL, 'PUT /api/equipment/3610-013-0001%20/status', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'PUT', '/api/equipment/3610-013-0001%20/status', 200, 109, '2025-09-11 08:11:59', 'low', 'normal', NULL, NULL),
(1527, 119, '65011211022', 'borrow', 'borrows', '353', 'สร้างคำขอยืมใหม่: BR-4867', NULL, '{\"borrow_id\":353,\"borrow_code\":\"BR-4867\",\"user_id\":\"119\",\"equipment_items\":\"item_id: 15, quantity: 1\",\"borrow_date\":\"2025-09-12\",\"return_date\":\"2025-09-19\",\"purpose\":\"หฟกฟหก\"}', '10.210.132.240', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/borrows', 200, 234, '2025-09-11 08:29:04', 'low', 'normal', NULL, NULL),
(1528, 119, '65011211022', 'borrow', NULL, NULL, 'POST /api/borrows', NULL, NULL, '10.210.132.240', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/borrows', 201, 234, '2025-09-11 08:29:04', 'low', 'normal', NULL, NULL),
(1529, 119, '65011211022', 'update', NULL, NULL, 'PUT /api/equipment/EQ-005/status', NULL, NULL, '10.210.132.240', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'PUT', '/api/equipment/EQ-005/status', 200, 100, '2025-09-11 08:29:04', 'low', 'normal', NULL, NULL),
(1530, 124, 'admin', 'approve', 'borrows', '353', 'อนุมัติคำขอยืม: BR-4867 ส่งตรวจสอบ', '{\"status\":\"pending\"}', '{\"borrow_id\":\"353\",\"borrow_code\":\"BR-4867\",\"old_status\":\"pending\",\"new_status\":\"pending_approval\",\"rejection_reason\":null,\"has_signature\":false,\"has_handover_photo\":false}', '10.210.132.240', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'PUT', '/api/borrows/353/status', 200, 332, '2025-09-11 08:29:10', 'low', 'normal', NULL, NULL),
(1531, 124, 'admin', 'update', NULL, NULL, 'PUT /api/borrows/353/status', NULL, NULL, '10.210.132.240', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'PUT', '/api/borrows/353/status', 200, 332, '2025-09-11 08:29:10', 'low', 'normal', NULL, NULL),
(1532, 125, 'x', 'approve', 'borrows', '353', 'อนุมัติและส่งมอบครุภัณฑ์: BR-4867', '{\"status\":\"pending_approval\"}', '{\"borrow_id\":\"353\",\"borrow_code\":\"BR-4867\",\"old_status\":\"pending_approval\",\"new_status\":\"carry\",\"rejection_reason\":null,\"has_signature\":false,\"has_handover_photo\":false}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'PUT', '/api/borrows/353/status', 200, 168, '2025-09-11 08:29:17', 'low', 'normal', NULL, NULL),
(1533, 125, 'x', 'update', NULL, NULL, 'PUT /api/borrows/353/status', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'PUT', '/api/borrows/353/status', 200, 167, '2025-09-11 08:29:17', 'low', 'normal', NULL, NULL),
(1534, 124, 'admin', 'update', 'borrows', '353', 'อัปเดตสถานะการยืมเป็น: approved', '{\"status\":\"carry\"}', '{\"borrow_id\":\"353\",\"borrow_code\":\"BR-4867\",\"old_status\":\"carry\",\"new_status\":\"approved\",\"rejection_reason\":null,\"has_signature\":true,\"has_handover_photo\":true}', '10.210.132.240', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'PUT', '/api/borrows/353/status', 200, 2366, '2025-09-11 08:29:32', 'low', 'normal', NULL, NULL),
(1535, 124, 'admin', 'update', NULL, NULL, 'PUT /api/borrows/353/status', NULL, NULL, '10.210.132.240', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'PUT', '/api/borrows/353/status', 200, 2365, '2025-09-11 08:29:32', 'low', 'normal', NULL, NULL),
(1536, 124, 'admin', 'return', 'returns', '270', 'บันทึกการคืนครุภัณฑ์: BR-4867', NULL, '{\"borrow_id\":353,\"borrow_code\":\"BR-4867\",\"return_id\":270,\"return_date\":\"2025-09-11 15:29:38\",\"fine_amount\":250,\"damage_fine\":250,\"late_fine\":0,\"late_days\":0,\"status\":\"waiting_payment\",\"payment_method\":\"online\"}', '10.210.197.54', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/returns', 200, 575, '2025-09-11 08:29:40', 'low', 'normal', NULL, NULL),
(1537, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ x เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-11T08:29:46.550Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 93, '2025-09-11 08:29:47', 'low', 'normal', NULL, NULL),
(1538, NULL, NULL, 'login', NULL, NULL, 'User x logged in successfully', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-11T08:29:46.589Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 132, '2025-09-11 08:29:48', 'low', 'normal', NULL, NULL),
(1539, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 165, '2025-09-11 08:29:48', 'low', 'normal', NULL, NULL),
(1540, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ admin เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":124,\"username\":\"admin\",\"login_time\":\"2025-09-11T08:53:57.562Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/users/login', 200, 635, '2025-09-11 08:53:57', 'low', 'normal', NULL, NULL),
(1541, NULL, NULL, 'login', NULL, NULL, 'User admin logged in successfully', NULL, '{\"user_id\":124,\"username\":\"admin\",\"login_time\":\"2025-09-11T08:53:57.773Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/users/login', 200, 843, '2025-09-11 08:53:57', 'low', 'normal', NULL, NULL),
(1542, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/users/login', 200, 1023, '2025-09-11 08:53:58', 'low', 'normal', NULL, NULL),
(1543, 124, 'admin', 'update', NULL, NULL, 'PUT /api/equipment/EQ-004/status', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'PUT', '/api/equipment/EQ-004/status', 200, 107, '2025-09-11 09:08:18', 'low', 'normal', NULL, NULL),
(1544, 124, 'admin', 'update', 'equipment', 'EQ-004', 'แก้ไขครุภัณฑ์: router (EQ-004)', '{\"item_code\":\"EQ-004\",\"name\":\"router\",\"category\":\"ครุภัณฑ์เครือข่าย (Networking)\",\"quantity\":\"1\",\"status\":\"รออนุมัติซ่อม\",\"price\":\"9000\",\"room_id\":2}', '{\"item_code\":\"EQ-004\",\"name\":\"router\",\"category\":\"ครุภัณฑ์เครือข่าย (Networking)\",\"quantity\":\"1\",\"status\":\"รออนุมัติซ่อม\",\"price\":\"9000\",\"room_id\":2}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'PUT', '/api/equipment/6', 200, 150, '2025-09-11 09:08:18', 'low', 'normal', NULL, NULL),
(1545, 124, 'admin', 'update', NULL, NULL, 'PUT /api/equipment/6', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'PUT', '/api/equipment/6', 200, 233, '2025-09-11 09:08:18', 'low', 'normal', NULL, NULL),
(1546, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ x เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-11T09:08:37.520Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 197, '2025-09-11 09:08:37', 'low', 'normal', NULL, NULL),
(1547, NULL, NULL, 'login', NULL, NULL, 'User x logged in successfully', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-11T09:08:37.558Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 234, '2025-09-11 09:08:37', 'low', 'normal', NULL, NULL),
(1548, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 278, '2025-09-11 09:08:37', 'low', 'normal', NULL, NULL),
(1549, 125, 'x', 'update', NULL, NULL, 'PUT /api/equipment/EQ-004/status', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'PUT', '/api/equipment/EQ-004/status', 200, 76, '2025-09-11 09:08:58', 'low', 'normal', NULL, NULL),
(1550, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ 65011211022 เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":119,\"username\":\"65011211022\",\"login_time\":\"2025-09-11T09:13:48.592Z\"}', '10.210.132.240', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/users/login', 200, 322, '2025-09-11 09:13:48', 'low', 'normal', NULL, NULL),
(1551, NULL, NULL, 'login', NULL, NULL, 'User 65011211022 logged in successfully', NULL, '{\"user_id\":119,\"username\":\"65011211022\",\"login_time\":\"2025-09-11T09:13:48.760Z\"}', '10.210.132.240', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/users/login', 200, 490, '2025-09-11 09:13:48', 'low', 'normal', NULL, NULL),
(1552, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '10.210.132.240', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', 'POST', '/api/users/login', 200, 531, '2025-09-11 09:13:48', 'low', 'normal', NULL, NULL),
(1553, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ admin เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":124,\"username\":\"admin\",\"login_time\":\"2025-09-11T09:16:06.488Z\"}', '10.210.148.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 295, '2025-09-11 09:16:06', 'low', 'normal', NULL, NULL),
(1554, NULL, NULL, 'login', NULL, NULL, 'User admin logged in successfully', NULL, '{\"user_id\":124,\"username\":\"admin\",\"login_time\":\"2025-09-11T09:16:06.578Z\"}', '10.210.148.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 385, '2025-09-11 09:16:06', 'low', 'normal', NULL, NULL),
(1555, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '10.210.148.56', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 427, '2025-09-11 09:16:06', 'low', 'normal', NULL, NULL),
(1556, 124, 'admin', 'approve', NULL, NULL, 'อนุมัติสลิปการชำระเงิน: BR-4867', NULL, '{\"borrow_id\":353,\"borrow_code\":\"BR-4867\",\"return_id\":\"270\",\"action\":\"slip_approved\"}', '10.210.132.240', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/returns/270/admin-approve-slip', 200, 619, '2025-09-11 09:16:17', 'low', 'normal', NULL, NULL),
(1557, NULL, NULL, 'login', NULL, NULL, 'ผู้ใช้ x เข้าสู่ระบบสำเร็จ', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-11T09:45:11.772Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 90, '2025-09-11 09:45:13', 'low', 'normal', NULL, NULL),
(1558, NULL, NULL, 'login', NULL, NULL, 'User x logged in successfully', NULL, '{\"user_id\":125,\"username\":\"x\",\"login_time\":\"2025-09-11T09:45:11.816Z\"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 134, '2025-09-11 09:45:13', 'low', 'normal', NULL, NULL),
(1559, NULL, NULL, 'create', NULL, NULL, 'POST /api/users/login', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'POST', '/api/users/login', 200, 167, '2025-09-11 09:45:13', 'low', 'normal', NULL, NULL);

--
-- Triggers `audit_logs`
--
DELIMITER $$
CREATE TRIGGER `after_audit_log_insert` AFTER INSERT ON `audit_logs` FOR EACH ROW BEGIN
    DECLARE activity_count INT DEFAULT 0;
    DECLARE hour_of_day INT DEFAULT 0;
    
    -- Check for excessive modifications in last hour
    SELECT COUNT(*) INTO activity_count
    FROM audit_logs 
    WHERE user_id = NEW.user_id 
    AND created_at >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
    AND action_type IN ('create', 'update', 'delete');
    
    -- Check login time (suspicious if outside 6 AM - 10 PM)
    SET hour_of_day = HOUR(NEW.created_at);
    
    -- Flag excessive activity
    IF activity_count > 50 THEN
        INSERT INTO suspicious_activities (
            user_id, activity_type, severity_level, description, details, detected_at
        ) VALUES (
            NEW.user_id, 'excessive_modifications', 'high',
            CONCAT('User performed ', activity_count, ' actions in the last hour'),
            JSON_OBJECT('activity_count', activity_count, 'time_period', '1 hour'),
            NOW()
        );
    END IF;
    
    -- Flag unusual login times
    IF NEW.action_type = 'login' AND (hour_of_day < 6 OR hour_of_day > 22) THEN
        INSERT INTO suspicious_activities (
            user_id, activity_type, severity_level, description, details, detected_at
        ) VALUES (
            NEW.user_id, 'unusual_login_time', 'medium',
            CONCAT('Login at unusual hour: ', hour_of_day, ':00'),
            JSON_OBJECT('login_hour', hour_of_day, 'ip_address', NEW.ip_address),
            NOW()
        );
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `borrow_items`
--

CREATE TABLE `borrow_items` (
  `borrow_item_id` int(11) NOT NULL,
  `borrow_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `borrow_items`
--

INSERT INTO `borrow_items` (`borrow_item_id`, `borrow_id`, `item_id`, `quantity`) VALUES
(390, 308, 3, 1),
(391, 309, 4, 1),
(392, 310, 6, 1),
(393, 311, 14, 1),
(394, 312, 15, 1),
(395, 313, 35, 1),
(396, 314, 36, 1),
(397, 315, 3, 1),
(398, 316, 4, 1),
(399, 317, 6, 1),
(400, 318, 35, 1),
(401, 319, 3, 1),
(402, 320, 4, 1),
(403, 321, 6, 1),
(404, 322, 4, 1),
(405, 323, 3, 1),
(406, 324, 4, 1),
(407, 325, 4, 1),
(408, 326, 3, 1),
(409, 327, 14, 1),
(410, 328, 35, 1),
(411, 329, 37, 1),
(412, 330, 38, 1),
(413, 331, 40, 1),
(414, 332, 39, 1),
(415, 333, 41, 1),
(416, 334, 43, 1),
(417, 335, 3, 1),
(418, 336, 4, 1),
(419, 337, 3, 1),
(420, 338, 4, 1),
(421, 339, 3, 1),
(422, 340, 4, 1),
(423, 341, 3, 1),
(424, 342, 14, 1),
(425, 343, 35, 1),
(426, 344, 4, 1),
(427, 345, 3, 1),
(428, 346, 35, 1),
(429, 347, 4, 1),
(430, 348, 3, 1),
(431, 349, 15, 1),
(432, 350, 3, 1),
(433, 351, 4, 1),
(434, 352, 4, 1),
(435, 353, 15, 1);

--
-- Triggers `borrow_items`
--
DELIMITER $$
CREATE TRIGGER `tr_update_equipment_borrow_count` AFTER INSERT ON `borrow_items` FOR EACH ROW BEGIN
  UPDATE equipment 
  SET total_borrow_count = total_borrow_count + NEW.quantity
  WHERE item_id = NEW.item_id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `borrow_transactions`
--

CREATE TABLE `borrow_transactions` (
  `borrow_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `borrow_date` date NOT NULL,
  `return_date` date NOT NULL,
  `status` enum('pending','pending_approval','approved','rejected','carry','completed','waiting_payment') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `borrow_code` varchar(255) NOT NULL,
  `purpose` text NOT NULL,
  `rejection_reason` text DEFAULT NULL,
  `signature_image` text DEFAULT NULL,
  `handover_photo` text DEFAULT NULL,
  `important_documents` text DEFAULT NULL,
  `borrower_location` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'ข้อมูลตำแหน่งผู้ยืม (latitude, longitude, accuracy, address, timestamp)' CHECK (json_valid(`borrower_location`)),
  `last_location_update` timestamp NULL DEFAULT NULL COMMENT 'เวลาอัปเดตตำแหน่งล่าสุด',
  `borrower_latitude` decimal(10,7) GENERATED ALWAYS AS (json_unquote(json_extract(`borrower_location`,_utf8mb4'$.latitude'))) STORED,
  `borrower_longitude` decimal(10,7) GENERATED ALWAYS AS (json_unquote(json_extract(`borrower_location`,_utf8mb4'$.longitude'))) STORED,
  `priority_level` enum('normal','urgent','emergency') DEFAULT 'normal',
  `approval_notes` text DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `risk_assessment` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`risk_assessment`)),
  `processing_time_minutes` int(11) DEFAULT NULL COMMENT 'เวลาการดำเนินการ (นาที)',
  `approval_efficiency_score` decimal(5,2) DEFAULT NULL COMMENT 'คะแนนประสิทธิภาพการอนุมัติ',
  `customer_satisfaction_rating` decimal(3,2) DEFAULT NULL COMMENT 'คะแนนความพึงพอใจ 1-5',
  `escalation_required` tinyint(1) DEFAULT 0 COMMENT 'ต้องการการส่งต่อปัญหา',
  `escalated_to` int(11) DEFAULT NULL COMMENT 'ส่งต่อให้ใคร',
  `escalation_reason` text DEFAULT NULL,
  `complexity_score` decimal(5,2) DEFAULT 1.00 COMMENT 'คะแนนความซับซ้อนของรายการ'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `borrow_transactions`
--

INSERT INTO `borrow_transactions` (`borrow_id`, `user_id`, `borrow_date`, `return_date`, `status`, `created_at`, `updated_at`, `borrow_code`, `purpose`, `rejection_reason`, `signature_image`, `handover_photo`, `important_documents`, `borrower_location`, `last_location_update`, `priority_level`, `approval_notes`, `approved_by`, `approved_at`, `risk_assessment`, `processing_time_minutes`, `approval_efficiency_score`, `customer_satisfaction_rating`, `escalation_required`, `escalated_to`, `escalation_reason`, `complexity_score`) VALUES
(308, 126, '2025-08-23', '2025-08-29', 'completed', '2025-08-21 18:38:52', '2025-08-21 20:36:22', 'BR-7757', 'ไำพไำพ', NULL, 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1755807768/e-borrow/signature/signature-BR-7757.jpg', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1755807769/e-borrow/handover_photo/handover-BR-7757.jpg', NULL, '{\"address\": \"Kantharawichai, จังหวัดมหาสารคาม\", \"accuracy\": 15.529, \"latitude\": 16.2482012, \"longitude\": 103.259116, \"timestamp\": \"2025-08-22 03:36:22\"}', '2025-08-22 03:36:22', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(309, 119, '2025-08-23', '2025-08-29', 'completed', '2025-08-21 18:42:37', '2025-08-21 20:25:32', 'BR-9338', 'หฟกฟห', NULL, 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1755807900/e-borrow/signature/signature-BR-9338.jpg', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1755807901/e-borrow/handover_photo/handover-BR-9338.jpg', NULL, '{\"address\": \"มค.4009, Kantharawichai, จังหวัดมหาสารคาม\", \"accuracy\": 12.387, \"latitude\": 16.2536352, \"longitude\": 103.2345678, \"timestamp\": \"2025-08-22 03:06:14\"}', '2025-08-22 03:06:14', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(310, 126, '2025-08-23', '2025-08-29', 'completed', '2025-08-21 18:55:05', '2025-08-21 20:43:40', 'BR-5005', 'sdfsdf', NULL, 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1755808183/e-borrow/signature/signature-BR-5005.jpg', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1755808184/e-borrow/handover_photo/handover-BR-5005.jpg', '[{\"filename\":\"e-borrow/important_documents/BR-5005_qr-codes-equipment-1_1755802502216-655471043.pdf\",\"original_name\":\"QR_Codes_Equipment (1).pdf\",\"file_size\":1968065,\"mime_type\":\"application/pdf\",\"file_path\":\"https://res.cloudinary.com/dcepm8sk3/image/upload/v1755802504/e-borrow/important_documents/BR-5005_qr-codes-equipment-1_1755802502216-655471043.pdf.pdf\",\"cloudinary_url\":null,\"cloudinary_public_id\":null,\"stored_locally\":true}]', '{\"address\": null, \"accuracy\": 14.636, \"latitude\": 16.2482135, \"longitude\": 103.2591294, \"timestamp\": \"2025-08-22 03:43:40\"}', '2025-08-22 03:43:40', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(311, 126, '2025-08-23', '2025-08-29', 'completed', '2025-08-21 19:01:30', '2025-08-21 20:43:19', 'BR-7555', 'ฟหกฟหก', NULL, 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1755808008/e-borrow/signature/signature-BR-7555.jpg', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1755808008/e-borrow/handover_photo/handover-BR-7555.jpg', NULL, '{\"address\": null, \"accuracy\": 14.636, \"latitude\": 16.2482135, \"longitude\": 103.2591294, \"timestamp\": \"2025-08-22 03:43:19\"}', '2025-08-22 03:43:19', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(312, 119, '2025-08-23', '2025-08-29', 'completed', '2025-08-21 19:55:07', '2025-08-21 20:47:52', 'BR-7253', 'กหดหก', NULL, 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1755809246/e-borrow/signature/signature-BR-7253.jpg', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1755809247/e-borrow/handover_photo/handover-BR-7253.jpg', NULL, '{\"address\": \"มค.4009, Kantharawichai, จังหวัดมหาสารคาม\", \"accuracy\": 12.365, \"latitude\": 16.2536424, \"longitude\": 103.2345712, \"timestamp\": \"2025-08-22 02:54:38\"}', '2025-08-21 20:43:00', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(313, 119, '2025-08-23', '2025-08-29', 'completed', '2025-08-21 19:58:56', '2025-08-21 20:47:38', 'BR-3244', 'กหดหก', NULL, 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1755809231/e-borrow/signature/signature-BR-3244.jpg', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1755809232/e-borrow/handover_photo/handover-BR-3244.jpg', NULL, '{\"address\": \"มค.4009, Kantharawichai, จังหวัดมหาสารคาม\", \"accuracy\": 12.441, \"latitude\": 16.2536433, \"longitude\": 103.2345659, \"timestamp\": \"2025-08-22 02:58:26\"}', '2025-08-22 02:58:26', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(314, 126, '2025-08-23', '2025-08-29', 'completed', '2025-08-21 20:15:19', '2025-08-21 20:25:06', 'BR-1130', 'ยืม', NULL, 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1755807454/e-borrow/signature/signature-BR-1130.jpg', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1755807455/e-borrow/handover_photo/handover-BR-1130.jpg', '[{\"filename\":\"e-borrow/important_documents/BR-1130_qr-codes-equipment_1755807316427-928507245.pdf\",\"original_name\":\"QR_Codes_Equipment.pdf\",\"file_size\":1968065,\"mime_type\":\"application/pdf\",\"file_path\":\"https://res.cloudinary.com/dcepm8sk3/image/upload/v1755807319/e-borrow/important_documents/BR-1130_qr-codes-equipment_1755807316427-928507245.pdf.pdf\",\"cloudinary_url\":null,\"cloudinary_public_id\":null,\"stored_locally\":true}]', '{\"address\": null, \"accuracy\": 13.4, \"latitude\": 16.248212, \"longitude\": 103.2591343, \"timestamp\": \"2025-08-22 03:25:06\"}', '2025-08-22 03:25:06', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(315, 126, '2025-08-23', '2025-08-29', 'completed', '2025-08-21 20:48:11', '2025-09-03 03:50:12', 'BR-9974', 'aaaaaaaaaa', NULL, 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1756871172/e-borrow/signature/signature-BR-9974.jpg', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1756871173/e-borrow/handover_photo/handover-BR-9974.jpg', '[{\"filename\":\"e-borrow/important_documents/BR-9974_qr-codes-equipment_1755809288276-144513357.pdf\",\"original_name\":\"QR_Codes_Equipment.pdf\",\"file_size\":1968065,\"mime_type\":\"application/pdf\",\"file_path\":\"https://res.cloudinary.com/dcepm8sk3/image/upload/v1755809290/e-borrow/important_documents/BR-9974_qr-codes-equipment_1755809288276-144513357.pdf.pdf\",\"cloudinary_url\":null,\"cloudinary_public_id\":null,\"stored_locally\":true}]', '{\"address\": \"3069, Kantharawichai, จังหวัดมหาสารคาม\", \"accuracy\": 12.369, \"latitude\": 16.2465278, \"longitude\": 103.2523229, \"timestamp\": \"2025-09-03 09:07:26\"}', '2025-09-03 03:44:00', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(316, 126, '2025-08-07', '2025-08-12', 'completed', '2025-08-22 05:51:09', '2025-09-03 03:50:41', 'BR-7066', 'Yu', NULL, 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1756871201/e-borrow/signature/signature-BR-7066.jpg', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1756871201/e-borrow/handover_photo/handover-BR-7066.jpg', NULL, '{\"address\": \"3069, Kantharawichai, จังหวัดมหาสารคาม\", \"accuracy\": 12.369, \"latitude\": 16.2465278, \"longitude\": 103.2523229, \"timestamp\": \"2025-09-03 09:07:27\"}', '2025-09-03 03:44:00', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(317, 119, '2025-08-23', '2025-08-30', 'completed', '2025-08-22 06:54:47', '2025-09-03 03:37:50', 'BR-6035', 'ขอยืมไปศึกษาครับ', NULL, 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1755845951/e-borrow/signature/signature-BR-6035.jpg', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1755845951/e-borrow/handover_photo/handover-BR-6035.jpg', '[{\"filename\":\"e-borrow/important_documents/BR-6035_1743055574356_1755845684853-981736073.jpg\",\"original_name\":\"1743055574356.jpg\",\"file_size\":125008,\"mime_type\":\"image/jpeg\",\"file_path\":\"https://res.cloudinary.com/dcepm8sk3/image/upload/v1755845686/e-borrow/important_documents/BR-6035_1743055574356_1755845684853-981736073.jpg.jpg\",\"cloudinary_url\":null,\"cloudinary_public_id\":null,\"stored_locally\":true},{\"filename\":\"e-borrow/important_documents/BR-6035_532618887-1230499859120699-83289637003409218-n_1755845684893-413315191.jpg\",\"original_name\":\"532618887_1230499859120699_83289637003409218_n.jpg\",\"file_size\":350495,\"mime_type\":\"image/jpeg\",\"file_path\":\"https://res.cloudinary.com/dcepm8sk3/image/upload/v1755845686/e-borrow/important_documents/BR-6035_532618887-1230499859120699-83289637003409218-n_1755845684893-413315191.jpg.jpg\",\"cloudinary_url\":null,\"cloudinary_public_id\":null,\"stored_locally\":true}]', '{\"address\": \"2202, Kantharawichai, จังหวัดมหาสารคาม\", \"accuracy\": 13.304, \"latitude\": 16.2465397, \"longitude\": 103.2522974, \"timestamp\": \"2025-08-22 14:18:53\"}', '2025-08-22 14:18:53', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(318, 126, '2025-08-27', '2025-09-03', 'completed', '2025-08-26 15:06:46', '2025-09-03 03:50:28', 'BR-3810', 'assssss', NULL, 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1756871187/e-borrow/signature/signature-BR-3810.jpg', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1756871187/e-borrow/handover_photo/handover-BR-3810.jpg', '[{\"filename\":\"e-borrow/important_documents/BR-3810_qr-codes-equipment-7_1756220789875-425501844.pdf\",\"original_name\":\"QR_Codes_Equipment (7).pdf\",\"file_size\":1686937,\"mime_type\":\"application/pdf\",\"file_path\":\"https://res.cloudinary.com/dcepm8sk3/image/upload/v1756220800/e-borrow/important_documents/BR-3810_qr-codes-equipment-7_1756220789875-425501844.pdf.pdf\",\"cloudinary_url\":null,\"cloudinary_public_id\":null,\"stored_locally\":true}]', '{\"address\": \"Kantharawichai, จังหวัดมหาสารคาม\", \"accuracy\": 13.231, \"latitude\": 16.2482197, \"longitude\": 103.259147, \"timestamp\": \"2025-08-26 22:06:51\"}', '2025-09-03 03:44:00', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(319, 126, '2025-09-04', '2025-09-11', 'completed', '2025-09-03 05:38:30', '2025-09-06 09:56:35', 'BR-4784', 'ppppppppppppppppppppppp', NULL, 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1757149952/e-borrow/signature/signature-BR-4784.jpg', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1757149953/e-borrow/handover_photo/handover-BR-4784.jpg', '[{\"filename\":\"e-borrow/important_documents/BR-4784_qr-codes-equipment-9_1756877907489-174740664.pdf\",\"original_name\":\"QR_Codes_Equipment (9).pdf\",\"file_size\":4213438,\"mime_type\":\"application/pdf\",\"file_path\":\"https://res.cloudinary.com/dcepm8sk3/image/upload/v1756877910/e-borrow/important_documents/BR-4784_qr-codes-equipment-9_1756877907489-174740664.pdf.pdf\",\"cloudinary_url\":null,\"cloudinary_public_id\":null,\"stored_locally\":true}]', '{\"latitude\":16.248062804979465,\"longitude\":103.25885441363314,\"accuracy\":88,\"address\":\"Kantharawichai, จังหวัดมหาสารคาม\",\"timestamp\":\"2025-09-06 16:19:15\"}', '2025-09-06 09:19:15', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(320, 126, '2025-09-04', '2025-09-11', 'completed', '2025-09-03 05:39:41', '2025-09-06 09:56:43', 'BR-5316', '565656', NULL, 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1757152580/e-borrow/signature/signature-BR-5316.jpg', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1757152581/e-borrow/handover_photo/handover-BR-5316.jpg', NULL, '{\"latitude\":16.248062804979465,\"longitude\":103.25885441363314,\"accuracy\":88,\"address\":\"Kantharawichai, จังหวัดมหาสารคาม\",\"timestamp\":\"2025-09-06 16:19:15\"}', '2025-09-06 09:19:15', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(321, 126, '2025-09-07', '2025-09-14', 'completed', '2025-09-06 09:12:47', '2025-09-07 21:34:49', 'BR-8724', 'asdasd', NULL, 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1757172717/e-borrow/signature/signature-BR-8724.jpg', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1757172718/e-borrow/handover_photo/handover-BR-8724.jpg', '[{\"filename\":\"e-borrow/important_documents/BR-8724_qr-codes-equipment-9_1757149962168-483255456.pdf\",\"original_name\":\"QR_Codes_Equipment (9).pdf\",\"file_size\":4213438,\"mime_type\":\"application/pdf\",\"file_path\":\"https://res.cloudinary.com/dcepm8sk3/image/upload/v1757149966/e-borrow/important_documents/BR-8724_qr-codes-equipment-9_1757149962168-483255456.pdf.pdf\",\"cloudinary_url\":null,\"cloudinary_public_id\":null,\"stored_locally\":true}]', '{\"latitude\":16.2482196,\"longitude\":103.2591311,\"accuracy\":11.542,\"address\":\"Kantharawichai, จังหวัดมหาสารคาม\",\"timestamp\":\"2025-09-06 22:21:19\"}', '2025-09-06 15:21:19', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(322, 126, '2025-09-07', '2025-09-14', 'completed', '2025-09-06 09:57:54', '2025-09-06 15:31:47', 'BR-1694', 'aaaaaaaaaaaa', NULL, 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1757153282/e-borrow/signature/signature-BR-1694.jpg', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1757153283/e-borrow/handover_photo/handover-BR-1694.jpg', '[{\"filename\":\"e-borrow/important_documents/BR-1694_5_1757152671730-584699488.jpg\",\"original_name\":\"à¸à¸²à¸§à¸à¹à¹à¸«à¸¥à¸ (5).jpg\",\"file_size\":2189,\"mime_type\":\"image/jpeg\",\"file_path\":\"https://res.cloudinary.com/dcepm8sk3/image/upload/v1757152673/e-borrow/important_documents/BR-1694_5_1757152671730-584699488.jpg.jpg\",\"cloudinary_url\":null,\"cloudinary_public_id\":null,\"stored_locally\":true}]', '{\"latitude\":16.2482196,\"longitude\":103.2591311,\"accuracy\":11.542,\"address\":\"Kantharawichai, จังหวัดมหาสารคาม\",\"timestamp\":\"2025-09-06 22:21:19\"}', '2025-09-06 15:21:19', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(323, 126, '2025-09-07', '2025-09-14', 'completed', '2025-09-06 15:21:18', '2025-09-06 16:01:00', 'BR-8340', 'ggggggggggg', NULL, 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1757173731/e-borrow/signature/signature-BR-8340.jpg', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1757173732/e-borrow/handover_photo/handover-BR-8340.jpg', '[{\"filename\":\"e-borrow/important_documents/BR-8340_5_1757172064760-371904209.jpg\",\"original_name\":\"à¸à¸²à¸§à¸à¹à¹à¸«à¸¥à¸ (5).jpg\",\"file_size\":2189,\"mime_type\":\"image/jpeg\",\"file_path\":\"https://res.cloudinary.com/dcepm8sk3/image/upload/v1757172072/e-borrow/important_documents/BR-8340_5_1757172064760-371904209.jpg.jpg\",\"cloudinary_url\":null,\"cloudinary_public_id\":null,\"stored_locally\":true}]', '{\"latitude\":16.2482196,\"longitude\":103.2591311,\"accuracy\":11.542,\"address\":\"Kantharawichai, จังหวัดมหาสารคาม\",\"timestamp\":\"2025-09-06 22:21:18\"}', '2025-09-06 15:21:18', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(324, 119, '2025-09-07', '2025-09-14', 'rejected', '2025-09-06 15:51:22', '2025-09-06 15:55:16', 'BR-8940', 'กกกก', 'retredg', NULL, NULL, NULL, '{\"latitude\":16.2535333,\"longitude\":103.2345317,\"accuracy\":1.9170000553131104,\"address\":\"มค.4009, Kantharawichai, จังหวัดมหาสารคาม\",\"timestamp\":\"2025-09-06 22:55:16\"}', '2025-09-06 15:55:16', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(325, 126, '2025-09-08', '2025-09-14', 'rejected', '2025-09-06 20:16:36', '2025-09-06 21:17:33', 'BR-1966', '2222222222', 'd', NULL, NULL, '[{\"filename\":\"e-borrow/important_documents/BR-1966_gemini-generated-image-6mijbf6mijbf6mij_1757189791496-808574747.png\",\"original_name\":\"Gemini_Generated_Image_6mijbf6mijbf6mij.png\",\"file_size\":1341384,\"mime_type\":\"image/png\",\"file_path\":\"https://res.cloudinary.com/dcepm8sk3/image/upload/v1757189795/e-borrow/important_documents/BR-1966_gemini-generated-image-6mijbf6mijbf6mij_1757189791496-808574747.png.png\",\"cloudinary_url\":null,\"cloudinary_public_id\":null,\"stored_locally\":true}]', '{\"latitude\":16.2442721,\"longitude\":103.2555376,\"accuracy\":3932.3438743083884,\"address\":\"2202, Kantharawichai, จังหวัดมหาสารคาม\",\"timestamp\":\"2025-09-07 03:18:37\"}', '2025-09-06 20:18:37', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(326, 126, '2025-09-08', '2025-09-14', 'rejected', '2025-09-06 20:22:29', '2025-09-06 21:17:44', 'BR-1739', 'ccccccccc', 'asd', NULL, NULL, NULL, NULL, NULL, 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(327, 126, '2025-09-08', '2025-09-14', 'rejected', '2025-09-06 20:27:29', '2025-09-06 21:17:36', 'BR-1382', 'ฟหกฟหก', 'a', NULL, NULL, '[{\"filename\":\"e-borrow/important_documents/BR-1382_gemini-generated-image-yk1xbnyk1xbnyk1x_1757190445096-13239169.png\",\"original_name\":\"Gemini_Generated_Image_yk1xbnyk1xbnyk1x.png\",\"file_size\":1348620,\"mime_type\":\"image/png\",\"file_path\":\"https://res.cloudinary.com/dcepm8sk3/image/upload/v1757190449/e-borrow/important_documents/BR-1382_gemini-generated-image-yk1xbnyk1xbnyk1x_1757190445096-13239169.png.png\",\"cloudinary_url\":null,\"cloudinary_public_id\":null,\"stored_locally\":true}]', '{\"latitude\":16.248056671683912,\"longitude\":103.25886291078707,\"accuracy\":94,\"address\":\"Kantharawichai, จังหวัดมหาสารคาม\",\"timestamp\":\"2025-09-07 03:27:31\"}', '2025-09-06 20:27:31', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(328, 126, '2025-09-08', '2025-09-14', 'rejected', '2025-09-06 20:33:09', '2025-09-06 21:17:40', 'BR-4498', 'ฟฟฟฟฟฟฟฟฟฟ', 'asd', NULL, NULL, NULL, '{\"latitude\":16.248056671683912,\"longitude\":103.25886291078707,\"accuracy\":94,\"address\":\"Kantharawichai, จังหวัดมหาสารคาม\",\"timestamp\":\"2025-09-07 03:37:35\"}', '2025-09-06 20:37:35', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(329, 126, '2025-09-08', '2025-09-14', 'rejected', '2025-09-06 20:37:04', '2025-09-06 21:17:58', 'BR-4834', 'ggggggg', 'sd', NULL, NULL, NULL, '{\"latitude\":16.248056671683912,\"longitude\":103.25886291078707,\"accuracy\":94,\"address\":\"Kantharawichai, จังหวัดมหาสารคาม\",\"timestamp\":\"2025-09-07 03:37:05\"}', '2025-09-06 20:37:05', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(330, 126, '2025-09-08', '2025-09-14', 'rejected', '2025-09-06 20:41:02', '2025-09-06 21:17:48', 'BR-1178', 'ิิิิ', 'asd', NULL, NULL, NULL, '{\"latitude\":16.2442721,\"longitude\":103.2555376,\"accuracy\":3932.3438743083884,\"address\":\"2202, Kantharawichai, จังหวัดมหาสารคาม\",\"timestamp\":\"2025-09-07 03:41:03\"}', '2025-09-06 20:41:03', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(331, 126, '2025-09-08', '2025-09-14', 'rejected', '2025-09-06 20:43:32', '2025-09-06 21:18:01', 'BR-8192', 'อแอแ', 'sd', NULL, NULL, NULL, '{\"latitude\":16.2442721,\"longitude\":103.2555376,\"accuracy\":3932.3438743083884,\"address\":\"2202, Kantharawichai, จังหวัดมหาสารคาม\",\"timestamp\":\"2025-09-07 03:43:32\"}', '2025-09-06 20:43:32', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(332, 126, '2025-09-08', '2025-09-14', 'rejected', '2025-09-06 20:47:18', '2025-09-06 21:17:51', 'BR-2630', 'jjjjjjjj', 'sd', NULL, NULL, NULL, '{\"latitude\":16.2442721,\"longitude\":103.2555376,\"accuracy\":3932.3438743083884,\"address\":\"2202, Kantharawichai, จังหวัดมหาสารคาม\",\"timestamp\":\"2025-09-07 03:47:18\"}', '2025-09-06 20:47:18', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(333, 126, '2025-09-08', '2025-09-14', 'rejected', '2025-09-06 21:04:44', '2025-09-06 21:18:04', 'BR-1156', 'hhhhhhhh', 'sd', NULL, NULL, NULL, '{\"latitude\":16.2442721,\"longitude\":103.2555376,\"accuracy\":3932.3438743083884,\"address\":\"2202, Kantharawichai, จังหวัดมหาสารคาม\",\"timestamp\":\"2025-09-07 04:06:45\"}', '2025-09-06 21:06:45', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(334, 126, '2025-09-08', '2025-09-14', 'rejected', '2025-09-06 21:15:30', '2025-09-06 21:17:55', 'BR-6861', 'หหหหหหหหหหห', 'sd', NULL, NULL, NULL, '{\"latitude\":16.2442721,\"longitude\":103.2555376,\"accuracy\":3932.3438743083884,\"address\":\"3069, Kantharawichai, จังหวัดมหาสารคาม\",\"timestamp\":\"2025-09-07 04:17:10\"}', '2025-09-06 21:17:10', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(335, 126, '2025-09-08', '2025-09-15', 'rejected', '2025-09-07 09:24:08', '2025-09-07 09:27:50', 'BR-9577', 'ฟฟฟ', 'g', NULL, NULL, NULL, '{\"latitude\":16.2442721,\"longitude\":103.2555376,\"accuracy\":3932.3438743083884,\"address\":\"3069, Kantharawichai, จังหวัดมหาสารคาม\",\"timestamp\":\"2025-09-07 16:27:50\"}', '2025-09-07 09:27:50', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(336, 126, '2025-09-08', '2025-09-15', 'rejected', '2025-09-07 09:28:11', '2025-09-07 09:30:17', 'BR-2122', 'aaaaaaa', 'ฟหก', NULL, NULL, NULL, '{\"latitude\":16.2442721,\"longitude\":103.2555376,\"accuracy\":3932.3438743083884,\"address\":\"3069, Kantharawichai, จังหวัดมหาสารคาม\",\"timestamp\":\"2025-09-07 16:28:14\"}', '2025-09-07 09:28:14', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(337, 126, '2025-09-08', '2025-09-15', 'rejected', '2025-09-07 09:28:59', '2025-09-07 09:43:39', 'BR-2514', 'fdf', 'ผปแ', NULL, NULL, NULL, '{\"latitude\":16.2442721,\"longitude\":103.2555376,\"accuracy\":3932.3438743083884,\"address\":\"3069, Kantharawichai, จังหวัดมหาสารคาม\",\"timestamp\":\"2025-09-07 16:29:01\"}', '2025-09-07 09:29:01', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(338, 126, '2025-09-08', '2025-09-15', 'rejected', '2025-09-07 09:31:15', '2025-09-07 09:31:59', 'BR-9382', 'ปปป', '้่า้่า', NULL, NULL, NULL, '{\"latitude\":16.2442721,\"longitude\":103.2555376,\"accuracy\":3932.3438743083884,\"address\":\"2202, Kantharawichai, จังหวัดมหาสารคาม\",\"timestamp\":\"2025-09-07 16:31:18\"}', '2025-09-07 09:31:18', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(339, 126, '2025-09-08', '2025-09-15', 'rejected', '2025-09-07 09:47:23', '2025-09-07 09:48:53', 'BR-9694', 'ฟหก', 'ฟฟฟ', NULL, NULL, NULL, '{\"latitude\":16.2442721,\"longitude\":103.2555376,\"accuracy\":3932.3438743083884,\"address\":\"3069, Kantharawichai, จังหวัดมหาสารคาม\",\"timestamp\":\"2025-09-07 16:47:26\"}', '2025-09-07 09:47:26', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(340, 126, '2025-09-08', '2025-09-15', 'rejected', '2025-09-07 11:18:25', '2025-09-07 11:23:24', 'BR-4803', 'ฟฟฟฟฟฟฟฟ', 'ฟหกฟหก', NULL, NULL, NULL, '{\"latitude\":16.2442721,\"longitude\":103.2555376,\"accuracy\":3932.3438743083884,\"address\":\"3069, Kantharawichai, จังหวัดมหาสารคาม\",\"timestamp\":\"2025-09-07 18:18:29\"}', '2025-09-07 11:18:29', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(341, 126, '2025-09-08', '2025-09-15', 'rejected', '2025-09-07 11:19:45', '2025-09-07 11:25:21', 'BR-7541', 'ฟหกฟหก', 'aaa', NULL, NULL, NULL, '{\"latitude\":16.2442721,\"longitude\":103.2555376,\"accuracy\":3932.3438743083884,\"address\":\"3069, Kantharawichai, จังหวัดมหาสารคาม\",\"timestamp\":\"2025-09-07 18:19:45\"}', '2025-09-07 11:19:45', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(342, 126, '2025-09-08', '2025-09-15', 'rejected', '2025-09-07 11:21:30', '2025-09-07 11:29:22', 'BR-3581', 'qqqqq', 'หกดหกด', NULL, NULL, NULL, NULL, NULL, 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(343, 126, '2025-09-08', '2025-09-15', 'rejected', '2025-09-07 11:21:39', '2025-09-07 11:26:19', 'BR-8499', 'asdasd', 'asdasd', NULL, NULL, NULL, NULL, NULL, 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(344, 126, '2025-09-08', '2025-09-15', 'completed', '2025-09-07 11:30:30', '2025-09-07 12:14:16', 'BR-5805', 'aaaaaaa', NULL, 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1757245930/e-borrow/signature/signature-BR-5805.jpg', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1757245931/e-borrow/handover_photo/handover-BR-5805.jpg', '[{\"filename\":\"e-borrow/important_documents/BR-5805_qr-codes-equipment-2_1757244625895-331052904.pdf\",\"original_name\":\"QR_Codes_Equipment (2).pdf\",\"file_size\":1968065,\"mime_type\":\"application/pdf\",\"file_path\":\"https://res.cloudinary.com/dcepm8sk3/image/upload/v1757244629/e-borrow/important_documents/BR-5805_qr-codes-equipment-2_1757244625895-331052904.pdf.pdf\",\"cloudinary_url\":null,\"cloudinary_public_id\":null,\"stored_locally\":true}]', '{\"latitude\":16.248025270167233,\"longitude\":103.25885634671604,\"accuracy\":91,\"address\":\"Kantharawichai, จังหวัดมหาสารคาม\",\"timestamp\":\"2025-09-07 19:14:16\"}', '2025-09-07 12:14:16', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(345, 126, '2025-09-08', '2025-09-15', 'completed', '2025-09-07 11:32:19', '2025-09-07 12:16:47', 'BR-7761', 'aaaa', NULL, 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1757247315/e-borrow/signature/signature-BR-7761.jpg', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1757247316/e-borrow/handover_photo/handover-BR-7761.jpg', '[{\"filename\":\"e-borrow/important_documents/BR-7761_qr-codes-equipment-2_1757244722469-46489313.pdf\",\"original_name\":\"QR_Codes_Equipment (2).pdf\",\"file_size\":1968065,\"mime_type\":\"application/pdf\",\"file_path\":\"https://res.cloudinary.com/dcepm8sk3/image/upload/v1757244738/e-borrow/important_documents/BR-7761_qr-codes-equipment-2_1757244722469-46489313.pdf.pdf\",\"cloudinary_url\":null,\"cloudinary_public_id\":null,\"stored_locally\":true}]', '{\"latitude\":16.248025270167233,\"longitude\":103.25885634671604,\"accuracy\":91,\"address\":\"Kantharawichai, จังหวัดมหาสารคาม\",\"timestamp\":\"2025-09-07 19:14:15\"}', '2025-09-07 12:14:15', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(346, 126, '2025-09-08', '2025-09-15', 'completed', '2025-09-07 11:51:41', '2025-09-07 21:17:54', 'BR-6762', 'aaaaaaa', NULL, 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1757279831/e-borrow/signature/signature-BR-6762.jpg', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1757279832/e-borrow/handover_photo/handover-BR-6762.jpg', '[{\"filename\":\"e-borrow/important_documents/BR-6762_qr-codes-equipment-2_1757245898144-851379423.pdf\",\"original_name\":\"QR_Codes_Equipment (2).pdf\",\"file_size\":1968065,\"mime_type\":\"application/pdf\",\"file_path\":\"https://res.cloudinary.com/dcepm8sk3/image/upload/v1757245900/e-borrow/important_documents/BR-6762_qr-codes-equipment-2_1757245898144-851379423.pdf.pdf\",\"cloudinary_url\":null,\"cloudinary_public_id\":null,\"stored_locally\":true}]', '{\"latitude\":16.248025270167233,\"longitude\":103.25885634671604,\"accuracy\":91,\"address\":\"Kantharawichai, จังหวัดมหาสารคาม\",\"timestamp\":\"2025-09-07 19:14:14\"}', '2025-09-07 12:14:14', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(347, 126, '2025-09-09', '2025-09-15', 'completed', '2025-09-07 21:32:58', '2025-09-07 21:35:51', 'BR-4255', 'pppppppp', NULL, 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1757280825/e-borrow/signature/signature-BR-4255.jpg', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1757280825/e-borrow/handover_photo/handover-BR-4255.jpg', '[{\"filename\":\"e-borrow/important_documents/BR-4255_qr-codes-equipment-10_1757280772292-881179901.pdf\",\"original_name\":\"QR_Codes_Equipment (10).pdf\",\"file_size\":4213438,\"mime_type\":\"application/pdf\",\"file_path\":\"https://res.cloudinary.com/dcepm8sk3/image/upload/v1757280777/e-borrow/important_documents/BR-4255_qr-codes-equipment-10_1757280772292-881179901.pdf.pdf\",\"cloudinary_url\":null,\"cloudinary_public_id\":null,\"stored_locally\":true}]', '{\"latitude\":16.2482153,\"longitude\":103.259108,\"accuracy\":11.476,\"address\":\"Kantharawichai, จังหวัดมหาสารคาม\",\"timestamp\":\"2025-09-08 04:35:50\"}', '2025-09-07 21:35:50', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(348, 126, '2025-09-09', '2025-09-15', 'completed', '2025-09-07 22:06:58', '2025-09-07 23:52:56', 'BR-5210', '5555', NULL, 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1757282848/e-borrow/signature/signature-BR-5210.jpg', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1757282849/e-borrow/handover_photo/handover-BR-5210.jpg', NULL, '{\"latitude\":16.2482159,\"longitude\":103.2591025,\"accuracy\":11.497,\"address\":null,\"timestamp\":\"2025-09-08 06:47:21\"}', '2025-09-07 23:47:21', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(349, 126, '2025-09-09', '2025-09-15', 'completed', '2025-09-07 23:38:21', '2025-09-07 23:53:06', 'BR-7460', 'แแอปอปแอ', NULL, 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1757289166/e-borrow/signature/signature-BR-7460.jpg', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1757289167/e-borrow/handover_photo/handover-BR-7460.jpg', NULL, '{\"latitude\":16.2482159,\"longitude\":103.2591025,\"accuracy\":11.497,\"address\":\"Kantharawichai, จังหวัดมหาสารคาม\",\"timestamp\":\"2025-09-08 06:38:21\"}', '2025-09-07 23:38:21', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(350, 126, '2025-09-09', '2025-09-16', 'completed', '2025-09-08 12:14:18', '2025-09-08 12:16:25', 'BR-8748', 'ฟหก', NULL, 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1757333753/e-borrow/signature/signature-BR-8748.jpg', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1757333754/e-borrow/handover_photo/handover-BR-8748.jpg', NULL, '{\"latitude\":16.24804908483386,\"longitude\":103.25885908059345,\"accuracy\":83,\"address\":\"Kantharawichai, จังหวัดมหาสารคาม\",\"timestamp\":\"2025-09-08 19:14:21\"}', '2025-09-08 12:14:21', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(351, 119, '2025-09-12', '2025-09-19', 'completed', '2025-09-11 07:36:55', '2025-09-11 08:29:01', 'BR-5018', 'asfdasf', NULL, 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1757576236/e-borrow/signature/signature-BR-5018.jpg', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1757576237/e-borrow/handover_photo/handover-BR-5018.jpg', NULL, '{\"latitude\":16.253179859926863,\"longitude\":103.23443609680768,\"accuracy\":74,\"address\":\"มค.4009, Kantharawichai, จังหวัดมหาสารคาม\",\"timestamp\":\"2025-09-11 15:29:01\"}', '2025-09-11 08:29:01', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(352, 126, '2025-09-12', '2025-09-19', 'pending', '2025-09-11 08:00:54', '2025-09-11 08:00:58', 'BR-4666', 'asd', NULL, NULL, NULL, NULL, '{\"latitude\":16.2482003,\"longitude\":103.2591441,\"accuracy\":15.011,\"address\":\"Kantharawichai, จังหวัดมหาสารคาม\",\"timestamp\":\"2025-09-11 15:00:58\"}', '2025-09-11 08:00:58', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00'),
(353, 119, '2025-09-12', '2025-09-19', 'completed', '2025-09-11 08:29:03', '2025-09-11 09:16:16', 'BR-4867', 'หฟกฟหก', NULL, 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1757579370/e-borrow/signature/signature-BR-4867.jpg', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1757579371/e-borrow/handover_photo/handover-BR-4867.jpg', NULL, '{\"latitude\":16.253179859926863,\"longitude\":103.23443609680768,\"accuracy\":74,\"address\":\"มค.4009, Kantharawichai, จังหวัดมหาสารคาม\",\"timestamp\":\"2025-09-11 15:33:33\"}', '2025-09-11 08:33:33', 'normal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '1.00');

-- --------------------------------------------------------

--
-- Table structure for table `branches`
--

CREATE TABLE `branches` (
  `branch_id` int(11) NOT NULL,
  `branch_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `branches`
--

INSERT INTO `branches` (`branch_id`, `branch_name`) VALUES
(1, 'วิทยาการคอมพิวเตอร์'),
(2, 'เทคโนโลยีสารสนเทศ'),
(3, 'สื่อนฤมิต'),
(4, 'สารสนเทศศาสตร์'),
(6, 'isฟฟฟฟ'),
(7, 'วิชาการ');

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `category_id` int(11) NOT NULL,
  `category_code` varchar(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`category_id`, `category_code`, `name`, `created_at`, `updated_at`) VALUES
(1, 'CAT-001', 'ครุภัณฑ์คอมพิวเตอร์และอุปกรณ์ต่อพ่วง', '2025-05-30 13:23:13', NULL),
(2, 'CAT-002', 'ครุภัณฑ์เครือข่าย (Networking)', '2025-05-30 13:23:13', NULL),
(3, 'CAT-003', 'ครุภัณฑ์อิเล็กทรอนิกส์และ IoT', '2025-05-30 13:23:13', NULL),
(9, 'CAT-005', 'ครุภัณฑ์มัลติมีเดีย', NULL, NULL),
(12, 'CAT-006', 'ครุภัณฑ์ห้องปฏิบัติการ (Lab)', NULL, NULL),
(13, 'CAT-004', 'ครุภัณฑ์สำนักงาน	', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `contact_info`
--

CREATE TABLE `contact_info` (
  `id` int(11) NOT NULL,
  `location` varchar(255) NOT NULL COMMENT 'สถานที่ติดต่อ',
  `phone` varchar(50) NOT NULL COMMENT 'เบอร์โทรศัพท์',
  `hours` varchar(100) NOT NULL COMMENT 'เวลาทำการ',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `contact_info`
--

INSERT INTO `contact_info` (`id`, `location`, `phone`, `hours`, `created_at`, `updated_at`) VALUES
(3, 'ตึกไอที 502', '0929103525', '08.00-15.20 น.', '2025-08-05 17:42:24', '2025-08-15 14:00:27');

-- --------------------------------------------------------

--
-- Table structure for table `damage_levels`
--

CREATE TABLE `damage_levels` (
  `damage_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `fine_percent` int(11) NOT NULL,
  `detail` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `damage_levels`
--

INSERT INTO `damage_levels` (`damage_id`, `name`, `fine_percent`, `detail`) VALUES
(5, 'สภาพดี', 0, 'อุปกรณ์อยู่ในสภาพสมบูรณ์ ไฟติด ใช้งานได้ครบทุกฟังก์ชัน ไม่มีรอยหรือความเสียหายใดๆ'),
(6, 'ชำรุดเล็กน้อย', 10, 'มีรอยขีดข่วนภายนอก, ฝาปิดหลวม, ปุ่มใช้งานแข็ง แต่ยังใช้งานได้ตามปกติ'),
(7, 'ชำรุดปานกลาง', 30, 'บางฟังก์ชันใช้งานไม่ได้ เช่น กล้องโฟกัสช้า, เสียงไมค์เบา, ขาตั้งขาโยก, สายหลวม'),
(8, 'ชำรุดหนัก', 50, 'เสียหายชัดเจน เช่น กล้องเลนส์ร้าว, ไฟไม่ติด, เสียงขาดๆหายๆ, ขาตั้งหัก, หน้าจอไม่แสดงผล'),
(9, 'สูญหาย', 100, 'ไม่สามารถคืนอุปกรณ์ หรือคืนอุปกรณ์ไม่ครบ เช่น หายทั้งกล้อง, คืนเฉพาะขาตั้ง, หรือหายทั้งชุดไมค์'),
(10, 'สภาพดี', 5, 'อุปกรณ์อยู่ในสภาพสมบูรณ์ ไฟติด ใช้งานได้ครบทุกฟังก์ชัน ไม่มีรอยหรือความเสียหายใดๆ');

-- --------------------------------------------------------

--
-- Table structure for table `equipment`
--

CREATE TABLE `equipment` (
  `item_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `category_id` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `quantity` varchar(50) DEFAULT NULL,
  `unit` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `pic` text DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `item_code` varchar(255) DEFAULT NULL,
  `price` varchar(50) NOT NULL,
  `purchaseDate` date NOT NULL DEFAULT '2000-01-01',
  `room_id` int(11) DEFAULT NULL,
  `depreciation_rate` decimal(5,2) DEFAULT 0.00,
  `last_maintenance_date` date DEFAULT NULL,
  `next_maintenance_date` date DEFAULT NULL,
  `total_borrow_count` int(11) DEFAULT 0,
  `total_damage_cost` decimal(10,2) DEFAULT 0.00,
  `warranty_expiry_date` date DEFAULT NULL,
  `insurance_value` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `equipment`
--

INSERT INTO `equipment` (`item_id`, `name`, `category`, `category_id`, `description`, `quantity`, `unit`, `status`, `pic`, `created_at`, `item_code`, `price`, `purchaseDate`, `room_id`, `depreciation_rate`, `last_maintenance_date`, `next_maintenance_date`, `total_borrow_count`, `total_damage_cost`, `warranty_expiry_date`, `insurance_value`) VALUES
(3, 'MSI notebool', 'ครุภัณฑ์คอมพิวเตอร์และอุปกรณ์ต่อพ่วง', 1, 'โน็ตบุ๊คเร็วแรง 333', '1', 'ชิ้น', 'กำลังซ่อม', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1755356350/e-borrow/equipment/EQ-002.jpg', NULL, 'EQ-002', '30000', '1999-12-30', 12, '0.00', NULL, NULL, 12, '6000.00', NULL, '0.00'),
(4, 'ไฟ studio', 'ครุภัณฑ์มัลติมีเดีย', 9, 'ไฟในห้อง', '1', 'ชิ้น', 'ถูกยืม', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1755356361/e-borrow/equipment/EQ-003.jpg', NULL, 'EQ-003', '5000', '2000-01-01', 8, '0.00', NULL, NULL, 13, '3500.00', NULL, '0.00'),
(6, 'router', 'ครุภัณฑ์เครือข่าย (Networking)', 2, 'wifi', '1', 'ชุด', 'กำลังซ่อม', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1755356381/e-borrow/equipment/EQ-004.jpg', NULL, 'EQ-004', '9000', '1999-12-31', 2, '0.00', NULL, NULL, 3, '7650.00', NULL, '0.00'),
(14, 'ขาตั้งกล้อง', 'ครุภัณฑ์คอมพิวเตอร์และอุปกรณ์ต่อพ่วง', 1, 'ขาสำหรับตั้งกล้อง canon 2000', '1', 'ชิ้น', 'กำลังซ่อม', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1755356334/e-borrow/equipment/EQ-0018888.jpg', '2025-06-26 16:51:37', '3610-013-0001 ', '1500', '2025-06-19', 2, '0.00', NULL, NULL, 3, '50.00', NULL, '0.00'),
(15, 'rog moniter', 'ครุภัณฑ์อิเล็กทรอนิกส์และ IoT', 3, 'จอคอม', '1', 'ชุด', 'พร้อมใช้งาน', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1755356398/e-borrow/equipment/EQ-005.jpg', '2025-07-07 17:57:06', 'EQ-005', '2500', '2025-07-08', 13, '0.00', NULL, NULL, 3, '1000.00', NULL, '0.00'),
(35, 'โน๊ตบุ๊ค Dell', 'ครุภัณฑ์อิเล็กทรอนิกส์และ IoT', 3, 'Dell Inspiron 15', '1', 'ชิ้น', 'พร้อมใช้งาน', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1755769630/e-borrow/equipment/EQ-101.jpg', '2025-08-21 09:41:23', 'EQ-101', '25000', '2023-05-10', 1, '0.00', NULL, NULL, 5, '1250.00', NULL, '0.00'),
(36, 'โปรเจคเตอร์ Epson', 'ครุภัณฑ์เครือข่าย (Networking)', 2, 'Full HD Projector', '1', 'ชิ้น', 'พร้อมใช้งาน', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1755769706/e-borrow/equipment/EQ-102.jpg', '2025-08-21 09:41:23', 'EQ-102', '18000', '2022-12-01', 2, '0.00', NULL, NULL, 1, '900.00', NULL, '0.00'),
(37, 'เก้าอี้สำนักงาน', 'ครุภัณฑ์สำนักงาน	', 13, 'เก้าอี้สำนักงานแบบ Ergonomic', '1', 'ชิ้น', 'พร้อมใช้งาน', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1755769732/e-borrow/equipment/EQ-103.png', '2025-08-21 09:41:23', 'EQ-103', '3500', '2021-06-15', 5, '0.00', NULL, NULL, 1, '0.00', NULL, '0.00'),
(38, 'ไวท์บอร์ด', 'ครุภัณฑ์สำนักงาน	', 13, 'ไวท์บอร์ดแม่เหล็ก ขนาด 120x90 cm', '1', 'ชิ้น', 'พร้อมใช้งาน', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1755769756/e-borrow/equipment/EQ-104.jpg', '2025-08-21 09:41:23', 'EQ-104', '1200', '2020-09-20', 6, '0.00', NULL, NULL, 1, '0.00', NULL, '0.00'),
(39, 'แอร์ Daikin', 'ครุภัณฑ์สำนักงาน	', 13, 'แอร์ 18000 BTU', '1', 'ชิ้น', 'พร้อมใช้งาน', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1755769788/e-borrow/equipment/EQ-105.png', '2025-08-21 09:41:23', 'EQ-105', '22000', '2023-01-05', 8, '0.00', NULL, NULL, 1, '0.00', NULL, '0.00'),
(40, 'เครื่องพิมพ์ HP', 'ครุภัณฑ์สำนักงาน	', 13, 'LaserJet Pro M404dn', '1', 'ชิ้น', 'พร้อมใช้งาน', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1755769607/e-borrow/equipment/EQ-106.jpg', '2025-08-21 09:41:23', 'EQ-106', '8500', '2023-07-11', 10, '0.00', NULL, NULL, 1, '0.00', NULL, '0.00'),
(41, 'เราเตอร์ Cisco', 'ครุภัณฑ์เครือข่าย (Networking)', 2, 'Cisco Wi-Fi Router', '1', 'ชิ้น', 'พร้อมใช้งาน', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1755769494/e-borrow/equipment/EQ-107.jpg', '2025-08-21 09:41:23', 'EQ-107', '4500', '2023-03-15', 11, '0.00', NULL, NULL, 1, '0.00', NULL, '0.00'),
(42, 'โต๊ะสำนักงาน', 'ครุภัณฑ์สำนักงาน	', 13, 'โต๊ะไม้สำหรับสำนักงาน', '1', 'ชิ้น', 'พร้อมใช้งาน', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1755769544/e-borrow/equipment/EQ-108.jpg', '2025-08-21 09:41:23', 'EQ-108', '5000', '2021-11-10', 12, '0.00', NULL, NULL, 0, '0.00', NULL, '0.00'),
(43, 'พัดลมเพดาน Mitsubishi', 'ครุภัณฑ์สำนักงาน	', 13, 'พัดลมเพดานขนาดมาตรฐาน', '1', 'ชิ้น', 'พร้อมใช้งาน', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1755769444/e-borrow/equipment/EQ-109.jpg', '2025-08-21 09:41:23', 'EQ-109', '2500', '2022-04-05', 13, '0.00', NULL, NULL, 1, '0.00', NULL, '0.00'),
(44, 'ตู้เก็บเอกสาร', 'ครุภัณฑ์สำนักงาน	', 13, 'ตู้เหล็ก 4 ลิ้นชัก', '1', 'ชิ้น', 'พร้อมใช้งาน', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1755769572/e-borrow/equipment/EQ-110.jpg', '2025-08-21 09:41:23', 'EQ-110', '4000', '2022-07-20', 1, '0.00', NULL, NULL, 0, '0.00', NULL, '0.00');

-- --------------------------------------------------------

--
-- Table structure for table `footer_settings`
--

CREATE TABLE `footer_settings` (
  `id` int(11) NOT NULL,
  `university_name` varchar(255) NOT NULL DEFAULT 'มหาวิทยาลัยมหาสารคาม',
  `faculty_name` varchar(255) NOT NULL DEFAULT 'คณะวิทยาศาสตร์',
  `address` text NOT NULL,
  `phone` varchar(50) DEFAULT '043-754321',
  `email` varchar(100) DEFAULT 'science@msu.ac.th',
  `website` varchar(255) DEFAULT 'https://it.msu.ac.th',
  `facebook_url` varchar(255) DEFAULT 'https://facebook.com/msu.science',
  `line_url` varchar(255) DEFAULT 'https://line.me',
  `instagram_url` varchar(255) DEFAULT 'https://instagram.com/msu.science',
  `copyright_text` varchar(255) NOT NULL DEFAULT '© 2024 มหาวิทยาลัยมหาสารคาม สงวนลิขสิทธิ์',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `footer_settings`
--

INSERT INTO `footer_settings` (`id`, `university_name`, `faculty_name`, `address`, `phone`, `email`, `website`, `facebook_url`, `line_url`, `instagram_url`, `copyright_text`, `created_at`, `updated_at`) VALUES
(1, 'MAHASARAKHAM', 'คณะวิทยาการสารสนเทศ', 'ตำบลขามเรียง อำเภอกันทรวิชัย จังหวัดมหาสารคาม 44150', '082-647-1065', 'equipment@msu.ac.th', 'https://it.msu.ac.th', 'https://facebook.com', 'https://line.me', 'https://www.instagram.com', 'e-borrow', '2025-08-18 15:04:56', '2025-08-19 07:56:20');

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

CREATE TABLE `news` (
  `id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` enum('การบำรุงรักษา','อุปกรณ์ใหม่','กิจกรรม','ประกาศ') COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` datetime DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `image_url` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `force_show` tinyint(1) NOT NULL DEFAULT 0,
  `show_to_all` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `news`
--

INSERT INTO `news` (`id`, `title`, `content`, `category`, `date`, `created_at`, `updated_at`, `image_url`, `force_show`, `show_to_all`) VALUES
(1, 'ปรับปรุงระบบครั้งใหญ่!', 'ระบบ E-borrow จะมีการปิดปรับปรุงเพื่อเพิ่มประสิทธิภาพและฟีเจอร์ใหม่ๆ ในวันที่ 30 เมษายน 2568 ตั้งแต่เวลา 00:00 ถึง 06:00 น. ขออภัยในความไม่สะดวก', 'การบำรุงรักษา', '2025-04-25 00:00:00', '2025-05-30 11:22:10', '2025-08-18 12:12:24', '[]', 1, 1),
(2, 'อุปกรณ์ใหม่: โดรนสำหรับการถ่ายภาพมุมสูง', 'เราได้เพิ่มโดรน DJI Mavic Air 3 เข้ามาในระบบ ท่านสามารถเริ่มยืมได้ตั้งแต่วันนี้เป็นต้นไป', 'อุปกรณ์ใหม่', '2025-04-22 00:00:00', '2025-05-30 11:22:10', '2025-08-21 10:20:59', '[]', 1, 1),
(3, 'อบรมการใช้งานโปรเจกเตอร์รุ่นใหม่', 'ขอเชิญผู้ที่สนใจเข้าร่วมอบรมการใช้งานโปรเจกเตอร์ Epson EB-L200SW ในวันที่ 5 พฤษภาคม 2568 เวลา 13:00 - 15:00 น. ณ ห้องประชุมใหญ่', 'กิจกรรม', '2025-04-20 00:00:00', '2025-05-30 11:22:10', '2025-08-18 12:12:07', '[]', 1, 1),
(4, 'ประกาศวันหยุดเทศกาลสงกรานต์66', 'เนื่องในเทศกาลสงกรานต์ ระบบ E-borrow จะงดให้บริการในวันที่ 13-15 เมษายน 2568 และจะเปิดให้บริการตามปกติในวันที่ 16 เมษายน 2568', 'ประกาศ', '2025-04-10 00:00:00', '2025-05-30 11:22:10', '2025-08-21 10:21:05', '[]', 1, 1),
(23, 'IT Day and Job Fairs 2025', 'วันนี้ (14 สิงหาคม 2568) คณะวิทยาการสารสนเทศ มหาวิทยาลัยมหาสารคาม จัดงาน “IT Day and Job Fairs 2025” ขึ้นเป็นปีที่ 3 โดยมี รองศาสตราจารย์ ดร.ประยุกต์ ศรีวิไล อธิการบดีมหาวิทยาลัยมหาสารคาม เป็นประธานในพิธีเปิดงาน ณ อาคารคณะวิทยาการสารสนเทศ โดยงานดังกล่าวจัดขึ้นโดยมีวัตถุประสงค์เพื่อเปิดโอกาสให้นิสิตที่กำลังศึกษาและกำลังจะสำเร็จการศึกษา ได้เตรียมความพร้อมก่อนเข้าสู่โลกการทำงาน ผ่านการพบปะและรับฟังข้อมูลโดยตรงจากบริษัทชั้นนำด้านเทคโนโลยีสารสนเทศที่เข้าร่วมงานกว่า 12 แห่ง ซึ่งจะช่วยให้นิสิตได้สำรวจและค้นหาตำแหน่งงานที่ตรงกับความสนใจและความถนัดของตนเอง', 'ประกาศ', '2025-08-21 10:24:20', '2025-08-21 10:24:20', '2025-08-21 10:25:42', '[\"https://res.cloudinary.com/dcepm8sk3/image/upload/v1755771935/e-borrow/news/wrzatjayfsuoudqvddw0.jpg\",\"https://res.cloudinary.com/dcepm8sk3/image/upload/v1755771937/e-borrow/news/dtanoev0uyif8ivvxhx1.jpg\",\"https://res.cloudinary.com/dcepm8sk3/image/upload/v1755771938/e-borrow/news/cuzgdgkfbdi0tfdwtdgv.jpg\",\"https://res.cloudinary.com/dcepm8sk3/image/upload/v1755771939/e-borrow/news/tdedwdncsftouq5dusdw.jpg\",\"https://res.cloudinary.com/dcepm8sk3/image/upload/v1755771940/e-borrow/news/hwa4embdmklsycuhcftr.jpg\",\"https://res.cloudinary.com/dcepm8sk3/image/upload/v1755771941/e-borrow/news/lraeixdikv2rzdgrr3m7.jpg\"]', 1, 1),
(24, 'พิธีลงนามความร่วมมือทางวิชาการ ร่วมกับ บริษัท Extend IT Resource', '🎉คณะวิทยาการสารสนเทศ มหาวิทยาลัยมหาสารคาม ขอเรียนเชิญคณาจารย์ บุคลากร และนิสิต เข้าร่วมงานพิธีดังนี้\n\n✍️พิธีลงนามความร่วมมือทางวิชาการ ร่วมกับ บริษัท Extend IT Resource Co., Ltd. ณ บริเวณห้องโถง ชั้น 2\n\n🔐 พิธีเปิดห้องปฏิบัติการความปลอดภัยทางไซเบอร์ Cybersecurity Laboratory ณ ห้อง IT-106 ชั้น 1\n\n📆 วันศุกร์ที่ 25 กรกฎาคม 2568\n\n🕝 เวลา 13.30 น.\n\n📍 ณ คณะวิทยาการสารสนเทศ มหาวิทยาลัยมหาสารคาม', 'ประกาศ', '2025-08-21 10:27:28', '2025-08-21 10:27:28', '2025-08-21 10:27:36', '[\"https://res.cloudinary.com/dcepm8sk3/image/upload/v1755772047/e-borrow/news/kkyo2igaszwymruodqlf.jpg\"]', 1, 1),
(25, 'ติดตามแจ้งเตือนสถานะครุภัณฑ์', 'add Line เพื่อรับการแจ้งเตือนแบบเรียลไทม์!!', 'ประกาศ', '2025-08-21 19:55:54', '2025-08-21 19:55:54', '2025-08-21 19:55:54', '[\"https://res.cloudinary.com/dcepm8sk3/image/upload/v1755806152/e-borrow/news/byg3ey5kutift15eaqaw.jpg\"]', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `payment_settings`
--

CREATE TABLE `payment_settings` (
  `id` int(10) UNSIGNED NOT NULL,
  `method` enum('promptpay','bank') NOT NULL DEFAULT 'promptpay',
  `promptpay_number` varchar(32) NOT NULL DEFAULT '',
  `bank_name` varchar(128) NOT NULL DEFAULT '',
  `account_name` varchar(128) NOT NULL DEFAULT '',
  `account_number` varchar(64) NOT NULL DEFAULT '',
  `updated_by` int(10) UNSIGNED DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `payment_settings`
--

INSERT INTO `payment_settings` (`id`, `method`, `promptpay_number`, `bank_name`, `account_name`, `account_number`, `updated_by`, `updated_at`) VALUES
(1, 'bank', '0929103592', 'SCB', 'Adisorn Nooklang', '538-261-4672', 80, '2025-08-17 18:46:02');

-- --------------------------------------------------------

--
-- Table structure for table `positions`
--

CREATE TABLE `positions` (
  `position_id` int(11) NOT NULL,
  `position_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `positions`
--

INSERT INTO `positions` (`position_id`, `position_name`) VALUES
(1, 'เจ้าหน้าที่'),
(2, 'นิสิต'),
(3, 'บุคลากร'),
(5, 'ฟฟฟฟ');

-- --------------------------------------------------------

--
-- Table structure for table `repair_requests`
--

CREATE TABLE `repair_requests` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `problem_description` text DEFAULT NULL,
  `request_date` date DEFAULT NULL,
  `estimated_cost` decimal(10,2) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'รอการอนุมัติ',
  `created_at` datetime DEFAULT current_timestamp(),
  `pic_filename` text DEFAULT NULL,
  `repair_code` varchar(255) NOT NULL,
  `note` varchar(255) NOT NULL,
  `budget` int(11) NOT NULL,
  `responsible_person` varchar(255) NOT NULL,
  `approval_date` datetime NOT NULL DEFAULT current_timestamp(),
  `rejection_reason` text DEFAULT NULL COMMENT 'เหตุผลการปฏิเสธคำขอซ่อม',
  `inspection_notes` text DEFAULT NULL COMMENT 'บันทึกการตรวจสอบครุภัณฑ์หลังการซ่อม'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `repair_requests`
--

INSERT INTO `repair_requests` (`id`, `user_id`, `item_id`, `problem_description`, `request_date`, `estimated_cost`, `status`, `created_at`, `pic_filename`, `repair_code`, `note`, `budget`, `responsible_person`, `approval_date`, `rejection_reason`, `inspection_notes`) VALUES
(187, 124, 14, 'ขาตั้งกล้องหัก', '2025-08-21', '300.00', 'rejected', '2025-08-21 10:48:46', '[{\"filename\":\"e-borrow/repair/RP-13653_1\",\"original_name\":{\"filename\":\"e-borrow/repair/RP-13653_1\",\"url\":\"https://res.cloudinary.com/dcepm8sk3/image/upload/v1755773325/e-borrow/repair/RP-13653_1.png\",\"repair_code\":\"RP-13653\",\"index\":1},\"file_path\":\"uploads/repair/e-borrow/repair/RP-13653_1\",\"url\":\"https://res.cloudinary.com/dcepm8sk3/image/upload/v1755773325/e-borrow/repair/RP-13653_1.png\",\"repair_code\":\"RP-13653\",\"index\":1}]', 'RP-13653', '', 300, '', '2025-08-21 17:50:39', 'รายการนี้ไม่อยู่ในขอบเขตงานซ่อม', ''),
(188, 124, 14, 'ขาตั้งกล้องหัก', '2025-08-21', '300.00', 'rejected', '2025-08-21 10:51:51', '[{\"filename\":\"e-borrow/repair/RP-14583_1\",\"original_name\":{\"filename\":\"e-borrow/repair/RP-14583_1\",\"url\":\"https://res.cloudinary.com/dcepm8sk3/image/upload/v1755773510/e-borrow/repair/RP-14583_1.png\",\"repair_code\":\"RP-14583\",\"index\":1},\"file_path\":\"uploads/repair/e-borrow/repair/RP-14583_1\",\"url\":\"https://res.cloudinary.com/dcepm8sk3/image/upload/v1755773510/e-borrow/repair/RP-14583_1.png\",\"repair_code\":\"RP-14583\",\"index\":1}]', 'RP-14583', '', 300, '', '2025-08-21 17:51:40', 'รายการนี้ไม่อยู่ในขอบเขตงานซ่อม', ''),
(189, 124, 14, 'ขาตั้งกล้องหัก ', '2025-08-21', '300.00', 'completed', '2025-08-21 10:53:10', '[{\"filename\":\"e-borrow/repair/RP-50908_1\",\"original_name\":{\"filename\":\"e-borrow/repair/RP-50908_1\",\"url\":\"https://res.cloudinary.com/dcepm8sk3/image/upload/v1755773589/e-borrow/repair/RP-50908_1.jpg\",\"repair_code\":\"RP-50908\",\"index\":1},\"file_path\":\"uploads/repair/e-borrow/repair/RP-50908_1\",\"url\":\"https://res.cloudinary.com/dcepm8sk3/image/upload/v1755773589/e-borrow/repair/RP-50908_1.jpg\",\"repair_code\":\"RP-50908\",\"index\":1}]', 'RP-50908', '', 300, 'admin nakub', '2025-08-21 17:53:18', '', 'ใช้งานไม่ได้'),
(190, 124, 14, 'ปกดหกดกห', '2025-08-21', '3.00', 'approved', '2025-08-21 16:19:04', '[]', 'RP-35141', 'ะัี', 3, 'admin nakub', '2025-08-21 16:23:39', '', ''),
(191, 124, 3, 'sdfsdf', '2025-09-11', '24444.00', 'approved', '2025-09-11 14:39:59', '[]', 'RP-72941', '', 24444, 'admin nakub', '2025-09-11 14:40:11', '', ''),
(192, 124, 14, 'szcsad', '2025-09-11', '333.00', 'approved', '2025-09-11 14:41:56', '[]', 'RP-21465', '', 333, 'admin nakub', '2025-09-11 14:42:17', '', ''),
(193, 124, 14, 'aaaaaaaa', '2025-09-11', '3000.00', 'approved', '2025-09-11 14:48:32', '[{\"filename\":\"e-borrow/repair/RP-49796_1\",\"original_name\":{\"filename\":\"e-borrow/repair/RP-49796_1\",\"url\":\"https://res.cloudinary.com/dcepm8sk3/image/upload/v1757576911/e-borrow/repair/RP-49796_1.jpg\",\"repair_code\":\"RP-49796\",\"index\":1},\"file_path\":\"uploads/repair/e-borrow/repair/RP-49796_1\",\"url\":\"https://res.cloudinary.com/dcepm8sk3/image/upload/v1757576911/e-borrow/repair/RP-49796_1.jpg\",\"repair_code\":\"RP-49796\",\"index\":1}]', 'RP-49796', 'ฟฟฟฟฟ', 5000, 'admin nakub', '2025-09-11 15:11:58', '', ''),
(194, 124, 6, 'ฟหก', '2025-09-11', '200.00', 'approved', '2025-09-11 16:08:18', '[]', 'RP-96885', 'ttttttttttttttttt', 3000, 'admin nakub', '2025-09-11 16:08:57', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `returns`
--

CREATE TABLE `returns` (
  `return_id` int(11) NOT NULL,
  `borrow_id` int(11) NOT NULL,
  `return_date` datetime NOT NULL,
  `return_by` int(11) DEFAULT NULL,
  `fine_amount` decimal(10,2) DEFAULT 0.00,
  `proof_image` varchar(255) DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `notes` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `pay_status` varchar(255) NOT NULL DEFAULT 'pending',
  `payment_method` varchar(255) NOT NULL,
  `damage_fine` int(11) NOT NULL,
  `late_fine` int(11) NOT NULL,
  `late_days` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `approval_required` tinyint(1) DEFAULT 0,
  `approved_by` int(11) DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `verification_notes` text DEFAULT NULL,
  `risk_level` enum('low','medium','high') DEFAULT 'low',
  `payment_due_date` datetime DEFAULT NULL,
  `reminder_sent_count` int(11) DEFAULT 0,
  `last_reminder_sent` timestamp NULL DEFAULT NULL,
  `approval_workflow` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'ขั้นตอนการอนุมัติ' CHECK (json_valid(`approval_workflow`)),
  `risk_assessment_score` decimal(5,2) DEFAULT 0.00 COMMENT 'คะแนนประเมินความเสี่ยง',
  `requires_supervisor_approval` tinyint(1) DEFAULT 0 COMMENT 'ต้องการอนุมัติจากหัวหน้า',
  `supervisor_approved_by` int(11) DEFAULT NULL COMMENT 'หัวหน้าที่อนุมัติ',
  `supervisor_approved_at` timestamp NULL DEFAULT NULL,
  `payment_verification_status` enum('pending','verified','rejected','requires_review') DEFAULT 'pending',
  `payment_verified_by` int(11) DEFAULT NULL,
  `payment_verified_at` timestamp NULL DEFAULT NULL,
  `unusual_activity_flags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'ธงเตือนกิจกรรมผิดปกติ' CHECK (json_valid(`unusual_activity_flags`)),
  `additional_charges` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'ค่าใช้จ่ายเพิ่มเติม' CHECK (json_valid(`additional_charges`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `returns`
--

INSERT INTO `returns` (`return_id`, `borrow_id`, `return_date`, `return_by`, `fine_amount`, `proof_image`, `status`, `notes`, `created_at`, `updated_at`, `pay_status`, `payment_method`, `damage_fine`, `late_fine`, `late_days`, `user_id`, `updated_by`, `approval_required`, `approved_by`, `approved_at`, `verification_notes`, `risk_level`, `payment_due_date`, `reminder_sent_count`, `last_reminder_sent`, `approval_workflow`, `risk_assessment_score`, `requires_supervisor_approval`, `supervisor_approved_by`, `supervisor_approved_at`, `payment_verification_status`, `payment_verified_by`, `payment_verified_at`, `unusual_activity_flags`, `additional_charges`) VALUES
(246, 314, '2025-08-22 03:17:59', 124, '900.00', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1755807516/e-borrow/pay_slip/BR-1130_slip.png', 'pending', '', '2025-08-21 20:18:01', '2025-08-21 20:18:45', 'paid', 'online', 900, 0, 0, 126, NULL, 0, NULL, NULL, NULL, 'low', NULL, 0, NULL, NULL, '0.00', 0, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(247, 308, '2025-08-22 03:23:26', 124, '0.00', NULL, 'pending', '', '2025-08-21 20:23:27', '2025-08-21 20:23:27', 'paid', 'cash', 0, 0, 0, 126, NULL, 0, NULL, NULL, NULL, 'low', NULL, 0, NULL, NULL, '0.00', 0, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(248, 309, '2025-08-22 03:25:30', 124, '250.00', NULL, 'pending', '', '2025-08-21 20:25:31', '2025-08-21 20:25:31', 'paid', 'cash', 250, 0, 0, 119, NULL, 0, NULL, NULL, NULL, 'low', NULL, 0, NULL, NULL, '0.00', 0, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(249, 311, '2025-08-22 03:27:17', 124, '50.00', NULL, 'pending', '', '2025-08-21 20:27:18', '2025-08-21 20:27:18', 'paid', 'cash', 50, 0, 0, 126, NULL, 0, NULL, NULL, NULL, 'low', NULL, 0, NULL, NULL, '0.00', 0, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(250, 310, '2025-08-22 03:36:12', 124, '2700.00', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1755808634/e-borrow/pay_slip/BR-5005_slip.jpg', 'pending', 'ไม่ผ่าน', '2025-08-21 20:36:13', '2025-08-21 20:37:24', 'paid', 'online', 2700, 0, 0, 126, NULL, 0, NULL, NULL, NULL, 'low', NULL, 0, NULL, NULL, '0.00', 0, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(251, 313, '2025-08-22 03:47:36', 124, '0.00', NULL, 'pending', '', '2025-08-21 20:47:37', '2025-08-21 20:47:37', 'paid', 'cash', 0, 0, 0, 119, NULL, 0, NULL, NULL, NULL, 'low', NULL, 0, NULL, NULL, '0.00', 0, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(252, 312, '2025-08-22 03:47:50', 124, '750.00', NULL, 'pending', '', '2025-08-21 20:47:52', '2025-08-21 20:47:52', 'paid', 'cash', 750, 0, 0, 119, NULL, 0, NULL, NULL, NULL, 'low', NULL, 0, NULL, NULL, '0.00', 0, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(253, 317, '2025-08-22 14:05:45', 124, '450.00', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1755846473/e-borrow/pay_slip/BR-6035_slip.jpg', 'pending', '', '2025-08-22 07:05:46', '2025-09-03 03:37:49', 'paid', 'online', 450, 0, 0, 119, NULL, 0, NULL, NULL, NULL, 'low', NULL, 0, NULL, NULL, '0.00', 0, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(254, 315, '2025-09-03 10:50:11', 124, '3100.00', NULL, 'pending', '', '2025-09-03 03:50:11', '2025-09-03 03:50:11', 'paid', 'cash', 3000, 100, 5, 126, NULL, 0, NULL, NULL, NULL, 'low', NULL, 0, NULL, NULL, '0.00', 0, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(255, 318, '2025-09-03 10:50:27', 124, '1250.00', NULL, 'pending', '', '2025-09-03 03:50:27', '2025-09-03 03:50:27', 'paid', 'cash', 1250, 0, 0, 126, NULL, 0, NULL, NULL, NULL, 'low', NULL, 0, NULL, NULL, '0.00', 0, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(256, 316, '2025-09-03 10:50:39', 124, '440.00', NULL, 'pending', '', '2025-09-03 03:50:40', '2025-09-03 03:50:40', 'paid', 'cash', 0, 440, 22, 126, NULL, 0, NULL, NULL, NULL, 'low', NULL, 0, NULL, NULL, '0.00', 0, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(257, 319, '2025-09-06 16:56:35', 124, '0.00', NULL, 'pending', '', '2025-09-06 16:56:35', '2025-09-06 16:56:35', 'paid', 'cash', 0, 0, 0, 126, NULL, 0, NULL, NULL, NULL, 'low', NULL, 0, NULL, NULL, '0.00', 0, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(258, 320, '2025-09-06 16:56:43', 124, '0.00', NULL, 'pending', '', '2025-09-06 16:56:43', '2025-09-06 16:56:43', 'paid', 'cash', 0, 0, 0, 126, NULL, 0, NULL, NULL, NULL, 'low', NULL, 0, NULL, NULL, '0.00', 0, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(259, 322, '2025-09-06 22:31:40', 124, '1500.00', NULL, 'pending', '', '2025-09-06 22:31:47', '2025-09-06 22:31:47', 'paid', 'cash', 1500, 0, 0, 126, NULL, 0, NULL, NULL, NULL, 'low', NULL, 0, NULL, NULL, '0.00', 0, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(260, 321, '2025-09-06 22:31:59', 124, '4500.00', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1757280856/e-borrow/pay_slip/BR-8724_slip.png', 'pending', '', '2025-09-06 22:32:05', '2025-09-08 04:34:49', 'paid', 'online', 4500, 0, 0, 126, NULL, 0, NULL, NULL, NULL, 'low', NULL, 0, NULL, NULL, '0.00', 0, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(261, 323, '2025-09-06 23:00:53', 124, '3000.00', NULL, 'pending', '', '2025-09-06 23:01:00', '2025-09-06 23:01:00', 'paid', 'cash', 3000, 0, 0, 126, NULL, 0, NULL, NULL, NULL, 'low', NULL, 0, NULL, NULL, '0.00', 0, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(262, 344, '2025-09-07 18:52:19', 124, '0.00', NULL, 'pending', '', '2025-09-07 18:52:19', '2025-09-07 18:52:19', 'paid', 'cash', 0, 0, 0, 126, NULL, 0, NULL, NULL, NULL, 'low', NULL, 0, NULL, NULL, '0.00', 0, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(263, 345, '2025-09-07 19:16:47', 124, '0.00', NULL, 'pending', '', '2025-09-07 19:16:47', '2025-09-07 19:16:47', 'paid', 'cash', 0, 0, 0, 126, NULL, 0, NULL, NULL, NULL, 'low', NULL, 0, NULL, NULL, '0.00', 0, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(264, 346, '2025-09-08 04:17:53', 124, '0.00', NULL, 'pending', '', '2025-09-08 04:17:54', '2025-09-08 04:17:54', 'paid', 'cash', 0, 0, 0, 126, NULL, 0, NULL, NULL, NULL, 'low', NULL, 0, NULL, NULL, '0.00', 0, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(265, 347, '2025-09-08 04:34:00', 124, '250.00', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1757280876/e-borrow/pay_slip/BR-4255_slip.png', 'pending', '', '2025-09-08 04:34:01', '2025-09-08 04:34:52', 'paid', 'online', 250, 0, 0, 126, NULL, 0, NULL, NULL, NULL, 'low', '2025-09-15 04:34:00', 0, NULL, NULL, '0.00', 0, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(266, 348, '2025-09-08 06:52:55', 124, '0.00', NULL, 'pending', '', '2025-09-08 06:52:56', '2025-09-08 06:52:56', 'paid', 'cash', 0, 0, 0, 126, NULL, 0, NULL, NULL, NULL, 'low', NULL, 0, NULL, NULL, '0.00', 0, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(267, 349, '2025-09-08 06:53:05', 124, '0.00', NULL, 'pending', '', '2025-09-08 06:53:06', '2025-09-08 06:53:06', 'paid', 'cash', 0, 0, 0, 126, NULL, 0, NULL, NULL, NULL, 'low', NULL, 0, NULL, NULL, '0.00', 0, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(268, 350, '2025-09-08 19:16:24', 124, '0.00', NULL, 'pending', '', '2025-09-08 19:16:25', '2025-09-08 19:16:25', 'paid', 'cash', 0, 0, 0, 126, NULL, 0, NULL, NULL, NULL, 'low', NULL, 0, NULL, NULL, '0.00', 0, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(269, 351, '2025-09-11 14:37:23', 124, '1500.00', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1757576318/e-borrow/pay_slip/BR-5018_slip.png', 'pending', '', '2025-09-11 14:37:25', '2025-09-11 14:39:02', 'paid', 'online', 1500, 0, 0, 119, NULL, 0, NULL, NULL, NULL, 'low', '2025-09-18 14:37:23', 0, NULL, NULL, '0.00', 0, NULL, NULL, 'pending', NULL, NULL, NULL, NULL),
(270, 353, '2025-09-11 15:29:38', 124, '250.00', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1757582044/e-borrow/pay_slip/BR-4867_slip.png', 'pending', '', '2025-09-11 15:29:39', '2025-09-11 16:16:16', 'paid', 'online', 250, 0, 0, 119, NULL, 0, NULL, NULL, NULL, 'low', '2025-09-18 15:29:38', 0, NULL, NULL, '0.00', 0, NULL, NULL, 'pending', NULL, NULL, NULL, NULL);

--
-- Triggers `returns`
--
DELIMITER $$
CREATE TRIGGER `tr_set_payment_due_date` BEFORE INSERT ON `returns` FOR EACH ROW BEGIN
  IF NEW.fine_amount > 0 AND NEW.payment_due_date IS NULL THEN
    SET NEW.payment_due_date = DATE_ADD(NEW.return_date, INTERVAL 7 DAY);
  END IF;
  
  -- Set risk level based on fine amount
  IF NEW.fine_amount > 5000 THEN
    SET NEW.risk_level = 'high';
  ELSEIF NEW.fine_amount > 2000 THEN
    SET NEW.risk_level = 'medium';
  ELSE
    SET NEW.risk_level = 'low';
  END IF;
  
  -- Set approval required for high amounts
  IF NEW.fine_amount > 3000 THEN
    SET NEW.approval_required = TRUE;
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `return_items`
--

CREATE TABLE `return_items` (
  `return_item_id` int(11) NOT NULL,
  `return_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `damage_level_id` int(11) DEFAULT NULL,
  `damage_note` text DEFAULT NULL,
  `fine_amount` decimal(10,2) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `return_items`
--

INSERT INTO `return_items` (`return_item_id`, `return_id`, `item_id`, `damage_level_id`, `damage_note`, `fine_amount`, `created_at`, `updated_at`) VALUES
(176, 246, 36, 10, 'sssss', '900.00', '2025-08-21 20:18:01', '2025-08-21 20:18:01'),
(177, 247, 3, 5, '', '0.00', '2025-08-21 20:23:27', '2025-08-21 20:23:27'),
(178, 248, 4, 10, '', '250.00', '2025-08-21 20:25:32', '2025-08-21 20:25:32'),
(179, 249, 14, 10, 'ffff', '50.00', '2025-08-21 20:27:18', '2025-08-21 20:27:18'),
(180, 250, 6, 7, '', '2700.00', '2025-08-21 20:36:13', '2025-08-21 20:36:13'),
(181, 251, 35, 5, '', '0.00', '2025-08-21 20:47:37', '2025-08-21 20:47:37'),
(182, 252, 15, 7, '', '750.00', '2025-08-21 20:47:52', '2025-08-21 20:47:52'),
(183, 253, 6, 10, '', '450.00', '2025-08-22 07:05:46', '2025-08-22 07:05:46'),
(184, 254, 3, 6, '', '3000.00', '2025-09-03 03:50:11', '2025-09-03 03:50:11'),
(185, 255, 35, 10, '', '1250.00', '2025-09-03 03:50:27', '2025-09-03 03:50:27'),
(186, 256, 4, 5, '', '0.00', '2025-09-03 03:50:40', '2025-09-03 03:50:40'),
(187, 257, 3, 5, '', '0.00', '2025-09-06 16:56:35', '2025-09-06 16:56:35'),
(188, 258, 4, 5, '', '0.00', '2025-09-06 16:56:43', '2025-09-06 16:56:43'),
(189, 259, 4, 7, '', '1500.00', '2025-09-06 22:31:47', '2025-09-06 22:31:47'),
(190, 260, 6, 8, '', '4500.00', '2025-09-06 22:32:05', '2025-09-06 22:32:05'),
(191, 261, 3, 6, '', '3000.00', '2025-09-06 23:01:00', '2025-09-06 23:01:00'),
(192, 262, 4, 5, '', '0.00', '2025-09-07 18:52:19', '2025-09-07 18:52:19'),
(193, 263, 3, 5, '', '0.00', '2025-09-07 19:16:47', '2025-09-07 19:16:47'),
(194, 264, 35, 5, '', '0.00', '2025-09-08 04:17:54', '2025-09-08 04:17:54'),
(195, 265, 4, 10, '', '250.00', '2025-09-08 04:34:01', '2025-09-08 04:34:01'),
(196, 266, 3, 5, '', '0.00', '2025-09-08 06:52:56', '2025-09-08 06:52:56'),
(197, 267, 15, 5, '', '0.00', '2025-09-08 06:53:06', '2025-09-08 06:53:06'),
(198, 268, 3, 5, '', '0.00', '2025-09-08 19:16:25', '2025-09-08 19:16:25'),
(199, 269, 4, 7, '', '1500.00', '2025-09-11 14:37:25', '2025-09-11 14:37:25'),
(200, 270, 15, 6, '', '250.00', '2025-09-11 15:29:39', '2025-09-11 15:29:39');

--
-- Triggers `return_items`
--
DELIMITER $$
CREATE TRIGGER `tr_update_equipment_damage_cost` AFTER INSERT ON `return_items` FOR EACH ROW BEGIN
  IF NEW.damage_level_id > 5 THEN
    UPDATE equipment 
    SET total_damage_cost = total_damage_cost + NEW.fine_amount
    WHERE item_id = NEW.item_id;
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL,
  `role_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`role_id`, `role_name`) VALUES
(1, 'admin'),
(2, 'executive'),
(3, 'user');

-- --------------------------------------------------------

--
-- Table structure for table `room`
--

CREATE TABLE `room` (
  `room_id` int(11) NOT NULL,
  `room_name` varchar(100) NOT NULL,
  `room_code` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `detail` text DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `room`
--

INSERT INTO `room` (`room_id`, `room_name`, `room_code`, `address`, `detail`, `image_url`, `note`, `created_at`, `updated_at`) VALUES
(1, 'ห้องประชุมใหญ่', 'RM-001', 'ชั้น 1 อาคารหลัก', 'ห้องประชุมขนาดใหญ่สำหรับการประชุมทั่วไป', '[\"https://res.cloudinary.com/dcepm8sk3/image/upload/v1755771419/e-borrow/roomimg/room_RM-001_1755771417980.webp\"]', 'รองรับผู้เข้าร่วมได้ 50 คน', '2025-08-04 08:55:34', '2025-08-21 10:17:00'),
(2, 'ห้องประชุมเล็ก', 'RM-002', 'ชั้น 2 อาคารหลัก', 'ห้องประชุมขนาดเล็กสำหรับการประชุมกลุ่มย่อย', '[\"https://res.cloudinary.com/dcepm8sk3/image/upload/v1755771482/e-borrow/roomimg/room_RM-002_1755771482700.jpg\"]', 'รองรับผู้เข้าร่วมได้ 10 คน', '2025-08-04 08:55:34', '2025-08-21 10:18:03'),
(5, 'ห้องพักผ่อน', 'RM-005', 'ชั้น 2 อาคารหลัก', 'ห้องพักผ่อนสำหรับพนักงาน', '[\"https://res.cloudinary.com/dcepm8sk3/image/upload/v1755771442/e-borrow/roomimg/room_RM-005_1755771441171.jpg\"]', 'มีเครื่องดื่มและอาหารว่าง', '2025-08-04 08:55:34', '2025-08-21 10:17:23'),
(6, 'ห้องประชุมใหญ่', 'RM-075', 'ชั้น 1 อาคารหลัก', 'ห้องประชุมขนาดใหญ่สำหรับการประชุมทั่วไป', '[\"https://res.cloudinary.com/dcepm8sk3/image/upload/v1755771431/e-borrow/roomimg/room_RM-075_1755771429642.jpg\"]', 'รองรับผู้เข้าร่วมได้ 50 คน', '2025-08-04 09:02:01', '2025-08-21 10:17:12'),
(8, 'com3', 'RM-016', 'ชั้น 4', 'ห้องประชุม 3', '[\"https://res.cloudinary.com/dcepm8sk3/image/upload/v1754824358/e-borrow/roomimg/room_x52_1754824339834.png\"]', 'รองรับ 20 คน', '2025-08-05 05:28:02', '2025-08-13 07:11:53'),
(10, 'com4', 'RM-017', 'ชั้น 5', 'รองรับผู้เข้าร่วมได้ 50 คน', '[\"https://res.cloudinary.com/dcepm8sk3/image/upload/v1754824416/e-borrow/roomimg/room_%E0%B9%88IT-401565_1754824398659.jpg\"]', 'รองรับ 20 คน', '2025-08-05 09:26:03', '2025-08-18 09:59:33'),
(11, 'com9', 'RM-011', 'ชั้น 4', 'ห้องประชุม2', '[\"https://res.cloudinary.com/dcepm8sk3/image/upload/v1754824338/e-borrow/roomimg/room_er222_1754824321263.jpg\"]', 'รองรับ 15 คน', '2025-08-06 07:55:29', '2025-09-07 04:19:10'),
(12, 'com9', 'RM-012', 'ชั้น 5', 'ห้องประชุม', '[\"https://res.cloudinary.com/dcepm8sk3/image/upload/v1754824301/e-borrow/roomimg/room_it-500_1754824282927.jpg\"]', 'มีโต๊ะทำงาน 5 ชุด', '2025-08-06 08:08:53', '2025-09-06 21:13:14'),
(13, 'com5', 'RM-018', 'ชั้น 3', 'ห้องประชุม 6', '[\"https://res.cloudinary.com/dcepm8sk3/image/upload/v1754824432/e-borrow/roomimg/room_%E0%B8%AB%E0%B8%81%E0%B8%81%E0%B8%94_1754824417046.jpg\"]', 'รองรับ 50 คน', '2025-08-06 08:14:42', '2025-08-18 11:17:22');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `user_code` varchar(20) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `avatar` text DEFAULT NULL,
  `role_id` int(11) DEFAULT 3,
  `position_id` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `postal_no` varchar(10) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Fullname` varchar(255) NOT NULL,
  `parish` varchar(255) NOT NULL,
  `line_id` varchar(255) DEFAULT 'ยังไม่ผูกบัญชี',
  `line_notify_enabled` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `user_code`, `username`, `email`, `password`, `phone`, `avatar`, `role_id`, `position_id`, `branch_id`, `street`, `district`, `province`, `postal_no`, `created_at`, `updated_at`, `Fullname`, `parish`, `line_id`, `line_notify_enabled`) VALUES
(119, '65011211033', '65011211022', '65011211022@msu.ac.th', '$2b$10$0oHPC7GPTelA8Gxwr6o3../JPPC72dSLlDWn.HM/BOPwOyMAC4H3K', '0986286323', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1755770259/e-borrow/user/65011211022.png', 3, 2, 2, 'ทีทีแมนชั่น', 'กันทรวิชัย', 'มหาสารคาม', '44150', '2025-07-31 09:18:32', '2025-09-03 03:06:22', 'กิตติขจร คุ้มบุ่งคล้า', 'ขามเรียง', 'U6c2c71dc16c687eca1782326dcaf2bc6', 0),
(122, '64010917484', '64010917484', '64010917484@msu.ac.th', '$2b$10$Y70m9SS8JlgmHLU5hxtKz.JA8ayu5qw.TAedQVL787tX2SgwPWBJi', '0642359028', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1755495568/e-borrow/user/lux4f73632ic6ennampo.jpg', 3, 2, 2, 'อีเเ', 'พระพุทธบาท', 'สระบุรี', '18120', '2025-08-18 05:34:00', '2025-08-22 06:04:33', 'อริสา วันยะโส', 'ห้วยป่าหวาย', 'U285130c26784bcce4448f00d5b719cc0', 0),
(124, '00000000001', 'admin', 'admin@msu.ac.th', '$2b$10$ee58ytrlwhFF87wIOgMY3e7rNfl4LW1aBkB0zwuOtIJqOhlvbo68i', '0986286323', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1755770633/e-borrow/user/00000000001.webp', 1, 1, 7, 'มหาวิทยาลัยมหาสารคาม', 'กันทรวิชัย', 'มหาสารคาม', '44150', '2025-08-21 10:03:12', '2025-08-21 10:03:53', 'admin nakub', 'ขามเรียง', NULL, 0),
(125, '00000000002', 'x', 'executive@gmail.com', '$2b$10$et0btrK31FDMSIcCP8n09ezxafZag.wdPe2FJw4Kdoxik/hk0gsvO', '0999999999', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1755771307/e-borrow/user/00000000002.png', 2, 3, 2, 'มหาวิทยาลัยมหาสารคาม', 'กันทรวิชัย', 'มหาสารคาม', '44150', '2025-08-21 10:12:59', '2025-08-21 10:15:07', ' ผู้บริหาร', 'ขามเรียง', NULL, 0),
(126, '65011211033', '65011211033', 'aod0929103592@gmail.com', '$2b$10$aqBYQY4JgGFJ9cVvLqfh5uL9ENi5fEwavP4wmXr1qtap5l15OKycy', '0929103592', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1755799794/e-borrow/user/65011211033.jpg', 3, 2, 2, 'บ้านเลขที่84 หมู่11', 'นากลาง', 'หนองบัวลำภู', '39170', '2025-08-21 18:09:56', '2025-09-06 22:32:04', 'มาริโอ้', 'นากลาง', 'U94097fb047db33025f5a24fc4979de4f', 0),
(127, '65011211000', '65011211000', '65011211033@msu.ac.th', '$2b$10$NtnBDsLPbQpdLRxa/l/xeO2pkxeZ4GcU/MiRajQeCq8GCSiL.c2si', '0929103591', 'https://res.cloudinary.com/dcepm8sk3/image/upload/v1757175474/e-borrow/user/65011211000.jpg', 3, 3, 7, 'ฟฟฟฟฟฟฟฟฟฟฟ', 'ศรีราชา', 'ชลบุรี', '20230', '2025-08-26 14:04:58', '2025-09-07 20:12:22', '666666666666666', 'ทุ่งสุขลา', NULL, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_action_type` (`action_type`),
  ADD KEY `idx_table_name` (`table_name`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_username` (`username`),
  ADD KEY `idx_user_created` (`user_id`,`created_at`),
  ADD KEY `idx_action_created` (`action_type`,`created_at`),
  ADD KEY `idx_search` (`description`(255),`username`(50),`request_url`(100));

--
-- Indexes for table `borrow_items`
--
ALTER TABLE `borrow_items`
  ADD PRIMARY KEY (`borrow_item_id`),
  ADD KEY `borrow_id` (`borrow_id`),
  ADD KEY `item_id` (`item_id`);

--
-- Indexes for table `borrow_transactions`
--
ALTER TABLE `borrow_transactions`
  ADD PRIMARY KEY (`borrow_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_borrower_latitude` (`borrower_latitude`),
  ADD KEY `idx_borrower_longitude` (`borrower_longitude`),
  ADD KEY `idx_last_location_update` (`last_location_update`),
  ADD KEY `idx_status_location` (`status`,`borrower_latitude`,`borrower_longitude`),
  ADD KEY `idx_borrow_priority` (`priority_level`),
  ADD KEY `idx_borrow_approved_by` (`approved_by`),
  ADD KEY `fk_borrow_escalated_to` (`escalated_to`),
  ADD KEY `idx_status_date` (`status`,`created_at`);

--
-- Indexes for table `branches`
--
ALTER TABLE `branches`
  ADD PRIMARY KEY (`branch_id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `contact_info`
--
ALTER TABLE `contact_info`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `damage_levels`
--
ALTER TABLE `damage_levels`
  ADD PRIMARY KEY (`damage_id`);

--
-- Indexes for table `equipment`
--
ALTER TABLE `equipment`
  ADD PRIMARY KEY (`item_id`),
  ADD KEY `fk_equipment_room` (`room_id`),
  ADD KEY `idx_equipment_category_id` (`category_id`),
  ADD KEY `idx_equipment_next_maintenance` (`next_maintenance_date`),
  ADD KEY `idx_equipment_warranty_expiry` (`warranty_expiry_date`),
  ADD KEY `idx_equipment_borrow_count` (`total_borrow_count`),
  ADD KEY `idx_status_category` (`status`,`category_id`);

--
-- Indexes for table `footer_settings`
--
ALTER TABLE `footer_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payment_settings`
--
ALTER TABLE `payment_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `positions`
--
ALTER TABLE `positions`
  ADD PRIMARY KEY (`position_id`);

--
-- Indexes for table `repair_requests`
--
ALTER TABLE `repair_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user` (`user_id`),
  ADD KEY `fk_equipment` (`item_id`);

--
-- Indexes for table `returns`
--
ALTER TABLE `returns`
  ADD PRIMARY KEY (`return_id`),
  ADD KEY `borrow_id` (`borrow_id`),
  ADD KEY `return_by` (`return_by`),
  ADD KEY `fk_returns_user` (`user_id`),
  ADD KEY `fk_returns_approved_by` (`approved_by`),
  ADD KEY `idx_returns_approval_required` (`approval_required`),
  ADD KEY `idx_returns_risk_level` (`risk_level`),
  ADD KEY `idx_returns_payment_due` (`payment_due_date`),
  ADD KEY `idx_returns_updated_by` (`updated_by`),
  ADD KEY `fk_returns_supervisor` (`supervisor_approved_by`),
  ADD KEY `fk_returns_payment_verifier` (`payment_verified_by`),
  ADD KEY `idx_pay_status_amount` (`pay_status`,`fine_amount`);

--
-- Indexes for table `return_items`
--
ALTER TABLE `return_items`
  ADD PRIMARY KEY (`return_item_id`),
  ADD KEY `return_id` (`return_id`),
  ADD KEY `item_id` (`item_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`);

--
-- Indexes for table `room`
--
ALTER TABLE `room`
  ADD PRIMARY KEY (`room_id`),
  ADD UNIQUE KEY `room_code` (`room_code`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role_id` (`role_id`),
  ADD KEY `position_id` (`position_id`),
  ADD KEY `branch_id` (`branch_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1560;

--
-- AUTO_INCREMENT for table `borrow_items`
--
ALTER TABLE `borrow_items`
  MODIFY `borrow_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=436;

--
-- AUTO_INCREMENT for table `borrow_transactions`
--
ALTER TABLE `borrow_transactions`
  MODIFY `borrow_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=354;

--
-- AUTO_INCREMENT for table `branches`
--
ALTER TABLE `branches`
  MODIFY `branch_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `contact_info`
--
ALTER TABLE `contact_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `damage_levels`
--
ALTER TABLE `damage_levels`
  MODIFY `damage_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `equipment`
--
ALTER TABLE `equipment`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `footer_settings`
--
ALTER TABLE `footer_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `news`
--
ALTER TABLE `news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `payment_settings`
--
ALTER TABLE `payment_settings`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `positions`
--
ALTER TABLE `positions`
  MODIFY `position_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `repair_requests`
--
ALTER TABLE `repair_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=195;

--
-- AUTO_INCREMENT for table `returns`
--
ALTER TABLE `returns`
  MODIFY `return_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=271;

--
-- AUTO_INCREMENT for table `return_items`
--
ALTER TABLE `return_items`
  MODIFY `return_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=201;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `room`
--
ALTER TABLE `room`
  MODIFY `room_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=128;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

--
-- Constraints for table `borrow_items`
--
ALTER TABLE `borrow_items`
  ADD CONSTRAINT `borrow_items_ibfk_1` FOREIGN KEY (`borrow_id`) REFERENCES `borrow_transactions` (`borrow_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `borrow_items_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `equipment` (`item_id`) ON DELETE CASCADE;

--
-- Constraints for table `borrow_transactions`
--
ALTER TABLE `borrow_transactions`
  ADD CONSTRAINT `fk_borrow_approved_by` FOREIGN KEY (`approved_by`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `fk_borrow_escalated_to` FOREIGN KEY (`escalated_to`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

--
-- Constraints for table `equipment`
--
ALTER TABLE `equipment`
  ADD CONSTRAINT `fk_equipment_category` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`),
  ADD CONSTRAINT `fk_equipment_room` FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `repair_requests`
--
ALTER TABLE `repair_requests`
  ADD CONSTRAINT `fk_equipment` FOREIGN KEY (`item_id`) REFERENCES `equipment` (`item_id`),
  ADD CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `returns`
--
ALTER TABLE `returns`
  ADD CONSTRAINT `fk_returns_approved_by` FOREIGN KEY (`approved_by`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `fk_returns_payment_verifier` FOREIGN KEY (`payment_verified_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_returns_supervisor` FOREIGN KEY (`supervisor_approved_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_returns_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `fk_returns_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `returns_ibfk_1` FOREIGN KEY (`borrow_id`) REFERENCES `borrow_transactions` (`borrow_id`),
  ADD CONSTRAINT `returns_ibfk_3` FOREIGN KEY (`return_by`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `return_items`
--
ALTER TABLE `return_items`
  ADD CONSTRAINT `return_items_ibfk_1` FOREIGN KEY (`return_id`) REFERENCES `returns` (`return_id`),
  ADD CONSTRAINT `return_items_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `equipment` (`item_id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`),
  ADD CONSTRAINT `users_ibfk_2` FOREIGN KEY (`position_id`) REFERENCES `positions` (`position_id`),
  ADD CONSTRAINT `users_ibfk_3` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`branch_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
