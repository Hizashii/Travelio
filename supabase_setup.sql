-- ============================================
-- Supabase Destinations Table Setup
-- ============================================
-- Run this entire script in your Supabase SQL Editor
-- Go to: SQL Editor > New Query > Paste this > Run

-- Step 1: Create the destinations table
CREATE TABLE IF NOT EXISTS public.destinations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  base_price NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Step 2: Enable Row Level Security (RLS)
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;

-- Step 3: Create policy to allow public read access
-- This allows anyone to read destinations (no authentication required)
CREATE POLICY "Allow public read access" ON public.destinations
  FOR SELECT
  USING (true);

-- Step 4: Create policy to allow authenticated users to insert
CREATE POLICY "Allow authenticated insert" ON public.destinations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Step 5: Create policy to allow authenticated users to update
CREATE POLICY "Allow authenticated update" ON public.destinations
  FOR UPDATE
  TO authenticated
  USING (true);

-- Step 6: Create policy to allow authenticated users to delete
CREATE POLICY "Allow authenticated delete" ON public.destinations
  FOR DELETE
  TO authenticated
  USING (true);

-- Step 7: Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 8: Create trigger to automatically update updated_at
CREATE TRIGGER update_destinations_updated_at
  BEFORE UPDATE ON public.destinations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Step 9: Insert initial destination data (optional)
-- Uncomment the lines below if you want to insert sample data

INSERT INTO public.destinations (id, name, country, image, description, base_price, currency) VALUES
  ('paris', 'Paris', 'France', '/paris.jpg', 'The City of Light, known for its art, fashion, and iconic landmarks like the Eiffel Tower.', 450, 'USD'),
  ('japan', 'Tokyo', 'Japan', '/japan.jpg', 'A vibrant blend of traditional culture and cutting-edge technology.', 850, 'USD'),
  ('italy', 'Rome', 'Italy', '/italy.jpg', 'Historic capital with ancient ruins, Renaissance art, and world-class cuisine.', 550, 'USD'),
  ('india', 'Delhi', 'India', '/india.jpg', 'A rich tapestry of history, culture, and spirituality.', 650, 'USD'),
  ('bali', 'Bali', 'Indonesia', '/bali.jpg', 'Tropical paradise with stunning beaches, temples, and lush landscapes.', 600, 'USD'),
  ('london', 'London', 'United Kingdom', '/background1.jpg', 'Historic capital with royal palaces, world-class museums, and vibrant culture.', 500, 'USD'),
  ('newyork', 'New York', 'United States', '/background2.jpg', 'The city that never sleeps, home to iconic skyscrapers and Broadway.', 400, 'USD')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Verification Query (run this to check if it worked)
-- ============================================
-- SELECT * FROM public.destinations;

