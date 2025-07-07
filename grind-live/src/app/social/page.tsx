"use client";
import React, { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useUser } from "../../hooks/useUser";
import { useFeed } from "../../hooks/useFeed";
import { AuthGuard } from "../../components/auth/AuthGuard";

const mockFriends = [
  { name: "Alice", avatar: "A" },
  { name: "Thomas", avatar: "T" },
  { name: "David", avatar: "D" },
];

type TabType = 'activity' | 'friends' | 'challenges';

export default function SocialPage() {
  const [activeTab, setActiveTab] = useState<TabType>('activity');
  const { user, loading: userLoading } = useUser();
  const { feed, loading: feedLoading } = useFeed();

  // Mémoiser les calculs utilisateur pour optimiser les performances
  const { userName, userInitial } = useMemo(() => {
    const name = user?.username || user?.email?.split('@')[0] || 'Utilisateur';
    return {
      userName: name,
      userInitial: name.charAt(0).toUpperCase()
    };
  }, [user?.username, user?.email]);

  // Optimiser les handlers de tabs avec useCallback
  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);

  // Afficher un loader si l'utilisateur est en cours de chargement
  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement du profil...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4">
        <div className="max-w-md mx-auto space-y-6">
          {/* Header avec navigation */}
          <div className="flex items-center justify-between mb-2">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
            <span className="inline-block w-8 h-8 rounded-full bg-gray-300 border-2 border-white overflow-hidden">
              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-medium">
                {userInitial}
              </div>
            </span>
          </div>

          {/* Message de bienvenue */}
          <div className="mb-2">
            <h2 className="text-2xl font-bold flex items-center gap-2"><span>👋</span> Salut, {userName} !</h2>
            <p className="text-gray-600 text-base">Prêt à découvrir l&apos;activité de ta communauté&nbsp;?</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 px-4 mb-4">
            <button
              className={`px-4 py-2 rounded-full font-semibold transition-all duration-150 ${activeTab === 'activity' ? 'bg-orange-100 text-orange-600 shadow' : 'bg-gray-100 text-gray-500'}`}
              onClick={() => handleTabChange('activity')}
            >
              Activity
            </button>
            <button
              className={`px-4 py-2 rounded-full font-semibold transition-all duration-150 ${activeTab === 'friends' ? 'bg-blue-100 text-blue-600 shadow' : 'bg-gray-100 text-gray-500'}`}
              onClick={() => handleTabChange('friends')}
            >
              Friends
            </button>
            <button
              className={`px-4 py-2 rounded-full font-semibold transition-all duration-150 ${activeTab === 'challenges' ? 'bg-indigo-100 text-indigo-600 shadow' : 'bg-gray-100 text-gray-500'}`}
              onClick={() => handleTabChange('challenges')}
            >
              Challenges
            </button>
          </div>

          {/* Contenu dynamique selon l'onglet */}
          <div className="flex flex-col gap-4 px-4">
            {activeTab === 'activity' && (
              <>
                {feedLoading ? (
                  <div className="bg-white rounded-2xl shadow p-4 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Chargement de l&apos;activité...</p>
                  </div>
                ) : feed.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow p-4 text-center text-gray-500">
                    <p>Aucune activité récente</p>
                  </div>
                ) : (
                  feed.map((post) => (
                    <div key={post.id} className="bg-white rounded-2xl shadow p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Avatar>
                          <AvatarFallback>{post.user.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="font-semibold">{post.user.name}</span>
                        <span className="text-xs text-gray-400 ml-2">
                          {post.timestamp ? new Date(post.timestamp).toLocaleString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'N/A'}
                        </span>
                        <span className="ml-auto text-gray-400">•••</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-orange-600 text-base font-bold">
                          {post.type === 'workout' ? '💪 Séance terminée' : 
                           post.type === 'achievement' ? '🏆 Nouveau record' : 
                           post.type === 'challenge' ? '🎯 Challenge' : '📝 Nouveau post'}
                        </span>
                      </div>
                      <div className="mb-2 text-gray-700">
                        <div>
                          <div className="font-semibold">{post.title}</div>
                          <div className="text-sm text-gray-500">{post.description}</div>
                        </div>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <span role="img" aria-label="like">🧡</span>0
                        </span>
                        <span className="flex items-center gap-1">
                          <span role="img" aria-label="comment">💬</span>0
                        </span>
                      </div>
                    </div>
                  ))
                )}
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
    </AuthGuard>
  );
} 