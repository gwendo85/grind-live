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

// Mode démo simple - Pas besoin de Supabase pour tester l'interface
export const supabaseBrowser = {
  auth: {
    user: null,
    session: null,
    signIn: async () => ({ user: { id: 'demo-user', email: 'demo@grind-live.com' } }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: (callback: any) => {
      // Simuler un utilisateur connecté
      callback('SIGNED_IN', { user: { id: 'demo-user', email: 'demo@grind-live.com' } });
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  },
  from: () => ({
    select: () => ({
      eq: () => Promise.resolve({ data: [], error: null }),
      order: () => Promise.resolve({ data: [], error: null })
    }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ data: null, error: null })
  })
};

export const supabaseServer = supabaseBrowser;
