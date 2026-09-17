CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  username TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS languages (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  language_id INT REFERENCES languages(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  field1_label TEXT NOT NULL DEFAULT 'Term',
  field2_label TEXT NOT NULL DEFAULT 'Definition',
  is_custom BOOLEAN DEFAULT FALSE,
  position INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS entries (
  id SERIAL PRIMARY KEY,
  category_id INT REFERENCES categories(id) ON DELETE CASCADE,
  field1 TEXT NOT NULL,
  field2 TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cards (
  id SERIAL PRIMARY KEY,
  entry_id INT REFERENCES entries(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  difficulty_set_at TIMESTAMPTZ,
  UNIQUE (entry_id, user_id)
);

CREATE TABLE IF NOT EXISTS card_schedule (
  card_id INT PRIMARY KEY REFERENCES cards(id) ON DELETE CASCADE,
  next_review TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  interval_days FLOAT NOT NULL DEFAULT 1,
  ease_factor FLOAT NOT NULL DEFAULT 2.5,
  review_count INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS card_reviews (
  time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  card_id INT REFERENCES cards(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  correct BOOLEAN NOT NULL,
  attempt_number INT NOT NULL DEFAULT 1,
  rating TEXT CHECK (rating IN ('easy', 'medium', 'hard'))
);

SELECT create_hypertable('card_reviews', 'time', if_not_exists => TRUE);

CREATE MATERIALIZED VIEW IF NOT EXISTS daily_review_stats
WITH (timescaledb.continuous) AS
SELECT
  user_id,
  time_bucket('1 day', time) AS day,
  COUNT(*) AS total_reviews,
  SUM(CASE WHEN correct THEN 1 ELSE 0 END) AS correct_count
FROM card_reviews
GROUP BY user_id, day
WITH NO DATA;
