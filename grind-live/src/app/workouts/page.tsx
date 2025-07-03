"use client";
import React from "react";
import { Zap } from "lucide-react";

const prenom = "Thomas";

const mockWorkouts = [
  {
    id: 1,
    name: "Push Day",
    type: "Poitrine/Triceps",
    duration: "1h 10m",
    exercises: 5,
  },
  {
    id: 2,
    name: "Legs",
    type: "Jambes",
    duration: "1h 05m",
    exercises: 4,
  },
  {
    id: 3,
    name: "Full Body",
    type: "Corps complet",
    duration: "50m",
    exercises: 6,
  },
];

export default function WorkoutsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="bg-orange-100 p-1 rounded-lg"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><path d="M6 21v-2a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
            <span className="font-bold text-xl">GRIND Live</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></button>
            <span className="inline-block w-8 h-8 rounded-full bg-gray-300 border-2 border-white overflow-hidden"><img src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" /></span>
          </div>
        </div>

        {/* Message de bienvenue */}
        <div className="mb-2">
          <h2 className="text-2xl font-bold flex items-center gap-2"><span>💪</span> Prêt pour ta séance, {prenom} ?</h2>
          <p className="text-gray-600 text-base">Retrouve toutes tes séances et lance-toi !</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button className="px-4 py-2 rounded-full bg-orange-100 text-orange-600 font-semibold">Mes séances</button>
          <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-500 font-semibold">Explorer</button>
          <button className="px-4 py-2 rounded-full bg-indigo-100 text-indigo-600 font-semibold">Favoris</button>
        </div>

        {/* Liste de séances */}
        <div className="flex flex-col gap-4">
          {mockWorkouts.map((w) => (
            <div key={w.id} className="bg-white rounded-2xl shadow p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-lg text-gray-900">{w.name}</div>
                  <div className="text-xs text-gray-500">{w.type} • {w.exercises} exercices</div>
                </div>
                <span className="text-xs text-gray-400">{w.duration}</span>
              </div>
              <button className="mt-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-lg text-sm shadow flex items-center gap-2 self-end">
                <Zap className="w-4 h-4" /> Démarrer
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* Bouton sticky */}
      <button className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg p-4 flex items-center gap-2 z-50">
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 5v14m7-7H5"/></svg>
        Créer une séance
      </button>
    </div>
  );
} 