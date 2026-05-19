USE djmatch_db;

INSERT INTO music_styles (name, slug)
SELECT 'House', 'house'
WHERE NOT EXISTS (SELECT 1 FROM music_styles WHERE slug = 'house');

INSERT INTO music_styles (name, slug)
SELECT 'Techno', 'techno'
WHERE NOT EXISTS (SELECT 1 FROM music_styles WHERE slug = 'techno');

INSERT INTO music_styles (name, slug)
SELECT 'Reggaeton', 'reggaeton'
WHERE NOT EXISTS (SELECT 1 FROM music_styles WHERE slug = 'reggaeton');

INSERT INTO music_styles (name, slug)
SELECT 'Pop', 'pop'
WHERE NOT EXISTS (SELECT 1 FROM music_styles WHERE slug = 'pop');

INSERT INTO music_styles (name, slug)
SELECT 'Tech House', 'tech-house'
WHERE NOT EXISTS (SELECT 1 FROM music_styles WHERE slug = 'tech-house');

INSERT INTO users (email, password_hash, role, is_active)
SELECT 'alex@example.com', 'demo123', 'dj', TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'alex@example.com');

SET @alex_user_id = (SELECT id FROM users WHERE email = 'alex@example.com' LIMIT 1);

INSERT INTO dj_profiles (
    user_id, artist_name, bio, city, province, experience_years,
    fee_per_session, instagram_url, profile_photo, avg_rating, is_available
)
SELECT
    @alex_user_id,
    'Alex Beat',
    'DJ especializado en house y techno para eventos privados.',
    'Madrid',
    'Madrid',
    4,
    350.00,
    'https://instagram.com/alexbeat',
    'https://images.unsplash.com/photo-1516280440614-37939bbacd81',
    4.80,
    TRUE
WHERE NOT EXISTS (SELECT 1 FROM dj_profiles WHERE user_id = @alex_user_id);

INSERT INTO users (email, password_hash, role, is_active)
SELECT 'luna@example.com', 'demo123', 'dj', TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'luna@example.com');

SET @luna_user_id = (SELECT id FROM users WHERE email = 'luna@example.com' LIMIT 1);

INSERT INTO dj_profiles (
    user_id, artist_name, bio, city, province, experience_years,
    fee_per_session, instagram_url, profile_photo, avg_rating, is_available
)
SELECT
    @luna_user_id,
    'Luna Mix',
    'Sesiones de reggaeton, pop y musica comercial.',
    'Valencia',
    'Valencia',
    2,
    250.00,
    'https://instagram.com/lunamix',
    'https://images.unsplash.com/photo-1501386761578-eac5c94b800a',
    4.20,
    TRUE
WHERE NOT EXISTS (SELECT 1 FROM dj_profiles WHERE user_id = @luna_user_id);

INSERT INTO users (email, password_hash, role, is_active)
SELECT 'neo.techno@example.com', 'demo123', 'dj', TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'neo.techno@example.com');

SET @neo_user_id = (SELECT id FROM users WHERE email = 'neo.techno@example.com' LIMIT 1);

INSERT INTO dj_profiles (
    user_id, artist_name, bio, city, province, experience_years,
    fee_per_session, soundcloud_url, profile_photo, avg_rating, is_available
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
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3',
    4.70,
    TRUE
WHERE NOT EXISTS (SELECT 1 FROM dj_profiles WHERE user_id = @neo_user_id);

INSERT INTO users (email, password_hash, role, is_active)
SELECT 'organizador@example.com', 'demo123', 'organizer', TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'organizador@example.com');

SET @organizer_user_id = (SELECT id FROM users WHERE email = 'organizador@example.com' LIMIT 1);

INSERT INTO organizer_profiles (
    user_id, venue_name, description, city, province, venue_type, website_url, logo_photo
)
SELECT
    @organizer_user_id,
    'Sala Central',
    'Local de ocio nocturno con eventos de fin de semana.',
    'Madrid',
    'Madrid',
    'club',
    'https://salacentral.example.com',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819'
WHERE NOT EXISTS (SELECT 1 FROM organizer_profiles WHERE user_id = @organizer_user_id);

INSERT INTO users (email, password_hash, role, is_active)
SELECT 'fiestaprivada@example.com', 'demo123', 'private_party', TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'fiestaprivada@example.com');

SET @private_user_id = (SELECT id FROM users WHERE email = 'fiestaprivada@example.com' LIMIT 1);

INSERT INTO organizer_profiles (
    user_id, venue_name, description, city, province, venue_type, website_url, logo_photo
)
SELECT
    @private_user_id,
    'Eventos BlackRoom',
    'Empresa de fiestas privadas que busca DJs para eventos, salas y celebraciones.',
    'Madrid',
    'Madrid',
    'private_party',
    'https://blackroom.example.com',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'
WHERE NOT EXISTS (SELECT 1 FROM organizer_profiles WHERE user_id = @private_user_id);

INSERT INTO users (email, password_hash, role, is_active)
SELECT 'admin@example.com', 'demo123', 'admin', TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@example.com');

