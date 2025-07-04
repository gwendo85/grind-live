import { useState, useEffect } from 'react';

export interface Workout {
  id: string;
  name: string;
  created_at: string;
}

const mockWorkouts: Workout[] = [
  { id: '1', name: 'Push Day', created_at: '2024-07-01' },
  { id: '2', name: 'Legs', created_at: '2024-07-02' },
];

export function useWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simuler un chargement (remplacer par Supabase ensuite)
        await new Promise(resolve => setTimeout(resolve, 400));
        
        // Simuler une erreur aléatoire pour tester (à supprimer en prod)
        if (Math.random() < 0.05) {
          throw new Error('Erreur de chargement séances');
        }
        
        setWorkouts(mockWorkouts);
      } catch (err) {
        console.error('Erreur useWorkouts:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  // Ajouter une séance
  const addWorkout = (name: string) => {
    try {
      const newWorkout: Workout = {
        id: Date.now().toString(),
        name,
        created_at: new Date().toISOString().slice(0, 10),
      };
      setWorkouts((prev) => [newWorkout, ...prev]);
      console.log('Workout added:', name);
    } catch (err) {
      console.error('Erreur addWorkout:', err);
    }
  };

  // Supprimer une séance
  const removeWorkout = (id: string) => {
    try {
      setWorkouts((prev) => prev.filter((w) => w.id !== id));
      console.log('Workout removed:', id);
    } catch (err) {
      console.error('Erreur removeWorkout:', err);
    }
  };

  return { workouts, loading, error, addWorkout, removeWorkout };
} 