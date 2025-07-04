"use client";

import { Trophy, TrendingUp, Users, Play, Calendar, Award, Bell } from 'lucide-react';
import React, { useMemo } from 'react';
import Image from 'next/image';
import { useUser } from '@/hooks/useUser';
import { useProgression } from '@/hooks/useProgression';
import { useFeed } from '@/hooks/useFeed';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useTabs } from '@/hooks/useTabs';
import { useQuickActions } from '@/hooks/useQuickActions';
// import { supabaseBrowser } from '@/lib/supabaseClient';
// import type { User, Workout } from '@/lib/types';

export default function DashboardPage() {
  console.log('🔍 DashboardPage: Rendu du composant');

  // Hooks centralisés avec protection d'erreur
  const { user, loading: userLoading, error: userError } = useUser();
  const { progression, loading: progressionLoading } = useProgression();
  const { feed, loading: feedLoading, toggleLike, addComment } = useFeed();
  const { workouts, loading: workoutsLoading, addWorkout } = useWorkouts();
  const { actions } = useQuickActions();
  
  // Stabilisation des données pour useTabs
  const tabsConfig = useMemo(() => ({
    tabs: ['feed', 'progression', 'seance'] as string[],
    defaultTab: 'feed' as string,
    storageKey: 'dashboard-tab'
  }), []);

  const { setActiveTab, isActive } = useTabs(tabsConfig.tabs, tabsConfig.defaultTab, tabsConfig.storageKey);

  console.log('🔍 DashboardPage: État des hooks', {
    userLoading,
    userError,
    progressionLoading,
    feedLoading,
    workoutsLoading,
    user: user ? 'connecté' : 'non connecté'
  });

  // Gestion des erreurs critiques
  if (userError) {
    console.error('❌ DashboardPage: Erreur utilisateur:', userError);
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

  // Si pas d'utilisateur et pas en loading, afficher rien
  if (!user && !userLoading) {
    console.log('ℹ️ DashboardPage: Aucun utilisateur, redirection vers auth');
    return null;
  }

  // Éviter les re-renders pendant le chargement initial
  if (userLoading || progressionLoading || feedLoading || workoutsLoading) {
    console.log('⏳ DashboardPage: Chargement en cours...');
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-8 px-2">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-700 mb-2">Chargement...</div>
            <div className="text-gray-500">Préparation de ton dashboard</div>
          </div>
        </div>
      </div>
    );
  }

  console.log('✅ DashboardPage: Rendu normal');
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-8 px-2">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header local identique social/workout */}
        <div className="flex items-center justify-between mb-4">
          <Bell className="w-9 h-9 text-gray-400" />
          <span className="inline-block w-10 h-10 rounded-full bg-gray-300 border-2 border-white overflow-hidden">
            {user?.avatar_url ? (
              <Image src={user.avatar_url} alt="avatar" width={40} height={40} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-medium">
                {user?.username?.charAt(0) || 'U'}
              </div>
            )}
          </span>
        </div>

        {/* Welcome Section - carte gradient corrigée */}
        <div className="rounded-3xl p-6 mb-4" style={{ background: `linear-gradient(135deg, #FF9100 0%, #FF6A00 100%)` }}>
          <div className="flex flex-col gap-3">
            <div className="text-white text-2xl font-extrabold leading-tight mb-2">
              Salut, {user?.username || 'Champion'} ! <span role="img" aria-label="muscle">💪</span>
            </div>
            <div className="text-white text-base mb-4">Prêt à écraser cette séance ?</div>
            <div className="flex justify-end">
              <button className="bg-white text-orange-600 font-bold rounded-xl px-6 py-3 text-lg flex items-center gap-2 shadow hover:bg-orange-50 transition">
                <span className="text-2xl font-bold">+</span> Nouvelle séance
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards - grille 2x2 */}
        <div className="grid grid-cols-2 gap-4 mb-2">
          {/* Séances cette semaine */}
          <div className="bg-white rounded-2xl shadow p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-gray-600">Séances cette semaine</span>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4h0a4 4 0 0 0-4 4v2" stroke="#FF9100" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="7" r="4" stroke="#FF9100" strokeWidth="2"/></svg>
            </div>
            {progressionLoading ? (
              <div className="text-3xl font-extrabold text-gray-300 animate-pulse">--</div>
            ) : (
              <>
                <div className="text-3xl font-extrabold text-gray-900">{progression?.sessionsDone ?? 0}</div>
                <div className="text-green-600 text-sm font-bold flex items-center gap-1">{progression ? `+${progression.sessionsDone - 2} vs semaine dernière` : ''}</div>
              </>
            )}
          </div>
          {/* Temps total */}
          <div className="bg-white rounded-2xl shadow p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-gray-600">Temps total</span>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#FF9100" strokeWidth="2"/><path d="M12 6v6l4 2" stroke="#FF9100" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            {progressionLoading ? (
              <div className="text-3xl font-extrabold text-gray-300 animate-pulse">--</div>
            ) : (
              <>
                <div className="text-3xl font-extrabold text-gray-900">{progression?.timeDone ?? 0}h</div>
                <div className="text-green-600 text-sm font-bold flex items-center gap-1">+45m</div>
              </>
            )}
          </div>
          {/* PR ce mois */}
          <div className="bg-white rounded-2xl shadow p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-gray-600">PR ce mois</span>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M3 17l6-6 4 4 8-8" stroke="#FF9100" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 21H3V3" stroke="#FF9100" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <div className="text-3xl font-extrabold text-gray-900">12</div>
            <div className="text-green-600 text-sm font-bold flex items-center gap-1">+3</div>
          </div>
          {/* Streak actuel */}
          <div className="bg-white rounded-2xl shadow p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-gray-600">Streak actuel</span>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#FF9100" strokeWidth="2"/><path d="M16 2v4M8 2v4M3 10h18" stroke="#FF9100" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <div className="text-3xl font-extrabold text-gray-900">21<br/><span className='text-base font-bold'>jours</span></div>
            <div className="text-green-600 text-sm font-bold flex items-center gap-1">Record !</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="font-bold text-xl text-gray-900 mb-3">Actions rapides</div>
          <div className="flex flex-col gap-3">
            {actions.map((action) => (
              <button key={action.id} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 font-medium text-base hover:bg-gray-50 transition" onClick={action.onClick}>
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Badges récents */}
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-5 w-5 text-purple-500" />
            <span className="font-semibold text-gray-700">Badges récents</span>
          </div>
          <div className="text-center py-6">
            <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400">Aucun badge encore débloqué</p>
            <p className="text-sm text-gray-400">Continue tes entraînements pour débloquer des badges !</p>
          </div>
        </div>

        {/* Séances récentes */}
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <span className="font-semibold text-gray-700">Séances récentes</span>
          </div>
          {workoutsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                </div>
              ))}
            </div>
          ) : workouts.length > 0 ? (
            <div className="space-y-3">
              {workouts.map((workout: { id: string; name: string; created_at: string }) => (
                <div key={workout.id} className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">{workout.name}</span>
                  <span className="text-xs text-gray-400">{workout.created_at}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">Aucune séance récente.</p>
          )}
        </div>

        {/* Onglets dynamiques et leur contenu (Feed, Progression, Séance) */}
        <div className="pt-2">
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-4">
            <button
              className={`flex-1 py-2 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${isActive('feed') ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
              onClick={() => setActiveTab('feed')}
            >
              <Users className="w-5 h-5" /> Feed
            </button>
            <button
              className={`flex-1 py-2 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${isActive('progression') ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
              onClick={() => setActiveTab('progression')}
            >
              <TrendingUp className="w-5 h-5" /> Progression
            </button>
            <button
              className={`flex-1 py-2 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${isActive('seance') ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
              onClick={() => setActiveTab('seance')}
            >
              <Play className="w-5 h-5" /> Séance
            </button>
          </div>

          {/* Contenu dynamique selon l'onglet */}
          {isActive('feed') && (
            <div className="space-y-4">
              {feedLoading ? (
                // Placeholders pour le feed en loading
                [1, 2].map((i: number) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-32 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                      </div>
                    </div>
                    <div className="h-5 bg-gray-200 rounded animate-pulse w-48 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-full mb-3"></div>
                    <div className="flex gap-4 pt-2 border-t border-gray-100">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
                    </div>
                  </div>
                ))
              ) : (
                feed.map((post) => (
                  <div key={post.id} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col gap-2">
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg bg-orange-100 text-orange-500`}>{post.avatar}</span>
                      <div className="flex-1">
                        <span className="font-bold text-lg text-gray-900 mr-2">{post.user}</span>
                        {post.badge && (
                          <span className="text-orange-600 font-semibold text-sm ml-1">{post.badgeIcon} {post.badge}</span>
                        )}
                        <div className="text-gray-400 text-xs font-medium">{post.time}</div>
                      </div>
                    </div>
                    <div className="font-bold text-gray-900 text-lg mb-1">{post.title} <span>{post.emoji}</span> <span className="font-normal text-gray-500 text-base ml-2">· {post.duration}</span></div>
                    <div className="text-gray-500 text-base mb-2">{post.details}</div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-gray-400 text-base">
                      <button className="flex items-center gap-1" onClick={() => toggleLike(post.id)}><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> {post.likes}</button>
                      <button className="flex items-center gap-1" onClick={() => addComment(post.id)}><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> {post.comments}</button>
                      <span className="flex items-center gap-1"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="16 6 12 2 8 6" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {isActive('progression') && (
            <div className="space-y-4">
              {progressionLoading ? (
                // Placeholders pour la progression en loading
                [1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="h-5 bg-gray-200 rounded animate-pulse w-32"></div>
                      <div className="h-5 bg-gray-200 rounded animate-pulse w-16"></div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-20 ml-auto"></div>
                  </div>
                ))
              ) : progression ? (
                <>
                  {/* Objectif séances mensuelles */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col gap-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 leading-tight">Objectif séances<br/>mensuelles</span>
                      <span className="text-gray-500 text-lg font-semibold text-right">{progression.sessionsDone}/{progression.sessionsGoal}<br/><span className="text-sm font-normal">séances</span></span>
                    </div>
                    <div className="mt-2 mb-1">
                      <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-3 rounded-full bg-orange-500 transition-all" style={{ width: `${progression.sessionsPercent}%` }}></div>
                      </div>
                    </div>
                    <div className="text-right text-orange-500 font-bold text-base">{progression.sessionsPercent}% complété</div>
                  </div>
                  {/* Volume d'entraînement */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col gap-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 leading-tight">Volume d&apos;entraînement</span>
                      <span className="text-gray-500 text-lg font-semibold text-right">{progression.volumeDone}/{progression.volumeGoal}<br/><span className="text-sm font-normal">kg</span></span>
                    </div>
                    <div className="mt-2 mb-1">
                      <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-3 rounded-full bg-orange-500 transition-all" style={{ width: `${progression.volumePercent}%` }}></div>
                      </div>
                    </div>
                    <div className="text-right text-orange-500 font-bold text-base">{progression.volumePercent}% complété</div>
                  </div>
                  {/* Temps d'entraînement */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col gap-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 leading-tight">Temps d&apos;entraînement</span>
                      <span className="text-gray-500 text-lg font-semibold text-right">{progression.timeDone}/{progression.timeGoal}<br/><span className="text-sm font-normal">heures</span></span>
                    </div>
                    <div className="mt-2 mb-1">
                      <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-3 rounded-full bg-orange-500 transition-all" style={{ width: `${progression.timePercent}%` }}></div>
                      </div>
                    </div>
                    <div className="text-right text-orange-500 font-bold text-base">{progression.timePercent}% complété</div>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Erreur de chargement de la progression
                </div>
              )}
            </div>
          )}

          {isActive('seance') && (
            <div className="space-y-6">
              {/* Boutons de séance */}
              <div>
                <div className="font-bold text-xl text-gray-900 mb-3">Commencer une séance</div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button className="rounded-xl bg-orange-500 text-white font-bold py-6 text-lg flex flex-col items-center justify-center gap-2 shadow hover:bg-orange-600 transition" onClick={() => addWorkout('Push Day')}><Play className="w-6 h-6" />Push Day</button>
                  <button className="rounded-xl bg-red-500 text-white font-bold py-6 text-lg flex flex-col items-center justify-center gap-2 shadow hover:bg-red-600 transition" onClick={() => addWorkout('Pull Day')}><TrendingUp className="w-6 h-6" />Pull Day</button>
                  <button className="rounded-xl bg-blue-500 text-white font-bold py-6 text-lg flex flex-col items-center justify-center gap-2 shadow hover:bg-blue-600 transition" onClick={() => addWorkout('Leg Day')}><Calendar className="w-6 h-6" />Leg Day</button>
                  <button className="rounded-xl bg-green-500 text-white font-bold py-6 text-lg flex flex-col items-center justify-center gap-2 shadow hover:bg-green-600 transition" onClick={() => addWorkout('Personnalisé')}><Award className="w-6 h-6" />Personnalisé</button>
                </div>
              </div>
              {/* Récompenses récentes (statique pour l'instant) */}
              <div>
                <div className="font-bold text-xl text-gray-900 mb-3">Récompenses récentes</div>
                <div className="space-y-3">
                  <div className="bg-yellow-100 rounded-xl p-4 flex flex-col gap-1 border border-yellow-200">
                    <span className="flex items-center gap-2 text-yellow-800 font-bold text-lg"><svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8L21 10h-9l1-8z" fill="#FF9100"/></svg>Beast Mode</span>
                    <span className="text-yellow-900 text-base">20 séances ce mois</span>
                    <span className="mt-1 inline-block bg-white rounded px-2 py-1 text-xs font-bold text-yellow-800 border border-yellow-300 w-max">Débloqué !</span>
                  </div>
                  <div className="bg-red-100 rounded-xl p-4 flex flex-col gap-1 border border-red-200">
                    <span className="flex items-center gap-2 text-red-700 font-bold text-lg"><svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20a10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16a8 8 0 0 1 0 16zm0-10a2 2 0 1 1 0 4a2 2 0 0 1 0-4z" fill="#FF6A00"/></svg>Régularité</span>
                    <span className="text-red-800 text-base">7 jours consécutifs</span>
                    <span className="mt-1 inline-block bg-white rounded px-2 py-1 text-xs font-bold text-red-700 border border-red-300 w-max">Débloqué !</span>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-4 flex flex-col gap-1 border border-gray-200 opacity-60">
                    <span className="flex items-center gap-2 text-gray-400 font-bold text-lg"><Trophy className="w-5 h-5" />Force Brute</span>
                    <span className="text-gray-400 text-base">Record PR sur un mouvement</span>
                    <span className="mt-1 inline-block bg-white rounded px-2 py-1 text-xs font-bold text-gray-400 border border-gray-200 w-max">À débloquer</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
