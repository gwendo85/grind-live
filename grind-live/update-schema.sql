-- Script de mise à jour du schéma pour les favoris et séances publiques

-- Ajouter les nouvelles colonnes à la table workouts
ALTER TABLE public.workouts 
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS difficulty TEXT,
ADD COLUMN IF NOT EXISTS estimated_duration INTEGER,
ADD COLUMN IF NOT EXISTS exercise_count INTEGER;

-- Créer la table favorites si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  workout_id UUID REFERENCES public.workouts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, workout_id)
);

-- Activer RLS sur la table favorites
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les favoris
DROP POLICY IF EXISTS "Users can view their own favorites" ON public.favorites;
CREATE POLICY "Users can view their own favorites" ON public.favorites
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own favorites" ON public.favorites;
CREATE POLICY "Users can create their own favorites" ON public.favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own favorites" ON public.favorites;
CREATE POLICY "Users can delete their own favorites" ON public.favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Politique pour voir les séances publiques
DROP POLICY IF EXISTS "Users can view public workouts" ON public.workouts;
CREATE POLICY "Users can view public workouts" ON public.workouts
  FOR SELECT USING (is_public = true);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_workout_id ON public.favorites(workout_id);
CREATE INDEX IF NOT EXISTS idx_workouts_is_public ON public.workouts(is_public);

-- Insérer quelques séances publiques d'exemple (optionnel)
-- Note: Remplacez l'UUID par un vrai user_id de votre base
-- INSERT INTO public.workouts (user_id, name, date, is_public, difficulty, estimated_duration, exercise_count, notes)
-- VALUES 
--   ('00000000-0000-0000-0000-000000000001', 'Full Body Beginner', CURRENT_DATE, true, 'débutant', 45, 6, 'Séance complète pour débutants'),
--   ('00000000-0000-0000-0000-000000000001', 'Upper Body Power', CURRENT_DATE, true, 'intermédiaire', 75, 8, 'Focus sur le haut du corps'),
--   ('00000000-0000-0000-0000-000000000001', 'Core Crusher', CURRENT_DATE, true, 'tous niveaux', 30, 5, 'Renforcement des abdominaux')
-- ON CONFLICT DO NOTHING; 