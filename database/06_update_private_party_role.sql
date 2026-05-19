USE djmatch_db;

ALTER TABLE users
MODIFY COLUMN role ENUM('dj', 'organizer', 'private_party', 'admin') NOT NULL DEFAULT 'dj';

ALTER TABLE organizer_profiles
MODIFY COLUMN venue_type ENUM('club', 'bar', 'festival', 'private', 'private_party', 'other') NOT NULL DEFAULT 'other';
