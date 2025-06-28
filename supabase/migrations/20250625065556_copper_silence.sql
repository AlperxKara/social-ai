/*
  # Initial Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `avatar_url` (text, optional)
      - `role` (text, enum: individual/agency)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `social_accounts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `platform` (text, enum: instagram/facebook/twitter/linkedin/tiktok)
      - `platform_user_id` (text)
      - `username` (text)
      - `display_name` (text)
      - `access_token` (text, encrypted)
      - `refresh_token` (text, encrypted, optional)
      - `token_expires_at` (timestamp, optional)
      - `followers_count` (integer, default 0)
      - `is_active` (boolean, default true)
      - `connected_at` (timestamp)
      - `last_sync_at` (timestamp, optional)

    - `posts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text)
      - `content` (text)
      - `media_urls` (jsonb, array of media URLs)
      - `platforms` (jsonb, array of platform IDs)
      - `scheduled_for` (timestamp, optional)
      - `published_at` (timestamp, optional)
      - `status` (text, enum: draft/scheduled/published/failed)
      - `ai_generated` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `media_library`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `filename` (text)
      - `original_name` (text)
      - `file_type` (text)
      - `file_size` (integer)
      - `storage_path` (text)
      - `public_url` (text)
      - `tags` (jsonb, array of tags)
      - `created_at` (timestamp)

    - `ai_generations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `type` (text, enum: image/caption/strategy)
      - `prompt` (text)
      - `result` (jsonb)
      - `credits_used` (integer, default 1)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('individual', 'agency');
CREATE TYPE social_platform AS ENUM ('instagram', 'facebook', 'twitter', 'linkedin', 'tiktok');
CREATE TYPE post_status AS ENUM ('draft', 'scheduled', 'published', 'failed');
CREATE TYPE ai_generation_type AS ENUM ('image', 'caption', 'strategy');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  avatar_url text,
  role user_role DEFAULT 'individual',
  credits_remaining integer DEFAULT 100,
  subscription_tier text DEFAULT 'free',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Social accounts table
CREATE TABLE IF NOT EXISTS social_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  platform social_platform NOT NULL,
  platform_user_id text NOT NULL,
  username text NOT NULL,
  display_name text,
  access_token text NOT NULL,
  refresh_token text,
  token_expires_at timestamptz,
  followers_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  connected_at timestamptz DEFAULT now(),
  last_sync_at timestamptz,
  UNIQUE(user_id, platform, platform_user_id)
);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  media_urls jsonb DEFAULT '[]',
  platforms jsonb DEFAULT '[]',
  scheduled_for timestamptz,
  published_at timestamptz,
  status post_status DEFAULT 'draft',
  ai_generated boolean DEFAULT false,
  engagement_stats jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Media library table
CREATE TABLE IF NOT EXISTS media_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  filename text NOT NULL,
  original_name text NOT NULL,
  file_type text NOT NULL,
  file_size integer NOT NULL,
  storage_path text NOT NULL,
  public_url text NOT NULL,
  tags jsonb DEFAULT '[]',
  used_in_posts integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- AI generations table
CREATE TABLE IF NOT EXISTS ai_generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type ai_generation_type NOT NULL,
  prompt text NOT NULL,
  result jsonb NOT NULL,
  credits_used integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  platform social_platform NOT NULL,
  metric_type text NOT NULL, -- likes, comments, shares, reach, impressions
  metric_value integer NOT NULL,
  recorded_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Social accounts policies
CREATE POLICY "Users can manage own social accounts"
  ON social_accounts
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Posts policies
CREATE POLICY "Users can manage own posts"
  ON posts
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Media library policies
CREATE POLICY "Users can manage own media"
  ON media_library
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- AI generations policies
CREATE POLICY "Users can manage own AI generations"
  ON ai_generations
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Analytics policies
CREATE POLICY "Users can read own analytics"
  ON analytics
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for media files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload own media"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own media"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own media"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);