import { useState, useEffect, useCallback } from 'react';
import { supabaseBrowser } from '@/lib/supabaseClient';
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
      
      // Simuler un délai de chargement
      setTimeout(() => {
        setFavorites(MOCK_FAVORITES);
        setLoading(false);
        setError(null);
      }, 800);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabaseBrowser
        .from('favorites')
        .select(`
          *,
          workout:workouts(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setFavorites(data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des favoris:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Ajouter aux favoris
  const addToFavorites = async (workoutId: string) => {
    console.log('🔍 Ajout aux favoris:', workoutId);
    
    // Mode simulation si pas d'utilisateur connecté
    if (!user) {
      console.log('🔍 Mode simulation : ajout aux favoris mock');
      
      // Simuler un délai
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Créer un nouveau favori simulé
      const newFavorite: FavoriteWorkout = {
        id: Date.now().toString(),
        user_id: 'mock-user',
        workout_id: workoutId,
        created_at: new Date().toISOString(),
        workout: {
          id: workoutId,
          name: `Séance ${workoutId}`,
          description: 'Séance simulée',
          created_at: new Date().toISOString(),
          user_id: 'mock-user',
          estimated_duration: 60,
          exercise_count: 5
        }
      };
      
      setFavorites(prev => [newFavorite, ...prev]);
      return;
    }

    try {
      const { error } = await supabaseBrowser
        .from('favorites')
        .insert({
          user_id: user.id,
          workout_id: workoutId
        });

      if (error) throw error;

      // Recharger les favoris
      await loadFavorites();
    } catch (err) {
      console.error('Erreur lors de l\'ajout aux favoris:', err);
      throw err;
    }
  };

  // Retirer des favoris
  const removeFromFavorites = async (workoutId: string) => {
    console.log('🔍 Retrait des favoris:', workoutId);
    
    // Mode simulation si pas d'utilisateur connecté
    if (!user) {
      console.log('🔍 Mode simulation : retrait des favoris mock');
      
      // Simuler un délai
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setFavorites(prev => prev.filter(fav => fav.workout_id !== workoutId));
      return;
    }

    try {
      const { error } = await supabaseBrowser
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('workout_id', workoutId);

      if (error) throw error;

      // Recharger les favoris
      await loadFavorites();
    } catch (err) {
      console.error('Erreur lors de la suppression des favoris:', err);
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