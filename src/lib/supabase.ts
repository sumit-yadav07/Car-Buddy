import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Profile = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type Car = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  images: string[];
  tags: string[];
  created_at: string;
  updated_at: string;
};