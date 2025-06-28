/*
  # Add User Settings Support

  1. New Columns
    - Add bio, phone, company to profiles table
    - Add language, timezone preferences
    
  2. New Tables
    - user_settings for storing additional preferences
    
  3. Functions
    - Function to deduct credits safely
*/

-- Add new columns to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'bio'
  ) THEN
    ALTER TABLE profiles ADD COLUMN bio text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'phone'
  ) THEN
    ALTER TABLE profiles ADD COLUMN phone text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'company'
  ) THEN
    ALTER TABLE profiles ADD COLUMN company text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'language'
  ) THEN
    ALTER TABLE profiles ADD COLUMN language text DEFAULT 'en';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'timezone'
  ) THEN
    ALTER TABLE profiles ADD COLUMN timezone text DEFAULT 'UTC';
  END IF;
END $$;

-- Create user_settings table for additional preferences
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  notifications jsonb DEFAULT '{"email": true, "push": true, "marketing": false, "security": true}',
  appearance jsonb DEFAULT '{"theme": "light"}',
  integrations jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on user_settings
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- User settings policies
CREATE POLICY "Users can manage own settings"
  ON user_settings
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Function to safely deduct credits
CREATE OR REPLACE FUNCTION deduct_credits(user_id uuid, amount integer)
RETURNS void AS $$
BEGIN
  UPDATE profiles 
  SET credits_remaining = GREATEST(0, credits_remaining - amount),
      updated_at = now()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for user_settings updated_at
CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings for existing users
INSERT INTO user_settings (user_id)
SELECT id FROM profiles
WHERE id NOT IN (SELECT user_id FROM user_settings)
ON CONFLICT (user_id) DO NOTHING;