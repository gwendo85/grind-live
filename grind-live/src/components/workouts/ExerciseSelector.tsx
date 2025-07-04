'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useExercises } from '@/hooks/useExercises';
import { CreateExerciseForm } from './CreateExerciseForm';
import type { Exercise } from '@/lib/types';

interface ExerciseSelectorProps {
  onExerciseSelect: (exercise: Exercise) => void;
  selectedExercises?: Exercise[];
}

const categories = [
  { id: 'all', name: 'Tous', color: 'bg-gray-500' },
  { id: 'poitrine', name: 'Poitrine', color: 'bg-red-500' },
  { id: 'dos', name: 'Dos', color: 'bg-blue-500' },
  { id: 'épaules', name: 'Épaules', color: 'bg-green-500' },
  { id: 'jambes', name: 'Jambes', color: 'bg-purple-500' },
  { id: 'biceps', name: 'Biceps', color: 'bg-orange-500' },
  { id: 'triceps', name: 'Triceps', color: 'bg-pink-500' },
  { id: 'abdominaux', name: 'Abdominaux', color: 'bg-yellow-500' },
  { id: 'cardio', name: 'Cardio', color: 'bg-indigo-500' },
];

export function ExerciseSelector({ onExerciseSelect, selectedExercises = [] }: ExerciseSelectorProps) {
  const { exercises, loading, error } = useExercises();
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filterExercises = useCallback(() => {
    let filtered = exercises;

    // Filtre par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(exercise => exercise.category === selectedCategory);
    }

    // Filtre par recherche
    if (searchQuery) {
      filtered = filtered.filter(exercise =>
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.muscle_groups.some(muscle => 
          muscle.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    setFilteredExercises(filtered);
  }, [exercises, selectedCategory, searchQuery]);

  useEffect(() => {
    filterExercises();
  }, [exercises, searchQuery, selectedCategory, filterExercises]);

  const isExerciseSelected = (exercise: Exercise) => {
    return selectedExercises.some(selected => selected.id === exercise.id);
  };

  const handleExerciseClick = (exercise: Exercise) => {
    if (!isExerciseSelected(exercise)) {
      onExerciseSelect(exercise);
    }
  };

  const handleExerciseCreated = () => {
    setShowCreateForm(false);
    // L'exercice sera automatiquement ajouté à la liste via le hook
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Sélectionner des exercices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Chargement des exercices...</span>
          </div>
          <div className="text-center text-sm text-gray-500 mt-2">
            {exercises.length > 0 ? `Cache: ${exercises.length} exercices disponibles` : 'Premier chargement...'}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Sélectionner des exercices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-500">
            <p>Erreur lors du chargement des exercices</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Si le formulaire de création est affiché
  if (showCreateForm) {
    return (
      <CreateExerciseForm
        onExerciseCreated={handleExerciseCreated}
        onCancel={() => setShowCreateForm(false)}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Sélectionner des exercices
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-500">
              {exercises.length} exercices
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Créer
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Barre de recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher un exercice..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
              {category.name}
            </Button>
          ))}
        </div>

        {/* Liste des exercices */}
        <div className="grid gap-3 max-h-96 overflow-y-auto">
          {filteredExercises.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery || selectedCategory !== 'all' 
                ? 'Aucun exercice trouvé avec ces critères'
                : 'Aucun exercice disponible'
              }
            </div>
          ) : (
            filteredExercises.map((exercise) => (
              <div
                key={exercise.id}
                onClick={() => handleExerciseClick(exercise)}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  isExerciseSelected(exercise)
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-primary/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{exercise.name}</h3>
                      {exercise.is_custom && (
                        <Badge variant="outline" className="text-xs">
                          <Plus className="h-3 w-3 mr-1" />
                          Personnalisé
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{exercise.description}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      {exercise.muscle_groups.map((muscle, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {muscle}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {exercise.equipment.map((equip, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {equip}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {isExerciseSelected(exercise) ? (
                    <div className="flex items-center gap-2 text-primary">
                      <Plus className="h-4 w-4" />
                      <span className="text-sm font-medium">Ajouté</span>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Statistiques */}
        <div className="text-sm text-gray-500 text-center">
          {filteredExercises.length} exercice{filteredExercises.length > 1 ? 's' : ''} trouvé{filteredExercises.length > 1 ? 's' : ''}
          {selectedExercises.length > 0 && (
            <span className="ml-2">
              • {selectedExercises.length} sélectionné{selectedExercises.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 