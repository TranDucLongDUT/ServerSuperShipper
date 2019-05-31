-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th5 31, 2019 lúc 04:16 AM
-- Phiên bản máy phục vụ: 10.1.38-MariaDB
-- Phiên bản PHP: 7.3.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `supershipper`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `comment`
--

CREATE TABLE `comment` (
  `id` bigint(20) NOT NULL,
  `idUser` bigint(20) NOT NULL,
  `idNews` bigint(20) NOT NULL,
  `comment` text COLLATE utf8_vietnamese_ci NOT NULL,
  `createdAt` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_vietnamese_ci;

--
-- Đang đổ dữ liệu cho bảng `comment`
--

INSERT INTO `comment` (`id`, `idUser`, `idNews`, `comment`, `createdAt`) VALUES
(1, 1, 1, 'Ngon Qua Đi', '2019-04-02'),
(2, 1, 1, 'Uoc Gi Duoc An Mot Lan', '2019-04-02'),
(3, 2, 1, 'Tao Cung Thay Nhu Then Tren', '2019-04-09'),
(4, 2, 2, 'Singaport dep qua bo teo', '2019-04-10'),
(5, 1, 2, 'Moi Qua Do Ban', '2019-04-10'),
(2147483647, 2, 2147483647, 'uuuu', '2019-05-31'),
(1559266953716, 2, 1559095343611, 'hhh', '2019-05-31'),
(1559266974931, 2, 1558926679007, 'lalals', '2019-05-31'),
(1559267586360, 2, 1559095343611, 'ok', '2019-05-31');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `likenews`
--

CREATE TABLE `likenews` (
  `idNews` bigint(20) NOT NULL,
  `idUser` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_vietnamese_ci;

--
-- Đang đổ dữ liệu cho bảng `likenews`
--

INSERT INTO `likenews` (`idNews`, `idUser`) VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 2),
(1558926055832, 2),
(1559095343611, 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `news`
--

CREATE TABLE `news` (
  `id` bigint(20) NOT NULL,
  `idUser` bigint(20) NOT NULL,
  `description` text COLLATE utf8_vietnamese_ci NOT NULL,
  `image` text COLLATE utf8_vietnamese_ci NOT NULL,
  `type` int(10) NOT NULL,
  `createdAt` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_vietnamese_ci;

--
-- Đang đổ dữ liệu cho bảng `news`
--

INSERT INTO `news` (`id`, `idUser`, `description`, `image`, `type`, `createdAt`) VALUES
(1, 1, 'Ngon Qua Xa', 'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2018/6/0/FN_snapchat_coachella_wingman%20.jpeg.rend.hgtvcom.616.462.suffix/1523633513292.jpeg', 1, '2019-04-02'),
(2, 2, 'Singapore', 'https://fm.cnbc.com/applications/cnbc.com/resources/img/editorial/2018/03/14/105066394-GettyImages-498350103_1.1910x1000.jpg', 1, '2019-04-06'),
(2147483647, 2, 'ff', 'https://i.imgur.com/cl6zDc4.jpg', 1, '2019-05-27'),
(1558926055832, 2, 'g', 'https://i.imgur.com/BqeMtyZ.jpg', 1, '2019-05-27'),
(1558926679007, 2, 'gdudjdj', 'https://i.imgur.com/WO1xgUS.jpg', 1, '2019-05-27'),
(1559095343611, 2, 'em muôn mua cái này.....', 'https://i.imgur.com/h7xy8B9.jpg', 1, '2019-05-29');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `rooms`
--

CREATE TABLE `rooms` (
  `id` int(255) NOT NULL,
  `roomName` varchar(255) DEFAULT NULL,
  `avatar` text,
  `type` int(1) NOT NULL,
  `createdAt` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `rooms`
--

INSERT INTO `rooms` (`id`, `roomName`, `avatar`, `type`, `createdAt`) VALUES
(54, 'Alibaba', 'https://cdn-image.foodandwine.com/sites/default/files/styles/medium_2x/public/1519844002/fast-food-mobile-apps-chick-fil-a-FT-BLOG0218.jpg?itok=7d_gu0JA', 0, '2019-04-01');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `roomusers`
--

CREATE TABLE `roomusers` (
  `idRoom` int(255) NOT NULL,
  `idUser` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `roomusers`
--

INSERT INTO `roomusers` (`idRoom`, `idUser`) VALUES
(54, 2),
(54, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user`
--

CREATE TABLE `user` (
  `id` int(255) NOT NULL,
  `userName` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `avatar` text NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `user`
--

INSERT INTO `user` (`id`, `userName`, `password`, `avatar`, `lastName`, `firstName`, `createdAt`) VALUES
(1, 'ronaldo', '12345', 'https://d2x51gyc4ptf2q.cloudfront.net/content/uploads/2019/03/13100151/Cristiano-Ronaldo-Football365-1.jpg', 'Ronaldo', 'Criatino', '2019-04-03 08:23:13'),
(2, 'messi', '12345', 'https://i.imgur.com/ntyA4xe.png', 'Messi', 'Lionel', '2019-04-03 08:23:13'),
(3, 'Neymar', '12345', 'https://i.imgur.com/dO3HP6J.jpg', 'jr', 'Neymar', '2019-05-03 13:57:15');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `roomusers`
--
ALTER TABLE `roomusers`
  ADD KEY `idRoom` (`idRoom`),
  ADD KEY `idUser` (`idUser`);

--
-- Chỉ mục cho bảng `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT cho bảng `user`
--
ALTER TABLE `user`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `roomusers`
--
ALTER TABLE `roomusers`
  ADD CONSTRAINT `RoomUsers_ibfk_1` FOREIGN KEY (`idRoom`) REFERENCES `rooms` (`id`),
  ADD CONSTRAINT `RoomUsers_ibfk_2` FOREIGN KEY (`idUser`) REFERENCES `user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
