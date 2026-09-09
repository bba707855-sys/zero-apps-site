/*
# ShflameStore Schema

## Overview
Creates the database schema for ShflameStore — an app store for games.
Stores a catalog of games organized by language category (Uzbek, English, Russian),
user profiles synced from Google OAuth, and user favorites.

## New Tables

### games
- `id` (uuid, primary key)
- `title` (text, not null) — game name
- `category` (text, not null) — 'uzbek' | 'english' | 'russian'
- `description` (text) — game description
- `icon_url` (text) — game logo/icon URL
- `play_store_url` (text) — Google Play download link
- `app_store_url` (text) — Apple App Store download link
- `rating` (numeric, default 0) — rating 0-5
- `downloads` (text) — download count display string e.g. "10M+"
- `developer` (text) — developer name
- `rank` (integer, default 0) — ranking within category (1 = #1)
- `created_at` (timestamptz)

### profiles
- `id` (uuid, primary key, references auth.users)
- `email` (text)
- `full_name` (text)
- `avatar_url` (text)
- `created_at` (timestamptz)

### favorites
- `id` (uuid, primary key)
- `user_id` (uuid, not null, defaults to auth.uid(), references auth.users)
- `game_id` (uuid, not null, references games)
- `created_at` (timestamptz)
- Unique constraint on (user_id, game_id)

## Security
- `games`: public read (anon + authenticated), no writes from frontend
- `profiles`: owner-scoped CRUD (authenticated only)
- `favorites`: owner-scoped CRUD (authenticated only)
*/

CREATE TABLE IF NOT EXISTS games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL CHECK (category IN ('uzbek', 'english', 'russian')),
  description text DEFAULT '',
  icon_url text DEFAULT '',
  play_store_url text DEFAULT '',
  app_store_url text DEFAULT '',
  rating numeric DEFAULT 0,
  downloads text DEFAULT '',
  developer text DEFAULT '',
  rank integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE games ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_games" ON games;
CREATE POLICY "public_read_games" ON games FOR SELECT
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text DEFAULT '',
  full_name text DEFAULT '',
  avatar_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id uuid NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, game_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_favorites" ON favorites;
CREATE POLICY "select_own_favorites" ON favorites FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_favorites" ON favorites;
CREATE POLICY "insert_own_favorites" ON favorites FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_favorites" ON favorites;
CREATE POLICY "delete_own_favorites" ON favorites FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_games_category_rank ON games(category, rank);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);