"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, TrendingUp, Users, Play, Plus, Calendar, Award, Bell } from 'lucide-react';
import { useId } from 'react';
// import { supabaseBrowser } from '@/lib/supabaseClient';
// import type { User, Workout } from '@/lib/types';

// Faux utilisateur pour bypass auth
const fakeUser = {
  username: "TestUser",
  xp: 250,
  level: 3,
  goal: "Prendre du muscle",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg"
};
const fakeWorkouts = [
  { id: 1, name: "Push Day", created_at: "2024-07-01" },
  { id: 2, name: "Legs", created_at: "2024-07-02" },
];

export default function DashboardPage() {
  // Bypass auth : on affiche toujours le dashboard avec des données fictives
  const user = fakeUser;
  const recentWorkouts = fakeWorkouts;
  const loading = false;

  const xpToNextLevel = 100 - (user.xp % 100);
  const progressPercentage = user.xp % 100;
  const gradientId = useId();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-8 px-2">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header local identique social/workout */}
        <div className="flex items-center justify-between mb-4">
          <Bell className="w-9 h-9 text-gray-400" />
          <span className="inline-block w-10 h-10 rounded-full bg-gray-300 border-2 border-white overflow-hidden">
            <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
          </span>
        </div>

        {/* Welcome Section - carte gradient corrigée */}
        <div className="rounded-3xl p-6 mb-4" style={{ background: `linear-gradient(135deg, #FF9100 0%, #FF6A00 100%)` }}>
          <div className="flex flex-col gap-3">
            <div className="text-white text-2xl font-extrabold leading-tight mb-2">
              Salut, Champion ! <span role="img" aria-label="muscle">💪</span>
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
        <div className="grid grid-cols-2 gap-4">
          {/* Séances cette semaine */}
          <div className="bg-white rounded-2xl shadow p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-gray-600">Séances cette semaine</span>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4h0a4 4 0 0 0-4 4v2" stroke="#FF9100" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="7" r="4" stroke="#FF9100" strokeWidth="2"/></svg>
            </div>
            <div className="text-3xl font-extrabold text-gray-900">4</div>
            <div className="text-green-600 text-sm font-bold flex items-center gap-1">+2 vs semaine dernière</div>
          </div>
          {/* Temps total */}
          <div className="bg-white rounded-2xl shadow p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-gray-600">Temps total</span>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#FF9100" strokeWidth="2"/><path d="M12 6v6l4 2" stroke="#FF9100" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <div className="text-3xl font-extrabold text-gray-900">6h<br/>45m</div>
            <div className="text-green-600 text-sm font-bold flex items-center gap-1">+45m</div>
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
        <div className="bg-white rounded-2xl shadow p-4 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Play className="h-5 w-5 text-green-500" />
            <span className="font-semibold text-gray-700">Actions rapides</span>
          </div>
          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl text-base shadow transition">
            <Plus className="mr-2 h-4 w-4" /> Nouvelle séance
          </Button>
          <Button variant="outline" className="w-full text-indigo-600 border-indigo-200 py-3 rounded-xl text-base font-bold">
            <Play className="mr-2 h-4 w-4" /> Mode LIVE
          </Button>
          <Button variant="outline" className="w-full text-blue-600 border-blue-200 py-3 rounded-xl text-base font-bold">
            <Calendar className="mr-2 h-4 w-4" /> Planifier
          </Button>
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
          {recentWorkouts.length > 0 ? (
            <div className="space-y-3">
              {recentWorkouts.map((workout) => (
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
      </div>
    </div>
  );
}
