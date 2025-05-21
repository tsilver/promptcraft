import { createClient } from '@supabase/supabase-js';

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables:', { 
    supabaseUrl: !!supabaseUrl, 
    supabaseAnonKey: !!supabaseAnonKey 
  });
}

// Use empty strings as fallbacks to prevent runtime errors
// The application will handle missing auth in the auth context
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
); 