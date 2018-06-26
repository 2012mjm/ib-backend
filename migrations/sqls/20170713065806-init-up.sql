SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;

CREATE TABLE IF NOT EXISTS `category` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nameFa` VARCHAR(45) CHARACTER SET 'utf8' NOT NULL,
  `nameEn` VARCHAR(45) NULL,
  `photoId` INT(11) NULL DEFAULT NULL,
  `color` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `province`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `province` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) CHARACTER SET 'utf8' NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `city`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `city` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `provinceId` INT(11) NOT NULL,
  `name` VARCHAR(45) CHARACTER SET 'utf8' NOT NULL,
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
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `mobile` VARCHAR(45) CHARACTER SET 'utf8' NOT NULL,
  `password` VARCHAR(255) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `name` VARCHAR(45) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `phone` VARCHAR(45) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `postalCode` INT(11) NULL DEFAULT NULL,
  `address` VARCHAR(255) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `cityId` INT(11) NULL DEFAULT NULL,
  `isVerifiedMobile` TINYINT(1) NOT NULL DEFAULT '0',
  `mobileKey` INT(11) NULL DEFAULT NULL,
  `expiryMobileKey` DATETIME NULL DEFAULT NULL,
  `status` ENUM('active', 'inactive', 'banned') CHARACTER SET 'utf8' NOT NULL DEFAULT 'inactive',
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
-- Table `file`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `file` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(128) CHARACTER SET 'utf8' NOT NULL,
  `path` VARCHAR(128) CHARACTER SET 'utf8' NOT NULL,
  `type` ENUM('image', 'video', 'document') CHARACTER SET 'utf8' NOT NULL DEFAULT 'image',
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `invoice`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `invoice` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `customerId` INT(11) NOT NULL,
  `number` VARCHAR(45) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `cityId` INT(11) NULL DEFAULT NULL,
  `address` VARCHAR(255) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `postalCode` INT(11) NULL DEFAULT NULL,
  `phone` VARCHAR(45) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `createdAt` DATETIME NOT NULL,
  `status` ENUM('pending', 'accepted', 'rejected') CHARACTER SET 'utf8' NOT NULL,
  `reasonRejected` TEXT CHARACTER SET 'utf8' NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_payment_customer1_idx` (`customerId` ASC),
  INDEX `fk_payment_city1_idx` (`cityId` ASC),
  CONSTRAINT `fk_payment_city1`
    FOREIGN KEY (`cityId`)
    REFERENCES `city` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_payment_customer1`
    FOREIGN KEY (`customerId`)
    REFERENCES `customer` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `manager`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `manager` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(128) CHARACTER SET 'utf8' NOT NULL,
  `password` VARCHAR(256) CHARACTER SET 'utf8' NOT NULL,
  `email` VARCHAR(256) CHARACTER SET 'utf8' NOT NULL,
  `avatarId` INT(11) NULL DEFAULT NULL,
  `mobile` VARCHAR(45) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `phone` VARCHAR(45) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `status` ENUM('active', 'inactive') CHARACTER SET 'utf8' NOT NULL DEFAULT 'active',
  `createdAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username` (`username` ASC),
  UNIQUE INDEX `email` (`email` ASC),
  INDEX `fk_user_file1_idx` (`avatarId` ASC),
  CONSTRAINT `fk_user_file1`
    FOREIGN KEY (`avatarId`)
    REFERENCES `file` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `migrations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `run_on` DATETIME NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `order`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `order` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `customerId` INT(11) NOT NULL,
  `invoiceId` INT(11) NOT NULL,
  `productId` INT(11) NOT NULL,
  `price` BIGINT(20) NOT NULL,
  `quantity` INT(11) NOT NULL DEFAULT '1',
  `weight` DECIMAL(5,2) NULL DEFAULT NULL,
  `createdAt` DATETIME NOT NULL,
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
-- Table `payment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `payment` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `customerId` INT(11) NOT NULL,
  `invoiceId` INT(11) NOT NULL,
  `trackingCode` VARCHAR(45) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `reffererCode` VARCHAR(45) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `amount` BIGINT(20) NOT NULL,
  `statusCode` INT(11) NULL DEFAULT NULL,
  `status` VARCHAR(45) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `type` ENUM('online', 'cash', 'POS') CHARACTER SET 'utf8' NOT NULL DEFAULT 'online',
  `createdAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_payment_invoice1_idx` (`invoiceId` ASC),
  INDEX `fk_payment_customer2_idx` (`customerId` ASC),
  CONSTRAINT `fk_payment_customer2`
    FOREIGN KEY (`customerId`)
    REFERENCES `customer` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_payment_invoice1`
    FOREIGN KEY (`invoiceId`)
    REFERENCES `invoice` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `store`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `store` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `mobile` VARCHAR(45) CHARACTER SET 'utf8' NOT NULL,
  `password` VARCHAR(128) CHARACTER SET 'utf8' NOT NULL,
  `email` VARCHAR(255) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `ownerFa` VARCHAR(45) CHARACTER SET 'utf8' NULL,
  `ownerEn` VARCHAR(45) NULL,
  `nameFa` VARCHAR(45) CHARACTER SET 'utf8' NOT NULL,
  `nameEn` VARCHAR(45) NULL,
  `descriptionFa` TEXT CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `descriptionEn` TEXT NULL,
  `logoId` INT(11) NULL DEFAULT NULL,
  `createdAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `mobile_UNIQUE` (`mobile` ASC),
  INDEX `fk_store_file1_idx` (`logoId` ASC),
  CONSTRAINT `fk_store_file1`
    FOREIGN KEY (`logoId`)
    REFERENCES `file` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `subcategory`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `subcategory` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `categoryId` INT(11) NOT NULL,
  `nameFa` VARCHAR(45) CHARACTER SET 'utf8' NOT NULL,
  `nameEn` VARCHAR(45) NULL,
  `photoId` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_subcategory_category1_idx` (`categoryId` ASC),
  CONSTRAINT `fk_subcategory_category1`
    FOREIGN KEY (`categoryId`)
    REFERENCES `category` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `secondSubcategory`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `secondSubcategory` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `subcategoryId` INT NOT NULL,
  `nameFa` VARCHAR(45) NOT NULL,
  `nameEn` VARCHAR(45) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_secondSubcategory_subcategory1_idx` (`subcategoryId` ASC),
  CONSTRAINT `fk_secondSubcategory_subcategory1`
    FOREIGN KEY (`subcategoryId`)
    REFERENCES `subcategory` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `product`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `product` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `storeId` INT(11) NOT NULL,
  `categoryId` INT NOT NULL,
  `subcategoryId` INT(11) NULL,
  `secondSubcategoryId` INT NULL,
  `nameFa` VARCHAR(128) CHARACTER SET 'utf8' NOT NULL,
  `nameEn` VARCHAR(128) NULL,
  `descriptionFa` TEXT CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `descriptionEn` TEXT NULL,
  `price` BIGINT(20) NOT NULL,
  `discount` BIGINT NULL,
  `quantity` INT(11) NOT NULL,
  `weight` DECIMAL(5,2) NULL DEFAULT NULL,
  `star` DECIMAL(5,2) NOT NULL DEFAULT 0,
  `status` ENUM('pending', 'accepted', 'rejected') CHARACTER SET 'utf8' NOT NULL DEFAULT 'pending',
  `rejectReason` VARCHAR(255) NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_product_store1_idx` (`storeId` ASC),
  INDEX `fk_product_subcategory1_idx` (`subcategoryId` ASC),
  INDEX `fk_product_category1_idx` (`categoryId` ASC),
  INDEX `fk_product_secondSubcategory1_idx` (`secondSubcategoryId` ASC),
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
  CONSTRAINT `fk_product_category1`
    FOREIGN KEY (`categoryId`)
    REFERENCES `category` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_product_secondSubcategory1`
    FOREIGN KEY (`secondSubcategoryId`)
    REFERENCES `secondSubcategory` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `product_photo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `product_photo` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `productId` INT(11) NOT NULL,
  `fileId` INT(11) NOT NULL,
  `isMain` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX `fk_product_photo_product1_idx` (`productId` ASC),
  INDEX `fk_product_photo_file1_idx` (`fileId` ASC),
  CONSTRAINT `fk_product_photo_file1`
    FOREIGN KEY (`fileId`)
    REFERENCES `file` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_product_photo_product1`
    FOREIGN KEY (`productId`)
    REFERENCES `product` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `product_star`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `product_star` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `productId` INT(11) NOT NULL,
  `customerId` INT(11) NOT NULL,
  `vote` INT(11) NOT NULL,
  `createdAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_product_rate_product1_idx` (`productId` ASC),
  INDEX `fk_product_rate_customer1_idx` (`customerId` ASC),
  CONSTRAINT `fk_product_rate_customer1`
    FOREIGN KEY (`customerId`)
    REFERENCES `customer` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_product_rate_product1`
    FOREIGN KEY (`productId`)
    REFERENCES `product` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `color`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `color` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nameFa` VARCHAR(45) NOT NULL,
  `nameEn` VARCHAR(45) NULL,
  `code` VARCHAR(45) NULL,
  `photoId` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `product_color`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `product_color` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `productId` INT NOT NULL,
  `colorId` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_product_color_product1_idx` (`productId` ASC),
  INDEX `fk_product_color_color1_idx` (`colorId` ASC),
  CONSTRAINT `fk_product_color_product1`
    FOREIGN KEY (`productId`)
    REFERENCES `product` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_product_color_color1`
    FOREIGN KEY (`colorId`)
    REFERENCES `color` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `product_comment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `product_comment` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `productId` INT NOT NULL,
  `customerId` INT NOT NULL,
  `star` DECIMAL(5,2) NULL,
  `content` TEXT NOT NULL,
  `status` VARCHAR(45) NOT NULL DEFAULT 'pending',
  `reasonRejected` VARCHAR(255) NULL,
  `createdAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_product_comment_product1_idx` (`productId` ASC),
  INDEX `fk_product_comment_customer1_idx` (`customerId` ASC),
  CONSTRAINT `fk_product_comment_product1`
    FOREIGN KEY (`productId`)
    REFERENCES `product` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_product_comment_customer1`
    FOREIGN KEY (`customerId`)
    REFERENCES `customer` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;