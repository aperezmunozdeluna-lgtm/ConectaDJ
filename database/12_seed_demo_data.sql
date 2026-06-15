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

UPDATE dj_profiles
SET
    artist_name = 'Alex Beat',
    bio = 'DJ especializado en house y techno para eventos privados.',
    city = 'Madrid',
    province = 'Madrid',
    experience_years = 4,
    fee_per_session = 350.00,
    instagram_url = 'https://instagram.com/alexbeat',
    profile_photo = 'https://images.unsplash.com/photo-1516280440614-37939bbacd81',
    is_available = TRUE
WHERE user_id = @alex_user_id;

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
    'Sesiones de reggaeton, pop y música comercial.',
    'Valencia',
    'Valencia',
    2,
    250.00,
    'https://instagram.com/lunamix',
    'https://images.unsplash.com/photo-1501386761578-eac5c94b800a',
    4.20,
    TRUE
WHERE NOT EXISTS (SELECT 1 FROM dj_profiles WHERE user_id = @luna_user_id);

UPDATE dj_profiles
SET
    artist_name = 'Luna Mix',
    bio = 'Sesiones de reggaeton, pop y música comercial.',
    city = 'Valencia',
    province = 'Valencia',
    experience_years = 2,
    fee_per_session = 250.00,
    instagram_url = 'https://instagram.com/lunamix',
    profile_photo = 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a',
    is_available = TRUE
WHERE user_id = @luna_user_id;

INSERT INTO users (email, password_hash, role, is_active)
SELECT 'marco@example.com', 'demo123', 'dj', TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'marco@example.com');

SET @marco_user_id = (SELECT id FROM users WHERE email = 'marco@example.com' LIMIT 1);

INSERT INTO dj_profiles (
    user_id, artist_name, bio, city, province, experience_years,
    fee_per_session, soundcloud_url, profile_photo, avg_rating, is_available
)
SELECT
    @marco_user_id,
    'Marco Sound',
    'DJ especializado en techno y tech house para salas y eventos nocturnos.',
    'Barcelona',
    'Barcelona',
    5,
    400.00,
    'https://soundcloud.com/marcosound',
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3',
    4.50,
    TRUE
WHERE NOT EXISTS (SELECT 1 FROM dj_profiles WHERE user_id = @marco_user_id);

UPDATE dj_profiles
SET
    bio = 'DJ especializado en techno y tech house para salas y eventos nocturnos.',
    city = 'Barcelona',
    province = 'Barcelona',
    experience_years = 5,
    fee_per_session = 400.00,
    soundcloud_url = 'https://soundcloud.com/marcosound',
    profile_photo = 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3',
    avg_rating = 4.50,
    is_available = TRUE
WHERE user_id = @marco_user_id;

INSERT INTO users (email, password_hash, role, is_active)
SELECT 'carla.dj@example.com', 'demo123', 'dj', TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'carla.dj@example.com');

SET @carla_user_id = (SELECT id FROM users WHERE email = 'carla.dj@example.com' LIMIT 1);

INSERT INTO dj_profiles (
    user_id, artist_name, bio, city, province, experience_years,
    fee_per_session, instagram_url, profile_photo, avg_rating, is_available
)
SELECT
    @carla_user_id,
    'Carla Groove',
    'DJ orientada a eventos privados, pop actual y música comercial.',
    'Madrid',
    'Madrid',
    3,
    300.00,
    'https://instagram.com/carlagroove',
    'https://images.unsplash.com/photo-1516280440614-37939bbacd81',
    4.60,
    TRUE
WHERE NOT EXISTS (SELECT 1 FROM dj_profiles WHERE user_id = @carla_user_id);

UPDATE dj_profiles
SET
    artist_name = 'Carla Groove',
    bio = 'DJ orientada a eventos privados, pop actual y música comercial.',
    city = 'Madrid',
    province = 'Madrid',
    experience_years = 3,
    fee_per_session = 300.00,
    instagram_url = 'https://instagram.com/carlagroove',
    profile_photo = 'https://images.unsplash.com/photo-1516280440614-37939bbacd81',
    avg_rating = 4.60,
    is_available = TRUE
WHERE user_id = @carla_user_id;

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
    'DJ de techno y tech house para salas, festivales pequeños y sesiones nocturnas.',
    'Valencia',
    'Valencia',
    5,
    420.00,
    'https://soundcloud.com/neopulse',
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3',
    4.70,
    TRUE
