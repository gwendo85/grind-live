import { useState, useEffect } from 'react';

export interface FeedPost {
  id: string;
  type: 'post' | 'workout';
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

export function useFeed() {
  const [feed, setFeed] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/feed');
        
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setFeed(data);
      } catch (err) {
        console.error('Erreur useFeed:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  // Like/unlike un post (à implémenter avec l'API)
  const toggleLike = async (id: string) => {
    try {
      // TODO: Implémenter l'API pour liker/unliker
      console.log('Post liked:', id);
    } catch (err) {
      console.error('Erreur toggleLike:', err);
    }
  };

  // Ajouter un commentaire (à implémenter avec l'API)
  const addComment = async (id: string) => {
    try {
      // TODO: Implémenter l'API pour ajouter un commentaire
      console.log('Comment added to post:', id);
    } catch (err) {
      console.error('Erreur addComment:', err);
    }
  };

  // Rafraîchir le feed
  const refreshFeed = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/feed');
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setFeed(data);
    } catch (err) {
      console.error('Erreur refreshFeed:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return { feed, loading, error, toggleLike, addComment, refreshFeed };
} 