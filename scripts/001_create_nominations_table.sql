-- Create nominations table to store anonymous nominations
CREATE TABLE IF NOT EXISTS nominations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  category TEXT NOT NULL,
  nominee TEXT NOT NULL,
  reason TEXT,
  submitter_id TEXT DEFAULT gen_random_uuid()::TEXT
);

-- Enable Row Level Security
ALTER TABLE nominations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert nominations (anonymous)
CREATE POLICY "Allow anonymous inserts" ON nominations
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read nominations (for counting/winners)
CREATE POLICY "Allow public reads" ON nominations
  FOR SELECT
  USING (true);
