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
    console.log('🔍 useProgression: useEffect déclenché');
    setIsClient(true);
    
    const fetchProgression = async () => {
      console.log('🔍 useProgression: fetchProgression démarré');
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/progression');
        
        // Si la réponse n'est pas ok (401, 500, etc.), passer en mode simulation
        if (!response.ok) {
          console.log('🔍 useProgression: Erreur HTTP', response.status, '- Mode simulation activé');
          setIsSimulationMode(true);
          setProgression(MOCK_PROGRESSION);
          setLoading(false);
          return;
        }
        
        let data;
        try {
          data = await response.json();
        } catch (e) {
          console.log('🔍 useProgression: Erreur parsing JSON - Mode simulation activé');
          setIsSimulationMode(true);
          setProgression(MOCK_PROGRESSION);
          setLoading(false);
          return;
        }
        
        console.log('🔍 useProgression: Données récupérées avec succès');
        setProgression(data);
        setLoading(false);
        
      } catch (error) {
        console.log('🔍 useProgression: Erreur réseau - Mode simulation activé');
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
      console.log('🔍 useProgression: Côté serveur - Mode simulation activé');
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
