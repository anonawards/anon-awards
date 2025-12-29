-- Make phone number required in user_profiles table
ALTER TABLE user_profiles 
  ALTER COLUMN phone SET NOT NULL;

-- Add check constraint to ensure phone is not empty
ALTER TABLE user_profiles 
  ADD CONSTRAINT phone_not_empty CHECK (length(phone) > 0);
