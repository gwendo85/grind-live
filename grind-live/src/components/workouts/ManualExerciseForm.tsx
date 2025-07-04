'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X, Save } from 'lucide-react';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useUser } from '@/hooks/useUser';
import { supabaseBrowser } from '@/lib/supabaseClient';

interface ExerciseEntry {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  restTime?: number;
  notes?: string;
}

export function ManualExerciseForm() {
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState<ExerciseEntry[]>([]);
  const { createWorkout, loading } = useWorkouts();
  const { user } = useUser();

  const addExercise = () => {
    const newExercise: ExerciseEntry = {
      id: `manual-${Date.now()}`,
      name: '',
      sets: 3,
      reps: 10,
      weight: undefined,
      restTime: 60,
      notes: '',
    };
    setExercises([...exercises, newExercise]);
  };

  const updateExercise = (id: string, field: keyof ExerciseEntry, value: any) => {
    setExercises(prev =>
      prev.map(ex => ex.id === id ? { ...ex, [field]: value } : ex)
    );
  };

  const removeExercise = (id: string) => {
    setExercises(prev => prev.filter(ex => ex.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Veuillez saisir un nom pour votre séance');
      return;
    }

    if (exercises.length === 0) {
      alert('Veuillez ajouter au moins un exercice');
      return;
    }

    // Vérifier que tous les exercices ont un nom
    const invalidExercises = exercises.filter(ex => !ex.name.trim());
    if (invalidExercises.length > 0) {
      alert('Veuillez saisir le nom de tous les exercices');
      return;
    }

    try {
      // Créer d'abord les exercices personnalisés
      const createdExercises = [];
      
      for (const exercise of exercises) {
        // Créer l'exercice personnalisé
        const { data: newExercise, error: exerciseError } = await supabaseBrowser
          .from('exercises')
          .insert({
            name: exercise.name.trim(),
            category: 'Personnalisé',
            description: exercise.notes || '',
            user_id: user?.id,
            is_custom: true,
          })
          .select()
          .single();

        if (exerciseError) {
          console.error('Erreur lors de la création de l\'exercice:', exerciseError);
          throw new Error(`Erreur lors de la création de l'exercice "${exercise.name}"`);
        }

        createdExercises.push(newExercise);
      }

      // Créer la séance avec les exercices créés
      await createWorkout({
        name: name.trim(),
        date,
        notes: notes.trim() || null,
        exercises: exercises.map((ex, index) => ({
          exerciseId: createdExercises[index].id,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight,
          restTime: ex.restTime,
          notes: ex.notes,
        })),
      });

      // Reset form
      setName('');
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
      setExercises([]);
      
      alert('Séance créée avec succès !');
    } catch (error) {
      console.error('Erreur lors de la création de la séance:', error);
      alert('Erreur lors de la création de la séance');
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Créer une séance manuellement
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
                placeholder="ex: Séance pectoraux (45 min)"
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

          {/* Exercices */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <Label className="text-base font-medium">Exercices</Label>
              <Button
                type="button"
                onClick={addExercise}
                size="sm"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un exercice
              </Button>
            </div>
            
            {exercises.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                <p className="mb-2">Aucun exercice ajouté</p>
                <p className="text-sm">Cliquez sur "Ajouter un exercice" pour commencer</p>
              </div>
            ) : (
              <div className="space-y-4">
                {exercises.map((exercise, index) => (
                  <Card key={exercise.id} className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h5 className="font-medium">Exercice {index + 1}</h5>
                      <Button
                        type="button"
                        onClick={() => removeExercise(exercise.id)}
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor={`name-${exercise.id}`}>Nom de l'exercice *</Label>
                        <Input
                          id={`name-${exercise.id}`}
                          value={exercise.name}
                          onChange={(e) => updateExercise(exercise.id, 'name', e.target.value)}
                          placeholder="ex: Développé couché"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`sets-${exercise.id}`}>Séries *</Label>
                        <Input
                          id={`sets-${exercise.id}`}
                          type="number"
                          min="1"
                          value={exercise.sets}
                          onChange={(e) => updateExercise(exercise.id, 'sets', parseInt(e.target.value))}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`reps-${exercise.id}`}>Répétitions *</Label>
                        <Input
                          id={`reps-${exercise.id}`}
                          type="number"
                          min="1"
                          value={exercise.reps}
                          onChange={(e) => updateExercise(exercise.id, 'reps', parseInt(e.target.value))}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`weight-${exercise.id}`}>Poids (kg)</Label>
                        <Input
                          id={`weight-${exercise.id}`}
                          type="number"
                          min="0"
                          step="0.5"
                          value={exercise.weight || ''}
                          onChange={(e) => updateExercise(exercise.id, 'weight', e.target.value ? parseFloat(e.target.value) : undefined)}
                          placeholder="ex: 60"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`rest-${exercise.id}`}>Repos (sec)</Label>
                        <Input
                          id={`rest-${exercise.id}`}
                          type="number"
                          min="0"
                          value={exercise.restTime || ''}
                          onChange={(e) => updateExercise(exercise.id, 'restTime', e.target.value ? parseInt(e.target.value) : undefined)}
                          placeholder="ex: 90"
                        />
                      </div>
                      
                      <div className="md:col-span-2 lg:col-span-1">
                        <Label htmlFor={`notes-${exercise.id}`}>Notes</Label>
                        <Input
                          id={`notes-${exercise.id}`}
                          value={exercise.notes || ''}
                          onChange={(e) => updateExercise(exercise.id, 'notes', e.target.value)}
                          placeholder="ex: Technique focus"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Bouton de soumission */}
          <div className="flex justify-end">
            <Button type="submit" disabled={loading} className="min-w-[120px]">
              {loading ? (
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