WHERE NOT EXISTS (SELECT 1 FROM dj_profiles WHERE user_id = @neo_user_id);

UPDATE dj_profiles
SET
    artist_name = 'Neo Pulse',
    bio = 'DJ de techno y tech house para salas, festivales pequeños y sesiones nocturnas.',
    city = 'Valencia',
    province = 'Valencia',
    experience_years = 5,
    fee_per_session = 420.00,
    soundcloud_url = 'https://soundcloud.com/neopulse',
    profile_photo = 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3',
    avg_rating = 4.70,
    is_available = TRUE
WHERE user_id = @neo_user_id;

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

UPDATE organizer_profiles
SET
    venue_name = 'Sala Central',
    description = 'Local de ocio nocturno con eventos de fin de semana.',
    city = 'Madrid',
    province = 'Madrid',
    venue_type = 'club',
    website_url = 'https://salacentral.example.com',
    logo_photo = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819'
WHERE user_id = @organizer_user_id;

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

UPDATE organizer_profiles
SET
    venue_name = 'Eventos BlackRoom',
    description = 'Empresa de fiestas privadas que busca DJs para eventos, salas y celebraciones.',
    city = 'Madrid',
    province = 'Madrid',
    venue_type = 'private_party',
    website_url = 'https://blackroom.example.com',
    logo_photo = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'
WHERE user_id = @private_user_id;

INSERT INTO users (email, password_hash, role, is_active)
SELECT 'admin@example.com', 'demo123', 'admin', TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@example.com');

SET @alex_profile_id = (SELECT id FROM dj_profiles WHERE user_id = @alex_user_id LIMIT 1);
SET @luna_profile_id = (SELECT id FROM dj_profiles WHERE user_id = @luna_user_id LIMIT 1);
SET @marco_profile_id = (SELECT id FROM dj_profiles WHERE user_id = @marco_user_id LIMIT 1);
SET @carla_profile_id = (SELECT id FROM dj_profiles WHERE user_id = @carla_user_id LIMIT 1);
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
SELECT @marco_profile_id, @techno_style_id
WHERE NOT EXISTS (
    SELECT 1 FROM dj_styles WHERE dj_profile_id = @marco_profile_id AND music_style_id = @techno_style_id
);

INSERT INTO dj_styles (dj_profile_id, music_style_id)
SELECT @marco_profile_id, @tech_house_style_id
WHERE NOT EXISTS (
    SELECT 1 FROM dj_styles WHERE dj_profile_id = @marco_profile_id AND music_style_id = @tech_house_style_id
);

INSERT INTO dj_styles (dj_profile_id, music_style_id)
SELECT @carla_profile_id, @pop_style_id
WHERE NOT EXISTS (
    SELECT 1 FROM dj_styles WHERE dj_profile_id = @carla_profile_id AND music_style_id = @pop_style_id
);

