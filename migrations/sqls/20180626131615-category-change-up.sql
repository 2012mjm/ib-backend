SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;

ALTER TABLE `product` 
DROP FOREIGN KEY `fk_product_subcategory1`,
DROP FOREIGN KEY `fk_product_secondSubcategory1`;

ALTER TABLE `category` 
ADD COLUMN `parentId` INT(11) NULL DEFAULT NULL AFTER `id`,
ADD INDEX `fk_category_category1_idx` (`parentId` ASC);

ALTER TABLE `product` 
DROP COLUMN `secondSubcategoryId`,
DROP COLUMN `subcategoryId`,
DROP INDEX `fk_product_secondSubcategory1_idx` ,
DROP INDEX `fk_product_subcategory1_idx` ;

DROP TABLE IF EXISTS `subcategory` ;

DROP TABLE IF EXISTS `secondSubcategory` ;

ALTER TABLE `category` 
ADD CONSTRAINT `fk_category_category1`
  FOREIGN KEY (`parentId`)
  REFERENCES `category` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `category` 
ADD INDEX `fk_category_file1_idx` (`photoId` ASC);

ALTER TABLE `category` 
ADD CONSTRAINT `fk_category_file1`
  FOREIGN KEY (`photoId`)
  REFERENCES `file` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;


SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
