import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mode simulation - retourner des données simulées
    const mockFeed = [
      {
        id: '1',
        type: 'workout',
        user: 'Alex',
        avatar: 'A',
        time: 'Il y a 2h',
        title: 'Séance Push terminée',
        emoji: '💪',
        duration: '45min',
        details: '8 exercices • 45 minutes',
        likes: 12,
        comments: 3,
        shares: 1,
      },
      {
        id: '2',
        type: 'post',
        user: 'Sarah',
        avatar: 'S',
        time: 'Il y a 4h',
        title: 'Nouveau record !',
        emoji: '🏆',
        duration: '',
        details: 'Battu mon record sur le développé couché : 80kg !',
        likes: 25,
        comments: 8,
        shares: 5,
      },
      {
        id: '3',
        type: 'workout',
        user: 'Marc',
        avatar: 'M',
        time: 'Il y a 6h',
        title: 'Séance Pull réussie',
        emoji: '💪',
        duration: '40min',
        details: '6 exercices • 40 minutes',
        likes: 8,
        comments: 2,
        shares: 0,
      },
      {
        id: '4',
        type: 'post',
        user: 'Emma',
        avatar: 'E',
        time: 'Il y a 8h',
        title: 'Challenge 30 jours',
        emoji: '🎯',
        duration: '',
        details: 'Jour 15/30 du challenge fitness !',
        likes: 18,
        comments: 6,
        shares: 3,
      }
    ];

    return NextResponse.json(mockFeed);

  } catch (error) {
    console.error('Erreur API feed:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} 