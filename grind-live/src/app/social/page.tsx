"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Zap } from "lucide-react";

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
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4">
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
          <h2 className="text-2xl font-bold flex items-center gap-2"><span>👋</span> Salut, {prenom} !</h2>
          <p className="text-gray-600 text-base">Prêt à découvrir l'activité de ta communauté&nbsp;?</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-4 mb-4">
          <button className="px-4 py-2 rounded-full bg-orange-100 text-orange-600 font-semibold">Activity</button>
          <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-500 font-semibold">Friends</button>
          <button className="px-4 py-2 rounded-full bg-indigo-100 text-indigo-600 font-semibold">Challenges</button>
        </div>

        {/* Feed d'activité */}
        <div className="flex flex-col gap-4 px-4">
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

          {/* Section Amis */}
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
        </div>
      </div>
    </div>
  );
} 