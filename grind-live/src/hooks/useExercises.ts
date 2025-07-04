import { useState, useEffect, useCallback } from 'react';
import { supabaseBrowser } from '@/lib/supabaseClient';
import type { Exercise } from '@/lib/types';

// Cache global pour les exercices
let exercisesCache: Exercise[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // Récupérer l'utilisateur actuel
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      setUser(user);
    };
    
    getUser();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadExercises = useCallback(async (forceRefresh = false) => {
    // Vérifier le cache
    const now = Date.now();
    if (!forceRefresh && exercisesCache && (now - cacheTimestamp) < CACHE_DURATION) {
      setExercises(exercisesCache);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Chargement des exercices depuis Supabase...');
      
      // Charger les exercices globaux (user_id IS NULL)
      const { data: globalData, error: globalError } = await supabaseBrowser
        .from('exercises')
        .select('*')
        .is('user_id', null)
        .order('name');

      if (globalError) {
        console.error('❌ Erreur lors du chargement des exercices globaux:', globalError);
        setError(globalError.message);
        return;
      }

      // Charger les exercices personnalisés de l'utilisateur (si connecté)
      let customData: Exercise[] = [];
      if (user?.id) {
        const { data: userData, error: customError } = await supabaseBrowser
          .from('exercises')
          .select('*')
          .eq('user_id', user.id)
          .order('name');

        if (customError) {
          console.error('❌ Erreur lors du chargement des exercices personnalisés:', customError);
          setError(customError.message);
          return;
        }

        customData = userData || [];
      }

      // Combiner les exercices globaux et personnalisés
      const exercisesData = [...(globalData || []), ...customData];
      
      console.log(`✅ ${globalData?.length || 0} exercices globaux + ${customData.length} exercices personnalisés chargés`);

      // Mettre à jour le cache
      exercisesCache = exercisesData;
      cacheTimestamp = now;

      setExercises(exercisesData);
    } catch (err) {
      console.error('❌ Erreur inattendue:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const refreshExercises = useCallback(() => {
    return loadExercises(true);
  }, [loadExercises]);

  // Charger les exercices au montage et quand l'utilisateur change
  useEffect(() => {
    loadExercises();
  }, [loadExercises]);

  const createCustomExercise = useCallback(async (exerciseData: Omit<Exercise, 'id' | 'created_at'>) => {
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }

    try {
      setError(null);

      const { data, error: supabaseError } = await supabaseBrowser
        .from('exercises')
        .insert({
          ...exerciseData,
          user_id: user.id,
          is_custom: true,
        })
        .select()
        .single();

      if (supabaseError) {
        console.error('❌ Erreur lors de la création:', supabaseError);
        throw new Error(supabaseError.message);
      }

      console.log('✅ Exercice personnalisé créé:', data);

      // Mettre à jour le cache et l'état
      if (exercisesCache) {
        exercisesCache = [...exercisesCache, data];
      }
      setExercises(prev => [...prev, data]);

      return data;
    } catch (err) {
      console.error('❌ Erreur lors de la création:', err);
      throw err;
    }
  }, [user]);

  return {
    exercises,
    loading,
    error,
    refresh: refreshExercises,
    loadExercises,
    createCustomExercise,
  };
} 