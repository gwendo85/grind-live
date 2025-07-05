import { useState, useEffect } from 'react';
import { supabaseBrowser } from '@/lib/supabaseClient';

export function useUser() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mode démo - Utilisateur fictif connecté
    const demoUser = {
      id: 'demo-user',
      email: 'demo@grind-live.com',
      name: 'Alex Johnson',
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    };

    setUser(demoUser);
    setLoading(false);

    // Simuler l'écoute des changements d'auth
    const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange(
      (event: string, session: any) => {
        if (event === 'SIGNED_IN') {
          setUser(demoUser);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string) => {
    setLoading(true);
    try {
      const { user } = await supabaseBrowser.auth.signIn();
      setUser(user);
      setError(null);
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabaseBrowser.auth.signOut();
      setUser(null);
      setError(null);
    } catch (err) {
      setError('Erreur de déconnexion');
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    signIn,
    signOut,
    isAuthenticated: !!user
  };
} 