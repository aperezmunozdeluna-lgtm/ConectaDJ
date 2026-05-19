USE djmatch_db;

INSERT INTO reviews (dj_profile_id, organizer_id, rating, comment, job_offer_id)
SELECT 1, 1, 5, 'Muy profesional, puntual y con buena seleccion musical.', 1
WHERE NOT EXISTS (
    SELECT 1 FROM reviews WHERE dj_profile_id = 1 AND organizer_id = 1
);

INSERT INTO reviews (dj_profile_id, organizer_id, rating, comment, job_offer_id)
SELECT 2, 3, 4, 'La sesion encajo muy bien con la fiesta privada.', 2
WHERE NOT EXISTS (
    SELECT 1 FROM reviews WHERE dj_profile_id = 2 AND organizer_id = 3
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
