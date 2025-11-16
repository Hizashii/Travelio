# Supabase Setup Guide

## 1. Environment Variables

**Important:** In Vite, environment variables must be prefixed with `VITE_` not `REACT_APP_`.

### Finding Your Supabase Credentials

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/YOUR_PROJECT_REF
2. Click on **Settings** (gear icon) in the left sidebar
3. Click on **API** in the settings menu
4. You'll see:
   - **Project URL**: This is your `VITE_SUPABASE_URL` (format: `https://xxxxx.supabase.co`)
   - **anon public** key: This is your `VITE_SUPABASE_ANON_KEY`

**⚠️ CRITICAL:** Do NOT use the dashboard URL (`https://supabase.com/dashboard/...`). 
You MUST use the Project URL which looks like: `https://YOUR_PROJECT_REF.supabase.co`

### Setting Up .env File

Create a `.env` file in the root of your project:

```env
VITE_SUPABASE_URL=https://mvxlvilxtdlspvongmnx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Example for your project:**
```env
VITE_SUPABASE_URL=https://mvxlvilxtdlspvongmnx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Replace `your_anon_key_here` with the actual anon key from your Supabase dashboard.

If you already have `REACT_APP_` prefixed variables, you need to rename them to `VITE_`.

## 2. Create the Destinations Table

**The table doesn't exist yet!** You need to create it first.

### Quick Setup (Recommended)

1. Open the file `supabase_setup.sql` in this project
2. Copy the entire contents
3. Go to your Supabase dashboard: https://supabase.com/dashboard/project/mvxlvilxtdlspvongmnx
4. Click on **SQL Editor** in the left sidebar
5. Click **New Query**
6. Paste the SQL script
7. Click **Run** (or press Ctrl+Enter)

Alternatively, run this SQL in your Supabase SQL Editor:

```sql
-- Create destinations table
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

-- Enable Row Level Security (RLS)
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON public.destinations
  FOR SELECT
  USING (true);

-- Create policy to allow authenticated users to insert
CREATE POLICY "Allow authenticated insert" ON public.destinations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policy to allow authenticated users to update
CREATE POLICY "Allow authenticated update" ON public.destinations
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create policy to allow authenticated users to delete
CREATE POLICY "Allow authenticated delete" ON public.destinations
  FOR DELETE
  TO authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_destinations_updated_at
  BEFORE UPDATE ON public.destinations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
```

## 3. Insert Initial Data (Optional)

The `supabase_setup.sql` file already includes sample data insertion. If you want to insert data separately:

```sql
INSERT INTO public.destinations (id, name, country, image, description, base_price, currency) VALUES
  ('paris', 'Paris', 'France', '/paris.jpg', 'The City of Light, known for its art, fashion, and iconic landmarks like the Eiffel Tower.', 450, 'USD'),
  ('japan', 'Tokyo', 'Japan', '/japan.jpg', 'A vibrant blend of traditional culture and cutting-edge technology.', 850, 'USD'),
  ('italy', 'Rome', 'Italy', '/italy.jpg', 'Historic capital with ancient ruins, Renaissance art, and world-class cuisine.', 550, 'USD'),
  ('india', 'Delhi', 'India', '/india.jpg', 'A rich tapestry of history, culture, and spirituality.', 650, 'USD'),
  ('bali', 'Bali', 'Indonesia', '/bali.jpg', 'Tropical paradise with stunning beaches, temples, and lush landscapes.', 600, 'USD'),
  ('london', 'London', 'United Kingdom', '/background1.jpg', 'Historic capital with royal palaces, world-class museums, and vibrant culture.', 500, 'USD'),
  ('newyork', 'New York', 'United States', '/background2.jpg', 'The city that never sleeps, home to iconic skyscrapers and Broadway.', 400, 'USD')
ON CONFLICT (id) DO NOTHING;
```

**Note:** The `ON CONFLICT (id) DO NOTHING` prevents errors if you run this multiple times.

## 4. Column Name Mapping

Note: The database uses `base_price` (snake_case) but the TypeScript interface uses `basePrice` (camelCase). Supabase automatically handles this conversion, but if you need to explicitly map it, you can use:

```typescript
// In your service file, you can use select with column aliases if needed
.select('id, name, country, image, description, base_price as basePrice, currency')
```

However, Supabase JS client automatically converts snake_case to camelCase, so this should work out of the box.

## 5. Testing

After setting up:

1. Make sure your `.env` file has the correct `VITE_` prefixed variables
2. Restart your dev server (`npm run dev`)
3. Check the browser console for any errors
4. The destinations should now load from Supabase instead of the static array

## 6. Authentication (Optional)

If you want to add/update/delete destinations from the UI, you'll need to:

1. Set up Supabase Auth
2. Add authentication to your app
3. The policies above allow authenticated users to modify data

For now, the app only reads destinations, so public read access is sufficient.