INSERT INTO dj_styles (dj_profile_id, music_style_id)
SELECT @carla_profile_id, @reggaeton_style_id
WHERE NOT EXISTS (
    SELECT 1 FROM dj_styles WHERE dj_profile_id = @carla_profile_id AND music_style_id = @reggaeton_style_id
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
    'Buscamos DJ para evento privado con música house y ambiente comercial.',
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

UPDATE job_offers
SET
    description = 'Buscamos DJ para evento privado con música house y ambiente comercial.',
    music_style_id = @house_style_id,
    image_url = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
    status = 'open'
WHERE organizer_id = @organizer_id
AND title = 'DJ para evento privado';

INSERT INTO job_offers (
    organizer_id, title, description, event_date, city, music_style_id,
    min_experience_years, budget, duration_hours, image_url, status
)
SELECT
    @private_id,
    'DJ para fiesta privada en sala',
    'Buscamos DJ para fiesta privada con house, reggaeton comercial y éxitos actuales.',
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

UPDATE job_offers
SET
    description = 'Buscamos DJ para fiesta privada con house, reggaeton comercial y éxitos actuales.',
    music_style_id = @pop_style_id,
    image_url = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
    status = 'open'
WHERE organizer_id = @private_id
AND title = 'DJ para fiesta privada en sala';

INSERT INTO job_offers (
    organizer_id, title, description, event_date, city, music_style_id,
    min_experience_years, budget, duration_hours, image_url, status
)
SELECT
    @organizer_id,
    'Sesión en local de ocio',
    'Sesión de viernes noche en local con público joven, reggaeton y pop.',
    '2026-06-22',
    'Valencia',
    @reggaeton_style_id,
    1,
    250.00,
    3.5,
    'https://images.unsplash.com/photo-1501386761578-eac5c94b800a',
    'open'
WHERE NOT EXISTS (
    SELECT 1 FROM job_offers
    WHERE organizer_id = @organizer_id
    AND title IN ('Sesion en local de ocio', 'Sesión en local de ocio')
);

UPDATE job_offers
SET
    title = 'Sesión en local de ocio',
    description = 'Sesión de viernes noche en local con público joven, reggaeton y pop.',
    music_style_id = @reggaeton_style_id,
    image_url = 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a',
    status = 'open'
WHERE organizer_id = @organizer_id
AND title IN ('Sesion en local de ocio', 'Sesión en local de ocio');

INSERT INTO job_offers (
    organizer_id, title, description, event_date, city, music_style_id,
    min_experience_years, budget, duration_hours, image_url, status
)
SELECT
    @private_id,
    'DJ para fiesta privada',
    'Evento privado con música comercial, house y reggaeton para público adulto.',
    '2026-07-18',
    'Madrid',
    @pop_style_id,
    2,
    500.00,
    5.0,
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
    'open'
WHERE NOT EXISTS (
    SELECT 1 FROM job_offers WHERE organizer_id = @private_id AND title = 'DJ para fiesta privada'
);

UPDATE job_offers
SET
    description = 'Evento privado con música comercial, house y reggaeton para público adulto.',
    music_style_id = @pop_style_id,
    image_url = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
    status = 'open'
WHERE organizer_id = @private_id
AND title = 'DJ para fiesta privada';

INSERT INTO job_offers (
    organizer_id, title, description, event_date, city, music_style_id,
    min_experience_years, budget, duration_hours, image_url, status
)
SELECT
    @organizer_id,
    'DJ house para terraza de verano',
    'Sesión de tarde-noche con música house y ambiente elegante.',
    '2026-07-05',
    'Madrid',
    @house_style_id,
    2,
    380.00,
    4.0,
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3',
    'open'
WHERE NOT EXISTS (
    SELECT 1 FROM job_offers WHERE organizer_id = @organizer_id AND title = 'DJ house para terraza de verano'
);

UPDATE job_offers
SET
    description = 'Sesión de tarde-noche con música house y ambiente elegante.',
    music_style_id = @house_style_id,
    image_url = 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3',
    status = 'open'
WHERE organizer_id = @organizer_id
AND title = 'DJ house para terraza de verano';

INSERT INTO job_offers (
    organizer_id, title, description, event_date, city, music_style_id,
    min_experience_years, budget, duration_hours, image_url, status
)
SELECT
    @private_id,
    'DJ comercial para fiesta de empresa',
    'Fiesta privada de empresa con pop, reggaeton comercial y éxitos actuales.',
    '2026-07-26',
    'Madrid',
    @pop_style_id,
    1,
    450.00,
    5.0,
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
    'open'
WHERE NOT EXISTS (
    SELECT 1 FROM job_offers WHERE organizer_id = @private_id AND title = 'DJ comercial para fiesta de empresa'
);

UPDATE job_offers
SET
    description = 'Fiesta privada de empresa con pop, reggaeton comercial y éxitos actuales.',
    music_style_id = @pop_style_id,
    image_url = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
    status = 'open'
WHERE organizer_id = @private_id
AND title = 'DJ comercial para fiesta de empresa';

SET @offer_evento_id = (
    SELECT id FROM job_offers
    WHERE organizer_id = @organizer_id AND title = 'DJ para evento privado'
    LIMIT 1
);

SET @offer_local_id = (
    SELECT id FROM job_offers
    WHERE organizer_id = @organizer_id
    AND title IN ('Sesion en local de ocio', 'Sesión en local de ocio')
    LIMIT 1
);

SET @offer_fiesta_id = (
    SELECT id FROM job_offers
    WHERE organizer_id = @private_id AND title = 'DJ para fiesta privada'
    LIMIT 1
);

SET @offer_house_id = (
    SELECT id FROM job_offers
    WHERE organizer_id = @organizer_id AND title = 'DJ house para terraza de verano'
    LIMIT 1
);

SET @offer_empresa_id = (
    SELECT id FROM job_offers
    WHERE organizer_id = @private_id AND title = 'DJ comercial para fiesta de empresa'
    LIMIT 1
);

SET @offer_fiesta_sala_id = (
    SELECT id FROM job_offers
    WHERE organizer_id = @private_id AND title = 'DJ para fiesta privada en sala'
    LIMIT 1
);

INSERT INTO applications (job_offer_id, dj_profile_id, status, message)
SELECT
    @offer_evento_id,
    @alex_profile_id,
    'pending',
    'Hola, me interesa esta oferta. Tengo experiencia en eventos parecidos y puedo adaptarme al estilo musical del evento.'
WHERE @offer_evento_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM applications
    WHERE job_offer_id = @offer_evento_id AND dj_profile_id = @alex_profile_id
);

INSERT INTO applications (job_offer_id, dj_profile_id, status, message)
SELECT
    @offer_local_id,
    @alex_profile_id,
    'accepted',
    'Hola, me interesa esta oferta. Tengo experiencia en eventos parecidos y puedo adaptarme al estilo musical del evento.'
WHERE @offer_local_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM applications
    WHERE job_offer_id = @offer_local_id AND dj_profile_id = @alex_profile_id
);

INSERT INTO applications (job_offer_id, dj_profile_id, status, message)
SELECT
    @offer_fiesta_id,
    @alex_profile_id,
    'pending',
    'Hola, me interesa esta oferta. Tengo experiencia en eventos parecidos y puedo adaptarme al estilo musical del evento.'
WHERE @offer_fiesta_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM applications
    WHERE job_offer_id = @offer_fiesta_id AND dj_profile_id = @alex_profile_id
);

INSERT INTO applications (job_offer_id, dj_profile_id, status, message)
SELECT
    @offer_empresa_id,
    @alex_profile_id,
    'pending',
    'Hola, me interesa esta oferta. Tengo experiencia en eventos parecidos y puedo adaptarme al estilo musical del evento.'
WHERE @offer_empresa_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM applications
    WHERE job_offer_id = @offer_empresa_id AND dj_profile_id = @alex_profile_id
);

INSERT INTO applications (job_offer_id, dj_profile_id, status, message)
SELECT
    @offer_house_id,
    @alex_profile_id,
    'accepted',
    'Hola, me interesa esta oferta. Tengo experiencia en eventos parecidos y puedo adaptarme al estilo musical del evento.'
WHERE @offer_house_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM applications
    WHERE job_offer_id = @offer_house_id AND dj_profile_id = @alex_profile_id
);

INSERT INTO applications (job_offer_id, dj_profile_id, status, message)
SELECT
    @offer_fiesta_sala_id,
    @alex_profile_id,
    'pending',
    'Hola, me interesa esta oferta. Tengo experiencia en eventos parecidos y puedo adaptarme al estilo musical del evento.'
WHERE @offer_fiesta_sala_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM applications
    WHERE job_offer_id = @offer_fiesta_sala_id AND dj_profile_id = @alex_profile_id
);

UPDATE conversations
SET
    dj_profile_id = @alex_profile_id,
    organizer_id = @organizer_id,
    job_offer_id = COALESCE(job_offer_id, @offer_evento_id),
    status = 'active',
    last_message_at = CURRENT_TIMESTAMP
WHERE (
    (user_one_id = @alex_user_id AND user_two_id = @organizer_user_id)
    OR (user_one_id = @organizer_user_id AND user_two_id = @alex_user_id)
);

INSERT INTO conversations (
    user_one_id, user_two_id, dj_profile_id, organizer_id,
    job_offer_id, status, last_message_at
)
SELECT
    @alex_user_id,
    @organizer_user_id,
    @alex_profile_id,
    @organizer_id,
    @offer_evento_id,
    'active',
    CURRENT_TIMESTAMP
WHERE @offer_evento_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM conversations
    WHERE (user_one_id = @alex_user_id AND user_two_id = @organizer_user_id)
    OR (user_one_id = @organizer_user_id AND user_two_id = @alex_user_id)
);

SET @alex_organizer_conversation_id = (
    SELECT id FROM conversations
    WHERE (user_one_id = @alex_user_id AND user_two_id = @organizer_user_id)
    OR (user_one_id = @organizer_user_id AND user_two_id = @alex_user_id)
    ORDER BY id
    LIMIT 1
);

INSERT INTO messages (conversation_id, sender_user_id, body, is_read)
SELECT
    @alex_organizer_conversation_id,
    @alex_user_id,
    'Hola, me interesa la oferta y puedo adaptarme al estilo del evento.',
    TRUE
WHERE @alex_organizer_conversation_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM messages
    WHERE conversation_id = @alex_organizer_conversation_id
    AND sender_user_id = @alex_user_id
    AND body = 'Hola, me interesa la oferta y puedo adaptarme al estilo del evento.'
);

