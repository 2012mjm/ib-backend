CREATE TABLE `iranibekharim`.`message` ( `id` INT NOT NULL AUTO_INCREMENT , `name` VARCHAR(45) NULL , `email` VARCHAR(255) NULL , `subject` VARCHAR(128) NULL , `message` TEXT NOT NULL , `source` ENUM('site','app') NOT NULL , `createdAt` DATE NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;