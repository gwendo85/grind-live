'use client';

import { useState } from 'react';
import { Plus, X, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabaseBrowser } from '@/lib/supabaseClient';
import { useUser } from '@/hooks/useUser';
import type { Exercise } from '@/lib/types';

interface CreateExerciseFormProps {
  onExerciseCreated?: (exercise: Exercise) => void;
  onCancel?: () => void;
}

const categories = [
  { id: 'poitrine', name: 'Poitrine', color: 'bg-red-500' },
  { id: 'dos', name: 'Dos', color: 'bg-blue-500' },
  { id: 'épaules', name: 'Épaules', color: 'bg-green-500' },
  { id: 'jambes', name: 'Jambes', color: 'bg-purple-500' },
  { id: 'biceps', name: 'Biceps', color: 'bg-orange-500' },
  { id: 'triceps', name: 'Triceps', color: 'bg-pink-500' },
  { id: 'abdominaux', name: 'Abdominaux', color: 'bg-yellow-500' },
  { id: 'cardio', name: 'Cardio', color: 'bg-indigo-500' },
  { id: 'flexibilité', name: 'Flexibilité', color: 'bg-teal-500' },
  { id: 'autre', name: 'Autre', color: 'bg-gray-500' },
];

const equipmentOptions = [
  'Poids du corps', 'Haltères', 'Barre', 'Machine', 'Élastique', 
  'Kettlebell', 'Ballon', 'Tapis', 'Banc', 'Corde à sauter',
  'Vélo', 'Tapis de course', 'Rameur', 'Stepper'
];

export function CreateExerciseForm({ onExerciseCreated, onCancel }: CreateExerciseFormProps) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'poitrine',
    description: '',
    muscleGroups: [] as string[],
    equipment: [] as string[],
  });

  const [newMuscleGroup, setNewMuscleGroup] = useState('');
  const [newEquipment, setNewEquipment] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Vous devez être connecté pour créer un exercice');
      return;
    }

    if (!formData.name.trim()) {
      setError('Le nom de l&apos;exercice est requis');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const exerciseData = {
        user_id: user.id,
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim() || null,
        muscle_groups: formData.muscleGroups.length > 0 ? formData.muscleGroups : null,
        equipment: formData.equipment.length > 0 ? formData.equipment : null,
      };

      const { data, error: supabaseError } = await supabaseBrowser
        .from('exercises')
        .insert(exerciseData)
        .select()
        .single();

      if (supabaseError) {
        console.error('Erreur lors de la création:', supabaseError);
        setError(supabaseError.message);
        return;
      }

      console.log('✅ Exercice personnalisé créé:', data);
      
      if (onExerciseCreated) {
        onExerciseCreated(data);
      }

      // Réinitialiser le formulaire
      setFormData({
        name: '',
        category: 'poitrine',
        description: '',
        muscleGroups: [],
        equipment: [],
      });
      
    } catch (err) {
      console.error('Erreur inattendue:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const addMuscleGroup = () => {
    if (newMuscleGroup.trim() && !formData.muscleGroups.includes(newMuscleGroup.trim())) {
      setFormData(prev => ({
        ...prev,
        muscleGroups: [...prev.muscleGroups, newMuscleGroup.trim()]
      }));
      setNewMuscleGroup('');
    }
  };

  const removeMuscleGroup = (muscleGroup: string) => {
    setFormData(prev => ({
      ...prev,
      muscleGroups: prev.muscleGroups.filter(mg => mg !== muscleGroup)
    }));
  };

  const addEquipment = () => {
    if (newEquipment.trim() && !formData.equipment.includes(newEquipment.trim())) {
      setFormData(prev => ({
        ...prev,
        equipment: [...prev.equipment, newEquipment.trim()]
      }));
      setNewEquipment('');
    }
  };

  const removeEquipment = (equipment: string) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.filter(eq => eq !== equipment)
    }));
  };

  const addEquipmentFromList = (equipment: string) => {
    if (!formData.equipment.includes(equipment)) {
      setFormData(prev => ({
        ...prev,
        equipment: [...prev.equipment, equipment]
      }));
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Créer un exercice personnalisé
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nom de l&apos;exercice */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Nom de l&apos;exercice *
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Pompes diamant, Squat bulgare..."
              required
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Catégorie
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  type="button"
                  variant={formData.category === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, category: category.id }))}
                  className="flex items-center gap-2"
                >
                  <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description (optionnel)
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Décrivez comment effectuer cet exercice..."
              rows={3}
            />
          </div>

          {/* Groupes musculaires */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Groupes musculaires ciblés
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newMuscleGroup}
                onChange={(e) => setNewMuscleGroup(e.target.value)}
                placeholder="Ajouter un groupe musculaire..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMuscleGroup())}
              />
              <Button type="button" onClick={addMuscleGroup} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.muscleGroups.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.muscleGroups.map((muscleGroup) => (
                  <Badge key={muscleGroup} variant="secondary" className="flex items-center gap-1">
                    {muscleGroup}
                    <button
                      type="button"
                      onClick={() => removeMuscleGroup(muscleGroup)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Équipement */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Équipement nécessaire
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newEquipment}
                onChange={(e) => setNewEquipment(e.target.value)}
                placeholder="Ajouter un équipement..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEquipment())}
              />
              <Button type="button" onClick={addEquipment} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Équipements prédéfinis */}
            <div className="mb-2">
              <p className="text-xs text-gray-500 mb-1">Équipements courants :</p>
              <div className="flex flex-wrap gap-1">
                {equipmentOptions.map((equipment) => (
                  <Button
                    key={equipment}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addEquipmentFromList(equipment)}
                    disabled={formData.equipment.includes(equipment)}
                    className="text-xs"
                  >
                    {equipment}
                  </Button>
                ))}
              </div>
            </div>

            {formData.equipment.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.equipment.map((equipment) => (
                  <Badge key={equipment} variant="outline" className="flex items-center gap-1">
                    {equipment}
                    <button
                      type="button"
                      onClick={() => removeEquipment(equipment)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Erreur */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Boutons */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Créer l&apos;exercice
                </>
              )}
            </Button>
            
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                Annuler
              </Button>
            )}
          </div>
        </form>
        <p className="text-sm text-gray-600">
          Tu peux personnaliser cet exercice selon tes besoins
        </p>
        <p className="text-sm text-gray-600">
          Tu peux maintenant ajouter cet exercice à ta séance
        </p>
      </CardContent>
    </Card>
  );
} 