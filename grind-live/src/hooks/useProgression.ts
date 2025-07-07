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

// Données simulées pour les tests
const MOCK_PROGRESSION: Progression = {
  sessionsDone: 3,
  sessionsGoal: 5,
  sessionsPercent: 60,
  volumeDone: 6500,
  volumeGoal: 10000,
  volumePercent: 65,
  timeDone: 4.5,
  timeGoal: 8,
  timePercent: 56
};

export function useProgression() {
  const [progression, setProgression] = useState<Progression | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const fetchProgression = async () => {
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/progression');
        
        // Si la réponse n'est pas ok (401, 500, etc.), passer en mode simulation
        if (!response.ok) {
          setIsSimulationMode(true);
          setProgression(MOCK_PROGRESSION);
          setLoading(false);
          return;
        }
        
        let data;
        try {
          data = await response.json();
        } catch (e) {
          setIsSimulationMode(true);
          setProgression(MOCK_PROGRESSION);
          setLoading(false);
          return;
        }
        
        setProgression(data);
        setLoading(false);
        
      } catch (error) {
        setIsSimulationMode(true);
        setProgression(MOCK_PROGRESSION);
        setLoading(false);
      }
    };

    // Exécuter seulement côté client
    if (typeof window !== 'undefined') {
      fetchProgression();
    } else {
      // Côté serveur, passer directement en mode simulation
      setIsSimulationMode(true);
      setProgression(MOCK_PROGRESSION);
      setLoading(false);
    }
  }, []);

  return {
    progression,
    loading,
    error,
    isSimulationMode,
    isClient
  };
}
