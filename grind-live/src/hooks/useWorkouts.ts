import { useState, useEffect, useCallback } from 'react';
import { supabaseBrowser } from '@/lib/supabaseClient';
import { useUser } from './useUser';
import type { Workout, WorkoutInsert, ExerciseLogInsert } from '@/lib/types';

export function useWorkouts() {
  const { user } = useUser();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les séances de l'utilisateur
  const loadWorkouts = useCallback(async () => {
    if (!user) {
      setWorkouts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabaseBrowser
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors du chargement des séances:', error);
        setError(error.message);
        return;
      }

      setWorkouts(data || []);
    } catch (err) {
      console.error('Erreur inattendue:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Créer une nouvelle séance
  const createWorkout = async (workoutData: WorkoutInsert) => {
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }

    try {
      setError(null);

      // Ajouter l'ID de l'utilisateur
      const workoutWithUser = {
        ...workoutData,
        user_id: user.id,
      };

      const { data, error } = await supabaseBrowser
        .from('workouts')
        .insert(workoutWithUser)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la création de la séance:', error);
        throw new Error(error.message);
      }

      // Ajouter la nouvelle séance à la liste
      setWorkouts(prev => [data, ...prev]);

      return data;
    } catch (err) {
      console.error('Erreur lors de la création:', err);
      throw err;
    }
  };

  // Mettre à jour une séance
  const updateWorkout = async (id: string, updates: Partial<Workout>) => {
    try {
      setError(null);

      const { data, error } = await supabaseBrowser
        .from('workouts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la mise à jour:', error);
        throw new Error(error.message);
      }

      // Mettre à jour la séance dans la liste
      setWorkouts(prev => 
        prev.map(workout => 
          workout.id === id ? data : workout
        )
      );

      return data;
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      throw err;
    }
  };

  // Supprimer une séance
  const deleteWorkout = async (id: string) => {
    try {
      setError(null);

      const { error } = await supabaseBrowser
        .from('workouts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erreur lors de la suppression:', error);
        throw new Error(error.message);
      }

      // Retirer la séance de la liste
      setWorkouts(prev => prev.filter(workout => workout.id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      throw err;
    }
  };

  // Démarrer une séance (passer en mode live)
  const startWorkout = async (id: string) => {
    return updateWorkout(id, {
      status: 'live',
      is_live: true,
    });
  };

  // Terminer une séance
  const finishWorkout = async (id: string) => {
    return updateWorkout(id, {
      status: 'completed',
      is_live: false,
    });
  };

  // Ajouter un log d'exercice
  const addExerciseLog = async (logData: ExerciseLogInsert) => {
    try {
      setError(null);

      const { data, error } = await supabaseBrowser
        .from('exercise_logs')
        .insert(logData)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de l\'ajout du log:', error);
        throw new Error(error.message);
      }

      return data;
    } catch (err) {
      console.error('Erreur lors de l\'ajout du log:', err);
      throw err;
    }
  };

  // Charger les séances au montage et quand l'utilisateur change
  useEffect(() => {
    if (user) {
      loadWorkouts();
    }
  }, [user, loadWorkouts]);

  return {
    workouts,
    loading,
    error,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    startWorkout,
    finishWorkout,
    addExerciseLog,
    refresh: loadWorkouts,
  };
} 