CREATE TABLE feedback (
	id      BIGINT AUTO_INCREMENT NOT NULL,
	content VARCHAR(1024)         NOT NULL,
	created DATETIME              NOT NULL,
	CONSTRAINT pk_feedback PRIMARY KEY (id)
);

CREATE TABLE paytype (
	id               BIGINT AUTO_INCREMENT NOT NULL,
	name             VARCHAR(255)          NOT NULL,
	affects_balance  TINYINT(1)            NOT NULL DEFAULT 0,
	affects_quantity TINYINT(1)            NOT NULL DEFAULT 0,
	CONSTRAINT pk_paytype PRIMARY KEY (id)
);

CREATE TABLE product (
	id       BIGINT AUTO_INCREMENT NOT NULL,
	name     VARCHAR(255)          NOT NULL,
	price    DECIMAL(38, 2)        NOT NULL,
	quantity INTEGER               NOT NULL,
	CONSTRAINT pk_product PRIMARY KEY (id)
);

CREATE TABLE status (
	id   BIGINT AUTO_INCREMENT NOT NULL,
	name VARCHAR(255)          NOT NULL,
	CONSTRAINT pk_status PRIMARY KEY (id)
);

CREATE TABLE stocktaking (
	id           BIGINT AUTO_INCREMENT NOT NULL,
	created      DATETIME              NOT NULL,
	users        LONGTEXT,
	products     LONGTEXT,
	transactions LONGTEXT,
	CONSTRAINT pk_stocktaking PRIMARY KEY (id)
);

CREATE TABLE transaction (
	id         BIGINT AUTO_INCREMENT NOT NULL,
	invalid    TINYINT(1)            NOT NULL DEFAULT 0,
	created    DATETIME              NOT NULL,
	user_id    BIGINT                NOT NULL,
	paytype_id BIGINT                NOT NULL,
	CONSTRAINT pk_transaction PRIMARY KEY (id)
);

CREATE TABLE transaction_product (
	id         BIGINT AUTO_INCREMENT NOT NULL,
	name       VARCHAR(255)          NOT NULL,
	price      DECIMAL(38, 2)        NOT NULL,
	quantity   INTEGER               NOT NULL,
	product_id BIGINT                NOT NULL,
	CONSTRAINT pk_transaction_product PRIMARY KEY (id)
);

CREATE TABLE transaction_transaction_product (
	transaction_id         BIGINT NOT NULL,
	transaction_product_id BIGINT NOT NULL,
	CONSTRAINT pk_transaction_transaction_product PRIMARY KEY (transaction_id, transaction_product_id)
);

CREATE TABLE user (
	id         BIGINT AUTO_INCREMENT NOT NULL,
	first_name VARCHAR(255)          NOT NULL,
	last_name  VARCHAR(255)          NOT NULL,
	beer_name  VARCHAR(255),
	status_id  BIGINT                NOT NULL,
	balance    DECIMAL(38, 2)        NOT NULL,
	CONSTRAINT pk_user PRIMARY KEY (id)
);


CREATE TABLE paytype_status (
	paytype_id BIGINT NOT NULL,
	status_id  BIGINT NOT NULL,
	CONSTRAINT pk_paytype_status PRIMARY KEY (paytype_id, status_id)
);

CREATE INDEX ix_transaction_user_1 ON transaction (user_id);
CREATE INDEX ix_transaction_paytype_2 ON transaction (paytype_id);
CREATE INDEX ix_user_status_4 ON user (status_id);