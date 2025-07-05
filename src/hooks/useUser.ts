import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
}

interface AuthError {
  message: string;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    // Mode démo - récupération de l'utilisateur depuis localStorage
    const demoUser = localStorage.getItem('demoUser');
    if (demoUser) {
      try {
        const userData = JSON.parse(demoUser);
        setUser(userData);
      } catch {
        setError({ message: 'Erreur lors du chargement de l\'utilisateur' });
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<{ user: User | null; error: AuthError | null }> => {
    try {
      // Simulation de connexion en mode démo
      const userData = {
        id: 'demo-user',
        email,
        name: email.split('@')[0],
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      };
      
      localStorage.setItem('demoUser', JSON.stringify(userData));
      setUser(userData);
      return { user: userData, error: null };
    } catch {
      const authError = { message: 'Erreur de connexion' };
      setError(authError);
      return { user: null, error: authError };
    }
  };

  const signOut = async (): Promise<{ error: AuthError | null }> => {
    try {
      localStorage.removeItem('demoUser');
      setUser(null);
      return { error: null };
    } catch {
      const authError = { message: 'Erreur de déconnexion' };
      setError(authError);
      return { error: authError };
    }
  };

  return {
    user,
    loading,
    error,
    signIn,
    signOut
  };
} 