// Configuration Supabase pour le mode démo
// En production, utilisez les vraies variables d'environnement

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';



// Client pour le navigateur (React)
export const supabaseBrowser = {
  auth: {
    user: null,
    session: null,
    signIn: async () => Promise.resolve({ user: { id: 'demo', email: 'demo@example.com' } }),
    signOut: async () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => {} } }
    })
  },
  from: () => ({
    select: () => ({
      eq: () => Promise.resolve({ data: [], error: null }),
      order: () => Promise.resolve({ data: [], error: null }),
      limit: () => Promise.resolve({ data: [], error: null })
    }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ data: null, error: null })
  })
};

export const supabaseServer = supabaseBrowser;
