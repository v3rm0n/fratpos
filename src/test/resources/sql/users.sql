--liquibase formatted sql

--changeset users:1

INSERT INTO user(id, first_name, last_name, beer_name, balance, status_id) VALUES(user_seq.nextval, 'Esimene', 'Korporant', 'Hüüdnimi' ,0, (SELECT id FROM status WHERE name = 'vil!'));
INSERT INTO user(id, first_name, last_name, beer_name, balance, status_id) VALUES(user_seq.nextval, 'Teine', 'Korporant', 'Teinenimi' ,0, (SELECT id FROM status WHERE name = 'ksv!'));
INSERT INTO user(id, first_name, last_name, beer_name, balance, status_id) VALUES(user_seq.nextval, 'Kolmas', 'Korporant', 'Rebane' ,0, (SELECT id FROM status WHERE name = 'reb!'));
INSERT INTO user(id, first_name, last_name, beer_name, balance, status_id) VALUES(user_seq.nextval, 'Neljas', 'Perekonnanimi', 'Külaline' ,0, (SELECT id FROM status WHERE name = 'kül!'));