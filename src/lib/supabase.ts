import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper functions for common operations
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const uploadFile = async (file: File, path: string) => {
  const { data, error } = await supabase.storage
    .from('media')
    .upload(path, file);
  
  if (error) throw error;
  return data;
};

export const getPublicUrl = (path: string) => {
  const { data } = supabase.storage
    .from('media')
    .getPublicUrl(path);
  
  return data.publicUrl;
};