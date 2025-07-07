import { useState, useEffect } from 'react';

export interface FeedItem {
  id: string;
  type: 'workout' | 'achievement' | 'challenge';
  title: string;
  description: string;
  timestamp: string;
  user: {
    name: string;
    avatar?: string;
  };
  data?: Record<string, unknown>;
}

// Données simulées pour les tests
const MOCK_FEED: FeedItem[] = [
  {
    id: '1',
    type: 'workout',
    title: 'Séance Push terminée',
    description: 'Alex a terminé sa séance Push avec 8 exercices',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h ago
    user: { name: 'Alex' },
    data: { exercises: 8, duration: '45min' }
  },
  {
    id: '2',
    type: 'achievement',
    title: 'Nouveau record !',
    description: 'Sarah a battu son record sur le développé couché',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4h ago
    user: { name: 'Sarah' },
    data: { exercise: 'Développé couché', weight: '80kg' }
  },
  {
    id: '3',
    type: 'challenge',
    title: 'Challenge 30 jours',
    description: 'Marc a rejoint le challenge "30 jours de fitness"',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6h ago
    user: { name: 'Marc' },
    data: { challenge: '30 jours de fitness', day: 1 }
  },
  {
    id: '4',
    type: 'workout',
    title: 'Séance Pull réussie',
    description: 'Emma a terminé sa séance Pull avec 6 exercices',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8h ago
    user: { name: 'Emma' },
    data: { exercises: 6, duration: '40min' }
  }
];

export function useFeed() {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const fetchFeed = async () => {
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/feed');
        
        // Si la réponse n'est pas ok (401, 500, etc.), passer en mode simulation
        if (!response.ok) {
          setIsSimulationMode(true);
          setFeed(MOCK_FEED);
          setLoading(false);
          return;
        }
        
        let data;
        try {
          data = await response.json();
        } catch (e) {
          setIsSimulationMode(true);
          setFeed(MOCK_FEED);
          setLoading(false);
          return;
        }
        
        setFeed(data);
        setLoading(false);
        
      } catch (error) {
        setIsSimulationMode(true);
        setFeed(MOCK_FEED);
        setLoading(false);
      }
    };

    // Exécuter seulement côté client
    if (typeof window !== 'undefined') {
      fetchFeed();
    } else {
      // Côté serveur, passer directement en mode simulation
      setIsSimulationMode(true);
      setFeed(MOCK_FEED);
      setLoading(false);
    }
  }, []);

  return {
    feed,
    loading,
    error,
    isSimulationMode,
    isClient
  };
}
