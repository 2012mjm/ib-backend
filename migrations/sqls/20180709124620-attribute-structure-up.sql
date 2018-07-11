SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;

ALTER TABLE `order` 
CHANGE COLUMN `quantity` `count` INT(11) NOT NULL DEFAULT '1' ;

CREATE TABLE IF NOT EXISTS `attribute` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `key` VARCHAR(45) NOT NULL,
  `titleFa` VARCHAR(45) NOT NULL,
  `titleEn` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `category_attribute` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `categoryId` INT(11) NOT NULL,
  `attributeId` INT(11) NOT NULL,
  `isRequired` TINYINT(1) NOT NULL DEFAULT 0,
  `isMultiple` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX `fk_category_attribute_attribute1_idx` (`attributeId` ASC),
  INDEX `fk_category_attribute_category1_idx` (`categoryId` ASC),
  CONSTRAINT `fk_category_attribute_attribute1`
    FOREIGN KEY (`attributeId`)
    REFERENCES `attribute` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_category_attribute_category1`
    FOREIGN KEY (`categoryId`)
    REFERENCES `category` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `product_attribute` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `productId` INT(11) NOT NULL,
  `attributeId` INT(11) NOT NULL,
  `attributeValueId` INT(11) NULL DEFAULT NULL,
  `value` TEXT NULL DEFAULT NULL,
  `increasePrice` BIGINT(20) NULL DEFAULT NULL,
  `descount` BIGINT(20) NULL DEFAULT NULL,
  `quantity` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_product_attribute_attribute1_idx` (`attributeId` ASC),
  INDEX `fk_product_attribute_attribute_value1_idx` (`attributeValueId` ASC),
  INDEX `fk_product_attribute_product1_idx` (`productId` ASC),
  CONSTRAINT `fk_product_attribute_attribute1`
    FOREIGN KEY (`attributeId`)
    REFERENCES `attribute` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_product_attribute_attribute_value1`
    FOREIGN KEY (`attributeValueId`)
    REFERENCES `attribute_value` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_product_attribute_attribute_value2`
    FOREIGN KEY (`attributeValueId`)
    REFERENCES `attribute_value` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_product_attribute_product1`
    FOREIGN KEY (`productId`)
    REFERENCES `product` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `attribute_value` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `attributeId` INT(11) NOT NULL,
  `titleFa` VARCHAR(45) NOT NULL,
  `titleEn` VARCHAR(45) NULL DEFAULT NULL,
  `value` TEXT NULL DEFAULT NULL,
  `photoId` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;

ALTER TABLE `attribute_value` 
ADD CONSTRAINT `fk_attribute_value_file1`
  FOREIGN KEY (`photoId`)
  REFERENCES `file` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

DROP TABLE IF EXISTS `product_color` ;

DROP TABLE IF EXISTS `color` ;

INSERT INTO `attribute` (`id`, `key`, `titleFa`, `titleEn`) VALUES (NULL, 'color', 'رنگ', 'Color'), (NULL, 'size', 'سایز', 'Size'); 

INSERT INTO `attribute_value` (`id`, `attributeId`, `titleFa`, `titleEn`, `value`, `photoId`) VALUES 
(NULL, '1', 'مشکلی', 'Black', 'black', NULL),
(NULL, '1', 'سفید', 'White', 'white', NULL),
(NULL, '1', 'آبی', 'Blue', 'blue', NULL),
(NULL, '1', 'قرمز', 'Red', 'red', NULL),
(NULL, '1', 'زرد', 'Yellow', 'yellow', NULL);

INSERT INTO `attribute_value` (`id`, `attributeId`, `titleFa`, `titleEn`, `value`, `photoId`) VALUES 
(NULL, '2', 'کوچک', 'Large', 'L', NULL),
(NULL, '2', 'متوسط', 'Medium', 'M', NULL),
(NULL, '2', 'بزرگ', 'Small', 'S', NULL);

SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;