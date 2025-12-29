-- Update user_profiles table to make referred_by required
ALTER TABLE user_profiles
ALTER COLUMN referred_by SET NOT NULL;

-- Add a default value for existing rows if any exist
UPDATE user_profiles
SET referred_by = 'Unknown'
WHERE referred_by IS NULL;
