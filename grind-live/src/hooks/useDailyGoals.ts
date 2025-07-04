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
    console.log('🔍 useDailyGoals: useEffect déclenché');
    setIsClient(true);
    
    const fetchGoals = async () => {
      console.log('🔍 useDailyGoals: fetchGoals démarré');
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 useDailyGoals: Appel de /api/daily-goals');
        const response = await fetch('/api/daily-goals');
        console.log('🔍 useDailyGoals: Réponse reçue', { status: response.status, ok: response.ok });
        
        // Si la réponse n'est pas ok (401, 500, etc.), passer en mode simulation
        if (!response.ok) {
          console.log('🔍 useDailyGoals: Erreur HTTP', response.status, '- Mode simulation activé');
          setIsSimulationMode(true);
          setGoals(MOCK_GOALS);
          setLoading(false);
          return;
        }
        
        let data;
        try {
          data = await response.json();
          console.log('🔍 useDailyGoals: Données JSON parsées:', data);
        } catch (e) {
          console.log('🔍 useDailyGoals: Réponse non-JSON, mode simulation activé');
          setIsSimulationMode(true);
          setGoals(MOCK_GOALS);
          setLoading(false);
          return;
        }
        setGoals(data);
        setIsSimulationMode(false);
        console.log('🔍 useDailyGoals: Données réelles définies');
      } catch (err) {
        console.error('❌ Erreur useDailyGoals:', err);
        setIsSimulationMode(true);
        setGoals(MOCK_GOALS);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
        console.log('🔍 useDailyGoals: Loading terminé');
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
      console.log('🔍 useDailyGoals: Mise à jour simulée', { goalId, completed, current });
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
        console.log('🔍 useDailyGoals: Erreur HTTP lors de la mise à jour, mode simulation activé');
        setIsSimulationMode(true);
        setGoals(MOCK_GOALS);
        return;
      }
      let data;
      try {
        data = await response.json();
      } catch (e) {
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
      console.log('🔍 useDailyGoals: Rafraîchissement simulé');
      setGoals(MOCK_GOALS);
      return;
    }
    try {
      setLoading(true);
      const response = await fetch('/api/daily-goals');
      if (!response.ok) {
        console.log('🔍 useDailyGoals: Erreur HTTP lors du rafraîchissement, mode simulation activé');
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