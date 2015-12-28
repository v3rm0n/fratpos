CREATE TABLE IF NOT EXISTS obligation_type (
	id   BIGINT(20)  NOT NULL,
	name VARCHAR(45) NOT NULL,
	PRIMARY KEY (id),
	UNIQUE INDEX name_UNIQUE (name ASC)
);

CREATE TABLE IF NOT EXISTS obligation (
	id                 BIGINT(20)     NOT NULL,
	obligation_type_id BIGINT(20)     NOT NULL,
	description        VARCHAR(80)    NULL     DEFAULT NULL,
	time               DATETIME       NULL     DEFAULT NULL,
	total              DECIMAL(10, 2) NOT NULL,
	date_created       DATETIME       NOT NULL DEFAULT NOW(),
	PRIMARY KEY (id),
	INDEX fk_obligation_obligation_type_idx (obligation_type_id ASC),
	CONSTRAINT fk_obligation_obligation_type
	FOREIGN KEY (obligation_type_id)
	REFERENCES obligation_type (id)
		ON DELETE RESTRICT
		ON UPDATE RESTRICT
);

CREATE TABLE IF NOT EXISTS user_obligation (
	obligation_id BIGINT(20)     NOT NULL,
	user_id       BIGINT(20)     NOT NULL,
	amount        DECIMAL(10, 2) NOT NULL,
	recurring     TINYINT(1)     NULL DEFAULT 0,
	start_date    DATE           NULL DEFAULT NULL,
	end_date      DATE           NULL DEFAULT NULL,
	PRIMARY KEY (obligation_id, user_id),
	INDEX fk_user_obligation_user_idx (user_id ASC),
	CONSTRAINT fk_user_obligation_user
	FOREIGN KEY (user_id)
	REFERENCES user (id)
		ON DELETE RESTRICT
		ON UPDATE RESTRICT,
	CONSTRAINT fk_user_obligation_obligation
	FOREIGN KEY (obligation_id)
	REFERENCES obligation (id)
		ON DELETE RESTRICT
		ON UPDATE RESTRICT
);

CREATE TABLE IF NOT EXISTS income_type (
	id   BIGINT(20)  NOT NULL,
	name VARCHAR(45) NOT NULL,
	PRIMARY KEY (id),
	UNIQUE INDEX name_UNIQUE (name ASC)
);

CREATE TABLE IF NOT EXISTS income (
	id             BIGINT(20)     NOT NULL,
	user_id        BIGINT(20)     NOT NULL,
	income_type_id BIGINT(20)     NOT NULL,
	amount         DECIMAL(10, 2) NOT NULL,
	date_created   DATETIME       NOT NULL DEFAULT NOW(),
	PRIMARY KEY (id),
	INDEX fk_income_user_idx (user_id ASC),
	INDEX fk_income_income_type_idx (income_type_id ASC),
	CONSTRAINT fk_income_user
	FOREIGN KEY (user_id)
	REFERENCES user (id)
		ON DELETE RESTRICT
		ON UPDATE NO ACTION,
	CONSTRAINT fk_income_income_type
	FOREIGN KEY (income_type_id)
	REFERENCES income_type (id)
		ON DELETE RESTRICT
		ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS notification (
	id           BIGINT(20)  NOT NULL,
	user_id      BIGINT(20)  NOT NULL,
	type         VARCHAR(45) NOT NULL,
	date_created DATETIME    NOT NULL DEFAULT NOW(),
	PRIMARY KEY (id),
	INDEX fk_notification_user_idx (user_id ASC),
	CONSTRAINT fk_notification_user
	FOREIGN KEY (user_id)
	REFERENCES user (id)
		ON DELETE CASCADE
		ON UPDATE NO ACTION
);
