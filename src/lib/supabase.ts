import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

// Validate URL format - should be like https://xxxxx.supabase.co, not the dashboard URL
if (supabaseUrl.includes('supabase.com/dashboard')) {
  throw new Error(
    'Invalid Supabase URL! You are using the dashboard URL. ' +
    'The correct URL format should be: https://YOUR_PROJECT_REF.supabase.co\n' +
    'Find it in: Project Settings > API > Project URL'
  )
}

if (!supabaseUrl.includes('.supabase.co')) {
  console.warn(
    'Warning: Supabase URL does not match expected format. ' +
    'Expected format: https://YOUR_PROJECT_REF.supabase.co'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

