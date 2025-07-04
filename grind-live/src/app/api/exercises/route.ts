import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Charger les exercices globaux (user_id IS NULL)
    const { data: globalData, error: globalError } = await supabase
      .from('exercises')
      .select('*')
      .is('user_id', null)
      .order('name');

    if (globalError) {
      console.error('Erreur lors du chargement des exercices globaux:', globalError);
      return NextResponse.json({ error: globalError.message }, { status: 500 });
    }

    // Charger les exercices personnalisés de l'utilisateur
    const { data: customData, error: customError } = await supabase
      .from('exercises')
      .select('*')
      .eq('user_id', user.id)
      .order('name');

    if (customError) {
      console.error('Erreur lors du chargement des exercices personnalisés:', customError);
      return NextResponse.json({ error: customError.message }, { status: 500 });
    }

    // Combiner les exercices globaux et personnalisés
    const exercises = [...(globalData || []), ...(customData || [])];

    return NextResponse.json({ exercises });
  } catch (error) {
    console.error('Erreur inattendue:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { name, category, description, muscle_groups, equipment } = body;

    // Validation
    if (!name || !category) {
      return NextResponse.json(
        { error: 'Le nom et la catégorie sont requis' },
        { status: 400 }
      );
    }

    // Créer l'exercice personnalisé
    const { data, error } = await supabase
      .from('exercises')
      .insert({
        user_id: user.id,
        name: name.trim(),
        category,
        description: description?.trim() || null,
        muscle_groups: muscle_groups?.length > 0 ? muscle_groups : null,
        equipment: equipment?.length > 0 ? equipment : null,
        is_custom: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ exercise: data }, { status: 201 });
  } catch (error) {
    console.error('Erreur inattendue:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 