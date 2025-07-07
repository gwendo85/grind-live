import { useState, useEffect, useCallback } from 'react';
import { useUser } from './useUser';
import { supabaseBrowser } from '@/lib/supabaseClient';
import { Workout, WorkoutInsert, ExerciseLogInsert } from '@/lib/types';

interface ExerciseData {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  rest?: number;
  notes?: string;
}

interface WorkoutWithExercises {
  name: string;
  notes?: string;
  exercises: ExerciseData[];
}

// Données simulées pour les tests
const MOCK_WORKOUTS: Workout[] = [
  {
    id: '1',
    name: 'Séance Push',
    notes: 'Développé couché, pompes, dips',
    user_id: 'mock-user',
    status: 'completed',
    is_live: false,
    date: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    estimated_duration: 60,
    exercise_count: 6,
    is_public: false
  },
  {
    id: '2',
    name: 'Séance Pull',
    notes: 'Tractions, rowing, curl',
    user_id: 'mock-user',
    status: 'draft',
    is_live: false,
    date: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    estimated_duration: 45,
    exercise_count: 4,
    is_public: false
  }
];

export function useWorkouts() {
  const { user } = useUser();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSimulationMode, setIsSimulationMode] = useState(false);

  useEffect(() => {
    console.log('🔍 useWorkouts: useEffect déclenché');
    
    const loadWorkouts = async () => {
      console.log('🔍 useWorkouts: loadWorkouts démarré');
      
      // Mode simulation si pas d'utilisateur connecté
      if (!user) {
        console.log('🔍 useWorkouts: Pas d\'utilisateur, mode simulation activé');
        setIsSimulationMode(true);
        setWorkouts(MOCK_WORKOUTS);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 useWorkouts: Chargement des séances pour l\'utilisateur:', user.id);
        
        const { data, error: fetchError } = await supabaseBrowser
          .from('workouts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) {
          console.error('🔍 useWorkouts: Erreur lors du chargement:', fetchError);
          setError(fetchError.message);
          setIsSimulationMode(true);
          setWorkouts(MOCK_WORKOUTS);
        } else {
          console.log('🔍 useWorkouts: Séances chargées avec succès:', data?.length || 0);
          setWorkouts(data || []);
        }
      } catch (error) {
        console.error('🔍 useWorkouts: Erreur réseau:', error);
        setError('Erreur de connexion');
        setIsSimulationMode(true);
        setWorkouts(MOCK_WORKOUTS);
      } finally {
        setLoading(false);
      }
    };

    // Exécuter seulement côté client
    if (typeof window !== 'undefined') {
      loadWorkouts();
    } else {
      // Côté serveur, passer directement en mode simulation
      console.log('🔍 useWorkouts: Côté serveur - Mode simulation activé');
      setIsSimulationMode(true);
      setWorkouts(MOCK_WORKOUTS);
      setLoading(false);
    }
  }, [user]);

  // Écouter les changements en temps réel (seulement si utilisateur connecté)
  useEffect(() => {
    if (!user) {
      // En mode simulation, pas d'écoute temps réel
      return;
    }

    console.log('🔍 Configuration de l\'écoute en temps réel pour les séances');

    // Écouter les insertions
    const insertSubscription = supabaseBrowser
      .channel('workouts-inserts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'workouts',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('🔍 Nouvelle séance détectée:', payload.new);
          setWorkouts(prev => [payload.new as Workout, ...prev]);
        }
      )
      .subscribe();

    // Écouter les mises à jour
    const updateSubscription = supabaseBrowser
      .channel('workouts-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'workouts',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('🔍 Séance mise à jour:', payload.new);
          setWorkouts(prev => 
            prev.map(workout => 
              workout.id === payload.new.id ? payload.new as Workout : workout
            )
          );
        }
      )
      .subscribe();

    // Écouter les suppressions
    const deleteSubscription = supabaseBrowser
      .channel('workouts-deletes')
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'workouts',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('🔍 Séance supprimée:', payload.old);
          setWorkouts(prev => 
            prev.filter(workout => workout.id !== payload.old.id)
          );
        }
      )
      .subscribe();

    // Nettoyer les abonnements
    return () => {
      console.log('🔍 Nettoyage des abonnements temps réel');
      insertSubscription.unsubscribe();
      updateSubscription.unsubscribe();
      deleteSubscription.unsubscribe();
    };
  }, [user]);

  // Si on n'est pas encore côté client, retourner des valeurs par défaut
  const refresh = useCallback(() => {
    if (typeof window !== 'undefined') {
      // Recharger les données
      console.log('🔍 useWorkouts: Rafraîchissement manuel');
      // Re-déclencher le useEffect en forçant un re-render
      setWorkouts([]);
      setLoading(true);
    }
  }, []);

  // Créer une nouvelle séance avec exercices
  const createWorkout = useCallback(async (workoutData: WorkoutWithExercises) => {
    console.log('🔍 createWorkout appelé avec:', workoutData);
    
    // Mode simulation si pas d'utilisateur connecté
    if (!user) {
      console.log('🔍 Mode simulation : création de séance mock');
      
      const newWorkout: Workout = {
        id: Date.now().toString(),
        name: workoutData.name,
        notes: workoutData.notes || '',
        user_id: 'mock-user',
        status: 'draft',
        is_live: false,
        date: workoutData.date || new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        estimated_duration: parseInt(workoutData.duration || '60'),
        exercise_count: workoutData.exercises.length,
        is_public: false
      };

      // Simuler un délai
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setWorkouts(prev => [newWorkout, ...prev]);
      return newWorkout;
    }

    console.log('🔍 Utilisateur:', user);
    
    try {
      setError(null);

      // Créer la séance
      const workoutWithUser = {
        name: workoutData.name,
        notes: workoutData.notes || '',
        user_id: user.id,
        status: 'draft',
        is_live: false,
        date: workoutData.date || new Date().toISOString().split('T')[0],
      };

      console.log('🔍 Données de séance à insérer:', workoutWithUser);

      const { data: workout, error: workoutError } = await supabaseBrowser
        .from('workouts')
        .insert(workoutWithUser)
        .select()
        .single();

      console.log('🔍 Résultat création séance:', { workout, workoutError });

      if (workoutError) {
        console.error('Erreur lors de la création de la séance:', workoutError);
        throw new Error(workoutError.message);
      }

      // Créer les exercices pour cette séance
      if (workoutData.exercises.length > 0) {
        // Créer d'abord les exercices dans la table exercises
        const exercisesToCreate = workoutData.exercises.map(exercise => ({
          name: exercise.name,
          category: 'strength',
          description: exercise.notes || '',
          muscle_groups: [],
          equipment: [],
          user_id: user.id,
        }));

        const { data: createdExercises, error: exercisesError } = await supabaseBrowser
          .from('exercises')
          .insert(exercisesToCreate)
          .select();

        if (exercisesError) {
          console.error('Erreur lors de la création des exercices:', exercisesError);
          await supabaseBrowser.from('workouts').delete().eq('id', workout.id);
          throw new Error(exercisesError.message);
        }

        // Créer les logs d'exercices dans exercise_logs
        const exerciseLogsToCreate = workoutData.exercises.map((exercise, index) => ({
          workout_id: workout.id,
          exercise_id: createdExercises[index].id,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight || null,
          rest_time: exercise.rest || null,
          notes: exercise.notes || '',
          user_id: user.id,
        }));

        const { error: logsError } = await supabaseBrowser
          .from('exercise_logs')
          .insert(exerciseLogsToCreate);

        if (logsError) {
          console.error('Erreur lors de la création des logs d\'exercices:', logsError);
          await supabaseBrowser.from('workouts').delete().eq('id', workout.id);
          await supabaseBrowser.from('exercises').delete().in('id', createdExercises.map(ex => ex.id));
          throw new Error(logsError.message);
        }
      }

      console.log('🔍 Séance créée avec succès:', workout);
      return workout;
    } catch (error) {
      console.error('Erreur lors de la création de la séance:', error);
      throw error;
    }
  }, [user, setWorkouts]);

  const createSimpleWorkout = async (workoutData: WorkoutInsert) => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabaseBrowser
        .from('workouts')
        .insert({ ...workoutData, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la création de la séance:', error);
      throw error;
    }
  };

  const updateWorkout = async (id: string, updates: Partial<Workout>) => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabaseBrowser
        .from('workouts')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la séance:', error);
      throw error;
    }
  };

  const deleteWorkout = async (id: string) => {
    if (!user) return false;
    
    try {
      const { error } = await supabaseBrowser
        .from('workouts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de la séance:', error);
      throw error;
    }
  };

  const startWorkout = async (id: string) => {
    return updateWorkout(id, { status: 'in_progress', is_live: true });
  };

  const finishWorkout = async (id: string) => {
    return updateWorkout(id, { status: 'completed', is_live: false });
  };

  const addExerciseLog = async (logData: ExerciseLogInsert) => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabaseBrowser
        .from('exercise_logs')
        .insert({ ...logData, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout du log d\'exercice:', error);
      throw error;
    }
  };

  return {
    workouts,
    loading,
    error,
    createWorkout,
    createSimpleWorkout,
    updateWorkout,
    deleteWorkout,
    startWorkout,
    finishWorkout,
    addExerciseLog,
    refresh,
    isSimulationMode
  };
} 