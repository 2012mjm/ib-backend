ALTER TABLE `product` ADD `visit` INT NOT NULL DEFAULT '0' AFTER `star`, ADD `sale` INT NOT NULL DEFAULT '0' AFTER `visit`;
