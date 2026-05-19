USE djmatch_db;

INSERT INTO users (email, password_hash, role, is_active)
SELECT 'fiestaprivada@example.com', 'demo123', 'private_party', TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'fiestaprivada@example.com'
);

SET @private_party_user_id = (
    SELECT id FROM users WHERE email = 'fiestaprivada@example.com' LIMIT 1
);

INSERT INTO organizer_profiles (
    user_id,
    venue_name,
    description,
    city,
    province,
    venue_type,
    website_url,
    logo_photo
)
SELECT
    @private_party_user_id,
    'Eventos BlackRoom',
    'Empresa de fiestas privadas que busca DJs para eventos, salas y celebraciones.',
    'Madrid',
    'Madrid',
    'private_party',
    'https://blackroom.example.com',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'
WHERE NOT EXISTS (
    SELECT 1 FROM organizer_profiles WHERE user_id = @private_party_user_id
);

SET @private_party_profile_id = (
    SELECT id FROM organizer_profiles WHERE user_id = @private_party_user_id LIMIT 1
);

INSERT INTO job_offers (
    organizer_id,
    title,
    description,
    event_date,
    city,
    min_experience_years,
    budget,
    duration_hours,
    image_url,
    status
)
SELECT
    @private_party_profile_id,
    'DJ para fiesta privada en sala',
    'Buscamos DJ para una fiesta privada con musica house, reggaeton comercial y hits actuales.',
    '2026-07-18',
    'Madrid',
    2,
    500.00,
    5.0,
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
    'open'
WHERE NOT EXISTS (
    SELECT 1 FROM job_offers
    WHERE organizer_id = @private_party_profile_id
    AND title = 'DJ para fiesta privada en sala'
);
