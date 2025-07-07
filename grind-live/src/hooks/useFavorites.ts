import { useState, useEffect, useCallback } from 'react';
import { useUser } from './useUser';

export interface FavoriteWorkout {
  id: string;
  user_id: string;
  workout_id: string;
  created_at: string;
  workout?: {
    id: string;
    name: string;
    description?: string;
    created_at: string;
    user_id: string;
    estimated_duration?: number;
    exercise_count?: number;
  };
}

// Données simulées pour les tests
const MOCK_FAVORITES: FavoriteWorkout[] = [
  {
    id: '1',
    user_id: 'mock-user',
    workout_id: '3',
    created_at: '2024-01-15T10:00:00Z',
    workout: {
      id: '3',
      name: 'Séance Jambes - Quadriceps/Ischios',
      description: 'Séance complète pour les jambes',
      created_at: '2024-01-17T08:00:00Z',
      user_id: 'mock-user',
      estimated_duration: 90,
      exercise_count: 8
    }
  }
];

export function useFavorites() {
  const { user } = useUser();
  const [favorites, setFavorites] = useState<FavoriteWorkout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les favoris
  const loadFavorites = useCallback(async () => {
    // Mode simulation si pas d'utilisateur connecté
    if (!user) {
      console.log('🔍 Mode simulation : chargement des favoris mock');
      setLoading(true);
      
      try {
        const response = await fetch('/api/favorites');
        if (response.ok) {
          const data = await response.json();
          setFavorites(data.favorites || []);
        } else {
          // Fallback vers les données mock si l'API échoue
          setFavorites(MOCK_FAVORITES);
        }
      } catch (err) {
        console.log('🔍 Fallback vers données mock');
        setFavorites(MOCK_FAVORITES);
      } finally {
        setLoading(false);
        setError(null);
      }
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/favorites?userId=${user.id}`);
      if (!response.ok) throw new Error('Erreur API');

      const data = await response.json();
      setFavorites(data.favorites || []);
    } catch (err) {
      console.error('Erreur lors du chargement des favoris:');
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Ajouter aux favoris
  const addToFavorites = async (workoutId: string) => {
    console.log('🔍 Ajout aux favoris:', workoutId);
    
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id || 'mock-user',
          workoutId
        }),
      });

      if (!response.ok) throw new Error('Erreur API');

      const data = await response.json();
      
      // Ajouter le nouveau favori à la liste
      setFavorites(prev => [data.favorite, ...prev]);
    } catch (err) {
      console.error('Erreur lors de l\'ajout aux favoris:');
      throw err;
    }
  };

  // Retirer des favoris
  const removeFromFavorites = async (workoutId: string) => {
    console.log('🔍 Retrait des favoris:', workoutId);
    
    try {
      const response = await fetch(`/api/favorites?userId=${user?.id || 'mock-user'}&workoutId=${workoutId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erreur API');

      // Retirer le favori de la liste
      setFavorites(prev => prev.filter(fav => fav.workout_id !== workoutId));
    } catch (err) {
      console.error('Erreur lors de la suppression des favoris:');
      throw err;
    }
  };

  // Vérifier si un workout est en favori
  const isFavorite = (workoutId: string) => {
    return favorites.some(fav => fav.workout_id === workoutId);
  };

  // Toggle favori
  const toggleFavorite = async (workoutId: string) => {
    if (isFavorite(workoutId)) {
      await removeFromFavorites(workoutId);
    } else {
      await addToFavorites(workoutId);
    }
  };

  // Charger les favoris au montage et quand l'utilisateur change
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return {
    favorites,
    loading,
    error,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    refresh: loadFavorites
  };
} 