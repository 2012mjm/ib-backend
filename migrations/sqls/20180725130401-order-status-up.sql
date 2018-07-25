ALTER TABLE `order` ADD `status` ENUM('pending','sent','rejected') NOT NULL DEFAULT 'pending' AFTER `weight`;
ALTER TABLE `order` ADD `reasonRejected` TEXT NULL AFTER `status`;

ALTER TABLE `invoice` CHANGE `status` `status` ENUM('pending','accepted','paid','sent','rejected') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL;