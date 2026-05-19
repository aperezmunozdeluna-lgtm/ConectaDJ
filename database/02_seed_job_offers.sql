USE djmatch_db;

INSERT INTO users (email, password_hash, role)
VALUES ('organizador@example.com', 'demo123', 'organizer');

INSERT INTO organizer_profiles (
    user_id, venue_name, description, city, province, venue_type, website_url
)
VALUES (
    LAST_INSERT_ID(),
    'Sala Central',
    'Local de ocio nocturno con eventos de fin de semana.',
    'Madrid',
    'Madrid',
    'club',
    'https://salacentral.example.com'
);

SET @organizer_id = LAST_INSERT_ID();

INSERT INTO job_offers (
    organizer_id, title, description, event_date, city, music_style_id,
    min_experience_years, budget, duration_hours, status
)
VALUES
(
    @organizer_id,
    'DJ para evento privado',
    'Buscamos DJ para evento privado con musica house y ambiente comercial.',
    '2026-06-15',
    'Madrid',
    1,
    2,
    350.00,
    4.0,
    'open'
),
(
    @organizer_id,
    'Sesion en local de ocio',
    'Sesion de viernes noche en local con publico joven. Estilo reggaeton y pop.',
    '2026-06-22',
    'Valencia',
    3,
    1,
    250.00,
    3.5,
    'open'
);
