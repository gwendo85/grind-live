// Test de connexion Supabase et création de séance
const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = 'https://yrowyofwnbmpuibbmlba.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlyb3d5b2Z3bmJtcHVpYmJtbGJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MDQ0OTcsImV4cCI6MjA2NzA4MDQ5N30.GdQXa2Qn_8_vw5m3euKi_uTDdGmnj7B4sNdurGEJvV8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabaseConnection() {
  console.log('🧪 Test de connexion Supabase');
  console.log('=============================');

  try {
    // Test 1: Connexion de base
    console.log('1. Test de connexion...');
    const { data, error } = await supabase.from('workouts').select('count').limit(1);
    
    if (error) {
      console.log('❌ Erreur de connexion:', error.message);
      return;
    }
    
    console.log('✅ Connexion Supabase réussie');

    // Test 2: Vérifier la structure de la table workouts
    console.log('\n2. Vérification de la structure de la table workouts...');
    const { data: workouts, error: workoutsError } = await supabase
      .from('workouts')
      .select('*')
      .limit(5);

    if (workoutsError) {
      console.log('❌ Erreur lors de la lecture des séances:', workoutsError.message);
      return;
    }

    console.log('✅ Table workouts accessible');
    console.log(`📊 Nombre de séances trouvées: ${workouts.length}`);

    // Test 3: Vérifier la structure de la table exercises
    console.log('\n3. Vérification de la structure de la table exercises...');
    const { data: exercises, error: exercisesError } = await supabase
      .from('exercises')
      .select('*')
      .limit(5);

    if (exercisesError) {
      console.log('❌ Erreur lors de la lecture des exercices:', exercisesError.message);
      return;
    }

    console.log('✅ Table exercises accessible');
    console.log(`📊 Nombre d'exercices trouvés: ${exercises.length}`);

    // Test 4: Vérifier la structure de la table exercise_logs
    console.log('\n4. Vérification de la structure de la table exercise_logs...');
    const { data: logs, error: logsError } = await supabase
      .from('exercise_logs')
      .select('*')
      .limit(5);

    if (logsError) {
      console.log('❌ Erreur lors de la lecture des logs:', logsError.message);
      return;
    }

    console.log('✅ Table exercise_logs accessible');
    console.log(`📊 Nombre de logs trouvés: ${logs.length}`);

    console.log('\n✅ Tous les tests de connexion sont passés !');
    console.log('\n📋 Prochaines étapes:');
    console.log('1. Testez la création de séance via l\'interface web');
    console.log('2. Vérifiez les logs dans la console du navigateur');
    console.log('3. Vérifiez que les données sont bien insérées dans Supabase');

  } catch (error) {
    console.error('❌ Erreur inattendue:', error);
  }
}

testSupabaseConnection(); 