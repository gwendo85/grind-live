import { useState, useEffect } from 'react';

export interface DailyGoal {
  id: string;
  title: string;
  completed: boolean;
  type: 'workout' | 'steps' | 'water';
  target: number;
  current: number;
}

export function useDailyGoals() {
  const [goals, setGoals] = useState<DailyGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/daily-goals');
        
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setGoals(data);
      } catch (err) {
        console.error('Erreur useDailyGoals:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  // Mettre à jour un objectif
  const updateGoal = async (goalId: string, completed: boolean, current?: number) => {
    try {
      const response = await fetch('/api/daily-goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goalId,
          completed,
          current,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      // Mettre à jour l'état local
      setGoals(prev => prev.map(goal => 
        goal.id === goalId 
          ? { ...goal, completed, current: current ?? goal.current }
          : goal
      ));

      console.log('Objectif mis à jour:', goalId);
    } catch (err) {
      console.error('Erreur updateGoal:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  };

  // Rafraîchir les objectifs
  const refreshGoals = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/daily-goals');
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setGoals(data);
    } catch (err) {
      console.error('Erreur refreshGoals:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return { goals, loading, error, updateGoal, refreshGoals };
} 