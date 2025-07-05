"use client";

import React from 'react';
import { useUser } from '@/hooks/useUser';
import { useProgression } from '@/hooks/useProgression';
import { useFeed } from '@/hooks/useFeed';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useTabs } from '@/hooks/useTabs';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Target, Clock, Flame, Trophy, Calendar, Activity } from 'lucide-react';

export default function DashboardPage() {
  console.log('🔍 DashboardPage: Rendu du composant');

  // Hooks simplifiés
  const { user, loading: userLoading, error: userError } = useUser();
  const { progression, loading: progressionLoading } = useProgression();
  const { feed, loading: feedLoading } = useFeed();
  const { workouts, loading: workoutsLoading } = useWorkouts();
  
  // Tabs simplifiés
  const { setActiveTab, isActive } = useTabs(['feed', 'progression', 'seance'], 'feed', 'dashboard-tab');

  console.log('🔍 DashboardPage: État des hooks', {
    userLoading,
    userError,
    progressionLoading,
    feedLoading,
    workoutsLoading,
    user: user ? 'connecté' : 'non connecté'
  });

  // Gestion des erreurs (simplifiée)
  if (userError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
        <div className="text-center">
          <div className="text-xl font-bold text-red-500 mb-2">Erreur de chargement</div>
          <div className="text-gray-600 mb-4">{userError}</div>
          <button onClick={() => window.location.reload()} className="bg-orange-500 text-white px-4 py-2 rounded-lg">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (userLoading || progressionLoading || feedLoading || workoutsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-8 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-700 mb-2">Chargement...</div>
            <div className="text-gray-500">Préparation de ton dashboard</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-8 px-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header avec navigation */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Salut, {user?.username || 'Champion'} ! 💪
            </h1>
            <p className="text-gray-600">Bienvenue sur ton dashboard</p>
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
              +12% cette semaine
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-blue-500 mb-1">
              {progression?.volumeDone || 0}
            </div>
            <div className="text-sm text-gray-600">Volume (kg)</div>
            <div className="text-xs text-green-500 mt-1 flex items-center justify-center gap-1">
              <Target size={12} />
              Objectif atteint
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Séance du matin</span>
              </div>
              <span className="text-xs text-green-500 font-medium">Terminé</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm">10 000 pas</span>
              </div>
              <span className="text-xs text-orange-500 font-medium">6 500 / 10 000</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-sm">Hydratation</span>
              </div>
              <span className="text-xs text-gray-500 font-medium">1.5L / 2.5L</span>
            </div>
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
                Feed d'activité
              </h2>
              {feedLoading ? (
                <div className="text-gray-500">Chargement du feed...</div>
              ) : feed && feed.length > 0 ? (
                <div className="space-y-4">
                  {feed.slice(0, 3).map((item, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-gray-600">{item.details}</div>
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
              {progressionLoading ? (
                <div className="text-gray-500">Chargement de la progression...</div>
              ) : progression ? (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Séances cette semaine:</span>
                    <span className="font-bold">{progression.sessionsDone || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Temps total:</span>
                    <span className="font-bold">{progression.timeDone || 0}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Volume total:</span>
                    <span className="font-bold">{progression.volumeDone || 0}kg</span>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">Aucune donnée de progression</div>
              )}
            </div>
          )}

          {isActive('seance') && (
            <div>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Clock size={20} className="text-orange-500" />
                Tes séances
              </h2>
              {workoutsLoading ? (
                <div className="text-gray-500">Chargement des séances...</div>
              ) : workouts && workouts.length > 0 ? (
                <div className="space-y-4">
                  {workouts.slice(0, 3).map((workout, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0">
                      <div className="font-medium">{workout.name}</div>
                      <div className="text-sm text-gray-600">{workout.created_at}</div>
                    </div>
                  ))}
                  <Link href="/workouts" className="flex items-center gap-2 text-orange-500 hover:text-orange-600 text-sm font-medium">
                    Voir toutes mes séances
                    <ArrowRight size={16} />
                  </Link>
                </div>
              ) : (
                <div className="text-gray-500">Aucune séance trouvée</div>
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
          <div className="grid grid-cols-2 gap-3">
            <Link href="/workouts" className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg text-center text-sm font-medium transition-colors">
              Nouvelle séance
            </Link>
            <button className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg text-sm font-medium transition-colors">
              Voir objectifs
            </button>
          </div>
        </div>

        {/* Prochain événement */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold">Challenge de la semaine</h3>
            <Trophy size={20} />
          </div>
          <p className="text-sm opacity-90 mb-3">5 séances en 7 jours</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white bg-opacity-20 rounded-full h-2">
              <div className="bg-white h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
            <span className="text-sm font-medium">3/5</span>
          </div>
        </div>
      </div>
    </div>
  );
}
