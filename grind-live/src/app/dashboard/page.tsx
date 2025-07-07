"use client";

import React, { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { useProgression } from '@/hooks/useProgression';
import { useFeed } from '@/hooks/useFeed';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useDailyGoals } from '@/hooks/useDailyGoals';
import { useChallenges } from '@/hooks/useChallenges';
import { useTabs } from '@/hooks/useTabs';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { CreateWorkoutForm } from '@/components/workouts/CreateWorkoutForm';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Target, Clock, Flame, Trophy, Activity, Plus, AlertCircle, RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  console.log('🔍 DashboardPage: Rendu du composant');

  // État pour le modal de création de séance
  const [showCreateWorkout, setShowCreateWorkout] = useState(false);

  // Hooks pour les données réelles
  const { user, loading: userLoading, error: userError } = useUser();
  const { progression, loading: progressionLoading, isSimulationMode: progressionSimulation } = useProgression();
  const { feed, loading: feedLoading, isSimulationMode: feedSimulation } = useFeed();
  const { workouts, loading: workoutsLoading, createWorkout, refresh, isSimulationMode: workoutsSimulation } = useWorkouts();
  const { goals, loading: goalsLoading, isSimulationMode: goalsSimulation } = useDailyGoals();
  const { loading: challengesLoading, getMainChallenge, isSimulationMode: challengesSimulation } = useChallenges();
  
  // Tabs simplifiés
  const { setActiveTab, isActive } = useTabs(['feed', 'progression', 'seance'], 'feed', 'dashboard-tab');

  // Vérifier si on est en mode simulation (si au moins un hook est en mode simulation)
  const isSimulationMode = progressionSimulation || feedSimulation || workoutsSimulation || goalsSimulation || challengesSimulation;

  console.log('🔍 DashboardPage: État des hooks', {
    userLoading,
    userError,
    progressionLoading,
    feedLoading,
    workoutsLoading,
    goalsLoading,
    challengesLoading,
    isSimulationMode,
    progressionSimulation,
    feedSimulation,
    workoutsSimulation,
    goalsSimulation,
    challengesSimulation,
    user: user ? 'connecté' : 'non connecté'
  });

  console.log('🔍 DashboardPage: Séances chargées:', workouts);

  // Gestion des erreurs (améliorée)
  if (userError && !isSimulationMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 mb-4">
            <AlertCircle size={48} className="mx-auto" />
          </div>
          <div className="text-xl font-bold text-red-500 mb-2">Erreur de chargement</div>
          <div className="text-gray-600 mb-4">{userError}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={16} />
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Loading state amélioré - ne pas afficher le loading si on est en mode simulation
  const isLoading = (userLoading || progressionLoading || feedLoading || workoutsLoading || goalsLoading || challengesLoading) && !isSimulationMode;
  
  if (isLoading) {
    console.log('⏳ DashboardPage: Chargement en cours...');
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-8 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <div className="text-xl font-bold text-gray-700 mb-2">Chargement...</div>
            <div className="text-gray-500">Préparation de ton dashboard</div>
          </div>
        </div>
      </div>
    );
  }

  const mainChallenge = getMainChallenge();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-8 px-4">
        <div className="max-w-md mx-auto space-y-6">
        {/* Header avec navigation */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Salut, {user?.username || 'Champion'} ! 💪
            </h1>
            <p className="text-gray-600">Bienvenue sur ton dashboard</p>
            {isSimulationMode && (
              <div className="mt-2 text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                🧪 Mode simulation activé
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Link href="/workouts" className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
              Séances
            </Link>
            <Link href="/social" className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
              Social
            </Link>
          </div>
        </div>

        {/* Stats principales */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-orange-500 mb-1">
              {progression?.sessionsDone || 0}
            </div>
            <div className="text-sm text-gray-600">Séances</div>
            <div className="text-xs text-green-500 mt-1 flex items-center justify-center gap-1">
              <TrendingUp size={12} />
              {progression?.sessionsPercent || 0}% de l&apos;objectif
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-blue-500 mb-1">
              {progression?.volumeDone || 0}
            </div>
            <div className="text-sm text-gray-600">Volume (kg)</div>
            <div className="text-xs text-green-500 mt-1 flex items-center justify-center gap-1">
              <Target size={12} />
              {progression?.volumePercent || 0}% de l&apos;objectif
            </div>
          </div>
        </div>

        {/* Objectifs du jour */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Target size={20} className="text-orange-500" />
            Objectifs du jour
          </h2>
          <div className="space-y-3">
            {goals && goals.length > 0 ? (
              goals.map((goal) => (
                <div key={goal.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      goal.completed ? 'bg-green-500' : 
                      goal.current > 0 ? 'bg-orange-500' : 'bg-gray-300'
                    }`}></div>
                    <span className="text-sm">{goal.title}</span>
                  </div>
                  <span className={`text-xs font-medium ${
                    goal.completed ? 'text-green-500' : 
                    goal.current > 0 ? 'text-orange-500' : 'text-gray-500'
                  }`}>
                    {goal.type === 'workout' ? (
                      goal.completed ? 'Terminé' : 'À faire'
                    ) : (
                      `${goal.current} / ${goal.target}`
                    )}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-sm">Aucun objectif défini</div>
            )}
          </div>
        </div>

        {/* Tabs simplifiés */}
        <div className="flex gap-2 bg-white rounded-lg p-1 shadow">
          {['feed', 'progression', 'seance'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                isActive(tab)
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'feed' && 'Feed'}
              {tab === 'progression' && 'Progression'}
              {tab === 'seance' && 'Séances'}
            </button>
          ))}
        </div>

        {/* Contenu des onglets */}
        <div className="bg-white rounded-lg shadow p-6">
          {isActive('feed') && (
            <div>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Activity size={20} className="text-blue-500" />
                Feed d&apos;activité
              </h2>
              {feedLoading && !isSimulationMode ? (
                <div className="text-gray-500 flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  Chargement du feed...
                </div>
              ) : feed && feed.length > 0 ? (
                <div className="space-y-4">
                  {feed.slice(0, 3).map((item, idx) => (
                    <div key={item.id || idx} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{item.user.name}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(item.timestamp).toLocaleString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-gray-600">{item.description}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">Aucune activité récente</div>
              )}
            </div>
          )}

          {isActive('progression') && (
            <div>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-green-500" />
                Ta progression
              </h2>
              {progressionLoading && !isSimulationMode ? (
                <div className="text-gray-500 flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                  Chargement de la progression...
                </div>
              ) : progression ? (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Séances cette semaine:</span>
                    <span className="font-bold">{progression.sessionsDone || 0} / {progression.sessionsGoal || 5}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Temps total:</span>
                    <span className="font-bold">{progression.timeDone || 0}h / {progression.timeGoal || 5}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Volume total:</span>
                    <span className="font-bold">{progression.volumeDone || 0}kg / {progression.volumeGoal || 10000}kg</span>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">Aucune donnée de progression</div>
              )}
            </div>
          )}

          {isActive('seance') && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Clock size={20} className="text-orange-500" />
                  Tes séances
                </h2>
                <button
                  onClick={() => setShowCreateWorkout(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <Plus size={16} />
                  Créer une séance
                </button>
              </div>
              {workoutsLoading && !isSimulationMode ? (
                <div className="text-gray-500 flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                  Chargement des séances...
                </div>
              ) : workouts && workouts.length > 0 ? (
                <div className="space-y-4">
                  {workouts.slice(0, 3).map((workout, index) => (
                    <div key={workout.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="font-medium text-lg">{workout.name}</div>
                          <div className="text-sm text-gray-600">
                            {new Date(workout.created_at).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-orange-500">
                            {workout.exercise_count || 0} exercices
                          </div>
                          {workout.estimated_duration && (
                            <div className="text-xs text-gray-500">
                              ~{workout.estimated_duration} min
                            </div>
                          )}
                        </div>
                      </div>
                      {workout.notes && (
                        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {workout.notes}
                        </div>
                      )}
                    </div>
                  ))}
                  <Link href="/workouts" className="flex items-center gap-2 text-orange-500 hover:text-orange-600 text-sm font-medium">
                    Voir toutes mes séances
                    <ArrowRight size={16} />
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-500 mb-4">Aucune séance trouvée</div>
                  <button
                    onClick={() => setShowCreateWorkout(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Créer ta première séance
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions rapides */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Flame size={20} className="text-red-500" />
            Actions rapides
          </h2>
          <div className="space-y-2">
            <button
              onClick={async () => {
                console.log('🔍 Test création séance simple');
                try {
                  const testWorkout = {
                    name: 'Test Séance ' + new Date().toLocaleTimeString(),
                    notes: 'Séance de test',
                    exercises: [
                      {
                        name: 'Développé couché',
                        sets: 3,
                        reps: 10,
                        weight: 80,
                        rest: 90,
                        notes: 'Test'
                      }
                    ]
                  };
                  console.log('🔍 Création séance test:', testWorkout);
                  const result = await createWorkout(testWorkout);
                  console.log('🔍 Résultat création:', result);
                  alert('Séance créée avec succès !');
                } catch (error) {
                  console.error('❌ Erreur création séance:', error);
                  alert('Erreur: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
                }
              }}
              className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              🧪 Test Création Séance
            </button>
            <div className="text-xs text-gray-500">
              Séances actuelles: {workouts?.length || 0}
            </div>
            <button
              onClick={() => {
                console.log('🔍 Rafraîchissement des séances...');
                refresh();
              }}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 justify-center"
            >
              <RefreshCw size={16} />
              Rafraîchir les séances
            </button>
          </div>
        </div>

        {/* Prochain événement */}
        {mainChallenge && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold">{mainChallenge.title}</h3>
              <Trophy size={20} />
            </div>
            <p className="text-sm opacity-90 mb-3">{mainChallenge.description}</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white bg-opacity-20 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${mainChallenge.progress}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium">{mainChallenge.current}/{mainChallenge.target}</span>
            </div>
          </div>
        )}

        {/* Modal de création de séance */}
        {showCreateWorkout && (
          <CreateWorkoutForm onClose={() => setShowCreateWorkout(false)} />
        )}
      </div>
    </div>
    </AuthGuard>
  );
}