INSERT INTO messages (conversation_id, sender_user_id, body, is_read)
SELECT
    @alex_organizer_conversation_id,
    @alex_user_id,
    'Perfecto, tengo experiencia en eventos privados y puedo enviar una propuesta de repertorio.',
    TRUE
WHERE @alex_organizer_conversation_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM messages
    WHERE conversation_id = @alex_organizer_conversation_id
    AND sender_user_id = @alex_user_id
    AND body = 'Perfecto, tengo experiencia en eventos privados y puedo enviar una propuesta de repertorio.'
);

INSERT INTO messages (conversation_id, sender_user_id, body, is_read)
SELECT
    @alex_organizer_conversation_id,
    @organizer_user_id,
    'Gracias, revisamos tu candidatura y te confirmamos detalles por aquí.',
    TRUE
WHERE @alex_organizer_conversation_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM messages
    WHERE conversation_id = @alex_organizer_conversation_id
    AND sender_user_id = @organizer_user_id
    AND body = 'Gracias, revisamos tu candidatura y te confirmamos detalles por aquí.'
);

INSERT INTO messages (conversation_id, sender_user_id, body, is_read)
SELECT
    @alex_organizer_conversation_id,
    @alex_user_id,
    'Genial, quedo pendiente de la confirmación.',
    TRUE
WHERE @alex_organizer_conversation_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM messages
    WHERE conversation_id = @alex_organizer_conversation_id
    AND sender_user_id = @alex_user_id
    AND body = 'Genial, quedo pendiente de la confirmación.'
);

INSERT INTO messages (conversation_id, sender_user_id, body, is_read)
SELECT
    @alex_organizer_conversation_id,
    @organizer_user_id,
    'Candidatura aceptada. Hablamos por aquí para cerrar horario y necesidades técnicas.',
    TRUE
WHERE @alex_organizer_conversation_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM messages
    WHERE conversation_id = @alex_organizer_conversation_id
    AND sender_user_id = @organizer_user_id
    AND body = 'Candidatura aceptada. Hablamos por aquí para cerrar horario y necesidades técnicas.'
);

UPDATE conversations
SET last_message_at = CURRENT_TIMESTAMP
WHERE id = @alex_organizer_conversation_id;

DELETE c
FROM conversations c
LEFT JOIN messages m ON m.conversation_id = c.id
WHERE m.id IS NULL
AND (
    @alex_organizer_conversation_id IS NULL
    OR c.id <> @alex_organizer_conversation_id
);

INSERT INTO conversations (
    user_one_id, user_two_id, dj_profile_id, organizer_id,
    job_offer_id, status, last_message_at
)
SELECT
    @organizer_user_id,
    @luna_user_id,
    @luna_profile_id,
    @organizer_id,
    @offer_local_id,
    'active',
    CURRENT_TIMESTAMP
WHERE @offer_local_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM conversations
    WHERE (user_one_id = @organizer_user_id AND user_two_id = @luna_user_id)
    OR (user_one_id = @luna_user_id AND user_two_id = @organizer_user_id)
);

SET @luna_organizer_conversation_id = (
    SELECT id FROM conversations
    WHERE (user_one_id = @organizer_user_id AND user_two_id = @luna_user_id)
    OR (user_one_id = @luna_user_id AND user_two_id = @organizer_user_id)
    ORDER BY id
    LIMIT 1
);

UPDATE conversations
SET
    dj_profile_id = @luna_profile_id,
    organizer_id = @organizer_id,
    job_offer_id = COALESCE(job_offer_id, @offer_local_id),
    status = 'active'
WHERE id = @luna_organizer_conversation_id;

INSERT INTO messages (conversation_id, sender_user_id, body, is_read, sent_at)
SELECT
    @luna_organizer_conversation_id,
    @organizer_user_id,
    'Hola Luna, hemos visto tu perfil y encaja bien con la sesion en el local de ocio.',
    TRUE,
    DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 4 DAY)
WHERE @luna_organizer_conversation_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM messages
    WHERE conversation_id = @luna_organizer_conversation_id
    AND sender_user_id = @organizer_user_id
    AND body = 'Hola Luna, hemos visto tu perfil y encaja bien con la sesion en el local de ocio.'
);

INSERT INTO messages (conversation_id, sender_user_id, body, is_read, sent_at)
SELECT
    @luna_organizer_conversation_id,
    @luna_user_id,
    'Gracias. Puedo preparar una sesion de pop y reggaeton comercial para mantener buen ritmo toda la noche.',
    TRUE,
    DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 4 DAY) + INTERVAL 20 MINUTE
WHERE @luna_organizer_conversation_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM messages
    WHERE conversation_id = @luna_organizer_conversation_id
    AND sender_user_id = @luna_user_id
    AND body = 'Gracias. Puedo preparar una sesion de pop y reggaeton comercial para mantener buen ritmo toda la noche.'
);

INSERT INTO messages (conversation_id, sender_user_id, body, is_read, sent_at)
SELECT
    @luna_organizer_conversation_id,
    @organizer_user_id,
    'Perfecto. El evento empieza a las 23:00 y necesitamos una entrada musical suave durante la primera media hora.',
    TRUE,
    DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 DAY)
WHERE @luna_organizer_conversation_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM messages
    WHERE conversation_id = @luna_organizer_conversation_id
    AND sender_user_id = @organizer_user_id
    AND body = 'Perfecto. El evento empieza a las 23:00 y necesitamos una entrada musical suave durante la primera media hora.'
);

INSERT INTO messages (conversation_id, sender_user_id, body, is_read, sent_at)
SELECT
    @luna_organizer_conversation_id,
    @luna_user_id,
    'Sin problema. Llevo preparada una primera parte mas tranquila y despues subo energia segun responda el publico.',
    FALSE,
    DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 DAY)
WHERE @luna_organizer_conversation_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM messages
    WHERE conversation_id = @luna_organizer_conversation_id
    AND sender_user_id = @luna_user_id
    AND body = 'Sin problema. Llevo preparada una primera parte mas tranquila y despues subo energia segun responda el publico.'
);

INSERT INTO conversations (
    user_one_id, user_two_id, dj_profile_id, organizer_id,
    job_offer_id, status, last_message_at
)
SELECT
    @organizer_user_id,
    @marco_user_id,
    @marco_profile_id,
    @organizer_id,
    @offer_house_id,
    'active',
    CURRENT_TIMESTAMP
WHERE @offer_house_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM conversations
    WHERE (user_one_id = @organizer_user_id AND user_two_id = @marco_user_id)
    OR (user_one_id = @marco_user_id AND user_two_id = @organizer_user_id)
);

SET @marco_organizer_conversation_id = (
    SELECT id FROM conversations
    WHERE (user_one_id = @organizer_user_id AND user_two_id = @marco_user_id)
    OR (user_one_id = @marco_user_id AND user_two_id = @organizer_user_id)
    ORDER BY id
    LIMIT 1
);

UPDATE conversations
SET
    dj_profile_id = @marco_profile_id,
    organizer_id = @organizer_id,
    job_offer_id = COALESCE(job_offer_id, @offer_house_id),
    status = 'active'
WHERE id = @marco_organizer_conversation_id;

INSERT INTO messages (conversation_id, sender_user_id, body, is_read, sent_at)
SELECT
    @marco_organizer_conversation_id,
    @marco_user_id,
    'Buenas, me interesa la oferta de la terraza. Trabajo bastante con tech house y sesiones de tarde-noche.',
    TRUE,
    DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY)
WHERE @marco_organizer_conversation_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM messages
    WHERE conversation_id = @marco_organizer_conversation_id
    AND sender_user_id = @marco_user_id
    AND body = 'Buenas, me interesa la oferta de la terraza. Trabajo bastante con tech house y sesiones de tarde-noche.'
);

INSERT INTO messages (conversation_id, sender_user_id, body, is_read, sent_at)
SELECT
    @marco_organizer_conversation_id,
    @organizer_user_id,
    'Hola Marco. Nos interesa un sonido elegante, sin que sea demasiado duro al principio de la sesion.',
    TRUE,
    DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY) + INTERVAL 35 MINUTE
WHERE @marco_organizer_conversation_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM messages
    WHERE conversation_id = @marco_organizer_conversation_id
    AND sender_user_id = @organizer_user_id
    AND body = 'Hola Marco. Nos interesa un sonido elegante, sin que sea demasiado duro al principio de la sesion.'
);

INSERT INTO messages (conversation_id, sender_user_id, body, is_read, sent_at)
SELECT
    @marco_organizer_conversation_id,
    @marco_user_id,
    'Entendido. Puedo empezar con house vocal y pasar a tech house cuando la terraza este llena.',
    TRUE,
    DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 4 DAY)
WHERE @marco_organizer_conversation_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM messages
    WHERE conversation_id = @marco_organizer_conversation_id
    AND sender_user_id = @marco_user_id
    AND body = 'Entendido. Puedo empezar con house vocal y pasar a tech house cuando la terraza este llena.'
);

INSERT INTO messages (conversation_id, sender_user_id, body, is_read, sent_at)
SELECT
    @marco_organizer_conversation_id,
    @organizer_user_id,
    'Perfecto, te dejamos como candidato principal para esa fecha y cerramos detalles esta semana.',
    FALSE,
    DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY)
WHERE @marco_organizer_conversation_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM messages
    WHERE conversation_id = @marco_organizer_conversation_id
    AND sender_user_id = @organizer_user_id
    AND body = 'Perfecto, te dejamos como candidato principal para esa fecha y cerramos detalles esta semana.'
);

INSERT INTO conversations (
    user_one_id, user_two_id, dj_profile_id, organizer_id,
    job_offer_id, status, last_message_at
)
SELECT
    @private_user_id,
    @luna_user_id,
    @luna_profile_id,
    @private_id,
    @offer_empresa_id,
    'active',
    CURRENT_TIMESTAMP
WHERE @offer_empresa_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM conversations
    WHERE (user_one_id = @private_user_id AND user_two_id = @luna_user_id)
    OR (user_one_id = @luna_user_id AND user_two_id = @private_user_id)
);

SET @luna_private_conversation_id = (
    SELECT id FROM conversations
    WHERE (user_one_id = @private_user_id AND user_two_id = @luna_user_id)
    OR (user_one_id = @luna_user_id AND user_two_id = @private_user_id)
    ORDER BY id
    LIMIT 1
);

UPDATE conversations
SET
    dj_profile_id = @luna_profile_id,
    organizer_id = @private_id,
    job_offer_id = COALESCE(job_offer_id, @offer_empresa_id),
    status = 'active'
WHERE id = @luna_private_conversation_id;

INSERT INTO messages (conversation_id, sender_user_id, body, is_read, sent_at)
SELECT
    @luna_private_conversation_id,
    @private_user_id,
    'Hola Luna, buscamos una sesion comercial para una fiesta de empresa con publico variado.',
    TRUE,
    DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 6 DAY)
WHERE @luna_private_conversation_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM messages
    WHERE conversation_id = @luna_private_conversation_id
    AND sender_user_id = @private_user_id
    AND body = 'Hola Luna, buscamos una sesion comercial para una fiesta de empresa con publico variado.'
);

INSERT INTO messages (conversation_id, sender_user_id, body, is_read, sent_at)
SELECT
    @luna_private_conversation_id,
    @luna_user_id,
    'Hola. Para ese tipo de evento puedo combinar pop actual, reggaeton comercial y temas conocidos de varias decadas.',
    TRUE,
    DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 6 DAY) + INTERVAL 25 MINUTE
WHERE @luna_private_conversation_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM messages
    WHERE conversation_id = @luna_private_conversation_id
    AND sender_user_id = @luna_user_id
    AND body = 'Hola. Para ese tipo de evento puedo combinar pop actual, reggaeton comercial y temas conocidos de varias decadas.'
);

INSERT INTO messages (conversation_id, sender_user_id, body, is_read, sent_at)
SELECT
    @luna_private_conversation_id,
    @private_user_id,
    'Perfecto. La idea es empezar despues de la cena y mantener un ambiente animado pero apto para todos.',
    TRUE,
    DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY)
WHERE @luna_private_conversation_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM messages
    WHERE conversation_id = @luna_private_conversation_id
    AND sender_user_id = @private_user_id
    AND body = 'Perfecto. La idea es empezar despues de la cena y mantener un ambiente animado pero apto para todos.'
);

INSERT INTO messages (conversation_id, sender_user_id, body, is_read, sent_at)
SELECT
    @luna_private_conversation_id,
    @luna_user_id,
    'Queda claro. Preparo una lista flexible y dejo margen para peticiones durante la fiesta.',
    FALSE,
    DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 4 DAY)
WHERE @luna_private_conversation_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM messages
    WHERE conversation_id = @luna_private_conversation_id
    AND sender_user_id = @luna_user_id
    AND body = 'Queda claro. Preparo una lista flexible y dejo margen para peticiones durante la fiesta.'
);

