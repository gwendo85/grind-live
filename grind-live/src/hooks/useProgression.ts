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

export function useProgression() {
  const [progression, setProgression] = useState<Progression | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgression = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/progression');
        
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setProgression(data);
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
  const updateProgression = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/progression');
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setProgression(data);
      console.log('Progression mise à jour:', data);
    } catch (err) {
      console.error('Erreur updateProgression:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return { progression, loading, error, updateProgression };
} 