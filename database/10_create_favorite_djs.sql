USE djmatch_db;

CREATE TABLE IF NOT EXISTS favorite_djs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organizer_id INT NOT NULL,
    dj_profile_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_favorite_dj (organizer_id, dj_profile_id),
    CONSTRAINT fk_favorite_organizer
        FOREIGN KEY (organizer_id) REFERENCES organizer_profiles(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_favorite_dj
        FOREIGN KEY (dj_profile_id) REFERENCES dj_profiles(id)
        ON DELETE CASCADE
);

INSERT INTO favorite_djs (organizer_id, dj_profile_id)
SELECT 1, 1
WHERE NOT EXISTS (
    SELECT 1 FROM favorite_djs WHERE organizer_id = 1 AND dj_profile_id = 1
);

INSERT INTO favorite_djs (organizer_id, dj_profile_id)
SELECT 3, 2
WHERE NOT EXISTS (
    SELECT 1 FROM favorite_djs WHERE organizer_id = 3 AND dj_profile_id = 2
);
