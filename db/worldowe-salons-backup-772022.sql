-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Jun 06, 2022 at 04:59 AM
-- Server version: 8.0.29
-- PHP Version: 8.0.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `worldowe-salons`
--

-- --------------------------------------------------------

--
-- Table structure for table `location`
--

CREATE TABLE `location` (
  `user_id` int DEFAULT NULL,
  `id` int NOT NULL,
  `shop_name` varchar(255) NOT NULL,
  `street` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `zip` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `location`
--

INSERT INTO `location` (`user_id`, `id`, `shop_name`, `street`, `city`, `state`, `country`, `zip`, `phone`) VALUES
(15, 1, '', 'New street', 'Blacksburg', 'va', 'va', '24060', ''),
(16, 2, '', 'New street', 'Lexington', 'Kentucky', 'Kentucky', '24060', ''),
(15, 3, 'Giang Nail', '123 N FIled', 'Hampton', '', '', '23777', '123446'),
(NULL, 4, 'New Shop To Test', 'New Street', 'New City', '', '', '123345', '123456789'),
(15, 5, 'NEW GIANG NAIL', '12323', 'ASKLDJALSDJ', '', '', 'ASDASD', '10091923213'),
(15, 6, 'GIANG NEW SHOP', 'asdasd', 'sadasd', '', '', 'asdasd', '9898989898'),
(15, 7, 'GIANG NEW SHOP', 'asdasd', 'asdad', '', '', 'asdasd', 'asdasdsad'),
(15, 8, 'Test SHOP', 'asda', 'asdad', '', '', 'asda', 'asdasd'),
(15, 9, 'asdad', 'asdasd', 'asdasd', '', '', 'asdasd', 'asdasd'),
(15, 10, 'aaa', 'aadd', 'ddd', '', '', 'asdad', 'dasdads'),
(15, 11, 'ssss', 'ssss', 'sss', '', '', 'sss', 'sss'),
(15, 12, 'llll', 'lll', 'llll', '', '', '2333', '2222'),
(15, 13, 'Should Work', 'working', 'street', '', '', '23666', '1234567'),
(15, 14, 'My new shop', 'Giang', 'Hampton', '', '', 'HUHU', '123123123'),
(22, 15, 'Khanh Shop', '1234 Street', 'Blacksburg', '', '', '12345', '1233561553412'),
(15, 16, 'Bao nails', '1234 ', 'Hampton', '', '', '23666', '727272727272'),
(15, 17, 'New shop to test', '1234', '1234', '', '', '123', '123'),
(15, 18, 'Good Times Nails', '123 Street', 'Nice City', '', '', '23666', '123456666'),
(15, 19, 'Shop with Location', '1234 Street Name', 'Hampton', 'Virginia', 'US', '23666', '12345656564'),
(15, 20, 'Shayla\'s New Shop', '35 terroi', 'Chantily', 'Virginia', 'US', '213545', '13123565788');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `shop_id` int NOT NULL,
  `service_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `technicians`
--

CREATE TABLE `technicians` (
  `shop_id` int NOT NULL,
  `technician_name` varchar(255) NOT NULL,
  `id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` char(128) NOT NULL,
  `first_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `last_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `role` int DEFAULT NULL,
  `profile_image` varchar(100) NOT NULL,
  `activated` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `first_name`, `last_name`, `role`, `profile_image`, `activated`) VALUES
(15, 'kaitokid141264@gmail.com', '$2b$10$Kys0JlgBCRXV22/./dSTR.s1jN0zkseh7TDVgNFG3OsO1UJ1Du7PK', 'GT NAIL', '08091231', 0, '/uploads/profiles/smallsize.png', 1),
(16, 'trungteo0707@gmail.com', '$2b$10$Jn2w.RmXuCnqJYwcFyZwnOLNMx/dYheIeQqgiBSSI3yQbGMHMO642', 'TRUNG NAIL', '08091231', 0, '', 1),
(22, 'giangnguyentit@gmail.com', '$2b$10$4Q.Xp99339MFXYYjTol5LO2l0BLKljUNMdglN7.BRkVGiJDGRFpKS', 'Khanh', 'Nguyen', 1, '', 1);

-- --------------------------------------------------------

--
-- Table structure for table `verification_token`
--

CREATE TABLE `verification_token` (
  `user_id` int NOT NULL,
  `token` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `location`
--
ALTER TABLE `location`
  ADD PRIMARY KEY (`id`),
  ADD KEY `location_ibfk_1` (`user_id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD KEY `user_id` (`shop_id`);

--
-- Indexes for table `technicians`
--
ALTER TABLE `technicians`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`shop_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `verification_token`
--
ALTER TABLE `verification_token`
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `location`
--
ALTER TABLE `location`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `technicians`
--
ALTER TABLE `technicians`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `location`
--
ALTER TABLE `location`
  ADD CONSTRAINT `location_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `services`
--
ALTER TABLE `services`
  ADD CONSTRAINT `services_ibfk_1` FOREIGN KEY (`shop_id`) REFERENCES `location` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `technicians`
--
ALTER TABLE `technicians`
  ADD CONSTRAINT `technicians_ibfk_1` FOREIGN KEY (`shop_id`) REFERENCES `location` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `verification_token`
--
ALTER TABLE `verification_token`
  ADD CONSTRAINT `verification_token_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
