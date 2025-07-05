"use client";

import React from 'react';
import { useUser } from '@/hooks/useUser';
import { useProgression } from '@/hooks/useProgression';
import { useFeed } from '@/hooks/useFeed';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useTabs } from '@/hooks/useTabs';
import Link from 'next/link';
import { TrendingUp, Target, Clock, Trophy, Activity } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading: userLoading, error: userError } = useUser();
  const { progression, loading: progressionLoading } = useProgression();
  const { feed, loading: feedLoading } = useFeed();
  const { workouts, loading: workoutsLoading } = useWorkouts();
  const { activeTab, setActiveTab } = useTabs({
    tabs: ['feed', 'progression', 'seance'],
    defaultTab: 'feed',
    storageKey: 'dashboard-tab'
  });

  console.log('🔍 DashboardPage: Rendu du composant');
  console.log('🔍 useTabs: Initialisation avec', { tabs: ['feed', 'progression', 'seance'], defaultTab: 'feed', storageKey: 'dashboard-tab', isValid: true });
  console.log('🔍 DashboardPage: État des hooks', { userLoading, userError, progressionLoading, feedLoading, workoutsLoading, user: user ? 'connecté' : 'non connecté' });

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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Bienvenue {user?.name || 'utilisateur'} ! Voici un aperçu de tes activités.
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'feed', label: 'Feed', icon: Activity },
                { id: 'progression', label: 'Progression', icon: TrendingUp },
                { id: 'seance', label: 'Séances', icon: Target }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'feed' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Activités récentes</h3>
                {feedLoading ? (
                  <div className="text-gray-500">Chargement...</div>
                ) : feed.length > 0 ? (
                  <div className="space-y-3">
                    {feed.slice(0, 5).map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">{activity}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500">Aucune activité récente</div>
                )}
              </div>
            )}

            {activeTab === 'progression' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ta progression</h3>
                {progressionLoading ? (
                  <div className="text-gray-500">Chargement...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {progression.map((stat, index) => (
                      <div key={index} className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-orange-800">{stat.label}</span>
                          <Trophy className="w-4 h-4 text-orange-600" />
                        </div>
                        <div className="mt-2">
                          <span className="text-2xl font-bold text-orange-900">{stat.value}</span>
                          <span className="text-sm text-orange-700 ml-1">{stat.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'seance' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Tes séances</h3>
                  <Link href="/workouts" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                    Voir tout
                  </Link>
                </div>
                {workoutsLoading ? (
                  <div className="text-gray-500">Chargement...</div>
                ) : workouts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {workouts.slice(0, 4).map((workout) => (
                      <div key={workout.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{workout.name}</h4>
                          <Clock className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{workout.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{workout.duration} min</span>
                          <Link href={`/workouts/${workout.id}`} className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                            Commencer
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500">
                    Tu n&apos;as pas encore de séances. Commence par en créer une !
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/workouts" className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg text-center text-sm font-medium transition-colors">
              Nouvelle séance
            </Link>
            <Link href="/objectifs" className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg text-center text-sm font-medium transition-colors">
              Voir objectifs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
