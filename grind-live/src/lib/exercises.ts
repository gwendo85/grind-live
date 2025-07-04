import type { SupabaseClient } from '@supabase/supabase-js';

// Base de données d'exercices pour Grind Live
export const exercisesData: Omit<Exercise, 'id' | 'created_at' | 'user_id'>[] = [
  // Exercices de poitrine
  {
    name: "Développé couché",
    category: "poitrine",
    description: "Exercice de base pour développer la force et la masse de la poitrine",
    muscle_groups: ["pectoraux", "triceps", "épaules"],
    equipment: ["barre", "banc"]
  },
  {
    name: "Pompes",
    category: "poitrine",
    description: "Exercice au poids du corps pour renforcer la poitrine",
    muscle_groups: ["pectoraux", "triceps", "épaules"],
    equipment: ["aucun"]
  },
  {
    name: "Écarté couché",
    category: "poitrine",
    description: "Isolation des pectoraux avec haltères",
    muscle_groups: ["pectoraux"],
    equipment: ["banc", "haltères"]
  },

  // Exercices de dos
  {
    name: "Tractions",
    category: "dos",
    description: "Exercice au poids du corps pour le dos",
    muscle_groups: ["dorsaux", "biceps", "trapèzes"],
    equipment: ["barre de traction"]
  },
  {
    name: "Rowing haltère",
    category: "dos",
    description: "Renforcement du dos avec haltère",
    muscle_groups: ["dorsaux", "biceps", "trapèzes"],
    equipment: ["haltère", "banc"]
  },
  {
    name: "Tirage vertical",
    category: "dos",
    description: "Exercice de tirage à la poulie",
    muscle_groups: ["dorsaux", "biceps"],
    equipment: ["poulie"]
  },

  // Exercices d'épaules
  {
    name: "Développé militaire",
    category: "épaules",
    description: "Développé vertical pour les épaules",
    muscle_groups: ["épaules", "triceps"],
    equipment: ["barre", "disques"]
  },
  {
    name: "Élévations latérales",
    category: "épaules",
    description: "Isolation des épaules latérales",
    muscle_groups: ["épaules"],
    equipment: ["haltères"]
  },
  {
    name: "Élévations frontales",
    category: "épaules",
    description: "Isolation des épaules antérieures",
    muscle_groups: ["épaules"],
    equipment: ["haltères"]
  },

  // Exercices de jambes
  {
    name: "Squat",
    category: "jambes",
    description: "Exercice de base pour les jambes",
    muscle_groups: ["quadriceps", "fessiers", "ischios"],
    equipment: ["barre", "disques"]
  },
  {
    name: "Presse à cuisses",
    category: "jambes",
    description: "Exercice de presse pour les jambes",
    muscle_groups: ["quadriceps", "fessiers"],
    equipment: ["presse"]
  },
  {
    name: "Extensions de jambes",
    category: "jambes",
    description: "Isolation des quadriceps",
    muscle_groups: ["quadriceps"],
    equipment: ["machine"]
  },
  {
    name: "Curls de jambes",
    category: "jambes",
    description: "Isolation des ischio-jambiers",
    muscle_groups: ["ischios"],
    equipment: ["machine"]
  },

  // Exercices de biceps
  {
    name: "Curls haltères",
    category: "biceps",
    description: "Isolation des biceps avec haltères",
    muscle_groups: ["biceps"],
    equipment: ["haltères"]
  },
  {
    name: "Curls barre",
    category: "biceps",
    description: "Isolation des biceps avec barre",
    muscle_groups: ["biceps"],
    equipment: ["barre", "disques"]
  },
  {
    name: "Curls marteau",
    category: "biceps",
    description: "Variation de curl pour les avant-bras",
    muscle_groups: ["biceps", "avant-bras"],
    equipment: ["haltères"]
  },

  // Exercices de triceps
  {
    name: "Extensions triceps",
    category: "triceps",
    description: "Isolation des triceps avec haltère",
    muscle_groups: ["triceps"],
    equipment: ["haltère"]
  },
  {
    name: "Dips",
    category: "triceps",
    description: "Exercice au poids du corps pour les triceps",
    muscle_groups: ["triceps", "pectoraux"],
    equipment: ["barres parallèles"]
  },
  {
    name: "Extensions poulie",
    category: "triceps",
    description: "Isolation des triceps à la poulie",
    muscle_groups: ["triceps"],
    equipment: ["poulie"]
  },

  // Exercices d'abdominaux
  {
    name: "Crunch",
    category: "abdominaux",
    description: "Exercice de base pour les abdominaux",
    muscle_groups: ["abdominaux"],
    equipment: ["aucun"]
  },
  {
    name: "Planche",
    category: "abdominaux",
    description: "Exercice de gainage",
    muscle_groups: ["abdominaux", "lombaires"],
    equipment: ["aucun"]
  },
  {
    name: "Relevé de jambes",
    category: "abdominaux",
    description: "Exercice pour les abdominaux inférieurs",
    muscle_groups: ["abdominaux"],
    equipment: ["barre de traction"]
  },

  // Exercices cardio
  {
    name: "Course à pied",
    category: "cardio",
    description: "Exercice cardio de base",
    muscle_groups: ["jambes", "cardio"],
    equipment: ["aucun"]
  },
  {
    name: "Vélo",
    category: "cardio",
    description: "Cardio à faible impact",
    muscle_groups: ["jambes", "cardio"],
    equipment: ["vélo"]
  },
  {
    name: "Rameur",
    category: "cardio",
    description: "Cardio complet",
    muscle_groups: ["dos", "jambes", "cardio"],
    equipment: ["rameur"]
  }
];

// Fonction pour insérer les exercices dans Supabase
export async function seedExercises(supabase: SupabaseClient) {
  console.log('🌱 Seeding exercises...');
  
  for (const exercise of exercisesData) {
    const { error } = await supabase
      .from('exercises')
      .insert({
        name: exercise.name,
        category: exercise.category,
        description: exercise.description,
        muscle_groups: exercise.muscle_groups,
        equipment: exercise.equipment
      });
    
    if (error) {
      console.error(`❌ Erreur lors de l'insertion de ${exercise.name}:`, error);
    } else {
      console.log(`✅ ${exercise.name} ajouté`);
    }
  }
  
  console.log('🎉 Seeding terminé !');
} 