'use client';

import { useState } from 'react';
import { Plus, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExerciseSelector } from './ExerciseSelector';
import type { Exercise, WorkoutInsert } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWorkouts } from '@/hooks/useWorkouts';

interface CreateWorkoutFormProps {
  onSave: (workout: WorkoutInsert) => void;
  onCancel?: () => void;
  loading?: boolean;
}

export function CreateWorkoutForm({ onSave }: CreateWorkoutFormProps) {
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [workoutName, setWorkoutName] = useState('');
  const [workoutNotes, setWorkoutNotes] = useState('');
  const { createWorkout, loading: createWorkoutLoading } = useWorkouts();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!workoutName.trim()) {
      alert('Veuillez saisir un nom pour votre séance');
      return;
    }

    if (selectedExercises.length === 0) {
      alert('Veuillez ajouter au moins un exercice');
      return;
    }

    try {
      // Calculer la durée estimée
      const estimatedDuration = calculateEstimatedDuration();
      
      // Créer la séance avec les nouvelles colonnes
      const workoutData = {
        name: workoutName.trim(),
        date: new Date().toISOString().split('T')[0],
        notes: workoutNotes.trim() || null,
        estimated_duration: estimatedDuration,
        exercise_count: selectedExercises.length,
        difficulty: 'intermédiaire', // Par défaut, peut être amélioré
        is_public: false, // Par défaut privé
      };

      await createWorkout(workoutData);

      // Reset form
      setWorkoutName('');
      setWorkoutNotes('');
      setSelectedExercises([]);
      
      // Appeler le callback onSave si fourni
      if (onSave) {
        onSave(workoutData);
      }
    } catch (error) {
      console.error('Erreur lors de la création de la séance:', error);
      alert('Erreur lors de la création de la séance');
    }
  };

  const calculateEstimatedDuration = () => {
    if (selectedExercises.length === 0) return 0;
    
    let totalTime = 0;
    selectedExercises.forEach(ex => {
      // Temps par série (exercice + repos)
      const timePerSet = (ex.duration || 60) + (ex.rest_time || 90);
      totalTime += timePerSet * 3;
    });
    
    // Ajouter 10 minutes d'échauffement et 5 minutes de récupération
    return Math.round((totalTime + 900) / 60);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Nouvelle séance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom de la séance</Label>
              <Input
                id="name"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                placeholder="ex: Séance pectoraux"
                required
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes (optionnel)</Label>
              <Textarea
                id="notes"
                value={workoutNotes}
                onChange={(e) => setWorkoutNotes(e.target.value)}
                placeholder="Notes sur votre séance..."
                rows={3}
              />
            </div>
          </div>

          {/* Sélection des exercices */}
          <div>
            <Label>Exercices</Label>
            <Tabs value="selector" className="mt-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="selector">Sélectionner</TabsTrigger>
              </TabsList>
              
              <TabsContent value="selector" className="mt-4">
                <ExerciseSelector
                  selectedExercises={selectedExercises}
                  onExercisesChange={setSelectedExercises}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Bouton de soumission */}
          <div className="flex justify-end">
            <Button type="submit" disabled={createWorkoutLoading} className="min-w-[120px]">
              {createWorkoutLoading ? (
                'Création...'
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Créer la séance
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 