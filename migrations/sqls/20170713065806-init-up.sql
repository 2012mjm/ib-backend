SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;

CREATE TABLE IF NOT EXISTS `file` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(128) NOT NULL,
  `path` VARCHAR(128) NOT NULL,
  `type` ENUM('image', 'video', 'document') NOT NULL DEFAULT 'image',
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(128) NOT NULL,
  `password` VARCHAR(256) NOT NULL,
  `email` VARCHAR(256) NOT NULL,
  `avatarId` INT NULL,
  `mobile` VARCHAR(45) NULL,
  `phone` VARCHAR(45) NULL,
  `isAdmin` TINYINT(1) NOT NULL,
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  `createdAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_user_file1_idx` (`avatarId` ASC),
  CONSTRAINT `fk_user_file1`
    FOREIGN KEY (`avatarId`)
    REFERENCES `file` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `store`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `store` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `description` VARCHAR(45) NULL,
  `logoId` INT NULL,
  `createdAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_store_user_idx` (`userId` ASC),
  INDEX `fk_store_file1_idx` (`logoId` ASC),
  CONSTRAINT `fk_store_user`
    FOREIGN KEY (`userId`)
    REFERENCES `user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_store_file1`
    FOREIGN KEY (`logoId`)
    REFERENCES `file` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `category` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `photoId` INT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `subcategory`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `subcategory` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `categoryId` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `photoId` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_subcategory_category1_idx` (`categoryId` ASC),
  CONSTRAINT `fk_subcategory_category1`
    FOREIGN KEY (`categoryId`)
    REFERENCES `category` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `product`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `product` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `subcategoryId` INT NOT NULL,
  `storeId` INT NOT NULL,
  `photoId` INT NULL,
  `name` VARCHAR(128) NOT NULL,
  `description` TEXT NULL,
  `price` BIGINT NOT NULL,
  `quantity` INT NOT NULL,
  `weight` DECIMAL(5,2) NULL,
  `star` INT NOT NULL DEFAULT 0,
  `status` ENUM('pending', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
  `createdAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_product_store1_idx` (`storeId` ASC),
  INDEX `fk_product_subcategory1_idx` (`subcategoryId` ASC),
  INDEX `fk_product_file1_idx` (`photoId` ASC),
  CONSTRAINT `fk_product_store1`
    FOREIGN KEY (`storeId`)
    REFERENCES `store` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_product_subcategory1`
    FOREIGN KEY (`subcategoryId`)
    REFERENCES `subcategory` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_product_file1`
    FOREIGN KEY (`photoId`)
    REFERENCES `file` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `province`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `province` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `city`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `city` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `provinceId` INT NOT NULL,
  `name` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_city_province1_idx` (`provinceId` ASC),
  CONSTRAINT `fk_city_province1`
    FOREIGN KEY (`provinceId`)
    REFERENCES `province` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `customer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `customer` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `mobile` VARCHAR(45) NOT NULL,
  `password` VARCHAR(255) NULL,
  `name` VARCHAR(45) NULL,
  `phone` VARCHAR(45) NULL,
  `postalCode` INT NULL,
  `address` VARCHAR(255) NULL,
  `cityId` INT NULL,
  `isVerifiedMobile` TINYINT(1) NOT NULL DEFAULT 0,
  `mobileKey` INT NULL,
  `expiryMobileKey` DATETIME NULL,
  `status` ENUM('active', 'inactive', 'banned') NOT NULL DEFAULT 'inactive',
  `createdAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_customer_city1_idx` (`cityId` ASC),
  CONSTRAINT `fk_customer_city1`
    FOREIGN KEY (`cityId`)
    REFERENCES `city` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `invoice`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `invoice` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `customerId` INT NOT NULL,
  `number` VARCHAR(45) NULL,
  `cityId` INT NULL,
  `address` VARCHAR(255) NULL,
  `postalCode` INT NULL,
  `phone` VARCHAR(45) NULL,
  `createdAt` DATETIME NOT NULL,
  `status` ENUM('pending', 'accepted', 'rejected') NOT NULL,
  `reasonRejected` TEXT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_payment_customer1_idx` (`customerId` ASC),
  INDEX `fk_payment_city1_idx` (`cityId` ASC),
  CONSTRAINT `fk_payment_customer1`
    FOREIGN KEY (`customerId`)
    REFERENCES `customer` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_payment_city1`
    FOREIGN KEY (`cityId`)
    REFERENCES `city` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `order`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `order` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `customerId` INT NOT NULL,
  `invoiceId` INT NOT NULL,
  `productId` INT NOT NULL,
  `price` BIGINT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `weight` DECIMAL(5,2) NULL,
  `createdAt` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_order_customer1_idx` (`customerId` ASC),
  INDEX `fk_order_payment1_idx` (`invoiceId` ASC),
  CONSTRAINT `fk_order_customer1`
    FOREIGN KEY (`customerId`)
    REFERENCES `customer` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_order_payment1`
    FOREIGN KEY (`invoiceId`)
    REFERENCES `invoice` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `product_photo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `product_photo` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `productId` INT NOT NULL,
  `fileId` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_product_photo_product1_idx` (`productId` ASC),
  INDEX `fk_product_photo_file1_idx` (`fileId` ASC),
  CONSTRAINT `fk_product_photo_product1`
    FOREIGN KEY (`productId`)
    REFERENCES `product` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_product_photo_file1`
    FOREIGN KEY (`fileId`)
    REFERENCES `file` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `payment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `payment` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `customerId` INT NOT NULL,
  `invoiceId` INT NOT NULL,
  `trackingCode` VARCHAR(45) NULL,
  `reffererCode` VARCHAR(45) NULL,
  `amount` BIGINT NOT NULL,
  `statusCode` INT NULL,
  `status` VARCHAR(45) NULL,
  `type` ENUM('online', 'cash', 'POS') NOT NULL DEFAULT 'online',
  `createdAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_payment_invoice1_idx` (`invoiceId` ASC),
  INDEX `fk_payment_customer2_idx` (`customerId` ASC),
  CONSTRAINT `fk_payment_invoice1`
    FOREIGN KEY (`invoiceId`)
    REFERENCES `invoice` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_payment_customer2`
    FOREIGN KEY (`customerId`)
    REFERENCES `customer` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `product_star`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `product_star` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `productId` INT NOT NULL,
  `customerId` INT NOT NULL,
  `vote` INT NOT NULL,
  `createdAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_product_rate_product1_idx` (`productId` ASC),
  INDEX `fk_product_rate_customer1_idx` (`customerId` ASC),
  CONSTRAINT `fk_product_rate_product1`
    FOREIGN KEY (`productId`)
    REFERENCES `product` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_product_rate_customer1`
    FOREIGN KEY (`customerId`)
    REFERENCES `customer` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;

ALTER TABLE `user` ADD UNIQUE(`username`);
ALTER TABLE `user` ADD UNIQUE(`email`);

ALTER TABLE `store` 
DROP FOREIGN KEY `fk_store_user`;

ALTER TABLE `store` 
DROP COLUMN `userId`,
ADD COLUMN `mobile` VARCHAR(45) NOT NULL AFTER `id`,
ADD COLUMN `password` VARCHAR(128) NOT NULL AFTER `mobile`,
ADD COLUMN `email` VARCHAR(255) NULL DEFAULT NULL AFTER `password`,
ADD COLUMN `owner` VARCHAR(45) NULL DEFAULT NULL AFTER `email`,
ADD UNIQUE INDEX `mobile_UNIQUE` (`mobile` ASC),
DROP INDEX `fk_store_user_idx` ;

ALTER TABLE `user` 
DROP COLUMN `isAdmin`, RENAME TO  `manager` ;

SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;