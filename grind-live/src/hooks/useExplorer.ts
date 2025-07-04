import { useState, useEffect, useCallback } from 'react';
import { supabaseBrowser } from '@/lib/supabaseClient';

export interface PublicWorkout {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  user_id: string;
  is_public: boolean;
  difficulty?: string;
  estimated_duration?: number;
  exercise_count?: number;
  user?: {
    username?: string;
  };
  _count?: {
    favorites: number;
  };
}

export function useExplorer() {
  const [publicWorkouts, setPublicWorkouts] = useState<PublicWorkout[]>([]);
  const [popularWorkouts, setPopularWorkouts] = useState<PublicWorkout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les séances publiques
  const loadPublicWorkouts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer les séances publiques avec le nombre de favoris
      const { data, error } = await supabaseBrowser
        .from('workouts')
        .select(`
          *,
          user:profiles(username),
          _count: favorites(count)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      setPublicWorkouts(data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des séances publiques:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les séances populaires (avec le plus de favoris)
  const loadPopularWorkouts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer les séances les plus populaires
      const { data, error } = await supabaseBrowser
        .from('workouts')
        .select(`
          *,
          user:profiles(username),
          _count: favorites(count)
        `)
        .eq('is_public', true)
        .order('_count.favorites', { ascending: false })
        .limit(10);

      if (error) throw error;

      setPopularWorkouts(data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des séances populaires:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger toutes les données de l'explorateur
  const loadExplorerData = useCallback(async () => {
    await Promise.all([
      loadPublicWorkouts(),
      loadPopularWorkouts()
    ]);
  }, [loadPublicWorkouts, loadPopularWorkouts]);

  // Rechercher des séances
  const searchWorkouts = useCallback(async (query: string) => {
    if (!query.trim()) {
      await loadPublicWorkouts();
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabaseBrowser
        .from('workouts')
        .select(`
          *,
          user:profiles(username),
          _count: favorites(count)
        `)
        .eq('is_public', true)
        .ilike('name', `%${query}%`)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      setPublicWorkouts(data || []);
    } catch (err) {
      console.error('Erreur lors de la recherche:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [loadPublicWorkouts]);

  // Filtrer par difficulté
  const filterByDifficulty = useCallback(async (difficulty: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabaseBrowser
        .from('workouts')
        .select(`
          *,
          user:profiles(username),
          _count: favorites(count)
        `)
        .eq('is_public', true)
        .eq('difficulty', difficulty)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      setPublicWorkouts(data || []);
    } catch (err) {
      console.error('Erreur lors du filtrage:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les données au montage
  useEffect(() => {
    loadExplorerData();
  }, [loadExplorerData]);

  return {
    publicWorkouts,
    popularWorkouts,
    loading,
    error,
    searchWorkouts,
    filterByDifficulty,
    refresh: loadExplorerData
  };
} 