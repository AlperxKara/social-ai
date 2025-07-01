/*
  # Add profile_url column to social_accounts table

  1. Changes
    - Add profile_url column to social_accounts table to store the social media profile links
    
  2. Security
    - No changes to existing RLS policies needed
*/

-- Add profile_url column to social_accounts table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'social_accounts' AND column_name = 'profile_url'
  ) THEN
    ALTER TABLE social_accounts ADD COLUMN profile_url text;
  END IF;
END $$;