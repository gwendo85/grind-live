import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

const exercisesLibrary = [
  { name: "Développé couché barre", description: "Allonge-toi sur un banc, prends la barre en pronation, abaisse-la au niveau de ta poitrine puis pousse-la vers le haut en tendant les bras.", category: "Pectoraux", equipment: "Barre, Banc", level: "Intermédiaire", default_reps: "4x8-12" },
  { name: "Développé incliné haltères", description: "Allonge-toi sur un banc incliné, pousse les haltères vers le haut, puis redescends en contrôlant.", category: "Pectoraux", equipment: "Haltères, Banc incliné", level: "Intermédiaire", default_reps: "4x8-12" },
  { name: "Pompes classiques", description: "Mains au sol largeur épaules, descends poitrine au sol puis repousse.", category: "Pectoraux", equipment: "Aucun", level: "Débutant", default_reps: "4x max" },
  { name: "Tractions pronation", description: "Suspends-toi à la barre, paumes vers l'avant, tire ton corps jusqu'à ce que ton menton dépasse la barre, puis redescends lentement.", category: "Dos", equipment: "Barre de traction", level: "Avancé", default_reps: "4x6-10" },
  { name: "Rowing barre", description: "Torse penché, tire la barre vers ton nombril puis redescends.", category: "Dos", equipment: "Barre", level: "Intermédiaire", default_reps: "4x8-12" },
  { name: "Tirage poulie haute", description: "Assis, tire la barre vers la poitrine, coudes bas.", category: "Dos", equipment: "Poulie haute", level: "Débutant", default_reps: "4x10-12" },
  { name: "Développé militaire barre", description: "Debout ou assis, pousse la barre au-dessus de la tête.", category: "Épaules", equipment: "Barre", level: "Intermédiaire", default_reps: "4x8-10" },
  { name: "Élévations latérales haltères", description: "Debout, lève les bras sur les côtés à hauteur d'épaule.", category: "Épaules", equipment: "Haltères", level: "Débutant", default_reps: "3x12-15" },
  { name: "Curl barre", description: "Debout, plie les coudes pour monter la barre jusqu'aux épaules.", category: "Biceps", equipment: "Barre", level: "Débutant", default_reps: "4x10-12" },
  { name: "Curl incliné haltères", description: "Assis sur banc incliné, bras tendus, plie les coudes.", category: "Biceps", equipment: "Haltères", level: "Intermédiaire", default_reps: "4x10-12" },
  { name: "Extensions triceps poulie", description: "Debout, pousse la corde vers le bas en gardant les coudes fixes.", category: "Triceps", equipment: "Poulie", level: "Débutant", default_reps: "4x10-12" },
  { name: "Dips sur banc", description: "Mains sur banc, jambes tendues, descends puis remonte.", category: "Triceps", equipment: "Banc", level: "Débutant", default_reps: "4x10-15" },
  { name: "Squat barre", description: "Barre sur trapèzes, descends en pliant genoux et hanches.", category: "Jambes", equipment: "Barre", level: "Intermédiaire", default_reps: "4x8-12" },
  { name: "Fentes marchées", description: "Fais des pas en avant en descendant le genou arrière vers le sol.", category: "Jambes", equipment: "Aucun ou haltères", level: "Intermédiaire", default_reps: "3x10-12" },
  { name: "Soulevé de terre jambes tendues", description: "Torse penché, jambes légèrement fléchies, descends la barre jusqu'aux tibias.", category: "Jambes", equipment: "Barre", level: "Intermédiaire", default_reps: "4x8-12" },
  { name: "Mollets debout", description: "Debout sur une marche, monte sur la pointe des pieds.", category: "Mollets", equipment: "Aucun ou machine", level: "Débutant", default_reps: "4x12-15" },
  { name: "Crunch au sol", description: "Allongé, mains derrière la tête, relève le buste.", category: "Abdominaux", equipment: "Aucun", level: "Débutant", default_reps: "3x15-20" },
  { name: "Relevé de jambes suspendu", description: "Accroché à une barre, lève les jambes tendues.", category: "Abdominaux", equipment: "Barre de traction", level: "Avancé", default_reps: "3x10-15" },
  { name: "Planche", description: "Sur les avant-bras, corps droit, maintiens la position.", category: "Abdominaux", equipment: "Aucun", level: "Débutant", default_reps: "3x30-60 sec" },
  { name: "Russian Twist", description: "Assis, pieds au sol ou levés, tourne le buste de chaque côté.", category: "Abdominaux", equipment: "Aucun ou médecine ball", level: "Intermédiaire", default_reps: "3x20" },
  { name: "Burpees", description: "Depuis la position debout, descends en squat, fais une pompe, puis saute.", category: "Cardio / Fonctionnel", equipment: "Aucun", level: "Intermédiaire", default_reps: "4x10-15" },
  { name: "Kettlebell Swings", description: "Tiens une kettlebell, balance-la entre les jambes puis à hauteur d'épaule.", category: "Cardio / Fonctionnel", equipment: "Kettlebell", level: "Intermédiaire", default_reps: "4x15" },
  { name: "Corde à sauter", description: "Sautes pieds joints ou alternés.", category: "Cardio / Fonctionnel", equipment: "Corde à sauter", level: "Débutant", default_reps: "4x1 min" },
  { name: "Box Jump", description: "Saute sur un caisson, puis redescends en sécurité.", category: "Cardio / Fonctionnel", equipment: "Box", level: "Intermédiaire", default_reps: "4x10" },
  { name: "Farmer Walk", description: "Tiens des poids de chaque côté et marche.", category: "Cardio / Fonctionnel", equipment: "Haltères ou kettlebells", level: "Intermédiaire", default_reps: "4x30 sec" }
];

