-- ============================
-- Table: utilisateur
-- ============================
CREATE TABLE utilisateur (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL CHECK (LENGTH(password) >= 6),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
);

-- ============================
-- Table: categorie
-- Chaque utilisateur a ses propres catégories
-- ============================
CREATE TABLE categorie (
    category_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES utilisateur(user_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, name)  -- Empêche doublon de nom pour un même utilisateur
);

-- ============================
-- Table: recu
-- Lié à un utilisateur et à une dépense
-- ============================
CREATE TABLE recu (
    receipt_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES utilisateur(user_id) ON DELETE CASCADE,
    file_path VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- Table: depense
-- ============================
CREATE TABLE depense (
    expense_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES utilisateur(user_id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('one-time', 'recurring')),
    description TEXT,
    amount NUMERIC(12,2) NOT NULL,
    start_date DATE,
    end_date DATE,
    date DATE, 
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    receipt_id INT REFERENCES recu(receipt_id) ON DELETE SET NULL,
    category_id INT NOT NULL REFERENCES categorie(category_id)
);

-- Index pour filtrage rapide sur dashboard
CREATE INDEX idx_depense_user_date ON depense(user_id, date);
CREATE INDEX idx_depense_user_type ON depense(user_id, type);

-- ============================
-- Table: revenu
-- ============================
CREATE TABLE revenu (
    income_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES utilisateur(user_id) ON DELETE CASCADE,
    source VARCHAR(150) NOT NULL,
    description TEXT,
    amount NUMERIC(12,2) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index pour filtrage rapide sur dashboard
CREATE INDEX idx_revenu_user_date ON revenu(user_id, date);

-- ============================
-- Table: notification
-- Stocke les alertes budget pour chaque utilisateur
-- ============================
CREATE TABLE notification (
    alert_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES utilisateur(user_id) ON DELETE CASCADE,
    month DATE NOT NULL,  -- standardiser sur le 1er jour du mois
    amount_over_budget NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index pour retrouver rapidement les alertes par utilisateur et mois
CREATE INDEX idx_notification_user_month ON notification(user_id, month);
