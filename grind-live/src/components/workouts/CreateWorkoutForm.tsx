'use client';

import { useState } from 'react';
import { Plus, Trash2, Save, X, Clock, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExerciseSelector } from './ExerciseSelector';
import type { Exercise, WorkoutInsert } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWorkouts } from '@/hooks/useWorkouts';

interface CreateWorkoutFormProps {
  onSave: (workout: WorkoutInsert) => void;
  onCancel: () => void;
  loading?: boolean;
}

interface WorkoutExercise {
  exercise: Exercise;
  sets: number;
  reps: number | null;
  weight: number | null;
  duration: number | null;
  rest_time: number | null;
  notes: string;
}

interface ExerciseEntry {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  restTime?: number;
  notes?: string;
}

export function CreateWorkoutForm({ onSave, onCancel, loading = false }: CreateWorkoutFormProps) {
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>([]);
  const [manualExercises, setManualExercises] = useState<ExerciseEntry[]>([]);
  const [activeTab, setActiveTab] = useState('selector');
  const { createWorkout, loading: createWorkoutLoading } = useWorkouts();

  const handleExerciseSelect = (exercise: Exercise) => {
    const newWorkoutExercise: WorkoutExercise = {
      exercise,
      sets: 3,
      reps: 12,
      weight: null,
      duration: null,
      rest_time: 90,
      notes: ''
    };
    
    setSelectedExercises([...selectedExercises, newWorkoutExercise]);
  };

  const removeExercise = (index: number) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, field: keyof WorkoutExercise, value: any) => {
    const updated = [...selectedExercises];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedExercises(updated);
  };

  const addManualExercise = () => {
    const newExercise: ExerciseEntry = {
      id: `manual-${Date.now()}`,
      name: '',
      sets: 3,
      reps: 10,
      weight: undefined,
      restTime: 60,
      notes: '',
    };
    setManualExercises([...manualExercises, newExercise]);
  };

  const updateManualExercise = (id: string, field: keyof ExerciseEntry, value: any) => {
    setManualExercises(prev =>
      prev.map(ex => ex.id === id ? { ...ex, [field]: value } : ex)
    );
  };

  const removeManualExercise = (id: string) => {
    setManualExercises(prev => prev.filter(ex => ex.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Veuillez saisir un nom pour votre séance');
      return;
    }

    const allExercises = activeTab === 'selector' ? selectedExercises : manualExercises;
    
    if (allExercises.length === 0) {
      alert('Veuillez ajouter au moins un exercice');
      return;
    }

    try {
      // Calculer la durée estimée
      const estimatedDuration = calculateEstimatedDuration();
      
      // Créer la séance avec les nouvelles colonnes
      const workoutData = {
        name: name.trim(),
        date,
        notes: notes.trim() || null,
        estimated_duration: estimatedDuration,
        exercise_count: allExercises.length,
        difficulty: 'intermédiaire', // Par défaut, peut être amélioré
        is_public: false, // Par défaut privé
      };

      await createWorkout(workoutData);

      // Reset form
      setName('');
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
      setSelectedExercises([]);
      setManualExercises([]);
      setActiveTab('selector');
      
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
      totalTime += timePerSet * ex.sets;
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ex: Séance pectoraux"
                required
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes sur votre séance..."
              rows={3}
            />
          </div>

          {/* Sélection des exercices */}
          <div>
            <Label>Exercices</Label>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="selector">Sélectionner</TabsTrigger>
                <TabsTrigger value="manual">Saisie manuelle</TabsTrigger>
              </TabsList>
              
              <TabsContent value="selector" className="mt-4">
                <ExerciseSelector
                  selectedExercises={selectedExercises.map(ex => ex.exercise)}
                  onExercisesChange={(newExercises) => setSelectedExercises(newExercises.map(ex => ({
                    exercise: ex,
                    sets: 3,
                    reps: 12,
                    weight: null,
                    duration: null,
                    rest_time: 90,
                    notes: ''
                  } as WorkoutExercise)))}
                />
              </TabsContent>
              
              <TabsContent value="manual" className="mt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">Exercices saisis manuellement</h4>
                    <Button
                      type="button"
                      onClick={addManualExercise}
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un exercice
                    </Button>
                  </div>
                  
                  {manualExercises.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Aucun exercice ajouté</p>
                      <p className="text-sm">Cliquez sur "Ajouter un exercice" pour commencer</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {manualExercises.map((exercise, index) => (
                        <Card key={exercise.id} className="p-4">
                          <div className="flex justify-between items-start mb-4">
                            <h5 className="font-medium">Exercice {index + 1}</h5>
                            <Button
                              type="button"
                              onClick={() => removeManualExercise(exercise.id)}
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor={`name-${exercise.id}`}>Nom de l'exercice</Label>
                              <Input
                                id={`name-${exercise.id}`}
                                value={exercise.name}
                                onChange={(e) => updateManualExercise(exercise.id, 'name', e.target.value)}
                                placeholder="ex: Développé couché"
                                required
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor={`sets-${exercise.id}`}>Séries</Label>
                              <Input
                                id={`sets-${exercise.id}`}
                                type="number"
                                min="1"
                                value={exercise.sets}
                                onChange={(e) => updateManualExercise(exercise.id, 'sets', parseInt(e.target.value))}
                                required
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor={`reps-${exercise.id}`}>Répétitions</Label>
                              <Input
                                id={`reps-${exercise.id}`}
                                type="number"
                                min="1"
                                value={exercise.reps}
                                onChange={(e) => updateManualExercise(exercise.id, 'reps', parseInt(e.target.value))}
                                required
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor={`weight-${exercise.id}`}>Poids (kg) - optionnel</Label>
                              <Input
                                id={`weight-${exercise.id}`}
                                type="number"
                                min="0"
                                step="0.5"
                                value={exercise.weight || ''}
                                onChange={(e) => updateManualExercise(exercise.id, 'weight', e.target.value ? parseFloat(e.target.value) : undefined)}
                                placeholder="ex: 60"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor={`rest-${exercise.id}`}>Repos (sec) - optionnel</Label>
                              <Input
                                id={`rest-${exercise.id}`}
                                type="number"
                                min="0"
                                value={exercise.restTime || ''}
                                onChange={(e) => updateManualExercise(exercise.id, 'restTime', e.target.value ? parseInt(e.target.value) : undefined)}
                                placeholder="ex: 90"
                              />
                            </div>
                            
                            <div className="md:col-span-2 lg:col-span-1">
                              <Label htmlFor={`notes-${exercise.id}`}>Notes - optionnel</Label>
                              <Input
                                id={`notes-${exercise.id}`}
                                value={exercise.notes || ''}
                                onChange={(e) => updateManualExercise(exercise.id, 'notes', e.target.value)}
                                placeholder="ex: Technique focus"
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
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