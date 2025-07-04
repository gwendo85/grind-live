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
  };
}

export function useFavorites() {
  const { user } = useUser();
  const [favorites, setFavorites] = useState<FavoriteWorkout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les favoris
  const loadFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
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
    if (!user) {
      throw new Error('Utilisateur non connecté');
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
    if (!user) {
      throw new Error('Utilisateur non connecté');
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
    if (user) {
      loadFavorites();
    }
  }, [user, loadFavorites]);

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