INSERT INTO conversations (
    user_one_id, user_two_id, dj_profile_id, organizer_id,
    job_offer_id, status, last_message_at
)
SELECT
    @private_user_id,
    @alex_user_id,
    @alex_profile_id,
    @private_id,
    @offer_fiesta_id,
    'active',
    CURRENT_TIMESTAMP
WHERE @offer_fiesta_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM conversations
    WHERE (user_one_id = @private_user_id AND user_two_id = @alex_user_id)
    OR (user_one_id = @alex_user_id AND user_two_id = @private_user_id)
);

SET @alex_private_conversation_id = (
    SELECT id FROM conversations
    WHERE (user_one_id = @private_user_id AND user_two_id = @alex_user_id)
    OR (user_one_id = @alex_user_id AND user_two_id = @private_user_id)
    ORDER BY id
    LIMIT 1
);

UPDATE conversations
SET
    dj_profile_id = @alex_profile_id,
    organizer_id = @private_id,
    job_offer_id = COALESCE(job_offer_id, @offer_fiesta_id),
    status = 'active'
WHERE id = @alex_private_conversation_id;

INSERT INTO messages (conversation_id, sender_user_id, body, is_read, sent_at)
SELECT
    @alex_private_conversation_id,
    @private_user_id,
    'Hola Alex, queremos valorar tu perfil para una fiesta privada en Madrid.',
    TRUE,
    DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 DAY)
WHERE @alex_private_conversation_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM messages
    WHERE conversation_id = @alex_private_conversation_id
    AND sender_user_id = @private_user_id
    AND body = 'Hola Alex, queremos valorar tu perfil para una fiesta privada en Madrid.'
);

INSERT INTO messages (conversation_id, sender_user_id, body, is_read, sent_at)
SELECT
    @alex_private_conversation_id,
    @alex_user_id,
    'Encantado. Para fiestas privadas suelo preparar una base house y adapto el repertorio segun la edad del publico.',
    TRUE,
    DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 DAY) + INTERVAL 18 MINUTE
WHERE @alex_private_conversation_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM messages
    WHERE conversation_id = @alex_private_conversation_id
    AND sender_user_id = @alex_user_id
    AND body = 'Encantado. Para fiestas privadas suelo preparar una base house y adapto el repertorio segun la edad del publico.'
);

INSERT INTO messages (conversation_id, sender_user_id, body, is_read, sent_at)
SELECT
    @alex_private_conversation_id,
    @private_user_id,
    'Nos encaja. Te confirmamos aforo, horario exacto y si la sala tiene equipo propio.',
    FALSE,
    DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 DAY)
WHERE @alex_private_conversation_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM messages
    WHERE conversation_id = @alex_private_conversation_id
    AND sender_user_id = @private_user_id
    AND body = 'Nos encaja. Te confirmamos aforo, horario exacto y si la sala tiene equipo propio.'
);

UPDATE conversations
SET last_message_at = (
    SELECT MAX(m.sent_at)
    FROM messages m
    WHERE m.conversation_id = conversations.id
)
WHERE id IN (
    @alex_organizer_conversation_id,
    @luna_organizer_conversation_id,
    @marco_organizer_conversation_id,
    @luna_private_conversation_id,
    @alex_private_conversation_id
);

INSERT INTO reviews (dj_profile_id, organizer_id, rating, comment, job_offer_id)
SELECT @alex_profile_id, @organizer_id, 5, 'Muy profesional, puntual y con buena selección musical.',
       @offer_evento_id
WHERE NOT EXISTS (
    SELECT 1 FROM reviews WHERE dj_profile_id = @alex_profile_id AND organizer_id = @organizer_id
);

INSERT INTO reviews (dj_profile_id, organizer_id, rating, comment, job_offer_id)
SELECT @luna_profile_id, @private_id, 4, 'La sesión encajó muy bien con la fiesta privada.',
       @offer_local_id
WHERE NOT EXISTS (
    SELECT 1 FROM reviews WHERE dj_profile_id = @luna_profile_id AND organizer_id = @private_id
);

INSERT INTO favorite_djs (organizer_id, dj_profile_id)
SELECT @organizer_id, @alex_profile_id
WHERE NOT EXISTS (
    SELECT 1 FROM favorite_djs WHERE organizer_id = @organizer_id AND dj_profile_id = @alex_profile_id
);

INSERT INTO favorite_djs (organizer_id, dj_profile_id)
SELECT @private_id, @luna_profile_id
WHERE NOT EXISTS (
    SELECT 1 FROM favorite_djs WHERE organizer_id = @private_id AND dj_profile_id = @luna_profile_id
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
