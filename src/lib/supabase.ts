import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type Game = {
  id: string;
  title: string;
  category: 'uzbek' | 'english' | 'russian';
  description: string;
  icon_url: string;
  play_store_url: string;
  app_store_url: string;
  rating: number;
  downloads: string;
  developer: string;
  rank: number;
  created_at: string;
};

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  created_at: string;
};

export type Favorite = {
  id: string;
  user_id: string;
  game_id: string;
  created_at: string;
};