export async function POST() {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Vérifier si les exercices de la bibliothèque existent déjà
    const { data: existingExercises } = await supabase
      .from('exercises')
      .select('name')
      .is('user_id', null);

    const existingNames = existingExercises?.map(ex => ex.name) || [];
    const newExercises = exercisesLibrary.filter(ex => !existingNames.includes(ex.name));

    if (newExercises.length === 0) {
      return NextResponse.json({ 
        message: 'Tous les exercices de la bibliothèque existent déjà dans la base de données',
        count: existingExercises?.length || 0
      });
    }

    // Préparer les données pour l'insertion
    const exercisesToInsert = newExercises.map(exercise => ({
      name: exercise.name,
      category: exercise.category,
      description: exercise.description,
      equipment: exercise.equipment,
      level: exercise.level,
      default_reps: exercise.default_reps,
      user_id: null // Exercices globaux
    }));

    // Insérer les nouveaux exercices
    const { data, error } = await supabase
      .from('exercises')
      .insert(exercisesToInsert)
      .select();

    if (error) {
      console.error('Erreur lors de l\'ajout de la bibliothèque d\'exercices:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      message: `Bibliothèque d'exercices ajoutée avec succès !`,
      added: data.length,
      total: (existingExercises?.length || 0) + data.length,
      exercises: data
    });

  } catch (error) {
    console.error('Erreur inattendue:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de l\'ajout de la bibliothèque d\'exercices' 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Récupérer tous les exercices globaux
    const { data: exercises, error } = await supabase
      .from('exercises')
      .select('*')
      .is('user_id', null)
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('Erreur lors de la récupération des exercices:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Grouper par catégorie
    const groupedExercises = exercises?.reduce((acc, exercise) => {
      if (!acc[exercise.category]) {
        acc[exercise.category] = [];
      }
      acc[exercise.category].push(exercise);
      return acc;
    }, {} as Record<string, unknown[]>) || {};

    return NextResponse.json({ 
      message: 'Bibliothèque d\'exercices récupérée avec succès',
      total: exercises?.length || 0,
      categories: Object.keys(groupedExercises),
      exercises: groupedExercises
    });

  } catch (error) {
    console.error('Erreur inattendue:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de la récupération de la bibliothèque d\'exercices' 
    }, { status: 500 });
  }
}

export async function DELETE() {
  // ... existing code ...
} 