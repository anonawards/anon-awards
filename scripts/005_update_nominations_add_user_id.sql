-- Add user_id column to nominations table to track who submitted each nomination
ALTER TABLE nominations 
  ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Create index for faster queries
CREATE INDEX idx_nominations_user_id ON nominations(user_id);

-- Update RLS policies to allow users to see their own nominations
DROP POLICY IF EXISTS "Allow public reads" ON nominations;

-- Users can only see their own nominations
CREATE POLICY "Users can view own nominations" ON nominations
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow authenticated users to insert with their user_id
DROP POLICY IF EXISTS "Allow anonymous inserts" ON nominations;

CREATE POLICY "Authenticated users can insert" ON nominations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admin policy to view all nominations (for winners page later)
CREATE POLICY "Service role can view all" ON nominations
  FOR SELECT
  USING (auth.jwt() ->> 'role' = 'service_role');
