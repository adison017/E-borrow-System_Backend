-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mysql.railway.internal:3306
-- Generation Time: Aug 04, 2025 at 07:59 AM
-- Server version: 9.3.0
-- PHP Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `e-borrow`
--

-- --------------------------------------------------------

--
-- Table structure for table `borrow_items`
--

CREATE TABLE `borrow_items` (
  `borrow_item_id` int NOT NULL,
  `borrow_id` int NOT NULL,
  `item_id` int NOT NULL,
  `quantity` int DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `borrow_items`
--

INSERT INTO `borrow_items` (`borrow_item_id`, `borrow_id`, `item_id`, `quantity`) VALUES
(199, 146, 3, 1),
(200, 146, 4, 1),
(201, 146, 6, 1),
(202, 147, 14, 1),
(203, 148, 15, 1),
(204, 149, 19, 1),
(205, 150, 3, 1),
(206, 150, 4, 1),
(207, 150, 6, 1),
(208, 151, 3, 1),
(209, 151, 4, 1),
(210, 151, 6, 1),
(211, 152, 4, 1),
(212, 152, 6, 1),
(213, 153, 3, 1),
(214, 153, 4, 1),
(215, 153, 6, 1),
(216, 153, 14, 1),
(217, 154, 3, 1),
(218, 154, 4, 1),
(219, 154, 6, 1),
(220, 155, 4, 1),
(221, 155, 6, 1),
(222, 156, 3, 1),
(223, 156, 14, 1),
(224, 156, 15, 1),
(225, 157, 3, 1),
(226, 158, 4, 1),
(227, 158, 6, 1),
(228, 159, 3, 1),
(229, 159, 4, 1),
(230, 160, 6, 1),
(231, 160, 14, 1),
(232, 161, 15, 1),
(233, 161, 19, 1),
(234, 162, 3, 1),
(235, 162, 4, 1),
(236, 163, 6, 1),
(237, 163, 14, 1),
(238, 164, 15, 1),
(239, 164, 19, 1),
(240, 165, 19, 1),
(241, 166, 4, 1),
(242, 167, 4, 1),
(243, 168, 4, 1),
(244, 168, 6, 1),
(245, 168, 3, 1),
(246, 169, 14, 1),
(247, 170, 14, 1),
(248, 171, 4, 1),
(249, 172, 4, 1),
(250, 173, 4, 1),
(251, 174, 4, 1),
(252, 175, 15, 1),
(253, 176, 19, 1),
(254, 177, 4, 1),
(255, 178, 4, 1),
(256, 179, 6, 1),
(257, 180, 19, 1),
(258, 181, 3, 1),
(259, 182, 15, 1),
(260, 182, 14, 1),
(261, 183, 3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `borrow_transactions`
--

CREATE TABLE `borrow_transactions` (
  `borrow_id` int NOT NULL,
  `user_id` int NOT NULL,
  `borrow_date` date NOT NULL,
  `return_date` date NOT NULL,
  `status` enum('pending','pending_approval','approved','rejected','carry','completed','waiting_payment') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `borrow_code` varchar(255) NOT NULL,
  `purpose` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `rejection_reason` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `signature_image` text,
  `handover_photo` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `important_documents` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `borrow_transactions`
--

INSERT INTO `borrow_transactions` (`borrow_id`, `user_id`, `borrow_date`, `return_date`, `status`, `created_at`, `updated_at`, `borrow_code`, `purpose`, `rejection_reason`, `signature_image`, `handover_photo`, `important_documents`) VALUES
(146, 79, '2025-07-28', '2025-08-04', 'completed', '2025-07-27 14:03:06', '2025-07-27 14:31:59', 'BR-8121', 'พไำพไำพไ', NULL, 'signature/signature-BR-8121.jpg', 'handover_photo/handover-BR-8121.jpg', ''),
(147, 79, '2025-07-28', '2025-08-04', 'completed', '2025-07-27 14:03:41', '2025-07-27 14:14:43', 'BR-1178', 'ohgoh', NULL, 'signature/signature-BR-1178.jpg', 'handover_photo/handover-BR-1178.jpg', ''),
(148, 79, '2025-07-28', '2025-08-04', 'completed', '2025-07-27 14:07:57', '2025-08-01 09:16:29', 'BR-4383', 'ฟหก', NULL, 'signature/signature-BR-4383.jpg', 'handover_photo/handover-BR-4383.jpg', ''),
(149, 79, '2025-07-28', '2025-08-04', 'completed', '2025-07-27 14:09:49', '2025-08-01 09:19:49', 'BR-6119', 'กดเกดเ', NULL, 'signature/signature-BR-6119.jpg', 'handover_photo/handover-BR-6119.jpg', ''),
(150, 117, '2025-07-29', '2025-08-05', 'completed', '2025-07-28 15:43:32', '2025-07-28 15:50:38', 'BR-3978', 'เอาไปถ่ายงานด่วน', NULL, 'signature/signature-BR-3978.jpg', 'handover_photo/handover-BR-3978.jpg', ''),
(151, 79, '2025-08-02', '2025-08-09', 'completed', '2025-08-01 09:04:50', '2025-08-01 09:07:43', 'BR-6140', 'เล่นเกม', NULL, 'signature/signature-BR-6140.jpg', 'handover_photo/handover-BR-6140.jpg', ''),
(152, 79, '2025-08-02', '2025-08-09', 'completed', '2025-08-01 09:13:31', '2025-08-01 09:25:13', 'BR-3572', 'ยยยยยย', NULL, 'signature/signature-BR-3572.jpg', 'handover_photo/handover-BR-3572.jpg', ''),
(153, 79, '2025-08-02', '2025-08-09', 'completed', '2025-08-01 09:25:56', '2025-08-01 09:29:42', 'BR-3890', '้ส่าส', NULL, 'signature/signature-BR-3890.jpg', 'handover_photo/handover-BR-3890.jpg', ''),
(154, 79, '2025-08-02', '2025-08-09', 'completed', '2025-08-01 09:31:36', '2025-08-01 09:36:21', 'BR-7409', '55+6+5', NULL, 'signature/signature-BR-7409.jpg', 'handover_photo/handover-BR-7409.jpg', ''),
(155, 79, '2025-08-02', '2025-08-09', 'completed', '2025-08-01 09:45:35', '2025-08-01 09:47:20', 'BR-5273', 'ปแปแ', NULL, 'signature/signature-BR-5273.jpg', 'handover_photo/handover-BR-5273.jpg', ''),
(156, 79, '2025-08-02', '2025-08-09', 'completed', '2025-08-01 09:45:52', '2025-08-01 09:55:30', 'BR-5237', 'ผปแผปแ', NULL, 'signature/signature-BR-5237.jpg', 'handover_photo/handover-BR-5237.jpg', ''),
(157, 79, '2025-08-02', '2025-08-09', 'completed', '2025-08-01 09:59:25', '2025-08-01 10:01:21', 'BR-6939', 'รนีรน', NULL, 'signature/signature-BR-6939.jpg', 'handover_photo/handover-BR-6939.jpg', ''),
(158, 79, '2025-08-02', '2025-08-09', 'completed', '2025-08-01 09:59:32', '2025-08-01 10:06:13', 'BR-2372', 'ีนีรนีรนีร', NULL, 'signature/signature-BR-2372.jpg', 'handover_photo/handover-BR-2372.jpg', ''),
(159, 79, '2025-08-02', '2025-08-09', 'completed', '2025-08-01 10:10:07', '2025-08-01 10:11:55', 'BR-7497', 'dfgdgdfg', NULL, NULL, NULL, ''),
(160, 79, '2025-08-02', '2025-08-09', 'completed', '2025-08-01 10:10:15', '2025-08-01 10:16:01', 'BR-1088', 'dgdfgdfg', NULL, NULL, NULL, ''),
(161, 79, '2025-08-02', '2025-08-09', 'completed', '2025-08-01 10:10:21', '2025-08-01 10:21:57', 'BR-2983', 'dfgdgdf', NULL, NULL, NULL, ''),
(162, 79, '2025-08-02', '2025-08-09', 'completed', '2025-08-01 10:23:24', '2025-08-01 10:25:19', 'BR-2142', 'ด้ดเ้เด้', '', NULL, NULL, ''),
(163, 79, '2025-08-02', '2025-08-09', 'completed', '2025-08-01 10:23:33', '2025-08-01 10:26:14', 'BR-6228', 'ดเ้ดเ้ดเ้', '', NULL, NULL, ''),
(164, 79, '2025-08-02', '2025-08-09', 'completed', '2025-08-01 10:23:43', '2025-08-01 10:27:19', 'BR-6338', 'ดเ้ดเ้', '', NULL, NULL, ''),
(165, 79, '2025-08-04', '2025-08-11', 'completed', '2025-08-03 09:11:59', '2025-08-04 04:03:10', 'BR-6636', 'fffff', NULL, NULL, NULL, ''),
(166, 79, '2025-08-03', '2025-08-10', 'completed', '2025-08-04 03:58:33', '2025-08-04 04:04:20', 'BR-9224', 'ใช้ในการเรียน', NULL, NULL, NULL, '[{\"filename\":\"BRW-20250803-001-1754279912457-231548811.pdf\",\"original_name\":\"QR_Codes_Equipment (5).pdf\",\"file_path\":\"uploads/important_documents/BRW-20250803-001-1754279912457-231548811.pdf\",\"file_size\":1686937,\"mime_type\":\"application/pdf\"}]'),
(167, 79, '2025-08-05', '2025-08-12', 'completed', '2025-08-04 04:01:19', '2025-08-04 04:04:20', 'BR-8252', 'fffff', NULL, NULL, NULL, NULL),
(168, 79, '2025-08-05', '2025-08-12', 'completed', '2025-08-04 04:01:22', '2025-08-04 04:04:20', 'BR-6151', 'fffff', NULL, NULL, NULL, NULL),
(169, 79, '2025-08-05', '2025-08-12', 'completed', '2025-08-04 04:01:36', '2025-08-04 04:04:20', 'BR-9614', 'dddfdf', NULL, NULL, NULL, NULL),
(170, 79, '2025-08-05', '2025-08-12', 'completed', '2025-08-04 04:11:59', '2025-08-04 04:42:28', 'BR-9310', 'dfdfdf', '', NULL, NULL, '[{\"filename\":\"BR-1754280719257-1754280719257-344120036.pdf\",\"original_name\":\"QR_Codes_Equipment (6).pdf\",\"file_path\":\"uploads/important_documents/BR-1754280719257-1754280719257-344120036.pdf\",\"file_size\":1686937,\"mime_type\":\"application/pdf\"},{\"filename\":\"BR-1754280719347-1754280719348-516565445.docx\",\"original_name\":\"pro2.docx\",\"file_path\":\"uploads/important_documents/BR-1754280719347-1754280719348-516565445.docx\",\"file_size\":538730,\"mime_type\":\"application/vnd.openxmlformats-officedocument.wordprocessingml.document\"}]'),
(171, 79, '2025-08-03', '2025-08-10', 'completed', '2025-08-04 04:15:02', '2025-08-04 04:42:37', 'BR-4241', 'ใช้ในการเรียน', '', NULL, NULL, '[{\"filename\":\"BRW-20250803-001-1754280902098-950166692.pdf\",\"original_name\":\"QR_Codes_Equipment (5).pdf\",\"file_path\":\"uploads/important_documents/BRW-20250803-001-1754280902098-950166692.pdf\",\"file_size\":1686937,\"mime_type\":\"application/pdf\"}]'),
(172, 79, '2025-08-03', '2025-08-10', 'completed', '2025-08-04 04:19:28', '2025-08-04 04:42:45', 'BR-1066', 'ใช้ในการเรียน', '', NULL, NULL, '[{\"filename\":\"BRW-20250803-001-1754281167926-542770841.pdf\",\"original_name\":\"QR_Codes_Equipment (5).pdf\",\"file_path\":\"uploads/important_documents/BRW-20250803-001-1754281167926-542770841.pdf\",\"file_size\":1686937,\"mime_type\":\"application/pdf\"}]'),
(173, 79, '2025-08-03', '2025-08-10', 'completed', '2025-08-04 04:20:33', '2025-08-04 04:43:16', 'BR-7452', 'ใช้ในการเรียน', '', NULL, NULL, '[{\"filename\":\"BRW-20250803-001-1754281232922-273127831.pdf\",\"original_name\":\"QR_Codes_Equipment (5).pdf\",\"file_path\":\"uploads/important_documents/BRW-20250803-001-1754281232922-273127831.pdf\",\"file_size\":1686937,\"mime_type\":\"application/pdf\"}]'),
(174, 79, '2025-08-03', '2025-08-10', 'completed', '2025-08-04 04:23:37', '2025-08-04 04:42:52', 'BR-4597', 'ใช้ในการเรียน', '', NULL, NULL, '[{\"filename\":\"BRW-20250803-001_important_documents.pdf\",\"original_name\":\"QR_Codes_Equipment (5).pdf\",\"file_path\":\"uploads/important_documents/BRW-20250803-001_important_documents.pdf\",\"file_size\":1686937,\"mime_type\":\"application/pdf\"}]'),
(175, 79, '2025-08-05', '2025-08-12', 'completed', '2025-08-04 04:31:34', '2025-08-04 04:43:09', 'BR-1238', 'ำพัพะั', '', NULL, NULL, '[{\"filename\":\"BR-1754281894299_important_documents.docx\",\"original_name\":\"pro2.docx\",\"file_path\":\"uploads/important_documents/BR-1754281894299_important_documents.docx\",\"file_size\":538730,\"mime_type\":\"application/vnd.openxmlformats-officedocument.wordprocessingml.document\"},{\"filename\":\"BR-1754281894367_important_documents.pdf\",\"original_name\":\"QR_Codes_Equipment (6).pdf\",\"file_path\":\"uploads/important_documents/BR-1754281894367_important_documents.pdf\",\"file_size\":1686937,\"mime_type\":\"application/pdf\"}]'),
(176, 79, '2025-08-05', '2025-08-12', 'completed', '2025-08-04 04:35:39', '2025-08-04 04:43:25', 'BR-2059', 'drertet', '', NULL, NULL, '[{\"filename\":\"temp_important_documents_1754282138771_264148835.pdf\",\"original_name\":\"QR_Codes_Equipment (6).pdf\",\"file_path\":\"uploads/important_documents/temp_important_documents_1754282138771_264148835.pdf\",\"file_size\":1686937,\"mime_type\":\"application/pdf\"}]'),
(177, 79, '2025-08-03', '2025-08-10', 'completed', '2025-08-04 04:38:13', '2025-08-04 04:43:00', 'BR-9794', 'ใช้ในการเรียน', '', NULL, NULL, '[{\"filename\":\"BR-9794_important_documents.pdf\",\"original_name\":\"QR_Codes_Equipment (5).pdf\",\"file_path\":\"uploads/important_documents/BR-9794_important_documents.pdf\",\"file_size\":1686937,\"mime_type\":\"application/pdf\"}]'),
(178, 79, '2025-08-05', '2025-08-12', 'carry', '2025-08-04 04:47:17', '2025-08-04 06:14:18', 'BR-1979', 'าาาา', '', NULL, NULL, NULL),
(179, 79, '2025-08-05', '2025-08-12', 'approved', '2025-08-04 05:57:11', '2025-08-04 07:03:44', 'BR-2530', 'sdfsdfdf\r\n', NULL, 'signature/signature-BR-2530.jpg', 'handover_photo/handover-BR-2530.jpg', '[{\"filename\":\"BR-2530_important_documents.pdf\",\"original_name\":\"QR_Codes_Equipment (6).pdf\",\"file_path\":\"uploads/important_documents/BR-2530_important_documents.pdf\",\"file_size\":1686937,\"mime_type\":\"application/pdf\"},{\"filename\":\"BR-2530_important_documents.xlsx\",\"original_name\":\"users (1).xlsx\",\"file_path\":\"uploads/important_documents/BR-2530_important_documents.xlsx\",\"file_size\":18164,\"mime_type\":\"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet\"}]'),
(180, 79, '2025-08-05', '2025-08-12', 'pending_approval', '2025-08-04 06:02:00', '2025-08-04 07:21:50', 'BR-3647', 'ฟกฟหกฟ', NULL, NULL, NULL, '[{\"filename\":\"BR-3647_important_documents.pdf\",\"original_name\":\"QR_Codes_Equipment (5).pdf\",\"file_path\":\"uploads/important_documents/BR-3647_important_documents.pdf\",\"file_size\":1686937,\"mime_type\":\"application/pdf\"}]'),
(181, 79, '2025-08-05', '2025-08-12', 'rejected', '2025-08-04 06:15:07', '2025-08-04 07:21:45', 'BR-4006', 'ผแผปแผป', 'asdasfasf', NULL, NULL, '[{\"filename\":\"temp_important_documents_1754288106498_763848247.pdf\",\"original_name\":\"QR_Codes_Equipment (6).pdf\",\"file_path\":\"uploads/important_documents/temp_important_documents_1754288106498_763848247.pdf\",\"file_size\":1686937,\"mime_type\":\"application/pdf\"}]'),
(182, 79, '2025-08-05', '2025-08-12', 'approved', '2025-08-04 06:23:40', '2025-08-04 07:08:28', 'BR-4281', 'พเกดเกเกดเ', NULL, 'signature/signature-BR-4281.jpg', 'handover_photo/handover-BR-4281.jpg', '[{\"filename\":\"temp_important_documents_1754288620386_618877052.pdf\",\"original_name\":\"QR_Codes_Equipment (6).pdf\",\"file_path\":\"uploads/important_documents/temp_important_documents_1754288620386_618877052.pdf\",\"file_size\":1686937,\"mime_type\":\"application/pdf\"},{\"filename\":\"temp_important_documents_1754288620489_167500218.docx\",\"original_name\":\"pro2.docx\",\"file_path\":\"uploads/important_documents/temp_important_documents_1754288620489_167500218.docx\",\"file_size\":538730,\"mime_type\":\"application/vnd.openxmlformats-officedocument.wordprocessingml.document\"}]'),
(183, 79, '2025-08-05', '2025-08-12', 'pending_approval', '2025-08-04 07:29:04', '2025-08-04 07:32:59', 'BR-2100', 'asfsaf', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `branches`
--

CREATE TABLE `branches` (
  `branch_id` int NOT NULL,
  `branch_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `branches`
--

INSERT INTO `branches` (`branch_id`, `branch_name`) VALUES
(1, 'วิทยาการคอมพิวเตอร์'),
(2, 'เทคโนโลยีสารสนเทศ'),
(3, 'สื่อนฤมิต');

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `category_id` int NOT NULL,
  `category_code` varchar(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`category_id`, `category_code`, `name`, `created_at`, `updated_at`) VALUES
(1, 'CAT-001', 'อุปกรณ์อิเล็กทรอนิกส์', '2025-05-30 13:23:13', NULL),
(2, 'CAT-002', 'เครื่องใช้ในบ้าน', '2025-05-30 13:23:13', '2025-05-30 13:23:13'),
(3, 'CAT-003', 'เสื้อผ้าและแฟชั่น', '2025-05-30 13:23:13', '2025-05-30 13:23:13'),
(7, 'CAT-004', 'ZADOEx', NULL, NULL),
(9, 'CAT-005', 'เครื่องเสียงพพพ', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `damage_levels`
--

CREATE TABLE `damage_levels` (
  `damage_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `fine_percent` int NOT NULL,
  `detail` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `damage_levels`
--

INSERT INTO `damage_levels` (`damage_id`, `name`, `fine_percent`, `detail`) VALUES
(5, 'สภาพดี', 0, 'อุปกรณ์อยู่ในสภาพสมบูรณ์ ไฟติด ใช้งานได้ครบทุกฟังก์ชัน ไม่มีรอยหรือความเสียหายใดๆ'),
(6, 'ชำรุดเล็กน้อย', 10, 'มีรอยขีดข่วนภายนอก, ฝาปิดหลวม, ปุ่มใช้งานแข็ง แต่ยังใช้งานได้ตามปกติ'),
(7, 'ชำรุดปานกลาง', 30, 'บางฟังก์ชันใช้งานไม่ได้ เช่น กล้องโฟกัสช้า, เสียงไมค์เบา, ขาตั้งขาโยก, สายหลวม'),
(8, 'ชำรุดหนัก', 70, 'เสียหายชัดเจน เช่น กล้องเลนส์ร้าว, ไฟไม่ติด, เสียงขาดๆหายๆ, ขาตั้งหัก, หน้าจอไม่แสดงผล'),
(9, 'สูญหาย', 100, 'ไม่สามารถคืนอุปกรณ์ หรือคืนอุปกรณ์ไม่ครบ เช่น หายทั้งกล้อง, คืนเฉพาะขาตั้ง, หรือหายทั้งชุดไมค์');

-- --------------------------------------------------------

--
-- Table structure for table `equipment`
--

CREATE TABLE `equipment` (
  `item_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `description` text,
  `quantity` varchar(50) DEFAULT NULL,
  `unit` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `pic` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `created_at` datetime DEFAULT NULL,
  `pic_filename` varchar(255) DEFAULT NULL,
  `item_code` varchar(255) DEFAULT NULL,
  `price` varchar(50) NOT NULL,
  `location` varchar(255) NOT NULL,
  `purchaseDate` date NOT NULL DEFAULT '2000-01-01',
  `branch_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `equipment`
--

INSERT INTO `equipment` (`item_id`, `name`, `category`, `description`, `quantity`, `unit`, `status`, `pic`, `created_at`, `pic_filename`, `item_code`, `price`, `location`, `purchaseDate`, `branch_id`) VALUES
(3, 'MSI notebool', 'อุปกรณ์อิเล็กทรอนิกส์', 'โน็ตบุ๊คเร็วแรง', '1', 'ชิ้น', 'ถูกยืม', 'http://localhost:5000/uploads/equipment/EQ-002.jpg', NULL, NULL, 'EQ-002', '5000', 'ตึกไอที', '1999-12-30', NULL),
(4, 'ไฟ studio', 'อุปกรณ์อิเล็กทรอนิกส์', 'ไฟในห้อง', '1', 'ชิ้น', 'ถูกยืม', 'http://localhost:5000/uploads/equipment/EQ-003.jpg', NULL, NULL, 'EQ-003', '2000', 'ตึกไอที', '2000-01-01', NULL),
(6, 'router', 'อุปกรณ์อิเล็กทรอนิกส์', 'wifi', '1', 'ชุด', 'ถูกยืม', 'http://localhost:5000/uploads/equipment/EQ-004.jpg', NULL, NULL, 'EQ-004', '9000', 'ตึกไอที', '1999-12-31', NULL),
(14, 'ขาตั้งกล้องนน', 'อุปกรณ์อิเล็กทรอนิกส์', 'กล้อง', '1', 'ชิ้น', 'ถูกยืม', 'http://localhost:5000/uploads/equipment/EQ-001.jpg', '2025-06-26 16:51:37', NULL, 'EQ-0018888', '4000', 'ตึกไอที', '2025-06-19', NULL),
(15, 'rog moniter', 'อุปกรณ์อิเล็กทรอนิกส์', 'จอคอม', '1', 'ชุด', 'ถูกยืม', 'http://localhost:5000/uploads/equipment/EQ-005.jpg', '2025-07-07 17:57:06', NULL, 'EQ-005', '2500', 'ตึกไอที', '2025-07-08', NULL),
(19, 'Green Screen', 'อุปกรณ์อิเล็กทรอนิกส์', 'ฉากเขียวถ่ายงาน', '1', 'ชิ้น', 'ถูกยืม', 'http://localhost:5000/uploads/equipment/EQ-006.png', '2025-07-22 10:48:58', NULL, 'EQ-006', '3000', 'ตึกไอที', '2025-07-22', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

CREATE TABLE `news` (
  `id` int NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` enum('การบำรุงรักษา','อุปกรณ์ใหม่','กิจกรรม','ประกาศ') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `news`
--

INSERT INTO `news` (`id`, `title`, `content`, `category`, `date`, `created_at`, `updated_at`) VALUES
(1, 'ปรับปรุงระบบครั้งใหญ่!', 'ระบบ E-borrow จะมีการปิดปรับปรุงเพื่อเพิ่มประสิทธิภาพและฟีเจอร์ใหม่ๆ ในวันที่ 30 เมษายน 2568 ตั้งแต่เวลา 00:00 ถึง 06:00 น. ขออภัยในความไม่สะดวก', 'การบำรุงรักษา', '2025-04-25 00:00:00', '2025-05-30 11:22:10', '2025-05-30 11:22:10'),
(2, 'อุปกรณ์ใหม่: โดรนสำหรับการถ่ายภาพมุมสูง', 'เราได้เพิ่มโดรน DJI Mavic Air 3 เข้ามาในระบบ ท่านสามารถเริ่มยืมได้ตั้งแต่วันนี้เป็นต้นไป', 'อุปกรณ์ใหม่', '2025-04-22 00:00:00', '2025-05-30 11:22:10', '2025-05-30 11:22:10'),
(3, 'อบรมการใช้งานโปรเจกเตอร์รุ่นใหม่', 'ขอเชิญผู้ที่สนใจเข้าร่วมอบรมการใช้งานโปรเจกเตอร์ Epson EB-L200SW ในวันที่ 5 พฤษภาคม 2568 เวลา 13:00 - 15:00 น. ณ ห้องประชุมใหญ่', 'กิจกรรม', '2025-04-20 00:00:00', '2025-05-30 11:22:10', '2025-05-30 11:22:10'),
(4, 'ประกาศวันหยุดเทศกาลสงกรานต์66', 'เนื่องในเทศกาลสงกรานต์ ระบบ E-borrow จะงดให้บริการในวันที่ 13-15 เมษายน 2568 และจะเปิดให้บริการตามปกติในวันที่ 16 เมษายน 2568', 'ประกาศ', '2025-04-10 00:00:00', '2025-05-30 11:22:10', '2025-05-30 17:31:11'),
(9, 'fdfd', 'fdfdfdf', 'ประกาศ', '2025-06-03 18:16:48', '2025-06-03 11:16:48', '2025-06-03 11:16:48'),
(10, 'uuuug', '6y5y56y56', 'การบำรุงรักษา', '2025-06-19 23:15:48', '2025-06-19 16:15:48', '2025-07-03 15:44:46');

-- --------------------------------------------------------

--
-- Table structure for table `positions`
--

CREATE TABLE `positions` (
  `position_id` int NOT NULL,
  `position_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `positions`
--

INSERT INTO `positions` (`position_id`, `position_name`) VALUES
(1, 'เจ้าหน้าที่'),
(2, 'นิสิต'),
(3, 'บุคลากร');

-- --------------------------------------------------------

--
-- Table structure for table `repair_requests`
--

CREATE TABLE `repair_requests` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `item_id` int NOT NULL,
  `problem_description` text,
  `request_date` date DEFAULT NULL,
  `estimated_cost` decimal(10,2) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'รอการอนุมัติ',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `pic_filename` text,
  `repair_code` varchar(255) NOT NULL,
  `note` varchar(255) NOT NULL,
  `budget` int NOT NULL,
  `responsible_person` varchar(255) NOT NULL,
  `approval_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `repair_requests`
--

INSERT INTO `repair_requests` (`id`, `user_id`, `item_id`, `problem_description`, `request_date`, `estimated_cost`, `status`, `created_at`, `pic_filename`, `repair_code`, `note`, `budget`, `responsible_person`, `approval_date`) VALUES
(142, 76, 4, 'sdfsdf', '2025-07-15', 1222.00, 'rejected', '2025-07-15 17:06:34', '[{\"filename\":\"RP-65053_1.png\",\"original_name\":\"Adisorn_Resume.png\",\"file_path\":\"uploads/repair/RP-65053_1.png\",\"url\":\"http://localhost:5000/uploads/repair/RP-65053_1.png\",\"repair_code\":\"RP-65053\",\"index\":0}]', 'RP-65053', 'รายการนี้ไม่อยู่ในขอบเขตงานซ่อม jjjj', 1222, '', '2025-07-16 23:30:30'),
(143, 80, 6, 'ดดด', '2025-07-16', 2222.00, 'rejected', '2025-07-16 16:33:21', '[{\"filename\":\"RP-45625_1.jpg\",\"original_name\":\"Black And Orange Modern Seafood Restaurant Promotion Banner.jpg\",\"file_path\":\"uploads/repair/RP-45625_1.jpg\",\"url\":\"http://localhost:5000/uploads/repair/RP-45625_1.jpg\",\"repair_code\":\"RP-45625\",\"index\":0},{\"filename\":\"RP-45625_2.jpg\",\"original_name\":\"a62i-hero.jpg\",\"file_path\":\"uploads/repair/RP-45625_2.jpg\",\"url\":\"http://localhost:5000/uploads/repair/RP-45625_2.jpg\",\"repair_code\":\"RP-45625\",\"index\":1},{\"filename\":\"RP-45625_3.png\",\"original_name\":\"ChatGPT Image 16 à¸¡à¸´.à¸¢. 2568 01_50_34.png\",\"file_path\":\"uploads/repair/RP-45625_3.png\",\"url\":\"http://localhost:5000/uploads/repair/RP-45625_3.png\",\"repair_code\":\"RP-45625\",\"index\":2}]', 'RP-45625', 'ไม่สามารถซ่อมแซมได้ ', 2222, 'อดิศร หนูกลาง', '2025-07-16 23:38:41'),
(144, 80, 6, 'ssafasf', '2025-07-22', 21312.00, 'รออนุมัติซ่อม', '2025-07-22 09:26:56', '[{\"filename\":\"RP-54376_1.jpg\",\"original_name\":\"1653353121_1708097_1.jpg\",\"file_path\":\"uploads/repair/RP-54376_1.jpg\",\"url\":\"http://localhost:5000/uploads/repair/RP-54376_1.jpg\",\"repair_code\":\"RP-54376\",\"index\":0}]', 'RP-54376', '', 0, '', '2025-07-22 16:26:54');

-- --------------------------------------------------------

--
-- Table structure for table `returns`
--

CREATE TABLE `returns` (
  `return_id` int NOT NULL,
  `borrow_id` int NOT NULL,
  `return_date` datetime NOT NULL,
  `return_by` int DEFAULT NULL,
  `fine_amount` decimal(10,2) DEFAULT '0.00',
  `proof_image` varchar(255) DEFAULT NULL,
  `status` enum('pending','approved','rejected') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT 'pending',
  `notes` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `pay_status` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT 'pending',
  `payment_method` varchar(255) NOT NULL,
  `damage_fine` int NOT NULL,
  `late_fine` int NOT NULL,
  `late_days` int NOT NULL,
  `user_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `returns`
--

INSERT INTO `returns` (`return_id`, `borrow_id`, `return_date`, `return_by`, `fine_amount`, `proof_image`, `status`, `notes`, `created_at`, `updated_at`, `pay_status`, `payment_method`, `damage_fine`, `late_fine`, `late_days`, `user_id`) VALUES
(140, 147, '2025-07-27 21:14:41', 80, 0.00, NULL, 'pending', '', '2025-07-27 14:14:42', '2025-07-27 14:14:42', 'paid', 'cash', 0, 0, 0, 79),
(141, 146, '2025-07-27 21:31:23', 80, 2000.00, 'BR-8121_slip.png', 'pending', '', '2025-07-27 14:31:24', '2025-07-27 14:32:00', 'paid', 'online', 2000, 0, 0, 79),
(142, 150, '2025-07-28 22:48:56', 80, 500.00, 'BR-3978_slip.jpg', 'pending', '', '2025-07-28 15:48:56', '2025-07-28 15:50:38', 'paid', 'online', 500, 0, 0, 117),
(143, 151, '2025-08-01 16:07:04', 80, 8800.00, 'BR-6140_slip.jpg', 'pending', '', '2025-08-01 09:07:04', '2025-08-01 09:07:43', 'paid', 'online', 8800, 0, 0, 79),
(144, 148, '2025-08-01 16:16:08', 80, 1750.00, 'BR-4383_slip.jpg', 'pending', '', '2025-08-01 09:16:08', '2025-08-01 09:16:29', 'paid', 'online', 1750, 0, 0, 79),
(145, 149, '2025-08-01 16:19:32', 80, 2100.00, 'BR-6119_slip.png', 'pending', '', '2025-08-01 09:19:32', '2025-08-01 09:19:49', 'paid', 'online', 2100, 0, 0, 79),
(146, 152, '2025-08-01 16:25:04', 80, 1400.00, 'BR-3572_slip.jpg', 'pending', '', '2025-08-01 09:25:04', '2025-08-01 09:25:13', 'paid', 'online', 1400, 0, 0, 79),
(147, 153, '2025-08-01 16:28:34', 80, 10400.00, 'BR-3890_slip.jpg', 'pending', '', '2025-08-01 09:28:34', '2025-08-01 09:29:44', 'paid', 'online', 10400, 0, 0, 79),
(148, 154, '2025-08-01 16:35:20', 80, 5500.00, 'BR-7409_slip.jpg', 'pending', '', '2025-08-01 09:35:20', '2025-08-01 09:36:21', 'paid', 'online', 5500, 0, 0, 79),
(149, 155, '2025-08-01 16:46:51', 80, 10400.00, 'BR-5273_slip.png', 'pending', '', '2025-08-01 09:46:51', '2025-08-01 09:47:20', 'paid', 'online', 10400, 0, 0, 79),
(150, 156, '2025-08-01 16:55:29', 80, 6800.00, NULL, 'pending', '', '2025-08-01 09:55:29', '2025-08-01 09:55:29', 'paid', 'cash', 6800, 0, 0, 79),
(151, 157, '2025-08-01 17:00:59', 80, 3500.00, 'BR-6939_slip.jpg', 'pending', '', '2025-08-01 10:00:59', '2025-08-01 10:01:22', 'paid', 'online', 3500, 0, 0, 79),
(152, 158, '2025-08-01 17:05:47', 80, 10400.00, 'BR-2372_slip.jpg', 'pending', '', '2025-08-01 10:05:47', '2025-08-01 10:06:13', 'paid', 'online', 10400, 0, 0, 79),
(153, 159, '2025-08-01 17:11:29', 80, 5500.00, 'BR-7497_slip.jpg', 'pending', '', '2025-08-01 10:11:29', '2025-08-01 10:11:55', 'paid', 'online', 5500, 0, 0, 79),
(154, 160, '2025-08-01 17:15:33', 80, 13000.00, 'BR-1088_slip.png', 'pending', '', '2025-08-01 10:15:33', '2025-08-01 10:16:01', 'paid', 'online', 13000, 0, 0, 79),
(155, 161, '2025-08-01 17:21:45', 80, 4750.00, 'BR-2983_slip.jpg', 'pending', '', '2025-08-01 10:21:46', '2025-08-01 10:21:58', 'paid', 'online', 4750, 0, 0, 79),
(156, 162, '2025-08-01 17:25:18', 80, 5000.00, NULL, 'pending', '', '2025-08-01 10:25:18', '2025-08-01 10:25:18', 'paid', 'cash', 5000, 0, 0, 79),
(157, 163, '2025-08-01 17:25:57', 80, 6300.00, 'BR-6228_slip.png', 'pending', '', '2025-08-01 10:25:57', '2025-08-01 10:26:16', 'paid', 'online', 6300, 0, 0, 79),
(158, 164, '2025-08-01 17:27:01', 80, 0.00, 'BR-6338_slip.jpg', 'pending', '', '2025-08-01 10:27:01', '2025-08-01 10:27:19', 'paid', 'online', 0, 0, 0, 79),
(159, 165, '2025-08-04 11:03:09', 80, 2100.00, NULL, 'pending', '', '2025-08-04 04:03:09', '2025-08-04 04:03:09', 'paid', 'cash', 2100, 0, 0, 79),
(160, 170, '2025-08-04 11:42:27', 80, 0.00, NULL, 'pending', '', '2025-08-04 04:42:28', '2025-08-04 04:42:28', 'paid', 'cash', 0, 0, 0, 79),
(161, 171, '2025-08-04 11:42:36', 80, 0.00, NULL, 'pending', '', '2025-08-04 04:42:36', '2025-08-04 04:42:36', 'paid', 'cash', 0, 0, 0, 79),
(162, 172, '2025-08-04 11:42:44', 80, 0.00, NULL, 'pending', '', '2025-08-04 04:42:44', '2025-08-04 04:42:44', 'paid', 'cash', 0, 0, 0, 79),
(163, 174, '2025-08-04 11:42:51', 80, 0.00, NULL, 'pending', '', '2025-08-04 04:42:51', '2025-08-04 04:42:51', 'paid', 'cash', 0, 0, 0, 79),
(164, 177, '2025-08-04 11:42:59', 80, 200.00, NULL, 'pending', '', '2025-08-04 04:43:00', '2025-08-04 04:43:00', 'paid', 'cash', 200, 0, 0, 79),
(165, 175, '2025-08-04 11:43:08', 80, 0.00, NULL, 'pending', '', '2025-08-04 04:43:08', '2025-08-04 04:43:08', 'paid', 'cash', 0, 0, 0, 79),
(166, 173, '2025-08-04 11:43:15', 80, 0.00, NULL, 'pending', '', '2025-08-04 04:43:15', '2025-08-04 04:43:15', 'paid', 'cash', 0, 0, 0, 79),
(167, 176, '2025-08-04 11:43:24', 80, 0.00, NULL, 'pending', '', '2025-08-04 04:43:25', '2025-08-04 04:43:25', 'paid', 'cash', 0, 0, 0, 79);

-- --------------------------------------------------------

--
-- Table structure for table `return_items`
--

CREATE TABLE `return_items` (
  `return_item_id` int NOT NULL,
  `return_id` int NOT NULL,
  `item_id` int NOT NULL,
  `damage_level_id` int DEFAULT NULL,
  `damage_note` text,
  `fine_amount` decimal(10,2) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `return_items`
--

INSERT INTO `return_items` (`return_item_id`, `return_id`, `item_id`, `damage_level_id`, `damage_note`, `fine_amount`, `created_at`, `updated_at`) VALUES
(44, 140, 14, 5, '', 0.00, '2025-07-27 14:14:42', '2025-07-27 14:14:42'),
(45, 141, 3, 6, '', 500.00, '2025-07-27 14:31:24', '2025-07-27 14:31:24'),
(46, 141, 4, 7, '', 600.00, '2025-07-27 14:31:24', '2025-07-27 14:31:24'),
(47, 141, 6, 6, '', 900.00, '2025-07-27 14:31:25', '2025-07-27 14:31:25'),
(48, 142, 3, 6, '', 500.00, '2025-07-28 15:48:57', '2025-07-28 15:48:57'),
(49, 142, 4, 5, '', 0.00, '2025-07-28 15:48:57', '2025-07-28 15:48:57'),
(50, 142, 6, 5, '', 0.00, '2025-07-28 15:48:57', '2025-07-28 15:48:57'),
(51, 143, 3, 6, 'กกกกก', 500.00, '2025-08-01 09:07:04', '2025-08-01 09:07:04'),
(52, 143, 4, 9, 'กกกกก', 2000.00, '2025-08-01 09:07:05', '2025-08-01 09:07:05'),
(53, 143, 6, 8, 'กกกกก', 6300.00, '2025-08-01 09:07:05', '2025-08-01 09:07:05'),
(54, 144, 15, 8, 'าา', 1750.00, '2025-08-01 09:16:09', '2025-08-01 09:16:09'),
(55, 145, 19, 8, '', 2100.00, '2025-08-01 09:19:33', '2025-08-01 09:19:33'),
(56, 146, 4, 8, 'นน', 1400.00, '2025-08-01 09:25:05', '2025-08-01 09:25:05'),
(57, 146, 6, 5, 'รนรน', 0.00, '2025-08-01 09:25:05', '2025-08-01 09:25:05'),
(58, 147, 3, 8, '', 3500.00, '2025-08-01 09:28:35', '2025-08-01 09:28:35'),
(59, 147, 4, 8, '', 1400.00, '2025-08-01 09:28:35', '2025-08-01 09:28:35'),
(60, 147, 6, 7, '', 2700.00, '2025-08-01 09:28:36', '2025-08-01 09:28:36'),
(61, 147, 14, 8, '', 2800.00, '2025-08-01 09:28:36', '2025-08-01 09:28:36'),
(62, 148, 3, 8, '', 3500.00, '2025-08-01 09:35:20', '2025-08-01 09:35:20'),
(63, 148, 4, 9, '', 2000.00, '2025-08-01 09:35:21', '2025-08-01 09:35:21'),
(64, 148, 6, 5, '', 0.00, '2025-08-01 09:35:21', '2025-08-01 09:35:21'),
(65, 149, 4, 8, 'ารนีรน', 1400.00, '2025-08-01 09:46:52', '2025-08-01 09:46:52'),
(66, 149, 6, 9, 'ีนีรน', 9000.00, '2025-08-01 09:46:52', '2025-08-01 09:46:52'),
(67, 150, 3, 7, '', 1500.00, '2025-08-01 09:55:29', '2025-08-01 09:55:29'),
(68, 150, 14, 8, '', 2800.00, '2025-08-01 09:55:29', '2025-08-01 09:55:29'),
(69, 150, 15, 9, '', 2500.00, '2025-08-01 09:55:30', '2025-08-01 09:55:30'),
(70, 151, 3, 8, '', 3500.00, '2025-08-01 10:00:59', '2025-08-01 10:00:59'),
(71, 152, 4, 8, 'vsdf', 1400.00, '2025-08-01 10:05:47', '2025-08-01 10:05:47'),
(72, 152, 6, 9, 'sdf', 9000.00, '2025-08-01 10:05:48', '2025-08-01 10:05:48'),
(73, 153, 3, 8, '', 3500.00, '2025-08-01 10:11:29', '2025-08-01 10:11:29'),
(74, 153, 4, 9, '', 2000.00, '2025-08-01 10:11:29', '2025-08-01 10:11:29'),
(75, 154, 6, 9, '', 9000.00, '2025-08-01 10:15:34', '2025-08-01 10:15:34'),
(76, 154, 14, 9, '', 4000.00, '2025-08-01 10:15:34', '2025-08-01 10:15:34'),
(77, 155, 15, 8, '', 1750.00, '2025-08-01 10:21:46', '2025-08-01 10:21:46'),
(78, 155, 19, 9, '', 3000.00, '2025-08-01 10:21:46', '2025-08-01 10:21:46'),
(79, 156, 3, 9, '', 5000.00, '2025-08-01 10:25:18', '2025-08-01 10:25:18'),
(80, 156, 4, 5, '', 0.00, '2025-08-01 10:25:18', '2025-08-01 10:25:18'),
(81, 157, 6, 8, '', 6300.00, '2025-08-01 10:25:58', '2025-08-01 10:25:58'),
(82, 157, 14, 5, '', 0.00, '2025-08-01 10:25:58', '2025-08-01 10:25:58'),
(83, 158, 15, 5, '', 0.00, '2025-08-01 10:27:01', '2025-08-01 10:27:01'),
(84, 158, 19, 5, '', 0.00, '2025-08-01 10:27:01', '2025-08-01 10:27:01'),
(85, 159, 19, 8, '', 2100.00, '2025-08-04 04:03:10', '2025-08-04 04:03:10'),
(86, 160, 14, 5, '', 0.00, '2025-08-04 04:42:28', '2025-08-04 04:42:28'),
(87, 161, 4, 5, '', 0.00, '2025-08-04 04:42:36', '2025-08-04 04:42:36'),
(88, 162, 4, 5, '', 0.00, '2025-08-04 04:42:45', '2025-08-04 04:42:45'),
(89, 163, 4, 5, '', 0.00, '2025-08-04 04:42:52', '2025-08-04 04:42:52'),
(90, 164, 4, 6, '', 200.00, '2025-08-04 04:43:00', '2025-08-04 04:43:00'),
(91, 165, 15, 5, '', 0.00, '2025-08-04 04:43:08', '2025-08-04 04:43:08'),
(92, 166, 4, 5, '', 0.00, '2025-08-04 04:43:16', '2025-08-04 04:43:16'),
(93, 167, 19, 5, '', 0.00, '2025-08-04 04:43:25', '2025-08-04 04:43:25');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `role_id` int NOT NULL,
  `role_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`role_id`, `role_name`) VALUES
(1, 'admin'),
(2, 'executive'),
(3, 'user');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int NOT NULL,
  `user_code` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `avatar` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `role_id` int DEFAULT '3',
  `position_id` int DEFAULT NULL,
  `branch_id` int DEFAULT NULL,
  `street` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `district` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `province` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postal_no` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Fullname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `parish` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `line_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'ยังไม่ผูกบัญชี',
  `line_notify_enabled` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `user_code`, `username`, `email`, `password`, `phone`, `avatar`, `role_id`, `position_id`, `branch_id`, `street`, `district`, `province`, `postal_no`, `created_at`, `updated_at`, `Fullname`, `parish`, `line_id`, `line_notify_enabled`) VALUES
(31, 'U005', 'mike_d', 'mike@xn--example-uywa.com', '$2a$10$abc123456', '085555555566', 'U005.png', 3, 2, 1, '555 Forest Rrrrดเดเด', 'เมืองนครนายก', 'นครนายก', '26000', '2025-05-28 00:50:56', '2025-07-15 09:28:58', 'สมชาย', 'หินตั้ง', 'U5c749dd5223aa44b996725f42eea7969', 0),
(34, 'U008', 'sara_w', 'sara@example.com', '$2a$10$abc123456', '0888888888', 'U008.jpg', 2, 3, 3, '333 Bamboo Rd', 'คลองหลวง', 'ปทุมธานี', '12120', '2025-05-28 00:50:56', '2025-07-13 18:17:14', 'Sara Wilson', 'Parish H', 'U5c749dd5223aa44b996725f42eea7969', 0),
(65, 'U014', '43346', 'aod092eee9103592@gmail.com', '2', '0929103592', 'U014.jpg', 1, 3, 3, '3434', 'บางบ่อ', 'สมุทรปราการ', '10560', '2025-06-03 16:38:47', '2025-07-13 18:17:12', 'อดิศร หนูกลาง', 'บ้านระกาศ', 'U94097fb047db33025f5a24fc4979de4f', 0),
(71, '6410400001', '6505111', 'aod092910ewe3592@gmail.com', '12323', '0929103592', '6410400001.jpg', 3, 2, 3, 'บ้านเลขที่84 หมู่11', 'บ้านบึง', 'ชลบุรี', '20220', '2025-06-26 17:23:07', '2025-07-13 18:17:13', 'อดิศร หนูกลาง', 'คลองกิ่ว', 'U285130c26784bcce4448f00d5b719cc0', 0),
(72, '650', '650', 'aod09a2910sdsd3592@gmail.com', '1234', '0929103592', '650.jpg', 3, 2, 2, 'บ้านเลขที่84 หมู่11', 'เมืองหนองบัวลำภู', 'หนองบัวลำภู', '39000', '2025-07-11 06:10:45', '2025-07-13 18:17:13', 'อดิศร หนูกลาง', 'ลำภู', 'U94097fb047db33025f5a24fc4979de4f', 0),
(76, '2222', '2222', 'saraadr@example.com', '2222', '0888888888', '2222.jpg', 1, 2, 2, 'dfdf', 'สนามชัยเขต', 'ฉะเชิงเทรา', '24160', '2025-07-15 16:52:38', '2025-07-15 18:02:04', 'e', 'คู้ยายหมี', 'U94097fb047db33025f5a24fc4979de4f', 0),
(77, '3333', '3333', 'mike@xn--examplsdfe-sdfuywa.coms', '$2b$10$Eihvih.Ef8/KXAlLjpivmuMFxfwYwNIEkwLtDATnTL2qQ.TTK7LSC', '0888885888', '3333.jpg', 2, 2, 2, 'fdf', 'พนมดงรัก', 'สุรินทร์', '32140', '2025-07-15 16:55:25', '2025-07-16 07:17:54', 'z', 'บักได', 'U94097fb047db33025f5a24fc4979de4f', 0),
(79, '4444', '4444', 'ztezadoex@gmail.com', '$2b$10$Tea89NeySuikX4bMYeIjlu7N12et89GpIM9PTkAT0.SFc23ZiKRl6', '0888888545', '4444.jpg', 3, 2, 1, 'sdfsd', 'เมืองนครนายก', 'นครนายก', '26000', '2025-07-15 16:56:09', '2025-07-30 17:25:21', 'y', 'สาริกา', 'U6c2c71dc16c687eca1782326dcaf2bc6', 0),
(80, '1111', '1111', '65011211033@msu.ac.th', '$2b$10$pRBSBGe4iTwOaiATn2wCPOhm4pK3ULT59P44a58ag5wypHGgUNIMO', '0888888545', '1111.png', 1, 2, 2, 'hhih', 'สนามชัยเขต', 'ฉะเชิงเทรา', '24160', '2025-07-16 07:35:22', '2025-07-31 08:10:03', 'ppp', 'ท่ากระดาน', 'U6c2c71dc16c687eca1782326dcaf2bc6', 0),
(81, '99999', '99999', 'aod09tutur29103592@gmail.com', '$2b$10$WBrP88W1/0HR/aen..3YIOOTJXz45CkdltZIicNRJ2s0TV/kXup0e', '0929103592', NULL, 3, 2, 2, 'dsd', 'มหาชนะชัย', 'ยโสธร', '35130', '2025-07-21 07:50:44', '2025-07-21 07:50:44', 'อดิศร หนูกลาง', 'โนนทราย', NULL, 0),
(82, '2222', '2222', 'user@gmail.com', '$2b$10$lE361zH8KJqdOQUdGd0jEOnqWk1cdihNQMU2jtUn24jyAwGRVRSV2', '0855445', NULL, 3, 2, 3, 'asd', 'ตาลสุม', 'อุบลราชธานี', '34330', '2025-07-21 08:05:32', '2025-07-21 08:05:32', 'อดิศร หนูกลาง', 'สำโรง', NULL, 0),
(96, '014123', 'fghfgh', 'aod092fghfgh9103592@gmail.com', '$2b$10$b8Vti9YWDuyC5t6xx8qABO8KQCotn/.jI/AIErTnMICjo5R7v1V.W', '0929103592', '014123.jpg', 3, 2, 3, 'fgh', 'บางพลี', 'สมุทรปราการ', '10540', '2025-07-22 13:00:09', '2025-07-22 13:00:09', 'fghfgh', 'บางปลา', NULL, 0),
(99, '00466666', 'sdfsdf', 'aod0929103asdf592@gmail.comasdf', '$2b$10$v/VTs3Xx3cto/cmtYBanjO1O7tGDBfly4dXprTrSH6s5LklKEt1Ze', '0929103592', '00466666.jpg', 1, 2, 1, '41/20 ตำบลขามเรียง อำเภอกันทรวิชัย จังหวัดมหาสารคาม 44150', 'เมืองมหาสารคาม', 'มหาสารคาม', '44000', '2025-07-22 13:11:09', '2025-07-22 13:11:09', 'Adison Nooklang', 'ตลาด', NULL, 0),
(100, '23', 'hhhhhhhh', 'fas@dasdff.com', '$2b$10$7Dt3dRV9MTc3.k4RvnMfE.lMDPwZvvKGd.6LHK66mGq4a1aWxkRvu', '0929103592', '23.png', 1, 2, 1, '41/20 ตำบลขามเรียง อำเภอกันทรวิชัย จังหวัดมหาสารคาม 44150', 'แกดำ', 'มหาสารคาม', '44190', '2025-07-22 13:14:13', '2025-07-22 13:14:13', 'ert', 'มิตรภาพ', NULL, 0),
(101, '64104000018', 'asd', 'aod09291fffffffffff03592@gmail.com', '$2b$10$zpp3p6qr8oibkd5EoYVx6.F/v7VudSMgUnqYzGqmap9gO4bQWH6vm', '0929103592', '64104000018.png', 1, 3, 3, 'บ้านเลขที่84 หมู่11', 'นากลาง', 'หนองบัวลำภู', '39170', '2025-07-22 13:19:53', '2025-07-22 13:19:53', 'อดิศร หนูกลาง', 'ด่านช้าง', NULL, 0),
(102, '004999', 'ooooooooooooo', 'aod092910yuyu3592@gmail.com', '$2b$10$CG7.0sZ.rWwywYKMomvvbOV9AcnGHMQsUXUADWHZK/Clyp8TfAvvi', '0929103592', '/profile.png', 3, 2, 3, '41/20 ตำบลขามเรียง อำเภอกันทรวิชัย จังหวัดมหาสารคาม 44150', 'แกดำ', 'มหาสารคาม', '44190', '2025-07-22 13:24:30', '2025-07-22 13:24:30', 'Adison Nooklang', 'วังแสง', NULL, 0),
(103, '6669', 'o', 'aod09fghjfgj29103592@gmail.com', '$2b$10$FxN6WMogTkdqiXQR/fRK.eNvXGsKljETWMxk.AJNdaD11zLd5H3kS', '0929103592', '6669.png', 1, 3, 1, 'บ้านเลขที่84 หมู่11', 'ศรีบุญเรือง', 'หนองบัวลำภู', '39180', '2025-07-22 13:28:08', '2025-07-22 13:28:08', 'อดิศร หนูกลาง', 'หนองบัวใต้', NULL, 0),
(104, '555855', 'pty', 'aod092910359fghfg2@gmail.com', '$2b$10$Qpl0a57LQwmRaAzQMmVh4u807Uiw0ZpUeQEurBTxLhWf7WQpaxw0C', '0929103592', '555855.jpg', 1, 3, 3, 'บ้านเลขที่84 หมู่11', 'นากลาง', 'หนองบัวลำภู', '39170', '2025-07-22 13:30:03', '2025-07-22 13:30:03', 'อดิศร หนูกลาง', 'ด่านช้าง', NULL, 0),
(105, '00544444', 'ffffffffffffffffffffffffffffffff', 'aod0929103sdffsdf592@gmail.com', '$2b$10$g80biPPNBY9xzEQS99cPg.OSKvy33UzXPvC.jwY//1zSBz4ZcyWjS', '0929103592', '00544444.png', 2, 3, 3, '41/20 ตำบลขามเรียง อำเภอกันทรวิชัย จังหวัดมหาสารคาม 44150', 'แกดำ', 'มหาสารคาม', '44190', '2025-07-22 13:33:26', '2025-07-22 13:33:26', 'Adison Nooklang', 'วังแสง', NULL, 0),
(106, '7878', 'dsafsadf', 'asdsad@sdf.com', '$2b$10$DkjnBiaWkOSaS4jxPpFjEeSdrsDimsIwzgiYh/MXXkqsuPem1w5Zy', '232323', '7878.jpg', 1, 2, 3, 'asdasd', 'เมืองชัยนาท', 'ชัยนาท', '17000', '2025-07-22 13:34:35', '2025-07-22 13:34:35', 'dfdf df', 'ในเมือง', NULL, 0),
(107, '6410400444', 'asdfsdf', 'asdas@ddf.com', '$2b$10$JxE4savSaFWOgx/rOtZcUei/O0YpKWoG8C1yQhJwzKm1g780guzua', '55555555', '6410400444.jpg', 3, 2, 1, 'asd', 'เมืองสมุทรปราการ', 'สมุทรปราการ', '10270', '2025-07-22 13:36:28', '2025-07-22 13:36:28', 'ddddddddd ffffffffff', 'บางเมือง', NULL, 0),
(108, '00555566', 'rrrrrrrrrrrrrrrrrrr', 'aodsadfsdf0929103592@gmail.com', '$2b$10$LO6fQNkgl5yKuecRj/4ZtugVKL96D67omfVWC1f.xLMqurHg9sp7e', '0929103592', '00555566.png', 2, 2, 3, '41/20 ตำบลขามเรียง อำเภอกันทรวิชัย จังหวัดมหาสารคาม 44150', 'แกดำ', 'มหาสารคาม', '44190', '2025-07-22 13:42:00', '2025-07-23 09:15:53', 'Adison Nooklang', 'มิตรภาพ', NULL, 0),
(109, '556445', 'tyututy', 'aod092910tutyutyutyu3592@gmail.com', '$2b$10$wqZ0KAE.errT87nD1W..K.dyK7l2tXUBgdFxDKANwcCyWp0mSAp4u', '0929103592', '556445.jpg', 3, 3, 1, 'บ้านเลขที่84 หมู่11', 'โป่งน้ำร้อน', 'จันทบุรี', '22140', '2025-07-23 09:16:57', '2025-07-23 09:16:57', 'htyutyuty', 'เทพนิมิต', NULL, 0),
(110, '6565656', 'eteterte', 'erter@ttttt.com', '$2b$10$KU4bASByeA3R1dm4MMvntess0aEWN6RJh/NaIM0Jz6UzOSyKZbOMO', '53453534', '6565656.jpg', 3, 2, 1, '345345345', 'บางบ่อ', 'สมุทรปราการ', '10560', '2025-07-23 09:34:55', '2025-07-23 09:34:55', 'etrret', 'บ้านระกาศ', NULL, 0),
(111, '234234', 'rtrtyrtyr', 'aod0etyryrty929103592@gmail.com', '$2b$10$Dd5KHajhTUndkiUObBDhweO8yBeu727276vNu2WJNJ5CkHfypFUkO', '0929103592', '234234.png', 3, 2, 3, 'ำพะำพะ', 'บางใหญ่', 'นนทบุรี', '11140', '2025-07-23 09:41:04', '2025-07-23 09:41:04', '23424', 'บางเลน', NULL, 0),
(112, '2020202', 'yrtyrty', 'aod09sdfsdfggg29103592@gmail.com', '$2b$10$DpsYXas6wek8xRM4jhS8Jub2TUCMZjV2Y.9XcUfNQ.0DcNOvwlVE6', '0929103592', '2020202.png', 2, 1, 1, '202020', 'เขตพระนคร', 'กรุงเทพมหานคร', '10200', '2025-07-23 09:43:51', '2025-07-23 09:43:51', '202020', 'สำราญราษฎร์', NULL, 0),
(113, '436436456', 'fhfghfgh', 'aod09fghgfhfg29103592@gmail.com', '$2b$10$Z0VTOsKQ.yGvh.Q.jcjRVeBWZbuIhZ9ZFeP9rfT/26KADElazeFf2', '0929103592', '436436456.png', 1, 3, 3, '41/20 ตำบลขามเรียง อำเภอกันทรวิชัย จังหวัดมหาสารคาม 44150', 'เมืองมหาสารคาม', 'มหาสารคาม', '44000', '2025-07-23 09:49:35', '2025-07-23 09:49:35', 'fgdfgd', 'ตลาด', NULL, 0),
(114, '234324', 'dfgdfgdf', 'aod09291ertertfdg03592@gmail.com', '$2b$10$65bnV8NklNyilXiVTqdF9OZEBQgdDqsCoMyB8q9odPhaMWw0DI7Cq', '0929103592', '234324.png', 1, 3, 3, 'dfgdfgdf', 'บางพลี', 'สมุทรปราการ', '10540', '2025-07-23 09:54:27', '2025-07-23 09:54:27', 'gdfgdfg', 'บางปลา', NULL, 0),
(115, '23423452222', 'fffffffffffsssss', 'sdfsdfdf@gmail.com', '$2b$10$IHrMq3zeGdxgXDkxgv7yR.0D/3k43yd3xF1v47ov2I5kq2sDqO8M.', '0929103592', '23423452222.png', 3, 2, 1, '41/20 ตำบลขามเรียง อำเภอกันทรวิชัย จังหวัดมหาสารคาม 44150', 'ครบุรี', 'นครราชสีมา', '30250', '2025-07-23 09:58:13', '2025-07-27 16:52:46', 'dfsdfsd', 'เฉลียง', NULL, 0),
(117, '64010917484', '64010917484', '64010917484@msu.ac.th', '$2b$10$xp7FhnbJYTqm98O3KJ8Ye.TESsp09t6RB7lPZbn/ZmsAyepASC0tu', '0642359028', '64010917484.jpg', 3, 2, 2, '44444', 'หนองเสือ', 'ปทุมธานี', '12170', '2025-07-28 15:30:18', '2025-08-01 08:52:52', 'อริสา วันยะโส', 'บึงกาสาม', 'U285130c26784bcce4448f00d5b719cc0', 0),
(119, '65011211022', '65011211022', '65011211022@msu.ac.th', '$2b$10$zTZ6ahluwD0GQ9LpEKZIFuA1XkxE0ME.jk8xM74BW/lV.HB4UZQ3C', '0986286323', NULL, 3, 2, 1, 'ewtewt', 'ราชสาส์น', 'ฉะเชิงเทรา', '24120', '2025-07-31 09:18:32', '2025-07-31 09:18:32', 'กิตติขจร คุ้มบุ่งคล้า', 'บางคา', NULL, 0);

--
-- Indexes for dumped tables
--

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
  ADD KEY `user_id` (`user_id`);

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
-- Indexes for table `damage_levels`
--
ALTER TABLE `damage_levels`
  ADD PRIMARY KEY (`damage_id`);

--
-- Indexes for table `equipment`
--
ALTER TABLE `equipment`
  ADD PRIMARY KEY (`item_id`);

--
-- Indexes for table `news`
--
ALTER TABLE `news`
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
  ADD KEY `fk_returns_user` (`user_id`);

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
-- AUTO_INCREMENT for table `borrow_items`
--
ALTER TABLE `borrow_items`
  MODIFY `borrow_item_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=262;

--
-- AUTO_INCREMENT for table `borrow_transactions`
--
ALTER TABLE `borrow_transactions`
  MODIFY `borrow_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=184;

--
-- AUTO_INCREMENT for table `branches`
--
ALTER TABLE `branches`
  MODIFY `branch_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `category_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `damage_levels`
--
ALTER TABLE `damage_levels`
  MODIFY `damage_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `equipment`
--
ALTER TABLE `equipment`
  MODIFY `item_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `news`
--
ALTER TABLE `news`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `positions`
--
ALTER TABLE `positions`
  MODIFY `position_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `repair_requests`
--
ALTER TABLE `repair_requests`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=145;

--
-- AUTO_INCREMENT for table `returns`
--
ALTER TABLE `returns`
  MODIFY `return_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=168;

--
-- AUTO_INCREMENT for table `return_items`
--
ALTER TABLE `return_items`
  MODIFY `return_item_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=120;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `borrow_items`
--
ALTER TABLE `borrow_items`
  ADD CONSTRAINT `borrow_items_ibfk_1` FOREIGN KEY (`borrow_id`) REFERENCES `borrow_transactions` (`borrow_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `borrow_items_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `equipment` (`item_id`) ON DELETE CASCADE;

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