SET @alex_profile_id = (SELECT id FROM dj_profiles WHERE user_id = @alex_user_id LIMIT 1);
SET @luna_profile_id = (SELECT id FROM dj_profiles WHERE user_id = @luna_user_id LIMIT 1);
SET @neo_profile_id = (SELECT id FROM dj_profiles WHERE user_id = @neo_user_id LIMIT 1);
SET @organizer_id = (SELECT id FROM organizer_profiles WHERE user_id = @organizer_user_id LIMIT 1);
SET @private_id = (SELECT id FROM organizer_profiles WHERE user_id = @private_user_id LIMIT 1);
SET @house_style_id = (SELECT id FROM music_styles WHERE slug = 'house' LIMIT 1);
SET @techno_style_id = (SELECT id FROM music_styles WHERE slug = 'techno' LIMIT 1);
SET @reggaeton_style_id = (SELECT id FROM music_styles WHERE slug = 'reggaeton' LIMIT 1);
SET @pop_style_id = (SELECT id FROM music_styles WHERE slug = 'pop' LIMIT 1);
SET @tech_house_style_id = (SELECT id FROM music_styles WHERE slug = 'tech-house' LIMIT 1);

INSERT INTO dj_styles (dj_profile_id, music_style_id)
SELECT @alex_profile_id, @house_style_id
WHERE NOT EXISTS (
    SELECT 1 FROM dj_styles WHERE dj_profile_id = @alex_profile_id AND music_style_id = @house_style_id
);

INSERT INTO dj_styles (dj_profile_id, music_style_id)
SELECT @alex_profile_id, @techno_style_id
WHERE NOT EXISTS (
    SELECT 1 FROM dj_styles WHERE dj_profile_id = @alex_profile_id AND music_style_id = @techno_style_id
);

INSERT INTO dj_styles (dj_profile_id, music_style_id)
SELECT @luna_profile_id, @reggaeton_style_id
WHERE NOT EXISTS (
    SELECT 1 FROM dj_styles WHERE dj_profile_id = @luna_profile_id AND music_style_id = @reggaeton_style_id
);

INSERT INTO dj_styles (dj_profile_id, music_style_id)
SELECT @luna_profile_id, @pop_style_id
WHERE NOT EXISTS (
    SELECT 1 FROM dj_styles WHERE dj_profile_id = @luna_profile_id AND music_style_id = @pop_style_id
);

INSERT INTO dj_styles (dj_profile_id, music_style_id)
SELECT @neo_profile_id, @techno_style_id
WHERE NOT EXISTS (
    SELECT 1 FROM dj_styles WHERE dj_profile_id = @neo_profile_id AND music_style_id = @techno_style_id
);

INSERT INTO dj_styles (dj_profile_id, music_style_id)
SELECT @neo_profile_id, @tech_house_style_id
WHERE NOT EXISTS (
    SELECT 1 FROM dj_styles WHERE dj_profile_id = @neo_profile_id AND music_style_id = @tech_house_style_id
);

INSERT INTO job_offers (
    organizer_id, title, description, event_date, city, music_style_id,
    min_experience_years, budget, duration_hours, image_url, status
)
SELECT
    @organizer_id,
    'DJ para evento privado',
    'Buscamos DJ para evento privado con musica house y ambiente comercial.',
    '2026-06-15',
    'Madrid',
    @house_style_id,
    2,
    350.00,
    4.0,
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
    'open'
WHERE NOT EXISTS (
    SELECT 1 FROM job_offers WHERE organizer_id = @organizer_id AND title = 'DJ para evento privado'
);

INSERT INTO job_offers (
    organizer_id, title, description, event_date, city, music_style_id,
    min_experience_years, budget, duration_hours, image_url, status
)
SELECT
    @private_id,
    'DJ para fiesta privada en sala',
    'Buscamos DJ para fiesta privada con house, reggaeton comercial y hits actuales.',
    '2026-07-18',
    'Madrid',
    @pop_style_id,
    2,
    500.00,
    5.0,
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
    'open'
WHERE NOT EXISTS (
    SELECT 1 FROM job_offers WHERE organizer_id = @private_id AND title = 'DJ para fiesta privada en sala'
);

INSERT INTO job_offers (
    organizer_id, title, description, event_date, city, music_style_id,
    min_experience_years, budget, duration_hours, image_url, status
)
SELECT
    @organizer_id,
    'Sesion en local de ocio',
    'Sesion de viernes noche en local con publico joven, reggaeton y pop.',
    '2026-06-22',
    'Valencia',
    @reggaeton_style_id,
    1,
    250.00,
    3.5,
    'https://images.unsplash.com/photo-1501386761578-eac5c94b800a',
    'open'
WHERE NOT EXISTS (
    SELECT 1 FROM job_offers WHERE organizer_id = @organizer_id AND title = 'Sesion en local de ocio'
);

INSERT INTO reviews (dj_profile_id, organizer_id, rating, comment, job_offer_id)
SELECT @alex_profile_id, @organizer_id, 5, 'Muy profesional, puntual y con buena seleccion musical.',
       (SELECT id FROM job_offers WHERE title = 'DJ para evento privado' LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM reviews WHERE dj_profile_id = @alex_profile_id AND organizer_id = @organizer_id
);

INSERT INTO favorite_djs (organizer_id, dj_profile_id)
SELECT @organizer_id, @alex_profile_id
WHERE NOT EXISTS (
    SELECT 1 FROM favorite_djs WHERE organizer_id = @organizer_id AND dj_profile_id = @alex_profile_id
);

UPDATE dj_profiles d
SET d.avg_rating = (
    SELECT ROUND(AVG(r.rating), 1)
    FROM reviews r
    WHERE r.dj_profile_id = d.id
)
WHERE EXISTS (
    SELECT 1 FROM reviews r WHERE r.dj_profile_id = d.id
);
