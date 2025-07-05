import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { Database } from './types'; // (à créer plus tard pour le typage DB)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client pour le navigateur (React)
export const supabaseBrowser = () => createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);

// Client pour les server actions (Next.js 14+)
export const supabaseServer = (cookies: any) =>
  createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies,
  });
