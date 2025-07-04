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

export function useChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/challenges');
        
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setChallenges(data);
      } catch (err) {
        console.error('Erreur useChallenges:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  // Rafraîchir les challenges
  const refreshChallenges = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/challenges');
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setChallenges(data);
    } catch (err) {
      console.error('Erreur refreshChallenges:', err);
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
    getMainChallenge 
  };
} 