import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Récupérer les posts récents avec les informations utilisateur
    const { data: posts, error: postsError } = await supabaseServer
      .from('posts')
      .select(`
        id,
        content,
        created_at,
        users!inner(
          id,
          username,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    if (postsError) {
      console.error('Erreur récupération posts:', postsError);
      return NextResponse.json({ error: 'Erreur récupération posts' }, { status: 500 });
    }

    // Récupérer les séances publiques récentes
    const { data: publicWorkouts, error: workoutsError } = await supabaseServer
      .from('workouts')
      .select(`
        id,
        name,
        duration,
        created_at,
        users!inner(
          id,
          username,
          avatar_url
        )
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(10);

    if (workoutsError) {
      console.error('Erreur récupération séances publiques:', workoutsError);
      return NextResponse.json({ error: 'Erreur récupération séances' }, { status: 500 });
    }

    // Combiner et formater les données
    const feed = [];

    // Ajouter les posts
    if (posts) {
      for (const post of posts) {
        feed.push({
          id: post.id,
          type: 'post',
          user: post.users.username,
          avatar: post.users.avatar_url || post.users.username.charAt(0).toUpperCase(),
          time: formatTimeAgo(post.created_at),
          title: 'Nouveau post',
          emoji: '💬',
          duration: '',
          details: post.content,
          likes: 0, // À implémenter avec la table likes
          comments: 0, // À implémenter avec la table comments
          shares: 0,
        });
      }
    }

    // Ajouter les séances publiques
    if (publicWorkouts) {
      for (const workout of publicWorkouts) {
        feed.push({
          id: workout.id,
          type: 'workout',
          user: workout.users.username,
          avatar: workout.users.avatar_url || workout.users.username.charAt(0).toUpperCase(),
          time: formatTimeAgo(workout.created_at),
          title: workout.name,
          emoji: '💪',
          duration: `${workout.duration || 0}min`,
          details: `Séance terminée • ${workout.duration || 0} minutes`,
          likes: 0, // À implémenter avec la table likes
          comments: 0,
          shares: 0,
        });
      }
    }

    // Trier par date de création (plus récent en premier)
    feed.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    return NextResponse.json(feed.slice(0, 10)); // Retourner les 10 plus récents

  } catch (error) {
    console.error('Erreur API feed:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// Fonction utilitaire pour formater le temps écoulé
function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'À l\'instant';
  if (diffInMinutes < 60) return `Il y a ${diffInMinutes}min`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `Il y a ${diffInHours}h`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `Il y a ${diffInDays}j`;
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  return `Il y a ${diffInWeeks}s`;
} 