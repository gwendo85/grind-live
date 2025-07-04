import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const { data, error } = await supabaseServer
      .from('favorites')
      .select(`
        *,
        workout:workouts(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ favorites: data });
  } catch (error) {
    console.error('Erreur lors de la récupération des favoris:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des favoris' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, workoutId } = await request.json();

    if (!userId || !workoutId) {
      return NextResponse.json(
        { error: 'User ID et Workout ID requis' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from('favorites')
      .insert({
        user_id: userId,
        workout_id: workoutId
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ favorite: data });
  } catch (error) {
    console.error('Erreur lors de l\'ajout aux favoris:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout aux favoris' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const workoutId = searchParams.get('workoutId');

    if (!userId || !workoutId) {
      return NextResponse.json(
        { error: 'User ID et Workout ID requis' },
        { status: 400 }
      );
    }

    const { error } = await supabaseServer
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('workout_id', workoutId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression des favoris:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression des favoris' },
      { status: 500 }
    );
  }
} 