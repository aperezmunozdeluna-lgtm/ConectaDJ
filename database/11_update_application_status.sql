USE djmatch_db;

ALTER TABLE applications
MODIFY COLUMN status ENUM('pending', 'accepted', 'rejected', 'withdrawn') NOT NULL DEFAULT 'pending';
