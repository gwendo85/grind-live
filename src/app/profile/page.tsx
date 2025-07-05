'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Target, Activity, Settings, LogOut, Star, Zap, Flame } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProfilePage() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Données fictives pour la démo
  const userProfile = {
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    level: "Intermédiaire",
    memberSince: "Mars 2024",
    stats: {
      workouts: 47,
      totalTime: "89h",
      calories: "12,450",
      streak: 12
    },
    achievements: [
      { name: "Premier Workout", icon: "🏆", date: "15 Mars" },
      { name: "7 jours consécutifs", icon: "🔥", date: "22 Mars" },
      { name: "1000 calories", icon: "💪", date: "28 Mars" }
    ]
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white' 
        : 'bg-gradient-to-br from-[#e9f0ff] to-[#f6f7fb] text-gray-900'
    } px-4 py-8 pb-safe`}>
      
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            GRIND Live
          </Link>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800 hover:bg-gray-700' 
                : 'bg-white hover:bg-gray-50 shadow-md'
            }`}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Profile Header */}
        <div className={`rounded-2xl p-6 mb-6 transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700' 
            : 'bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200'
        }`}>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <Image 
                src={userProfile.avatar} 
                alt={userProfile.name}
                width={96}
                height={96}
                className="w-24 h-24 rounded-full object-cover border-4 border-purple-500 shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white"></div>
            </div>
            
            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{userProfile.name}</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-2">{userProfile.email}</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isDarkMode 
                    ? 'bg-purple-600/20 text-purple-300' 
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {userProfile.level}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isDarkMode 
                    ? 'bg-blue-600/20 text-blue-300' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  Membre depuis {userProfile.memberSince}
                </span>
              </div>
            </div>

            {/* Settings Button */}
            <Link href="/settings" className={`p-3 rounded-xl transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}>
              <Settings size={20} />
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className={`p-4 rounded-xl text-center transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-800/50 border border-gray-700' 
              : 'bg-white/80 shadow-lg border border-gray-200'
          }`}>
            <div className="text-2xl font-bold text-purple-600 mb-1">{userProfile.stats.workouts}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Workouts</div>
          </div>
          
          <div className={`p-4 rounded-xl text-center transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-800/50 border border-gray-700' 
              : 'bg-white/80 shadow-lg border border-gray-200'
          }`}>
            <div className="text-2xl font-bold text-blue-600 mb-1">{userProfile.stats.totalTime}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Temps total</div>
          </div>
          
          <div className={`p-4 rounded-xl text-center transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-800/50 border border-gray-700' 
              : 'bg-white/80 shadow-lg border border-gray-200'
          }`}>
            <div className="text-2xl font-bold text-green-600 mb-1">{userProfile.stats.calories}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Calories</div>
          </div>
          
          <div className={`p-4 rounded-xl text-center transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-800/50 border border-gray-700' 
              : 'bg-white/80 shadow-lg border border-gray-200'
          }`}>
            <div className="text-2xl font-bold text-orange-600 mb-1">{userProfile.stats.streak}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Jours consécutifs</div>
          </div>
        </div>

        {/* Achievements */}
        <div className={`rounded-2xl p-6 transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700' 
            : 'bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200'
        }`}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Trophy className="text-yellow-500" size={24} />
            Réalisations
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {userProfile.achievements.map((achievement, index) => (
              <div key={index} className={`p-4 rounded-xl transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-700/50 border border-gray-600' 
                  : 'bg-gray-50 border border-gray-200'
              }`}>
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <div className="font-semibold mb-1">{achievement.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{achievement.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/dashboard" className={`p-4 rounded-xl transition-all duration-300 flex items-center gap-3 ${
            isDarkMode 
              ? 'bg-gray-800/50 border border-gray-700 hover:bg-gray-700/50' 
              : 'bg-white/80 shadow-lg border border-gray-200 hover:bg-white'
          }`}>
            <Activity className="text-purple-600" size={24} />
            <div>
              <div className="font-semibold">Dashboard</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Voir mes progrès</div>
            </div>
          </Link>
          
          <Link href="/workouts" className={`p-4 rounded-xl transition-all duration-300 flex items-center gap-3 ${
            isDarkMode 
              ? 'bg-gray-800/50 border border-gray-700 hover:bg-gray-700/50' 
              : 'bg-white/80 shadow-lg border border-gray-200 hover:bg-white'
          }`}>
            <Target className="text-blue-600" size={24} />
            <div>
              <div className="font-semibold">Workouts</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Commencer un entraînement</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
} 