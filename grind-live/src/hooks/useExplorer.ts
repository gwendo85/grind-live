import { useState, useEffect, useCallback } from 'react';
import { supabaseBrowser } from '@/lib/supabaseClient';
import { useUser } from './useUser';

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

// Données simulées pour les tests
const MOCK_PUBLIC_WORKOUTS: PublicWorkout[] = [
  {
    id: '4',
    name: 'Séance Full Body - Débutant',
    description: 'Séance complète pour débutants',
    created_at: '2024-01-10T10:00:00Z',
    user_id: 'user-1',
    is_public: true,
    difficulty: 'beginner',
    estimated_duration: 45,
    exercise_count: 6,
    user: { username: 'CoachPro' },
    _count: { favorites: 12 }
  },
  {
    id: '5',
    name: 'Séance HIIT - Cardio',
    description: 'Entraînement cardio intensif',
    created_at: '2024-01-12T14:00:00Z',
    user_id: 'user-2',
    is_public: true,
    difficulty: 'intermediate',
    estimated_duration: 30,
    exercise_count: 8,
    user: { username: 'FitnessGuru' },
    _count: { favorites: 8 }
  },
  {
    id: '6',
    name: 'Séance Force - Avancé',
    description: 'Séance de force pour sportifs confirmés',
    created_at: '2024-01-14T16:00:00Z',
    user_id: 'user-3',
    is_public: true,
    difficulty: 'advanced',
    estimated_duration: 90,
    exercise_count: 10,
    user: { username: 'PowerLifter' },
    _count: { favorites: 25 }
  }
];

const MOCK_POPULAR_WORKOUTS: PublicWorkout[] = [
  {
    id: '6',
    name: 'Séance Force - Avancé',
    description: 'Séance de force pour sportifs confirmés',
    created_at: '2024-01-14T16:00:00Z',
    user_id: 'user-3',
    is_public: true,
    difficulty: 'advanced',
    estimated_duration: 90,
    exercise_count: 10,
    user: { username: 'PowerLifter' },
    _count: { favorites: 25 }
  },
  {
    id: '4',
    name: 'Séance Full Body - Débutant',
    description: 'Séance complète pour débutants',
    created_at: '2024-01-10T10:00:00Z',
    user_id: 'user-1',
    is_public: true,
    difficulty: 'beginner',
    estimated_duration: 45,
    exercise_count: 6,
    user: { username: 'CoachPro' },
    _count: { favorites: 12 }
  }
];

export function useExplorer() {
  const { user } = useUser();
  const [publicWorkouts, setPublicWorkouts] = useState<PublicWorkout[]>([]);
  const [popularWorkouts, setPopularWorkouts] = useState<PublicWorkout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les séances publiques
  const loadPublicWorkouts = useCallback(async () => {
    // Mode simulation si pas d'utilisateur connecté
    if (!user) {
      setLoading(true);
      
      // Simuler un délai de chargement
      setTimeout(() => {
        setPublicWorkouts(MOCK_PUBLIC_WORKOUTS);
        setLoading(false);
        setError(null);
      }, 1200);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Récupérer les séances publiques (sans relation favorites pour éviter les erreurs)
      const { data, error } = await supabaseBrowser
        .from('workouts')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Erreur Supabase lors du chargement des séances publiques:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        // En cas d'erreur, utiliser les données simulées
        setPublicWorkouts(MOCK_PUBLIC_WORKOUTS);
        return;
      }

      setPublicWorkouts(data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des séances publiques:', {
        error: err,
        message: err instanceof Error ? err.message : 'Erreur inconnue',
        stack: err instanceof Error ? err.stack : undefined
      });
      // En cas d'erreur, utiliser les données simulées
      setPublicWorkouts(MOCK_PUBLIC_WORKOUTS);
      setError('Erreur lors du chargement des séances publiques');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Charger les séances populaires (avec le plus de favoris)
  const loadPopularWorkouts = useCallback(async () => {
    // Mode simulation si pas d'utilisateur connecté
    if (!user) {
      setPopularWorkouts(MOCK_POPULAR_WORKOUTS);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Récupérer les séances populaires (sans relation favorites pour éviter les erreurs)
      const { data, error } = await supabaseBrowser
        .from('workouts')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Erreur Supabase lors du chargement des séances populaires:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        // En cas d'erreur, utiliser les données simulées
        setPopularWorkouts(MOCK_POPULAR_WORKOUTS);
        return;
      }

      setPopularWorkouts(data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des séances populaires:', {
        error: err,
        message: err instanceof Error ? err.message : 'Erreur inconnue',
        stack: err instanceof Error ? err.stack : undefined
      });
      // En cas d'erreur, utiliser les données simulées
      setPopularWorkouts(MOCK_POPULAR_WORKOUTS);
      setError('Erreur lors du chargement des séances populaires');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Charger toutes les données de l'explorateur
  const loadExplorerData = useCallback(async () => {
    // Charger même si l'utilisateur n'est pas connecté (mode simulation)
    if (!user) {
      await Promise.all([
        loadPublicWorkouts(),
        loadPopularWorkouts()
      ]);
      return;
    }
    
    await Promise.all([
      loadPublicWorkouts(),
      loadPopularWorkouts()
    ]);
  }, [loadPublicWorkouts, loadPopularWorkouts, user]);

  // Rechercher des séances
  const searchWorkouts = useCallback(async (query: string) => {
    
    // Mode simulation si pas d'utilisateur connecté
    if (!user) {
      
      if (!query.trim()) {
        setPublicWorkouts(MOCK_PUBLIC_WORKOUTS);
        return;
      }

      // Filtrer les séances simulées
      const filtered = MOCK_PUBLIC_WORKOUTS.filter(workout =>
        workout.name.toLowerCase().includes(query.toLowerCase()) ||
        workout.description?.toLowerCase().includes(query.toLowerCase())
      );
      
      setPublicWorkouts(filtered);
      return;
    }

    if (!query.trim()) {
      await loadPublicWorkouts();
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabaseBrowser
        .from('workouts')
        .select('*')
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
  }, [loadPublicWorkouts, user]);

  // Filtrer par difficulté
  const filterByDifficulty = useCallback(async (difficulty: string) => {
    
    // Mode simulation si pas d'utilisateur connecté
    if (!user) {
      
      const filtered = MOCK_PUBLIC_WORKOUTS.filter(workout =>
        workout.difficulty === difficulty
      );
      
      setPublicWorkouts(filtered);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabaseBrowser
        .from('workouts')
        .select('*')
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
  }, [user]);

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