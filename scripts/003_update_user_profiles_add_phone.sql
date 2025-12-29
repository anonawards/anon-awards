-- Add phone column to user_profiles table
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Add index for phone lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_phone ON user_profiles(phone);
