import { createClient } from '@supabase/supabase-js';

// Vérifier si les variables d'environnement sont définies
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Vérifier si les clés sont valides
const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && 
  !supabaseUrl.includes('your-project') && 
  !supabaseAnonKey.includes('your-anon-key') &&
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey.startsWith('eyJ'));

// Client factice pour le développement si les variables ne sont pas définies
const createMockClient = () => {
  console.warn('⚠️ Utilisation d\'un client Supabase factice - Configure tes variables d\'environnement pour utiliser la vraie base de données');
  
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithOAuth: async () => ({ data: { url: null }, error: null }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null }),
    }),
  };
};

// Client pour le navigateur (React)
export const supabaseBrowser = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : createMockClient();

// Client pour le serveur (SSR)
export const supabaseServer = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : createMockClient();
