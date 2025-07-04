import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { exercisesData } from '@/lib/exercises';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Vérifier si les exercices existent déjà
    const { data: existingExercises } = await supabase
      .from('exercises')
      .select('count')
      .limit(1);

    if (existingExercises && existingExercises.length > 0) {
      return NextResponse.json({ 
        message: 'Les exercices existent déjà dans la base de données',
        count: existingExercises.length 
      });
    }

    // Insérer les exercices
    const { data, error } = await supabase
      .from('exercises')
      .insert(exercisesData)
      .select();

    if (error) {
      console.error('Erreur lors de l\'insertion des exercices:', error);
      return NextResponse.json(
        { error: 'Erreur lors de l\'insertion des exercices' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Exercices ajoutés avec succès',
      count: data.length,
      exercises: data
    });

  } catch (error) {
    console.error('Erreur inattendue:', error);
    return NextResponse.json(
      { error: 'Erreur inattendue' },
      { status: 500 }
    );
  }
} 