--liquibase formatted sql

--changeset vermon:1

create table feedback (
  id                        bigint not null,
  content                   varchar(255) not null,
  created                   timestamp,
  constraint pk_feedback primary key (id))
;

create table paytype (
  id                        bigint not null,
  name                      varchar(255) not null,
  affects_balance           boolean,
  affects_quantity          boolean,
  constraint pk_paytype primary key (id))
;

create table product (
  id                        bigint not null,
  name                      varchar(255) not null,
  price                     decimal(38) not null,
  quantity                  integer,
  constraint pk_product primary key (id))
;

create table status (
  id                        bigint not null,
  name                      varchar(255),
  constraint pk_status primary key (id))
;

create table stocktaking (
  id                        bigint not null,
  created                   timestamp,
  users                     clob,
  products                  clob,
  transactions              clob,
  constraint pk_stocktaking primary key (id))
;

create table transaction (
  id                        bigint not null,
  invalid                   boolean,
  created                   timestamp,
  user_id                   bigint not null,
  paytype_id                bigint not null,
  constraint pk_transaction primary key (id))
;

create table transaction_product (
  id                        bigint not null,
  name                      varchar(255) not null,
  price                     decimal(38) not null,
  quantity                  integer,
  transaction_id            bigint,
  product_id                bigint,
  constraint pk_transaction_product primary key (id))
;

create table user (
  id                        bigint not null,
  first_name                varchar(255) not null,
  last_name                 varchar(255) not null,
  beer_name                 varchar(255),
  status_id                 bigint not null,
  balance                   decimal(38),
  constraint pk_user primary key (id))
;


create table paytype_status (
  paytype_id                     bigint not null,
  status_id                      bigint not null,
  constraint pk_paytype_status primary key (paytype_id, status_id))
;
create sequence feedback_seq;

create sequence paytype_seq;

create sequence product_seq;

create sequence status_seq;

create sequence stocktaking_seq;

create sequence transaction_seq;

create sequence transaction_product_seq;

create sequence user_seq;

alter table transaction add constraint fk_transaction_user_1 foreign key (user_id) references user (id) on delete restrict on update restrict;
create index ix_transaction_user_1 on transaction (user_id);
alter table transaction add constraint fk_transaction_paytype_2 foreign key (paytype_id) references paytype (id) on delete restrict on update restrict;
create index ix_transaction_paytype_2 on transaction (paytype_id);
alter table transaction_product add constraint fk_transaction_product_transac_3 foreign key (transaction_id) references transaction (id) on delete restrict on update restrict;
create index ix_transaction_product_transac_3 on transaction_product (transaction_id);
alter table user add constraint fk_user_status_4 foreign key (status_id) references status (id) on delete restrict on update restrict;
create index ix_user_status_4 on user (status_id);



alter table paytype_status add constraint fk_paytype_status_paytype_01 foreign key (paytype_id) references paytype (id) on delete restrict on update restrict;

alter table paytype_status add constraint fk_paytype_status_status_02 foreign key (status_id) references status (id) on delete restrict on update restrict;
