USE djmatch_db;

INSERT INTO users (email, password_hash, role, is_active)
SELECT 'carla.dj@example.com', 'demo123', 'dj', TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'carla.dj@example.com');

SET @carla_user_id = (SELECT id FROM users WHERE email = 'carla.dj@example.com' LIMIT 1);

INSERT INTO dj_profiles (
    user_id,
    artist_name,
    bio,
    city,
    province,
    experience_years,
    fee_per_session,
    instagram_url,
    profile_photo,
    avg_rating,
    is_available
)
SELECT
    @carla_user_id,
    'Carla Groove',
    'DJ orientada a eventos privados, pop actual y musica comercial.',
    'Madrid',
    'Madrid',
    3,
    300.00,
    'https://instagram.com/carlagroove',
    'https://images.unsplash.com/photo-1516280440614-37939bbacd81',
    4.60,
    TRUE
WHERE NOT EXISTS (SELECT 1 FROM dj_profiles WHERE user_id = @carla_user_id);

SET @carla_profile_id = (SELECT id FROM dj_profiles WHERE user_id = @carla_user_id LIMIT 1);
SET @pop_style_id = (SELECT id FROM music_styles WHERE slug = 'pop' LIMIT 1);
SET @reggaeton_style_id = (SELECT id FROM music_styles WHERE slug = 'reggaeton' LIMIT 1);

INSERT INTO dj_styles (dj_profile_id, music_style_id)
SELECT @carla_profile_id, @pop_style_id
WHERE @pop_style_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM dj_styles
    WHERE dj_profile_id = @carla_profile_id AND music_style_id = @pop_style_id
);

INSERT INTO dj_styles (dj_profile_id, music_style_id)
SELECT @carla_profile_id, @reggaeton_style_id
WHERE @reggaeton_style_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM dj_styles
    WHERE dj_profile_id = @carla_profile_id AND music_style_id = @reggaeton_style_id
);

INSERT INTO users (email, password_hash, role, is_active)
SELECT 'neo.techno@example.com', 'demo123', 'dj', TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'neo.techno@example.com');

SET @neo_user_id = (SELECT id FROM users WHERE email = 'neo.techno@example.com' LIMIT 1);

INSERT INTO dj_profiles (
    user_id,
    artist_name,
    bio,
    city,
    province,
    experience_years,
    fee_per_session,
    soundcloud_url,
    profile_photo,
    avg_rating,
    is_available
)
SELECT
    @neo_user_id,
    'Neo Pulse',
    'DJ de techno y tech house para salas, festivales pequenos y sesiones nocturnas.',
    'Valencia',
    'Valencia',
    5,
    420.00,
    'https://soundcloud.com/neopulse',
    'https://images.unsplash.com/photo-1501386761578-eac5c94b800a',
    4.80,
    TRUE
WHERE NOT EXISTS (SELECT 1 FROM dj_profiles WHERE user_id = @neo_user_id);

SET @neo_profile_id = (SELECT id FROM dj_profiles WHERE user_id = @neo_user_id LIMIT 1);
SET @techno_style_id = (SELECT id FROM music_styles WHERE slug = 'techno' LIMIT 1);
SET @tech_house_style_id = (SELECT id FROM music_styles WHERE slug = 'tech-house' LIMIT 1);

INSERT INTO dj_styles (dj_profile_id, music_style_id)
SELECT @neo_profile_id, @techno_style_id
WHERE @techno_style_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM dj_styles
    WHERE dj_profile_id = @neo_profile_id AND music_style_id = @techno_style_id
);

INSERT INTO dj_styles (dj_profile_id, music_style_id)
SELECT @neo_profile_id, @tech_house_style_id
WHERE @tech_house_style_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM dj_styles
    WHERE dj_profile_id = @neo_profile_id AND music_style_id = @tech_house_style_id
);

SET @organizer_id = (
    SELECT id FROM organizer_profiles
    WHERE venue_name = 'Sala Central'
    LIMIT 1
);

SET @private_party_id = (
    SELECT id FROM organizer_profiles
    WHERE venue_name = 'Eventos BlackRoom'
    LIMIT 1
);

SET @house_style_id = (SELECT id FROM music_styles WHERE slug = 'house' LIMIT 1);

INSERT INTO job_offers (
    organizer_id,
    title,
    description,
    event_date,
    city,
    music_style_id,
    min_experience_years,
    budget,
    duration_hours,
    image_url,
    status
)
SELECT
    @organizer_id,
    'DJ house para terraza de verano',
    'Sesion de tarde-noche con musica house y ambiente elegante.',
    '2026-07-05',
    'Madrid',
    @house_style_id,
    2,
    380.00,
    4.0,
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3',
    'open'
WHERE @organizer_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM job_offers
    WHERE organizer_id = @organizer_id AND title = 'DJ house para terraza de verano'
);

INSERT INTO job_offers (
    organizer_id,
    title,
    description,
    event_date,
    city,
    music_style_id,
    min_experience_years,
    budget,
    duration_hours,
    image_url,
    status
)
SELECT
    @private_party_id,
    'DJ comercial para fiesta de empresa',
    'Fiesta privada de empresa con pop, reggaeton comercial y hits actuales.',
    '2026-07-26',
    'Madrid',
    @pop_style_id,
    1,
    450.00,
    5.0,
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
    'open'
WHERE @private_party_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM job_offers
    WHERE organizer_id = @private_party_id AND title = 'DJ comercial para fiesta de empresa'
);
