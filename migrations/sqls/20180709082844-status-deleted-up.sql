ALTER TABLE `store` ADD `status` ENUM('active','inactive','deleted') NOT NULL DEFAULT 'active' AFTER `logoId`;

ALTER TABLE `product` CHANGE `status` `status` ENUM('pending','accepted','rejected','deleted') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'pending'; 

ALTER TABLE `product` CHANGE `rejectReason` `reasonRejected` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL; 