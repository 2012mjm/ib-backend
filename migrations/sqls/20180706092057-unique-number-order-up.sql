ALTER TABLE `invoice` ADD UNIQUE(`number`);
ALTER TABLE `invoice` CHANGE `status` `status` ENUM('draft','pending','accepted','rejected') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL; 