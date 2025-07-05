'use client';

import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { User, LogOut, Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Header() {
  const { user, loading, signOut, isAuthenticated } = useUser();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Appliquer la classe dark/light sur le body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Initialiser le mode selon le localStorage
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') setIsDarkMode(true);
  }, []);

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            GRIND Live
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/dashboard" className="text-gray-700 dark:text-gray-200 hover:text-purple-600 transition-colors">
              Dashboard
            </Link>
            <Link href="/workouts" className="text-gray-700 dark:text-gray-200 hover:text-purple-600 transition-colors">
              Workouts
            </Link>
            <Link href="/social" className="text-gray-700 dark:text-gray-200 hover:text-purple-600 transition-colors">
              Social
            </Link>
          </nav>

          {/* User Menu + DarkMode */}
          <div className="flex items-center space-x-4">
            {/* Bouton dark mode */}
            <button
              onClick={() => setIsDarkMode((v) => !v)}
              className={`p-2 rounded-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700`}
              title={isDarkMode ? 'Mode clair' : 'Mode sombre'}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {loading ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ) : isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link href="/profile" className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-purple-600 transition-colors">
                  {user?.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={user.name || user.email} 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <User size={20} />
                  )}
                  <span className="hidden sm:block text-sm font-medium">
                    {user?.name || user?.email}
                  </span>
                </Link>
                <button
                  onClick={signOut}
                  className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                  title="Se déconnecter"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link 
                href="/auth" 
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Se connecter
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
