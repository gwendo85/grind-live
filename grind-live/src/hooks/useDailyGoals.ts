import { useState, useEffect } from 'react';

export interface DailyGoal {
  id: string;
  title: string;
  completed: boolean;
  type: 'workout' | 'steps' | 'water';
  target: number;
  current: number;
}

// Données simulées pour les tests
const MOCK_GOALS: DailyGoal[] = [
  {
    id: '1',
    title: 'Faire une séance de musculation',
    completed: true,
    type: 'workout',
    target: 1,
    current: 1
  },
  {
    id: '2',
    title: 'Marcher 10 000 pas',
    completed: false,
    type: 'steps',
    target: 10000,
    current: 6500
  },
  {
    id: '3',
    title: 'Boire 2L d\'eau',
    completed: false,
    type: 'water',
    target: 2000,
    current: 1200
  },
  {
    id: '4',
    title: 'Faire du cardio',
    completed: false,
    type: 'workout',
    target: 1,
    current: 0
  }
];

export function useDailyGoals() {
  const [goals, setGoals] = useState<DailyGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const fetchGoals = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/daily-goals');
        
        // Si la réponse n'est pas ok (401, 500, etc.), passer en mode simulation
        if (!response.ok) {
          setIsSimulationMode(true);
          setGoals(MOCK_GOALS);
          setLoading(false);
          return;
        }
        
        let data;
        try {
          data = await response.json();
        } catch (e) {
          setIsSimulationMode(true);
          setGoals(MOCK_GOALS);
          setLoading(false);
          return;
        }
        setGoals(data);
        setIsSimulationMode(false);
      } catch (err) {
        console.error('❌ Erreur useDailyGoals:', err);
        setIsSimulationMode(true);
        setGoals(MOCK_GOALS);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };
    
    // Attendre un peu pour s'assurer que l'hydratation est terminée
    const timer = setTimeout(() => {
      fetchGoals();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Si on n'est pas encore côté client, retourner les données simulées
  if (!isClient) {
    return {
      goals: MOCK_GOALS,
      loading: false,
      error: null,
      updateGoal: () => {},
      refreshGoals: () => {},
      isSimulationMode: true
    };
  }

  // Mettre à jour un objectif
  const updateGoal = async (goalId: string, completed: boolean, current?: number) => {
    if (isSimulationMode) {
      setGoals(prev => prev.map(goal => 
        goal.id === goalId 
          ? { ...goal, completed, current: current ?? goal.current }
          : goal
      ));
      return;
    }
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
        setIsSimulationMode(true);
        setGoals(MOCK_GOALS);
        return;
      }
      setGoals(prev => prev.map(goal => 
        goal.id === goalId 
          ? { ...goal, completed, current: current ?? goal.current }
          : goal
      ));
      console.log('✅ Objectif mis à jour:', goalId);
    } catch (err) {
      console.error('❌ Erreur updateGoal:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  };

  // Rafraîchir les objectifs
  const refreshGoals = async () => {
    if (isSimulationMode) {
      setGoals(MOCK_GOALS);
      return;
    }
    try {
      setLoading(true);
      const response = await fetch('/api/daily-goals');
      if (!response.ok) {
        setIsSimulationMode(true);
        setGoals(MOCK_GOALS);
        setLoading(false);
        return;
      }
      let data;
      try {
        data = await response.json();
      } catch (e) {
        setIsSimulationMode(true);
        setGoals(MOCK_GOALS);
        setLoading(false);
        return;
      }
      setGoals(data);
    } catch (err) {
      console.error('❌ Erreur refreshGoals:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return { 
    goals, 
    loading, 
    error, 
    updateGoal, 
    refreshGoals, 
    isSimulationMode 
  };
} 