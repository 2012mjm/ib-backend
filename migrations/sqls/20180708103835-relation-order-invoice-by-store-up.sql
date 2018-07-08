
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;

ALTER TABLE `invoice` 
ADD COLUMN `storeId` INT(11) NOT NULL AFTER `id`,
ADD INDEX `fk_invoice_store1_idx` (`storeId` ASC);

ALTER TABLE `order` 
ADD COLUMN `storeId` INT(11) NOT NULL AFTER `id`,
ADD INDEX `fk_order_product1_idx` (`productId` ASC),
ADD INDEX `fk_order_store1_idx` (`storeId` ASC);

ALTER TABLE `payment` 
ADD COLUMN `storeId` INT(11) NOT NULL AFTER `id`,
ADD INDEX `fk_payment_store1_idx` (`storeId` ASC);

ALTER TABLE `invoice` 
ADD CONSTRAINT `fk_invoice_store1`
  FOREIGN KEY (`storeId`)
  REFERENCES `store` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `order` 
ADD CONSTRAINT `fk_order_product1`
  FOREIGN KEY (`productId`)
  REFERENCES `product` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `fk_order_store1`
  FOREIGN KEY (`storeId`)
  REFERENCES `store` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `payment` 
ADD CONSTRAINT `fk_payment_store1`
  FOREIGN KEY (`storeId`)
  REFERENCES `store` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;


ALTER TABLE `invoice` 
DROP FOREIGN KEY `fk_invoice_store1`;

ALTER TABLE `payment` 
DROP FOREIGN KEY `fk_payment_store1`;

ALTER TABLE `invoice` 
DROP COLUMN `storeId`,
DROP INDEX `fk_invoice_store1_idx` ;

ALTER TABLE `order` 
ADD INDEX `fk_order_product1_idx` (`productId` ASC),
ADD INDEX `fk_order_store1_idx` (`storeId` ASC),
DROP INDEX `fk_order_store1_idx` ,
DROP INDEX `fk_order_product1_idx` ;

ALTER TABLE `payment` 
DROP COLUMN `storeId`,
DROP INDEX `fk_payment_store1_idx` ;

ALTER TABLE `invoice` ADD `amount` BIGINT NULL AFTER `number`;

SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
