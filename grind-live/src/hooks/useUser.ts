import { useState, useEffect } from 'react';

// Type utilisateur (à adapter selon Supabase plus tard)
export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  level: number;
  xp: number;
  goal?: string;
}

// Mock user par défaut
const mockUser: User = {
  id: '1',
  username: 'TestUser',
  email: 'test@grind.live',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  level: 3,
  xp: 250,
  goal: 'Prendre du muscle',
};

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simuler un chargement (remplacer par Supabase ensuite)
        await new Promise(resolve => setTimeout(resolve, 400));
        
        // Simuler une erreur aléatoire pour tester (à supprimer en prod)
        if (Math.random() < 0.1) {
          throw new Error('Erreur de chargement utilisateur');
        }
        
        setUser(mockUser);
      } catch (err) {
        console.error('Erreur useUser:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
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