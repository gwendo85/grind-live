"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useWorkouts } from "@/hooks/useWorkouts";
import { useUser } from "@/hooks/useUser";
import { ArrowLeft, TrendingUp, Star } from "lucide-react";

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
      type: 'Full Body',
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
      type: 'Cardio',
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