ALTER TABLE stocktaking
    CHANGE users users JSON NOT NULL,
    CHANGE products products JSON NOT NULL,
    CHANGE transactions transactions JSON NOT NULL;