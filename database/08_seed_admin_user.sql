USE djmatch_db;

INSERT INTO users (email, password_hash, role, is_active)
SELECT 'admin@example.com', 'demo123', 'admin', TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'admin@example.com'
);
