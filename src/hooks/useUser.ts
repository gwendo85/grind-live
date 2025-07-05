import { useState, useEffect } from 'react';
import { supabaseBrowser } from '@/lib/supabaseClient';
import type { User } from '@/lib/types';

// Mock user par défaut
const mockUser: User = {
  id: '1',
  username: 'TestUser',
  email: 'test@grind.live',
  avatar_url: 'https://randomuser.me/api/portraits/men/32.jpg',
  level: 3,
  xp: 250,
  goal: 'Prendre du muscle',
  bio: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔍 useUser: Début du chargement');
    
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 useUser: Vérification de la session...');
        
        // Vérifier d'abord si on est côté client
        if (typeof window === 'undefined') {
          console.log('ℹ️ useUser: Côté serveur, pas de session');
          setUser(null);
          return;
        }

        // Vérifier si Supabase est configuré
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && 
          supabaseUrl !== 'https://your-project.supabase.co' && 
          supabaseAnonKey !== 'your-anon-key-here');

        if (!isSupabaseConfigured) {
          console.log('ℹ️ useUser: Supabase non configuré, utilisation du mock user');
          setUser(mockUser);
          return;
        }
        
        const { data: { user: authUser }, error: authError } = await supabaseBrowser.auth.getUser();
        
        if (authError) {
          console.warn('⚠️ useUser: Erreur auth (normal si non connecté):', authError.message);
          // Ne pas traiter comme une erreur critique si c'est juste "pas de session"
          if (authError.message.includes('session') || authError.message.includes('token')) {
            console.log('ℹ️ useUser: Aucune session active');
            setUser(null);
            return;
          }
          setError(authError.message);
          return;
        }
        
        if (!authUser) {
          console.log('ℹ️ useUser: Aucun utilisateur connecté');
          setUser(null);
          return;
        }
        
        console.log('🔍 useUser: Récupération du profil...');
        const { data: profile, error: profileError } = await supabaseBrowser
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();
        
        if (profileError) {
          console.warn('⚠️ useUser: Profil non trouvé, création d\'un profil par défaut');
          
          // Créer un profil par défaut
          const defaultProfile: User = {
            id: authUser.id,
            email: authUser.email || '',
            username: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Utilisateur',
            avatar_url: authUser.user_metadata?.avatar_url || null,
            xp: 0,
            level: 1,
            bio: null,
            goal: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          
          console.log('✅ useUser: Profil par défaut créé:', defaultProfile);
          setUser(defaultProfile);
          return;
        }
        
        console.log('✅ useUser: Profil chargé:', profile);
        setUser(profile);
        
      } catch (err) {
        console.error('❌ useUser: Erreur inattendue:', err);
        // Ne pas bloquer l'application pour les erreurs d'auth
        if (err instanceof Error && err.message.includes('auth')) {
          console.log('ℹ️ useUser: Erreur auth non critique, utilisateur non connecté');
          setUser(null);
        } else {
          setError(err instanceof Error ? err.message : 'Erreur inconnue');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Pour la déconnexion, etc. (à compléter)
  const logout = () => {
    setUser(null);
    console.log('User logged out');
  };

  return { user, loading, error, logout };
} 