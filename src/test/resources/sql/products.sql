--liquibase formatted sql

--changeset products:1

INSERT INTO product(id, name, price, quantity) VALUES(product_seq.nextval, 'A. Le Coq - Porter', 1, 5);
INSERT INTO product(id, name, price, quantity) VALUES(product_seq.nextval, 'Warsteiner (Alkoholivaba)', 1, 1);
INSERT INTO product(id, name, price, quantity) VALUES(product_seq.nextval, 'Karastusjook - Kali', 0.5, 3);
INSERT INTO product(id, name, price, quantity) VALUES(product_seq.nextval, 'König Ludwig Dunkel', 1.5, 46);
INSERT INTO product(id, name, price, quantity) VALUES(product_seq.nextval, 'König Ludwig Weizzbier', 1.5, 33);
INSERT INTO product(id, name, price, quantity) VALUES(product_seq.nextval, 'Saku - Originaal (purk)', 1, 7);
INSERT INTO product(id, name, price, quantity) VALUES(product_seq.nextval, 'A. Le Coq - Premium', 1, 32);
INSERT INTO product(id, name, price, quantity) VALUES(product_seq.nextval, 'A. Le Coq - Pilsner', 1, 26);
INSERT INTO product(id, name, price, quantity) VALUES(product_seq.nextval, 'A. Le Coq - Special', 1, 50);
INSERT INTO product(id, name, price, quantity) VALUES(product_seq.nextval, 'A. Le Coq - Imperial Ale', 1, 53);
INSERT INTO product(id, name, price, quantity) VALUES(product_seq.nextval, 'A. Le Coq - Tõmmu Hiid', 1, 53);
INSERT INTO product(id, name, price, quantity) VALUES(product_seq.nextval, 'A. Le Coq - Alexander', 1, 211);
INSERT INTO product(id, name, price, quantity) VALUES(product_seq.nextval, 'Karastusjook -  Limonaad/Kelluke', 0.5, 11);
INSERT INTO product(id, name, price, quantity) VALUES(product_seq.nextval, 'A. Le Coq - Imperial Märzen', 1, 32);
INSERT INTO product(id, name, price, quantity) VALUES(product_seq.nextval, 'A.Le Coq - Extra Ginger', 1, 4);
INSERT INTO product(id, name, price, quantity) VALUES(product_seq.nextval, 'Valmiermuiza - Frejledus alus', 2, 13);
INSERT INTO product(id, name, price, quantity) VALUES(product_seq.nextval, 'Bralis', 1.5, 12);