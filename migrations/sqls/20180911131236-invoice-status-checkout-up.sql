ALTER TABLE `invoice` CHANGE `status` `status` ENUM('pending','accepted','paid','sent','sent-final','rejected','checkout') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL;
