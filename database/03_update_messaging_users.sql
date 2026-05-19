USE djmatch_db;

ALTER TABLE conversations
    ADD COLUMN user_one_id INT NULL AFTER id,
    ADD COLUMN user_two_id INT NULL AFTER user_one_id;

UPDATE conversations c
JOIN dj_profiles d ON c.dj_profile_id = d.id
JOIN organizer_profiles o ON c.organizer_id = o.id
SET c.user_one_id = d.user_id,
    c.user_two_id = o.user_id
WHERE c.user_one_id IS NULL OR c.user_two_id IS NULL;

ALTER TABLE conversations
    MODIFY COLUMN dj_profile_id INT NULL,
    MODIFY COLUMN organizer_id INT NULL;

ALTER TABLE conversations
    ADD CONSTRAINT fk_conversation_user_one
        FOREIGN KEY (user_one_id) REFERENCES users(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_conversation_user_two
        FOREIGN KEY (user_two_id) REFERENCES users(id) ON DELETE CASCADE;

CREATE INDEX idx_conversations_user_one ON conversations(user_one_id);
CREATE INDEX idx_conversations_user_two ON conversations(user_two_id);
