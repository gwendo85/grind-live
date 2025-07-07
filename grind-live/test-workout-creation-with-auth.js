// Test de création de séance avec authentification
const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = 'https://yrowyofwnbmpuibbmlba.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlyb3d5b2Z3bmJtcHVpYmJtbGJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MDQ0OTcsImV4cCI6MjA2NzA4MDQ5N30.GdQXa2Qn_8_vw5m3euKi_uTDdGmnj7B4sNdurGEJvV8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testWorkoutCreation() {
  console.log('🧪 Test de création de séance');
  console.log('=============================');

  try {
    // Test 1: Vérifier l'authentification
    console.log('1. Vérification de l\'authentification...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('❌ Erreur d\'authentification:', authError.message);
      console.log('💡 Note: Ce test nécessite une authentification via l\'interface web');
      return;
    }
    
    if (!user) {
      console.log('❌ Aucun utilisateur connecté');
      console.log('💡 Veuillez vous connecter via l\'interface web d\'abord');
      return;
    }
    
    console.log('✅ Utilisateur connecté:', user.email);

    // Test 2: Créer une séance de test
    console.log('\n2. Création d\'une séance de test...');
    const testWorkout = {
      name: 'Test Séance ' + new Date().toLocaleTimeString(),
      notes: 'Séance de test automatique',
      user_id: user.id,
      status: 'draft',
      is_live: false,
      date: new Date().toISOString().split('T')[0],
    };

    console.log('📝 Données de séance:', testWorkout);

    const { data: workout, error: workoutError } = await supabase
      .from('workouts')
      .insert(testWorkout)
      .select()
      .single();

    if (workoutError) {
      console.log('❌ Erreur lors de la création de la séance:', workoutError.message);
      return;
    }

    console.log('✅ Séance créée avec succès:', workout.id);

    // Test 3: Créer un exercice de test
    console.log('\n3. Création d\'un exercice de test...');
    const { data: exercise, error: exerciseError } = await supabase
      .from('exercises')
      .insert({
        name: 'Test Exercice',
        category: 'test',
        user_id: user.id
      })
      .select()
      .single();

    if (exerciseError) {
      console.log('❌ Erreur lors de la création de l\'exercice:', exerciseError.message);
      return;
    }

    console.log('✅ Exercice créé avec succès:', exercise.id);

    // Test 4: Créer un log d'exercice
    console.log('\n4. Création d\'un log d\'exercice...');
    const testLog = {
      workout_id: workout.id,
      exercise_id: exercise.id,
      sets: 3,
      reps: 10,
      weight: 80,
      rest_time: 90,
      notes: 'Log de test',
    };

    const { data: log, error: logError } = await supabase
      .from('exercise_logs')
      .insert(testLog)
      .select()
      .single();

    if (logError) {
      console.log('❌ Erreur lors de la création du log:', logError.message);
      return;
    }

    console.log('✅ Log d\'exercice créé avec succès:', log.id);

    // Test 5: Vérifier que tout a été créé
    console.log('\n5. Vérification finale...');
    const { data: finalWorkout, error: finalError } = await supabase
      .from('workouts')
      .select(`
        *,
        exercise_logs (
          *,
          exercise (*)
        )
      `)
      .eq('id', workout.id)
      .single();

    if (finalError) {
      console.log('❌ Erreur lors de la vérification finale:', finalError.message);
      return;
    }

    console.log('✅ Vérification finale réussie !');
    console.log('📊 Séance créée:', finalWorkout.name);
    console.log('📊 Nombre d\'exercices:', finalWorkout.exercise_logs.length);

    console.log('\n🎉 Test de création de séance réussi !');
    console.log('\n📋 Résumé:');
    console.log('- Séance créée:', workout.id);
    console.log('- Exercice créé:', exercise.id);
    console.log('- Log créé:', log.id);

  } catch (error) {
    console.error('❌ Erreur inattendue:', error);
  }
}

testWorkoutCreation(); 