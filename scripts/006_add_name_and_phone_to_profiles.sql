-- Add name and phone fields to user_profiles
ALTER TABLE user_profiles 
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT;

-- Update email to be nullable since users might use phone
ALTER TABLE user_profiles 
  ALTER COLUMN email DROP NOT NULL;
