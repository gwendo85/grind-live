import { useState, useEffect } from 'react';

export interface FeedPost {
  id: string;
  user: string;
  avatar: string;
  badge?: string;
  badgeIcon?: React.ReactNode;
  time: string;
  title: string;
  emoji?: string;
  duration: string;
  details: string;
  likes: number;
  comments: number;
  shares: number;
}

const mockFeed: FeedPost[] = [
  {
    id: '1',
    user: 'Alex_Muscle',
    avatar: 'A',
    badge: 'Nouveau PR !',
    time: 'Il y a 2h',
    title: 'Push Day',
    emoji: '💪',
    duration: '1h 30m',
    details: 'Développé couché · Dips · Épaules · Triceps',
    likes: 24,
    comments: 5,
    shares: 0,
  },
  {
    id: '2',
    user: 'Sophie_Fit',
    avatar: 'S',
    time: 'Il y a 4h',
    title: 'Leg Day',
    emoji: '🔥',
    duration: '1h 15m',
    details: 'Squat · Soulevé de terre · Fentes · Mollets',
    likes: 18,
    comments: 3,
    shares: 0,
  },
];

export function useFeed() {
  const [feed, setFeed] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simuler un chargement (remplacer par Supabase ensuite)
        await new Promise(resolve => setTimeout(resolve, 400));
        
        // Simuler une erreur aléatoire pour tester (à supprimer en prod)
        if (Math.random() < 0.05) {
          throw new Error('Erreur de chargement feed');
        }
        
        setFeed(mockFeed);
      } catch (err) {
        console.error('Erreur useFeed:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  // Like/unlike un post
  const toggleLike = (id: string) => {
    try {
      setFeed((prev) =>
        prev.map((post) =>
          post.id === id
            ? { ...post, likes: post.likes + 1 } // Pour l'exemple, incrémente toujours
            : post
        )
      );
      console.log('Post liked:', id);
    } catch (err) {
      console.error('Erreur toggleLike:', err);
    }
  };

  // Ajouter un commentaire (exemple simplifié)
  const addComment = (id: string) => {
    try {
      setFeed((prev) =>
        prev.map((post) =>
          post.id === id
            ? { ...post, comments: post.comments + 1 }
            : post
        )
      );
      console.log('Comment added to post:', id);
    } catch (err) {
      console.error('Erreur addComment:', err);
    }
  };

  return { feed, loading, error, toggleLike, addComment };
} 