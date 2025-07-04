import { useState, useEffect } from 'react';

export interface Progression {
  sessionsDone: number;
  sessionsGoal: number;
  sessionsPercent: number;
  volumeDone: number;
  volumeGoal: number;
  volumePercent: number;
  timeDone: number; // en heures
  timeGoal: number; // en heures
  timePercent: number;
}

const mockProgression: Progression = {
  sessionsDone: 16,
  sessionsGoal: 20,
  sessionsPercent: 80,
  volumeDone: 8500,
  volumeGoal: 10000,
  volumePercent: 85,
  timeDone: 24,
  timeGoal: 30,
  timePercent: 80,
};

export function useProgression() {
  const [progression, setProgression] = useState<Progression | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgression = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simuler un chargement (remplacer par Supabase ensuite)
        await new Promise(resolve => setTimeout(resolve, 400));
        
        // Simuler une erreur aléatoire pour tester (à supprimer en prod)
        if (Math.random() < 0.05) {
          throw new Error('Erreur de chargement progression');
        }
        
        setProgression(mockProgression);
      } catch (err) {
        console.error('Erreur useProgression:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchProgression();
  }, []);

  // Pour mettre à jour la progression (ex: après une séance)
  const updateProgression = (newData: Partial<Progression>) => {
    try {
      setProgression((prev) => prev ? { ...prev, ...newData } : mockProgression);
      console.log('Progression updated:', newData);
    } catch (err) {
      console.error('Erreur updateProgression:', err);
    }
  };

  return { progression, loading, error, updateProgression };
} 