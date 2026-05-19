CREATE DATABASE IF NOT EXISTS djmatch_db;
USE djmatch_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('dj', 'organizer', 'private_party', 'admin') NOT NULL DEFAULT 'dj',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS music_styles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80) NOT NULL,
    slug VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS dj_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    artist_name VARCHAR(120) NOT NULL,
    bio TEXT,
    city VARCHAR(100),
    province VARCHAR(100),
    experience_years INT NOT NULL DEFAULT 0,
    fee_per_session DECIMAL(10, 2),
    instagram_url VARCHAR(500),
    soundcloud_url VARCHAR(500),
    mixcloud_url VARCHAR(500),
    profile_photo VARCHAR(500),
    avg_rating DECIMAL(3, 2) NOT NULL DEFAULT 0,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_dj_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS organizer_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    venue_name VARCHAR(150) NOT NULL,
    description TEXT,
    city VARCHAR(100),
    province VARCHAR(100),
    venue_type ENUM('club', 'bar', 'festival', 'private', 'private_party', 'other') NOT NULL DEFAULT 'other',
    website_url VARCHAR(500),
    logo_photo VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_organizer_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS dj_styles (
    dj_profile_id INT NOT NULL,
    music_style_id INT NOT NULL,
    PRIMARY KEY (dj_profile_id, music_style_id),
    CONSTRAINT fk_dj_style_dj FOREIGN KEY (dj_profile_id) REFERENCES dj_profiles(id) ON DELETE CASCADE,
    CONSTRAINT fk_dj_style_style FOREIGN KEY (music_style_id) REFERENCES music_styles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS job_offers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organizer_id INT NOT NULL,
    title VARCHAR(160) NOT NULL,
    description TEXT NOT NULL,
    event_date DATE,
    city VARCHAR(100) NOT NULL,
    music_style_id INT,
    min_experience_years INT NOT NULL DEFAULT 0,
    budget DECIMAL(10, 2),
    duration_hours DECIMAL(4, 1),
    image_url VARCHAR(500),
    status ENUM('open', 'closed', 'cancelled') NOT NULL DEFAULT 'open',
    CONSTRAINT fk_offer_organizer FOREIGN KEY (organizer_id) REFERENCES organizer_profiles(id) ON DELETE CASCADE,
    CONSTRAINT fk_offer_style FOREIGN KEY (music_style_id) REFERENCES music_styles(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_offer_id INT NOT NULL,
    dj_profile_id INT NOT NULL,
    status ENUM('pending', 'accepted', 'rejected', 'withdrawn') NOT NULL DEFAULT 'pending',
    message TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_application_offer_dj (job_offer_id, dj_profile_id),
    CONSTRAINT fk_application_offer FOREIGN KEY (job_offer_id) REFERENCES job_offers(id) ON DELETE CASCADE,
    CONSTRAINT fk_application_dj FOREIGN KEY (dj_profile_id) REFERENCES dj_profiles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS conversations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_one_id INT NOT NULL,
    user_two_id INT NOT NULL,
    dj_profile_id INT NULL,
    organizer_id INT NULL,
    job_offer_id INT NULL,
    status ENUM('active', 'archived') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_message_at TIMESTAMP NULL,
    INDEX idx_conversations_user_one (user_one_id),
    INDEX idx_conversations_user_two (user_two_id),
    CONSTRAINT fk_conversation_user_one FOREIGN KEY (user_one_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_conversation_user_two FOREIGN KEY (user_two_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_conversation_dj FOREIGN KEY (dj_profile_id) REFERENCES dj_profiles(id) ON DELETE SET NULL,
    CONSTRAINT fk_conversation_organizer FOREIGN KEY (organizer_id) REFERENCES organizer_profiles(id) ON DELETE SET NULL,
    CONSTRAINT fk_conversation_offer FOREIGN KEY (job_offer_id) REFERENCES job_offers(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT NOT NULL,
    sender_user_id INT NOT NULL,
    body TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_message_conversation FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    CONSTRAINT fk_message_sender FOREIGN KEY (sender_user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dj_profile_id INT NOT NULL,
    organizer_id INT NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    job_offer_id INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_review_dj FOREIGN KEY (dj_profile_id) REFERENCES dj_profiles(id) ON DELETE CASCADE,
    CONSTRAINT fk_review_organizer FOREIGN KEY (organizer_id) REFERENCES organizer_profiles(id) ON DELETE CASCADE,
    CONSTRAINT fk_review_offer FOREIGN KEY (job_offer_id) REFERENCES job_offers(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS favorite_djs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organizer_id INT NOT NULL,
    dj_profile_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_favorite_dj (organizer_id, dj_profile_id),
    CONSTRAINT fk_favorite_organizer FOREIGN KEY (organizer_id) REFERENCES organizer_profiles(id) ON DELETE CASCADE,
    CONSTRAINT fk_favorite_dj FOREIGN KEY (dj_profile_id) REFERENCES dj_profiles(id) ON DELETE CASCADE
);
