"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWorkouts } from "@/hooks/useWorkouts";
import { useUser } from "@/hooks/useUser";
import { useFavorites } from "@/hooks/useFavorites";
import { useExplorer } from "@/hooks/useExplorer";
import { CreateWorkoutForm } from "@/components/workouts/CreateWorkoutForm";
import { ManualExerciseForm } from "@/components/workouts/ManualExerciseForm";
import { ExercisePreloader } from "@/components/workouts/ExercisePreloader";
import { ArrowLeft, Plus, Clock, Target, TrendingUp, Star, X, Edit3, Search, Filter } from "lucide-react";

export default function WorkoutsPage() {
  const { user, loading: userLoading } = useUser();
  const { workouts, loading: workoutsLoading, error: workoutsError, createWorkout } = useWorkouts();
  const { favorites, loading: favoritesLoading, error: favoritesError, toggleFavorite, isFavorite } = useFavorites();
  const { publicWorkouts, popularWorkouts: explorerPopularWorkouts, loading: explorerLoading, error: explorerError, searchWorkouts, filterByDifficulty } = useExplorer();
  const [activeTab, setActiveTab] = useState<'mes-seances' | 'explorer' | 'favoris'>('mes-seances');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');

  const prenom = user?.username || "Champion";

  const handleCreateWorkout = async (workoutData: any) => {
    try {
      setCreating(true);
      await createWorkout(workoutData);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      alert('Erreur lors de la création de la séance');
    } finally {
      setCreating(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    await searchWorkouts(query);
  };

  const handleDifficultyFilter = async (difficulty: string) => {
    setSelectedDifficulty(difficulty);
    if (difficulty) {
      await filterByDifficulty(difficulty);
    } else {
      await searchWorkouts('');
    }
  };

  const handleToggleFavorite = async (workoutId: string) => {
    try {
      await toggleFavorite(workoutId);
    } catch (error) {
      console.error('Erreur lors de la modification des favoris:', error);
      alert('Erreur lors de la modification des favoris');
    }
  };

  // Fonction pour formater la durée
  const formatDuration = (minutes: number | null | undefined) => {
    if (!minutes) return "N/A";
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  // Fonction pour obtenir le temps écoulé
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `Il y a ${diffInHours}h`;
    } else if (diffInHours < 168) {
      const days = Math.floor(diffInHours / 24);
      return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    } else {
      const weeks = Math.floor(diffInHours / 168);
      return `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
    }
  };

  // Si le formulaire de création est affiché
  if (showCreateForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4 pb-24">
        <div className="max-w-2xl mx-auto">
          <CreateWorkoutForm
            onSave={handleCreateWorkout}
            onCancel={() => setShowCreateForm(false)}
            loading={creating}
          />
        </div>
      </div>
    );
  }

  // Si le formulaire manuel est affiché
  if (showManualForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4 pb-24">
        <div className="max-w-4xl mx-auto">
          <ManualExerciseForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4 pb-24">
      <ExercisePreloader silent={true} />
      <div className="max-w-md mx-auto space-y-6">
        {/* Header avec navigation */}
        <div className="flex items-center justify-between mb-2">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          <span className="inline-block w-8 h-8 rounded-full bg-gray-300 border-2 border-white overflow-hidden">
            <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-medium">
              {prenom.charAt(0).toUpperCase()}
            </div>
          </span>
        </div>

        {/* Message de bienvenue */}
        <div className="mb-2">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span>💪</span> Prêt pour ta séance, {prenom} ?
          </h2>
          <p className="text-gray-600 text-base">Retrouve toutes tes séances et lance-toi !</p>
        </div>

        {/* Boutons créer une séance */}
        <div className="mb-4 space-y-3">
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg shadow transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Créer une séance (sélection)
          </button>
          
          <button
            onClick={() => setShowManualForm(true)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow transition-colors flex items-center justify-center gap-2"
          >
            <Edit3 className="h-5 w-5" />
            Créer une séance (saisie manuelle)
          </button>
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
              {favoritesLoading ? "..." : favorites?.length || 0}
            </div>
            <div className="text-xs text-gray-600">Favoris</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center shadow">
            <div className="text-lg font-bold text-green-500">
              {explorerLoading ? "..." : publicWorkouts?.length || 0}
            </div>
            <div className="text-xs text-gray-600">Publiques</div>
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
            </>
          )}

          {activeTab === 'explorer' && (
            <div className="space-y-4">
              {/* Barre de recherche */}
              <div className="bg-white rounded-2xl shadow p-4">
                <div className="flex gap-2 mb-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Rechercher des séances..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => handleDifficultyFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tous niveaux</option>
                    <option value="débutant">Débutant</option>
                    <option value="intermédiaire">Intermédiaire</option>
                    <option value="avancé">Avancé</option>
                  </select>
                </div>
              </div>

              {/* Séances populaires */}
              <div className="bg-white rounded-2xl shadow p-4">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <TrendingUp size={20} className="text-blue-500" />
                  Populaires
                </h3>
                {explorerLoading ? (
                  <div className="text-gray-500 text-center py-4">Chargement...</div>
                ) : explorerError ? (
                  <div className="text-red-500 text-center py-4">{explorerError}</div>
                ) : explorerPopularWorkouts.length > 0 ? (
                  explorerPopularWorkouts.map((workout) => (
                    <div key={workout.id} className="border-b last:border-b-0 py-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">{workout.name}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-2">
                            <span>{workout.difficulty || 'N/A'}</span>
                            <span>•</span>
                            <span>{workout.exercise_count || 0} exercices</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Star size={12} className="text-yellow-400 fill-current" />
                              {workout._count?.favorites || 0}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {formatDuration(workout.estimated_duration)}
                          </div>
                          <div className="text-xs text-gray-500">{workout.difficulty || 'N/A'}</div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-lg text-sm shadow transition-colors">
                          Essayer
                        </button>
                        <button 
                          onClick={() => handleToggleFavorite(workout.id)}
                          className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                            isFavorite(workout.id)
                              ? 'bg-red-100 hover:bg-red-200 text-red-600'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          <Star size={16} className={isFavorite(workout.id) ? 'fill-current' : ''} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-center py-4">Aucune séance populaire trouvée</div>
                )}
              </div>

              {/* Séances publiques récentes */}
              <div className="bg-white rounded-2xl shadow p-4">
                <h3 className="font-bold text-lg mb-3">Séances récentes</h3>
                {publicWorkouts.length > 0 ? (
                  publicWorkouts.map((workout) => (
                    <div key={workout.id} className="border-b last:border-b-0 py-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">{workout.name}</div>
                          <div className="text-xs text-gray-500">
                            Par {workout.user?.username || 'Anonyme'} • {getTimeAgo(workout.created_at)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {formatDuration(workout.estimated_duration)}
                          </div>
                          <div className="text-xs text-gray-500">{workout.difficulty || 'N/A'}</div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-lg text-sm shadow transition-colors">
                          Essayer
                        </button>
                        <button 
                          onClick={() => handleToggleFavorite(workout.id)}
                          className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                            isFavorite(workout.id)
                              ? 'bg-red-100 hover:bg-red-200 text-red-600'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          <Star size={16} className={isFavorite(workout.id) ? 'fill-current' : ''} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-center py-4">Aucune séance publique trouvée</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'favoris' && (
            <div className="space-y-4">
              {favoritesLoading ? (
                <div className="bg-white rounded-2xl shadow p-8 text-center">
                  <div className="text-gray-500">Chargement de tes favoris...</div>
                </div>
              ) : favoritesError ? (
                <div className="bg-white rounded-2xl shadow p-8 text-center">
                  <div className="text-red-500 mb-2">Erreur de chargement</div>
                  <div className="text-gray-500 text-sm">{favoritesError}</div>
                </div>
              ) : favorites.length > 0 ? (
                favorites.map((favorite) => (
                  <div key={favorite.id} className="bg-white rounded-2xl shadow p-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-lg text-gray-900">{favorite.workout?.name || 'Séance supprimée'}</div>
                        <div className="text-xs text-gray-500">
                          {favorite.workout?.difficulty || 'N/A'} • {favorite.workout?.exercise_count || 0} exercices • {getTimeAgo(favorite.created_at)}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {formatDuration(favorite.workout?.estimated_duration)}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-4 py-2 rounded-lg text-sm shadow transition-colors">
                        Démarrer
                      </button>
                      <button 
                        onClick={() => handleToggleFavorite(favorite.workout_id)}
                        className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-2 rounded-lg text-sm transition-colors"
                      >
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

      {/* Bouton sticky */}
      <button className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg p-4 flex items-center gap-2 z-50 transition-colors">
        <Plus size={20} />
        <span className="hidden sm:inline">Créer une séance</span>
      </button>
    </div>
  );
} 