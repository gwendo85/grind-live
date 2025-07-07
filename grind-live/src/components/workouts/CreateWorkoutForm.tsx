'use client';

import { useState } from 'react';
import { Plus, Save, X, Clock, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWorkouts } from '@/hooks/useWorkouts';

interface ExerciseManual {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  rest?: number;
  notes?: string;
}

interface CreateWorkoutFormProps {
  onClose: () => void;
}

export function CreateWorkoutForm({ onClose }: CreateWorkoutFormProps) {
  const { createWorkout } = useWorkouts();
  const [workoutName, setWorkoutName] = useState('');
  const [workoutNotes, setWorkoutNotes] = useState('');
  const [exercises, setExercises] = useState<ExerciseManual[]>([]);
  const [exerciseForm, setExerciseForm] = useState<ExerciseManual>({
    name: '',
    sets: 3,
    reps: 10,
    weight: 0,
    rest: 60,
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddExercise = () => {
    if (!exerciseForm.name.trim()) return;
    
    setExercises(prev => [...prev, { ...exerciseForm }]);
    setExerciseForm({
      name: '',
      sets: 3,
      reps: 10,
      weight: 0,
      rest: 60,
      notes: ''
    });
  };

  const handleRemoveExercise = (index: number) => {
    setExercises(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    console.log('🔍 handleSubmit appelé');
    console.log('🔍 workoutName:', workoutName);
    console.log('🔍 exercises:', exercises);
    
    if (!workoutName.trim() || exercises.length === 0) {
      console.log('🔍 Validation échouée - nom vide ou pas d\'exercices');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const workoutData = {
        name: workoutName,
        notes: workoutNotes,
        exercises: exercises.map(ex => ({
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight || 0,
          rest: ex.rest || 60,
          notes: ex.notes || ''
        }))
      };
      
      console.log('🔍 Données de séance à envoyer:', workoutData);
      
      const result = await createWorkout(workoutData);
      console.log('🔍 Résultat de création:', result);
      
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création de la séance:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const estimatedDuration = exercises.reduce((total, ex) => {
    const exerciseTime = (ex.sets * 2) + (ex.rest || 60) * (ex.sets - 1) / 60;
    return total + exerciseTime;
  }, 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Créer une nouvelle séance</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Informations de la séance */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5" />
                Informations de la séance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="workoutName">Nom de la séance *</Label>
                <Input
                  id="workoutName"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  placeholder="Ex: Séance pectoraux"
                />
              </div>
              <div>
                <Label htmlFor="workoutNotes">Notes (optionnel)</Label>
                <Textarea
                  id="workoutNotes"
                  value={workoutNotes}
                  onChange={(e) => setWorkoutNotes(e.target.value)}
                  placeholder="Description de la séance..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Ajout d&apos;exercices */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Ajouter un exercice</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="exerciseName">Nom de l'exercice *</Label>
                  <Input
                    id="exerciseName"
                    value={exerciseForm.name}
                    onChange={(e) => setExerciseForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Développé couché"
                  />
                </div>
                <div>
                  <Label htmlFor="exerciseSets">Séries</Label>
                  <Input
                    id="exerciseSets"
                    type="number"
                    min="1"
                    value={exerciseForm.sets}
                    onChange={(e) => setExerciseForm(prev => ({ ...prev, sets: parseInt(e.target.value) || 1 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="exerciseReps">Répétitions</Label>
                  <Input
                    id="exerciseReps"
                    type="number"
                    min="1"
                    value={exerciseForm.reps}
                    onChange={(e) => setExerciseForm(prev => ({ ...prev, reps: parseInt(e.target.value) || 1 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="exerciseWeight">Poids (kg)</Label>
                  <Input
                    id="exerciseWeight"
                    type="number"
                    min="0"
                    value={exerciseForm.weight}
                    onChange={(e) => setExerciseForm(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="exerciseRest">Repos (secondes)</Label>
                  <Input
                    id="exerciseRest"
                    type="number"
                    min="0"
                    value={exerciseForm.rest}
                    onChange={(e) => setExerciseForm(prev => ({ ...prev, rest: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="exerciseNotes">Notes</Label>
                  <Input
                    id="exerciseNotes"
                    value={exerciseForm.notes}
                    onChange={(e) => setExerciseForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Notes sur l'exercice..."
                  />
                </div>
              </div>
              <Button 
                onClick={handleAddExercise}
                disabled={!exerciseForm.name.trim()}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter l'exercice
              </Button>
            </CardContent>
          </Card>

          {/* Liste des exercices */}
          {exercises.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Exercices de la séance ({exercises.length})</span>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    ~{Math.round(estimatedDuration)} min
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {exercises.map((exercise, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{exercise.name}</h4>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>{exercise.sets} séries</span>
                          <span>{exercise.reps} reps</span>
                          {exercise.weight > 0 && <span>{exercise.weight} kg</span>}
                          {exercise.rest > 0 && <span>{exercise.rest}s repos</span>}
                        </div>
                        {exercise.notes && (
                          <p className="text-sm text-muted-foreground mt-1">{exercise.notes}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveExercise(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!workoutName.trim() || exercises.length === 0 || isSubmitting}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Création...' : 'Créer la séance'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 