ALTER TABLE `store` 
ADD COLUMN `credit` BIGINT(20) NOT NULL DEFAULT 0 AFTER `email`;

CREATE TABLE IF NOT EXISTS `withdraw` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `storeId` INT(11) NOT NULL,
  `amount` BIGINT(20) NOT NULL,
  `accountOwner` VARCHAR(128) NULL DEFAULT NULL,
  `bankName` VARCHAR(128) NULL DEFAULT NULL,
  `cardNumber` VARCHAR(128) NULL DEFAULT NULL,
  `accountNumber` VARCHAR(128) NULL DEFAULT NULL,
  `shabaNumber` VARCHAR(128) NULL DEFAULT NULL,
  `receiptPayment` VARCHAR(128) NULL DEFAULT NULL,
  `reasonRejected` VARCHAR(255) NOT NULL,
  `status` ENUM('pending', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
  `createdAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_withdraw_store1_idx` (`storeId` ASC),
  CONSTRAINT `fk_withdraw_store1`
    FOREIGN KEY (`storeId`)
    REFERENCES `store` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;

ALTER TABLE `withdraw` CHANGE `reasonRejected` `reasonRejected` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL;