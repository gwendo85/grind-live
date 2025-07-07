import { useState, useEffect } from 'react';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  progress: number;
  completed: boolean;
  type: 'workout_count' | 'volume' | 'streak';
  period: 'week' | 'month' | 'year';
  startDate: string;
  endDate: string;
}

// Données simulées pour les tests
const MOCK_CHALLENGES: Challenge[] = [
  {
    id: '1',
    title: 'Défi de la semaine',
    description: 'Faire 5 séances cette semaine',
    current: 3,
    target: 5,
    progress: 60,
    completed: false,
    type: 'workout_count',
    period: 'week',
    startDate: '2024-01-01',
    endDate: '2024-01-07'
  },
  {
    id: '2',
    title: 'Volume mensuel',
    description: 'Atteindre 50 000kg de volume',
    current: 32000,
    target: 50000,
    progress: 64,
    completed: false,
    type: 'volume',
    period: 'month',
    startDate: '2024-01-01',
    endDate: '2024-01-31'
  },
  {
    id: '3',
    title: 'Série continue',
    description: '7 jours consécutifs d\'entraînement',
    current: 4,
    target: 7,
    progress: 57,
    completed: false,
    type: 'streak',
    period: 'week',
    startDate: '2024-01-01',
    endDate: '2024-01-07'
  }
];

export function useChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/challenges');
        
        // Si la réponse n'est pas ok (401, 500, etc.), passer en mode simulation
        if (!response.ok) {
          setIsSimulationMode(true);
          setChallenges(MOCK_CHALLENGES);
          setLoading(false);
          return;
        }
        
        let data;
        try {
          data = await response.json();
        } catch (e) {
          setIsSimulationMode(true);
          setChallenges(MOCK_CHALLENGES);
          setLoading(false);
          return;
        }
        setChallenges(data);
        setIsSimulationMode(false);
      } catch (err) {
        console.error('❌ Erreur useChallenges:', err);
        setIsSimulationMode(true);
        setChallenges(MOCK_CHALLENGES);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };
    
    // Attendre un peu pour s'assurer que l'hydratation est terminée
    const timer = setTimeout(() => {
      fetchChallenges();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Si on n'est pas encore côté client, retourner les données simulées
  if (!isClient) {
    return {
      challenges: MOCK_CHALLENGES,
      loading: false,
      error: null,
      getMainChallenge: () => MOCK_CHALLENGES[0],
      isSimulationMode: true
    };
  }

  // Rafraîchir les challenges
  const refreshChallenges = async () => {
    if (isSimulationMode) {
      setChallenges(MOCK_CHALLENGES);
      return;
    }
    try {
      setLoading(true);
      const response = await fetch('/api/challenges');
      if (!response.ok) {
        setIsSimulationMode(true);
        setChallenges(MOCK_CHALLENGES);
        setLoading(false);
        return;
      }
      let data;
      try {
        data = await response.json();
      } catch (e) {
        setIsSimulationMode(true);
        setChallenges(MOCK_CHALLENGES);
        setLoading(false);
        return;
      }
      setChallenges(data);
    } catch (err) {
      console.error('❌ Erreur refreshChallenges:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  // Obtenir le challenge principal (le plus important)
  const getMainChallenge = () => {
    return challenges.find(challenge => challenge.period === 'week') || challenges[0];
  };

  return { 
    challenges, 
    loading, 
    error, 
    refreshChallenges, 
    getMainChallenge,
    isSimulationMode
  };
} 