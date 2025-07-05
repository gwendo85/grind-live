"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useWorkouts } from "@/hooks/useWorkouts";
import { useUser } from "@/hooks/useUser";
import { ArrowLeft, Plus, TrendingUp, Star } from "lucide-react";

export default function WorkoutsPage() {
  const { user } = useUser();
  const { workouts, loading: workoutsLoading } = useWorkouts();
  const [activeTab, setActiveTab] = useState<'mes-seances' | 'explorer' | 'favoris'>('mes-seances');

  // Données mockées pour les sections Explorer et Favoris
  const mockWorkouts = [
    {
      id: '1',
      name: 'Full Body Strength',
      description: 'Séance complète pour tout le corps',
      category: 'strength',
      duration: 45,
      difficulty: 'intermediate',
      exercises: 8,
      rating: 4.5,
      participants: 1247
    },
    {
      id: '2', 
      name: 'Cardio HIIT',
      description: 'Entraînement cardio intensif',
      category: 'cardio',
      duration: 30,
      difficulty: 'advanced',
      exercises: 6,
      rating: 4.8,
      participants: 892
    }
  ];

  const favoriteWorkouts = [
    {
      id: 201,
      name: "My Custom Push",
      type: "Poitrine/Triceps",
      duration: "1h 20m",
      exercises: 7,
      lastUsed: "Il y a 2 jours"
    },
    {
      id: 202,
      name: "Weekend Warrior",
      type: "Full Body",
      duration: "55m",
      exercises: 6,
      lastUsed: "Il y a 1 semaine"
    }
  ];

  const prenom = user?.email?.split('@')[0] || "Champion";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4 pb-40">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header avec navigation */}
        <div className="flex items-center justify-between mb-2">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
        </div>

        {/* Message de bienvenue */}
        <div className="mb-2">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span>💪</span> Prêt pour ta séance, {prenom} ?
          </h2>
          <p className="text-gray-600 text-base">Retrouve toutes tes séances et lance-toi !</p>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-lg p-3 text-center shadow">
            <div className="text-lg font-bold text-orange-500">
              {workoutsLoading ? "..." : workouts?.length || 0}
            </div>
            <div className="text-xs text-gray-600">Mes séances</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center shadow">
            <div className="text-lg font-bold text-blue-500">
              {workoutsLoading ? "..." : "12"}
            </div>
            <div className="text-xs text-gray-600">Cette semaine</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center shadow">
            <div className="text-lg font-bold text-green-500">
              {workoutsLoading ? "..." : "85%"}
            </div>
            <div className="text-xs text-gray-600">Objectif</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            className={`px-4 py-2 rounded-full font-semibold transition-all duration-150 ${
              activeTab === 'mes-seances' 
                ? 'bg-orange-100 text-orange-600 shadow' 
                : 'bg-gray-100 text-gray-500'
            }`}
            onClick={() => setActiveTab('mes-seances')}
          >
            Mes séances
          </button>
          <button
            className={`px-4 py-2 rounded-full font-semibold transition-all duration-150 ${
              activeTab === 'explorer' 
                ? 'bg-blue-100 text-blue-600 shadow' 
                : 'bg-gray-100 text-gray-500'
            }`}
            onClick={() => setActiveTab('explorer')}
          >
            Explorer
          </button>
          <button
            className={`px-4 py-2 rounded-full font-semibold transition-all duration-150 ${
              activeTab === 'favoris' 
                ? 'bg-indigo-100 text-indigo-600 shadow' 
                : 'bg-gray-100 text-gray-500'
            }`}
            onClick={() => setActiveTab('favoris')}
          >
            Favoris
          </button>
        </div>

        {/* Contenu dynamique selon l'onglet */}
        <div className="flex flex-col gap-4">
          {activeTab === 'mes-seances' && (
            <>
              {workoutsLoading ? (
                <div className="bg-white rounded-2xl shadow p-8 text-center">
                  <div className="text-gray-500">Chargement de tes séances...</div>
                </div>
              ) : workoutsError ? (
                <div className="bg-white rounded-2xl shadow p-8 text-center">
                  <div className="text-red-500 mb-2">Erreur de chargement</div>
                  <div className="text-gray-500 text-sm">{workoutsError}</div>
                </div>
              ) : workouts && workouts.length > 0 ? (
                workouts.map((workout) => (
                  <div key={workout.id} className="bg-white rounded-2xl shadow p-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-lg text-gray-900">{workout.name}</div>
                                                 <div className="text-xs text-gray-500">
                           Séance personnalisée • 5 exercices
                         </div>
                      </div>
                                             <span className="text-xs text-gray-400">45m</span>
                    </div>
                    <div className="flex gap-2">
                      <Link 
                        href={`/workouts/${workout.id}`}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-lg text-sm shadow text-center transition-colors"
                      >
                        Démarrer
                      </Link>
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm transition-colors">
                        <Star size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-2xl shadow p-8 text-center">
                  <div className="text-gray-500 mb-4">Aucune séance créée</div>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-lg shadow">
                    Créer ma première séance
                  </button>
                </div>
              )}
              {/* Affichage des séances locales créées */}
              {localWorkouts.map((workout) => (
                <div key={workout.id} className="bg-white rounded-2xl shadow p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-lg text-gray-900">{workout.name}</div>
                      <div className="text-xs text-gray-500">
                        Séance personnalisée • {workout.exercises.length} exercices
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{workout.duration}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-lg text-sm shadow text-center transition-colors">
                      Démarrer
                    </button>
                  </div>
                  {/* Aperçu des exercices */}
                  <div className="mt-2">
                    <div className="font-semibold text-sm mb-1">Exercices</div>
                    {workout.exercises.map(function(ex: any, idx: number) {
                      return (
                        <div key={idx} className="flex items-center justify-between py-1 px-2 rounded text-gray-700 text-sm bg-gray-50 mb-1">
                          <span className="font-medium">{idx + 1}. {ex.name}</span>
                          <span className="text-xs text-gray-500">{ex.sets}x{ex.reps} {ex.weight ? `• ${ex.weight}` : ''} {ex.rest ? `• ${ex.rest}` : ''}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              {/* Carte pour créer une nouvelle séance */}
              <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-orange-50 transition-colors" onClick={() => setShowCreate(!showCreate)}>
                <div className="flex items-center gap-2">
                  <span className="bg-orange-100 text-orange-600 rounded-full p-2"><Plus size={24} /></span>
                  <span className="font-bold text-lg text-orange-600">Créer une nouvelle séance</span>
                </div>
              </div>
              {/* Formulaire en expansion */}
              {showCreate && (
                <div className="bg-white rounded-2xl shadow-lg p-4 mt-2">
                  <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:gap-4">
                    <input
                      type="text"
                      placeholder="Nom de la séance"
                      className="flex-1 border rounded-lg px-3 py-2"
                      value={newWorkout.name}
                      onChange={e => setNewWorkout({ ...newWorkout, name: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Durée (ex: 45m)"
                      className="w-32 border rounded-lg px-3 py-2"
                      value={newWorkout.duration}
                      onChange={e => setNewWorkout({ ...newWorkout, duration: e.target.value })}
                    />
                  </div>
                  <div className="mb-2 grid grid-cols-1 sm:grid-cols-5 gap-2">
                    <input
                      type="text"
                      placeholder="Nom de l'exercice"
                      className="border rounded-lg px-3 py-2 col-span-2"
                      value={exercise.name}
                      onChange={e => setExercise({ ...exercise, name: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Séries"
                      className="border rounded-lg px-2 py-2"
                      value={exercise.sets}
                      onChange={e => setExercise({ ...exercise, sets: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Reps"
                      className="border rounded-lg px-2 py-2"
                      value={exercise.reps}
                      onChange={e => setExercise({ ...exercise, reps: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Charge"
                      className="border rounded-lg px-2 py-2"
                      value={exercise.weight}
                      onChange={e => setExercise({ ...exercise, weight: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Repos"
                      className="border rounded-lg px-2 py-2"
                      value={exercise.rest}
                      onChange={e => setExercise({ ...exercise, rest: e.target.value })}
                    />
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg font-bold col-span-1"
                      onClick={handleAddExercise}
                      type="button"
                    >
                      +
                    </button>
                  </div>
                  {/* Liste des exercices ajoutés */}
                  <div className="mb-2">
                    {newWorkout.exercises.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-2 mb-2 max-h-32 overflow-y-auto">
                        <div className="font-semibold text-sm mb-1">Exercices ajoutés :</div>
                        {newWorkout.exercises.map(function(ex: any, idx: number) {
                          return (
                            <div key={idx} className="flex items-center justify-between py-1 px-2 rounded text-gray-700 text-sm">
                              <span>{idx + 1}. {ex.name}</span>
                              <span className="text-xs text-gray-500">{ex.sets}x{ex.reps} {ex.weight ? `• ${ex.weight}` : ''} {ex.rest ? `• ${ex.rest}` : ''}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg text-lg shadow"
                      onClick={handleCreateWorkout}
                    >
                      Créer la séance
                    </button>
                    <button
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 rounded-lg text-lg shadow"
                      onClick={() => { setShowCreate(false); setNewWorkout({ name: '', duration: '', exercises: [] }); }}
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'explorer' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow p-4">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <TrendingUp size={20} className="text-blue-500" />
                  Populaires
                </h3>
                {mockWorkouts.map((workout) => (
                  <div key={workout.id} className="border-b last:border-b-0 py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-900">{workout.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-2">
                          <span>{workout.type}</span>
                          <span>•</span>
                          <span>{workout.exercises} exercices</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Star size={12} className="text-yellow-400 fill-current" />
                            {workout.rating}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{workout.duration}</div>
                        <div className="text-xs text-gray-500">{workout.difficulty}</div>
                      </div>
                    </div>
                    <button className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-lg text-sm shadow transition-colors">
                      Essayer
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'favoris' && (
            <div className="space-y-4">
              {favoriteWorkouts.length > 0 ? (
                favoriteWorkouts.map((workout) => (
                  <div key={workout.id} className="bg-white rounded-2xl shadow p-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-lg text-gray-900">{workout.name}</div>
                        <div className="text-xs text-gray-500">
                          {workout.type} • {workout.exercises} exercices • {workout.lastUsed}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">{workout.duration}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-4 py-2 rounded-lg text-sm shadow transition-colors">
                        Démarrer
                      </button>
                      <button className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-2 rounded-lg text-sm transition-colors">
                        <Star size={16} className="fill-current" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-2xl shadow p-8 text-center">
                  <div className="text-gray-500 mb-4">Aucun favori</div>
                  <div className="text-sm text-gray-400">Marque tes séances préférées avec ⭐</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 