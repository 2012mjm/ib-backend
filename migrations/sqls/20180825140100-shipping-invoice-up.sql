ALTER TABLE `invoice` ADD `shippingCost` INT NOT NULL DEFAULT '0' AFTER `amount`,
    ADD `shippingType` ENUM('payment-at-place','online','free') NULL AFTER `shippingCost`,
    ADD `shippingMethod` ENUM('bike-delivery','pickup-truck') NULL AFTER `shippingType`;
