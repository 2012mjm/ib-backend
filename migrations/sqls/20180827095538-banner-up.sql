CREATE TABLE IF NOT EXISTS `banner` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `type` ENUM('slide', 'wide', 'small') NOT NULL,
  `imageId` INT(11) NOT NULL,
  `linkType` ENUM('category', 'product', 'url') NULL DEFAULT NULL,
  `link` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_banner_file1_idx` (`imageId` ASC),
  CONSTRAINT `fk_banner_file1`
    FOREIGN KEY (`imageId`)
    REFERENCES `file` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;