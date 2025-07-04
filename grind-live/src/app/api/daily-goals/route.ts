import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseClient';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const today = new Date().toISOString().split('T')[0];

    // Vérifier si l'utilisateur a fait une séance aujourd'hui
    const { data: todayWorkout, error: workoutError } = await supabaseServer
      .from('workouts')
      .select('id')
      .eq('user_id', user.id)
      .eq('date', today)
      .limit(1);

    if (workoutError) {
      console.error('Erreur vérification séance:', workoutError);
    }

    // Objectifs par défaut (à remplacer par une vraie table plus tard)
    const dailyGoals = [
      {
        id: 'morning_workout',
        title: 'Séance du matin',
        completed: todayWorkout && todayWorkout.length > 0,
        type: 'workout',
        target: 1,
        current: todayWorkout ? todayWorkout.length : 0,
      },
      {
        id: 'steps',
        title: '10 000 pas',
        completed: false, // À connecter avec un tracker d'activité
        type: 'steps',
        target: 10000,
        current: 6500, // Données mockées pour l'instant
      },
      {
        id: 'hydration',
        title: 'Hydratation',
        completed: false, // À connecter avec un tracker d'hydratation
        type: 'water',
        target: 2.5, // litres
        current: 1.5, // litres - données mockées
      },
    ];

    return NextResponse.json(dailyGoals);

  } catch (error) {
    console.error('Erreur API daily-goals:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { goalId, completed, current } = body;

    // TODO: Implémenter la sauvegarde des objectifs dans une vraie table
    // Pour l'instant, on retourne juste un succès
    console.log('Objectif mis à jour:', { goalId, completed, current });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Erreur API daily-goals POST:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} 