"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { ArrowLeft } from "lucide-react";

const mockFeed = [
  {
    id: 1,
    user: { name: "Nina", avatar: "N" },
    time: "il y a 2h",
    type: "séance de Training",
    typeColor: "text-orange-600",
    content: "Super séance de HIIT ce matin! 💪🔥",
    likes: 12,
    comments: 3,
  },
  {
    id: 2,
    user: { name: "Miguel", avatar: "M" },
    time: "il y a 5h",
    type: "séance de Training",
    typeColor: "text-orange-600",
    content: "Cardio terminé, prêt pour la journée! 🚀",
    likes: 8,
    comments: 1,
  },
];

const mockFriends = [
  { name: "Alice", avatar: "A" },
  { name: "Thomas", avatar: "T" },
  { name: "David", avatar: "D" },
];

// Placeholder pour le prénom utilisateur
const prenom = 'Thomas'; // À remplacer plus tard par la vraie donnée utilisateur

export default function SocialPage() {
  const [activeTab, setActiveTab] = useState<'activity' | 'friends' | 'challenges'>('activity');
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4">
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
          <h2 className="text-2xl font-bold flex items-center gap-2"><span>👋</span> Salut, {prenom} !</h2>
          <p className="text-gray-600 text-base">Prêt à découvrir l&apos;activité de ta communauté&nbsp;?</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-4 mb-4">
          <button
            className={`px-4 py-2 rounded-full font-semibold transition-all duration-150 ${activeTab === 'activity' ? 'bg-orange-100 text-orange-600 shadow' : 'bg-gray-100 text-gray-500'}`}
            onClick={() => setActiveTab('activity')}
          >
            Activity
          </button>
          <button
            className={`px-4 py-2 rounded-full font-semibold transition-all duration-150 ${activeTab === 'friends' ? 'bg-blue-100 text-blue-600 shadow' : 'bg-gray-100 text-gray-500'}`}
            onClick={() => setActiveTab('friends')}
          >
            Friends
          </button>
          <button
            className={`px-4 py-2 rounded-full font-semibold transition-all duration-150 ${activeTab === 'challenges' ? 'bg-indigo-100 text-indigo-600 shadow' : 'bg-gray-100 text-gray-500'}`}
            onClick={() => setActiveTab('challenges')}
          >
            Challenges
          </button>
        </div>

        {/* Contenu dynamique selon l'onglet */}
        <div className="flex flex-col gap-4 px-4">
          {activeTab === 'activity' && (
            <>
              {mockFeed.map((post) => (
                <div key={post.id} className="bg-white rounded-2xl shadow p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar>
                      <AvatarFallback>{post.user.avatar}</AvatarFallback>
                    </Avatar>
                    <span className="font-semibold">{post.user.name}</span>
                    <span className="text-xs text-gray-400 ml-2">{post.time}</span>
                    <span className="ml-auto text-gray-400">•••</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-orange-600 text-base font-bold">⚡ séance de Training</span>
                  </div>
                  <div className="mb-2 text-gray-700">{post.content}</div>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><span role="img" aria-label="like">🧡</span>{post.likes}</span>
                    <span className="flex items-center gap-1"><span role="img" aria-label="comment">💬</span>{post.comments}</span>
                  </div>
                </div>
              ))}
            </>
          )}

          {activeTab === 'friends' && (
            <div className="bg-white rounded-2xl shadow p-4">
              <div className="font-bold text-lg mb-2">Amis</div>
              <div className="flex flex-col gap-2">
                {mockFriends.map((friend) => (
                  <div key={friend.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarFallback>{friend.avatar}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{friend.name}</span>
                    </div>
                    <Button variant="outline" className="text-blue-600 border-blue-200 px-4 py-1 rounded-full">Ajouter</Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'challenges' && (
            <div className="bg-white rounded-2xl shadow p-4 text-center text-gray-400 font-semibold text-lg">Bientôt disponible !</div>
          )}
        </div>
      </div>
    </div>
  );
} 