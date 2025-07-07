import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mode simulation - retourner des données simulées
    const dailyGoals = [
      {
        id: 'morning_workout',
        title: 'Séance du matin',
        completed: true,
        type: 'workout',
        target: 1,
        current: 1,
      },
      {
        id: 'steps',
        title: '10 000 pas',
        completed: false,
        type: 'steps',
        target: 10000,
        current: 6500,
      },
      {
        id: 'hydration',
        title: 'Hydratation',
        completed: false,
        type: 'water',
        target: 2.5,
        current: 1.5,
      },
    ];

    return NextResponse.json(dailyGoals);

  } catch (error) {
    console.error('Erreur API daily-goals:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { goalId, completed, current } = body;

    // Mode simulation - retourner un succès
    console.log('Objectif mis à jour (simulation):', { goalId, completed, current });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Erreur API daily-goals POST:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} 