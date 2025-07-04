import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Calculer les statistiques de la semaine en cours
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Début de semaine (dimanche)
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);
    endOfWeek.setHours(23, 59, 59, 999);

    // 1. Compter les séances de la semaine
    const { data: weeklyWorkouts, error: workoutsError } = await supabaseServer
      .from('workouts')
      .select('id, duration, total_volume, created_at')
      .eq('user_id', user.id)
      .gte('date', startOfWeek.toISOString().split('T')[0])
      .lte('date', endOfWeek.toISOString().split('T')[0]);

    if (workoutsError) {
      console.error('Erreur récupération séances:', workoutsError);
      return NextResponse.json({ error: 'Erreur récupération séances' }, { status: 500 });
    }

    // 2. Calculer le volume total de la semaine
    const { data: weeklyVolume, error: volumeError } = await supabaseServer
      .from('exercise_logs')
      .select(`
        sets,
        reps,
        weight,
        workouts!inner(user_id, date)
      `)
      .eq('workouts.user_id', user.id)
      .gte('workouts.date', startOfWeek.toISOString().split('T')[0])
      .lte('workouts.date', endOfWeek.toISOString().split('T')[0]);

    if (volumeError) {
      console.error('Erreur récupération volume:', volumeError);
      return NextResponse.json({ error: 'Erreur récupération volume' }, { status: 500 });
    }

    // 3. Calculer les statistiques
    const sessionsDone = weeklyWorkouts?.length || 0;
    const sessionsGoal = 5; // Objectif par défaut : 5 séances par semaine
    
    // Calculer le volume total (sets × reps × poids)
    const volumeDone = weeklyVolume?.reduce((total, log) => {
      if (log.sets && log.reps && log.weight) {
        return total + (log.sets * log.reps * log.weight);
      }
      return total;
    }, 0) || 0;

    const volumeGoal = 10000; // Objectif par défaut : 10 000 kg
    
    // Calculer le temps total en heures
    const timeDone = weeklyWorkouts?.reduce((total, workout) => {
      return total + (workout.duration || 0);
    }, 0) / 60; // Convertir minutes en heures

    const timeGoal = 5; // Objectif par défaut : 5 heures par semaine

    // Calculer les pourcentages
    const sessionsPercent = Math.round((sessionsDone / sessionsGoal) * 100);
    const volumePercent = Math.round((volumeDone / volumeGoal) * 100);
    const timePercent = Math.round((timeDone / timeGoal) * 100);

    const progression = {
      sessionsDone,
      sessionsGoal,
      sessionsPercent,
      volumeDone: Math.round(volumeDone),
      volumeGoal,
      volumePercent,
      timeDone: Math.round(timeDone * 10) / 10, // Arrondir à 1 décimale
      timeGoal,
      timePercent,
    };

    return NextResponse.json(progression);

  } catch (error) {
    console.error('Erreur API progression:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} 