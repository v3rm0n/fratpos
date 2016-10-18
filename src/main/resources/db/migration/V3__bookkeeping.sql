-- MySQL Workbench Synchronization
-- Generated: 2016-10-18 22:20
-- Model: New Model
-- Version: 1.0
-- Project: Name of the project
-- Author: Maido Käära

SET @OLD_UNIQUE_CHECKS = @@UNIQUE_CHECKS, UNIQUE_CHECKS = 0;
SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS = 0;
SET @OLD_SQL_MODE = @@SQL_MODE, SQL_MODE = 'TRADITIONAL,ALLOW_INVALID_DATES';

CREATE TABLE IF NOT EXISTS `obligation` (
	`id`              BIGINT(20)     NOT NULL AUTO_INCREMENT,
	`journal_type_id` BIGINT(20)     NOT NULL,
	`description`     VARCHAR(80)    NOT NULL,
	`date`            DATE           NOT NULL,
	`amount`          DECIMAL(10, 2) NOT NULL,
	`date_created`    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`account_id`      BIGINT(20)     NOT NULL,
	`created_by_id`   BIGINT(20)     NOT NULL,
	PRIMARY KEY (`id`),
	INDEX `fk_obligation_account_idx` (`account_id` ASC),
	INDEX `fk_obligation_journal_type_idx` (`journal_type_id` ASC),
	INDEX `fk_obligation_created_by_idx` (`created_by_id` ASC),
	CONSTRAINT `fk_obligation_journal_type`
	FOREIGN KEY (`journal_type_id`)
	REFERENCES `journal_type` (`id`)
		ON DELETE RESTRICT
		ON UPDATE RESTRICT,
	CONSTRAINT `fk_obligation_account`
	FOREIGN KEY (`account_id`)
	REFERENCES `account` (`id`)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION,
	CONSTRAINT `fk_obligation_created_by`
	FOREIGN KEY (`created_by_id`)
	REFERENCES `user` (`id`)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
)
	ENGINE = InnoDB
	DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `user_obligation` (
	`obligation_id` BIGINT(20)     NOT NULL,
	`user_id`       BIGINT(20)     NOT NULL,
	`amount`        DECIMAL(10, 2) NOT NULL,
	`start_date`    DATE           NOT NULL,
	`end_date`      DATE           NULL DEFAULT NULL,
	PRIMARY KEY (`obligation_id`, `user_id`),
	INDEX `fk_user_obligation_user_idx` (`user_id` ASC),
	CONSTRAINT `fk_user_obligation_user`
	FOREIGN KEY (`user_id`)
	REFERENCES `user` (`id`)
		ON DELETE RESTRICT
		ON UPDATE RESTRICT,
	CONSTRAINT `fk_user_obligation_obligation`
	FOREIGN KEY (`obligation_id`)
	REFERENCES `obligation` (`id`)
		ON DELETE RESTRICT
		ON UPDATE RESTRICT
)
	ENGINE = InnoDB
	DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `journal_type` (
	`id`   BIGINT(20)  NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(45) NOT NULL,
	PRIMARY KEY (`id`),
	UNIQUE INDEX `name_UNIQUE` (`name` ASC)
)
	ENGINE = InnoDB
	DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `notification` (
	`id`           BIGINT(20)  NOT NULL,
	`user_id`      BIGINT(20)  NOT NULL,
	`type`         VARCHAR(45) NOT NULL,
	`date_created` TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`created_by`   BIGINT(20)  NOT NULL,
	PRIMARY KEY (`id`),
	INDEX `fk_notification_user_idx` (`user_id` ASC),
	INDEX `fk_notification_created_by_idx` (`created_by` ASC),
	CONSTRAINT `fk_notification_user`
	FOREIGN KEY (`user_id`)
	REFERENCES `user` (`id`)
		ON DELETE CASCADE
		ON UPDATE NO ACTION,
	CONSTRAINT `fk_notification_created_by`
	FOREIGN KEY (`created_by`)
	REFERENCES `user` (`id`)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
)
	ENGINE = InnoDB
	DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `account` (
	`id`              BIGINT(20)  NOT NULL AUTO_INCREMENT,
	`name`            VARCHAR(45) NOT NULL,
	`date_created`    TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`account_type_id` BIGINT(20)  NOT NULL,
	`created_by_id`   BIGINT(20)  NOT NULL,
	PRIMARY KEY (`id`),
	INDEX `fk_account_account_type_idx` (`account_type_id` ASC),
	INDEX `fk_account_created_by_idx` (`created_by_id` ASC),
	CONSTRAINT `fk_account_account_type`
	FOREIGN KEY (`account_type_id`)
	REFERENCES `account_type` (`id`)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION,
	CONSTRAINT `fk_account_created_by`
	FOREIGN KEY (`created_by_id`)
	REFERENCES `user` (`id`)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
)
	ENGINE = InnoDB
	DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `journal` (
	`id`              BIGINT(20)    NOT NULL AUTO_INCREMENT,
	`journal_type_id` BIGINT(20)    NOT NULL,
	`date_created`    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`date`            DATE          NOT NULL,
	`created_by_id`   BIGINT(20)    NOT NULL,
	`description`     VARCHAR(1024) NULL     DEFAULT NULL,
	PRIMARY KEY (`id`),
	INDEX `fk_journal_journal_type_idx` (`journal_type_id` ASC),
	INDEX `fk_journal_created_by_idx` (`created_by_id` ASC),
	CONSTRAINT `fk_journal_journal_type`
	FOREIGN KEY (`journal_type_id`)
	REFERENCES `journal_type` (`id`)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION,
	CONSTRAINT `fk_journal_created_by`
	FOREIGN KEY (`created_by_id`)
	REFERENCES `user` (`id`)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
)
	ENGINE = InnoDB
	DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `user_account` (
	`user_id`    BIGINT(20) NOT NULL,
	`account_id` BIGINT(20) NOT NULL,
	PRIMARY KEY (`user_id`, `account_id`),
	INDEX `fk_user_account_account_idx` (`account_id` ASC),
	CONSTRAINT `fk_user_account_user`
	FOREIGN KEY (`user_id`)
	REFERENCES `user` (`id`)
		ON DELETE CASCADE
		ON UPDATE NO ACTION,
	CONSTRAINT `fk_user_account_account`
	FOREIGN KEY (`account_id`)
	REFERENCES `account` (`id`)
		ON DELETE CASCADE
		ON UPDATE NO ACTION
)
	ENGINE = InnoDB
	DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `posting` (
	`id`           BIGINT(20)     NOT NULL AUTO_INCREMENT,
	`account_id`   BIGINT(20)     NOT NULL,
	`journal_id`   BIGINT(20)     NOT NULL,
	`amount`       DECIMAL(10, 2) NOT NULL,
	`date_created` TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`credit`       TINYINT(1)     NOT NULL DEFAULT 0,
	PRIMARY KEY (`id`),
	INDEX `fk_posting_journal_idx` (`journal_id` ASC),
	INDEX `fk_posting_account_idx` (`account_id` ASC),
	CONSTRAINT `fk_posting_account`
	FOREIGN KEY (`account_id`)
	REFERENCES `account` (`id`)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION,
	CONSTRAINT `fk_posting_journal`
	FOREIGN KEY (`journal_id`)
	REFERENCES `journal` (`id`)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
)
	ENGINE = InnoDB
	DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `account_type` (
	`id`   BIGINT(20)  NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(45) NOT NULL,
	PRIMARY KEY (`id`)
)
	ENGINE = InnoDB
	DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `raport` (
	`id`            BIGINT(20)  NOT NULL AUTO_INCREMENT,
	`date_created`  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`created_by_id` BIGINT(20)  NOT NULL,
	`name`          VARCHAR(45) NOT NULL,
	PRIMARY KEY (`id`),
	INDEX `fk_raport_created_by_idx` (`created_by_id` ASC),
	CONSTRAINT `fk_raport_created_by`
	FOREIGN KEY (`created_by_id`)
	REFERENCES `user` (`id`)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
)
	ENGINE = InnoDB
	DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `raport_journal` (
	`raport_id`  BIGINT(20) NOT NULL,
	`journal_id` BIGINT(20) NOT NULL,
	PRIMARY KEY (`raport_id`, `journal_id`),
	INDEX `fk_raport_journal_journal_idx` (`journal_id` ASC),
	CONSTRAINT `fk_raport_posting_raport`
	FOREIGN KEY (`raport_id`)
	REFERENCES `raport` (`id`)
		ON DELETE CASCADE
		ON UPDATE NO ACTION,
	CONSTRAINT `fk_raport_journal_journal`
	FOREIGN KEY (`journal_id`)
	REFERENCES `journal` (`id`)
		ON DELETE RESTRICT
		ON UPDATE NO ACTION
)
	ENGINE = InnoDB
	DEFAULT CHARACTER SET = utf8;


SET SQL_MODE = @OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS = @OLD_UNIQUE_CHECKS;
