import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const difficulty = searchParams.get('difficulty');
    const limit = parseInt(searchParams.get('limit') || '20');

    let supabaseQuery = supabaseServer
      .from('workouts')
      .select(`
        *,
        user:profiles(username),
        _count: favorites(count)
      `)
      .eq('is_public', true);

    // Appliquer les filtres
    if (query) {
      supabaseQuery = supabaseQuery.ilike('name', `%${query}%`);
    }

    if (difficulty) {
      supabaseQuery = supabaseQuery.eq('difficulty', difficulty);
    }

    // Récupérer les séances publiques
    const { data: publicWorkouts, error: publicError } = await supabaseQuery
      .order('created_at', { ascending: false })
      .limit(limit);

    if (publicError) throw publicError;

    // Récupérer les séances populaires (avec le plus de favoris)
    const { data: popularWorkouts, error: popularError } = await supabaseServer
      .from('workouts')
      .select(`
        *,
        user:profiles(username),
        _count: favorites(count)
      `)
      .eq('is_public', true)
      .order('_count.favorites', { ascending: false })
      .limit(10);

    if (popularError) throw popularError;

    return NextResponse.json({
      publicWorkouts: publicWorkouts || [],
      popularWorkouts: popularWorkouts || []
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des séances:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des séances' },
      { status: 500 }
    );
  }
} 