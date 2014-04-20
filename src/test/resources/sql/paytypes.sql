--liquibase formatted sql

--changeset paytypes:1

INSERT INTO paytype(id, name, affects_quantity, affects_balance) VALUES(paytype_seq.nextval, 'Sulas', true, false);
INSERT INTO paytype(id, name, affects_quantity, affects_balance) VALUES(paytype_seq.nextval, 'Rebaseõlu', true, false);
INSERT INTO paytype(id, name, affects_quantity, affects_balance) VALUES(paytype_seq.nextval, 'Ettemaks/Võlg', true, true);

INSERT INTO paytype_status(paytype_id, status_id) VALUES((SELECT id FROM paytype WHERE name = 'Sulas'), (SELECT id FROM status WHERE name = 'reb!'));
INSERT INTO paytype_status(paytype_id, status_id) VALUES((SELECT id FROM paytype WHERE name = 'Sulas'), (SELECT id FROM status WHERE name = 'vil!'));
INSERT INTO paytype_status(paytype_id, status_id) VALUES((SELECT id FROM paytype WHERE name = 'Sulas'), (SELECT id FROM status WHERE name = 'ksv!'));
INSERT INTO paytype_status(paytype_id, status_id) VALUES((SELECT id FROM paytype WHERE name = 'Sulas'), (SELECT id FROM status WHERE name = 'kül!'));

INSERT INTO paytype_status(paytype_id, status_id) VALUES((SELECT id FROM paytype WHERE name = 'Rebaseõlu'), (SELECT id FROM status WHERE name = 'reb!'));

INSERT INTO paytype_status(paytype_id, status_id) VALUES((SELECT id FROM paytype WHERE name = 'Ettemaks/Võlg'), (SELECT id FROM status WHERE name = 'ksv!'));
INSERT INTO paytype_status(paytype_id, status_id) VALUES((SELECT id FROM paytype WHERE name = 'Ettemaks/Võlg'), (SELECT id FROM status WHERE name = 'vil!'));
INSERT INTO paytype_status(paytype_id, status_id) VALUES((SELECT id FROM paytype WHERE name = 'Ettemaks/Võlg'), (SELECT id FROM status WHERE name = 'kül'));
