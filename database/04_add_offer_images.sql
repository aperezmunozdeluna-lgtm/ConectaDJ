USE djmatch_db;

ALTER TABLE job_offers
    ADD COLUMN image_url VARCHAR(500) NULL AFTER duration_hours;
