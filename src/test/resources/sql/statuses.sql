--liquibase formatted sql

--changeset statuses:1

INSERT INTO status(id, name) VALUES(status_seq.nextval, 'reb!');
INSERT INTO status(id, name) VALUES(status_seq.nextval, 'ksv!');
INSERT INTO status(id, name) VALUES(status_seq.nextval, 'vil!');
INSERT INTO status(id, name) VALUES(status_seq.nextval, 'kül!');
INSERT INTO status(id, name) VALUES(status_seq.nextval, 'kül');