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

    // Calculer le début de la semaine (dimanche)
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);
    endOfWeek.setHours(23, 59, 59, 999);

    // Compter les séances de la semaine
    const { data: weeklyWorkouts, error: workoutsError } = await supabaseServer
      .from('workouts')
      .select('id, name, date')
      .eq('user_id', user.id)
      .gte('date', startOfWeek.toISOString().split('T')[0])
      .lte('date', endOfWeek.toISOString().split('T')[0]);

    if (workoutsError) {
      console.error('Erreur récupération séances:', workoutsError);
      return NextResponse.json({ error: 'Erreur récupération séances' }, { status: 500 });
    }

    const sessionsDone = weeklyWorkouts?.length || 0;
    const sessionsGoal = 5;

    // Challenge de la semaine : 5 séances en 7 jours
    const weeklyChallenge = {
      id: 'weekly_workouts',
      title: 'Challenge de la semaine',
      description: '5 séances en 7 jours',
      current: sessionsDone,
      target: sessionsGoal,
      progress: Math.min((sessionsDone / sessionsGoal) * 100, 100),
      completed: sessionsDone >= sessionsGoal,
      type: 'workout_count',
      period: 'week',
      startDate: startOfWeek.toISOString(),
      endDate: endOfWeek.toISOString(),
    };

    // Challenge du mois : 20 séances en 30 jours
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const { data: monthlyWorkouts, error: monthlyError } = await supabaseServer
      .from('workouts')
      .select('id')
      .eq('user_id', user.id)
      .gte('date', startOfMonth.toISOString().split('T')[0])
      .lte('date', endOfMonth.toISOString().split('T')[0]);

    if (monthlyError) {
      console.error('Erreur récupération séances mensuelles:', monthlyError);
    }

    const monthlySessionsDone = monthlyWorkouts?.length || 0;
    const monthlySessionsGoal = 20;

    const monthlyChallenge = {
      id: 'monthly_workouts',
      title: 'Challenge du mois',
      description: '20 séances en 30 jours',
      current: monthlySessionsDone,
      target: monthlySessionsGoal,
      progress: Math.min((monthlySessionsDone / monthlySessionsGoal) * 100, 100),
      completed: monthlySessionsDone >= monthlySessionsGoal,
      type: 'workout_count',
      period: 'month',
      startDate: startOfMonth.toISOString(),
      endDate: endOfMonth.toISOString(),
    };

    const challenges = [weeklyChallenge, monthlyChallenge];

    return NextResponse.json(challenges);

  } catch (error) {
    console.error('Erreur API challenges:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} 