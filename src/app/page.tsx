'use client';

import Link from 'next/link';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { Dumbbell, Zap, Brain, Users } from 'lucide-react';

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Animation d'entrée après le chargement
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  // Sauvegarde du thème dans localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Chargement du thème depuis localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  // Mémorisation des styles pour éviter les recalculs
  const containerStyle = useMemo(() => ({
    boxShadow: isDarkMode 
      ? '0 8px 40px 0 rgba(0,0,0,0.3)' 
      : '0 8px 40px 0 rgba(31,38,135,0.10)',
    width: '100%',
    maxWidth: 'min(440px, 95vw)',
    height: 'auto',
    minHeight: 'min(520px, 80vh)',
    maxHeight: 'min(700px, 90vh)',
    padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 3vw, 2rem)',
  }), [isDarkMode]);

  const logoStyle = useMemo(() => ({
    width: 'clamp(40px, 8vw, 56px)', 
    height: 'clamp(40px, 8vw, 56px)'
  }), []);

  const textShadowStyle = useMemo(() => ({
    letterSpacing: '-0.04em',
    textShadow: isDarkMode 
      ? '0 2px 8px rgba(255,255,255,0.1)' 
      : '0 2px 8px rgba(0,0,0,0.18)'
  }), [isDarkMode]);

  const buttonShadowStyle = useMemo(() => ({
    boxShadow: '0 4px 16px 0 rgba(255,105,0,0.15)'
  }), []);

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-[#0f172a] to-[#1e293b]' 
        : 'bg-gradient-to-br from-[#e9f0ff] to-[#f6f7fb]'
    } px-4 py-8 pb-safe overflow-hidden relative`}
    style={{
      backgroundImage: `url('/bg-fitness2.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      
      {/* Overlay pour la lisibilité et l'ambiance dorée */}
      <div className="absolute inset-0 z-0" style={{
        background: 'linear-gradient(120deg, rgba(255,186,115,0.45) 0%, rgba(255,115,115,0.15) 100%)',
        mixBlendMode: 'multiply'
      }}></div>
      <div className={`absolute inset-0 z-0 transition-all duration-500 ${
        isDarkMode 
          ? 'bg-black/60' 
          : 'bg-white/40'
      }`}></div>
      
      {/* Contenu principal avec z-index pour être au-dessus de l'overlay */}
      <div className="relative z-10 w-full flex flex-col justify-center items-center">
      
        {/* Bouton mode sombre */}
        <button
          onClick={toggleDarkMode}
          className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 ${
            isDarkMode 
              ? 'bg-white/10 text-yellow-300 hover:bg-white/20' 
              : 'bg-black/10 text-gray-600 hover:bg-black/20'
          } backdrop-blur-md`}
          aria-label="Basculer le mode sombre"
        >
          {isDarkMode ? (
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>

        <section
          className={`transition-all duration-500 ease-out ${
            isDarkMode 
              ? 'bg-gray-900/80 text-white shadow-2xl' 
              : 'bg-white text-black shadow-2xl'
          } rounded-[2rem] md:rounded-[2.5rem] flex flex-col items-center text-center ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={containerStyle}
        >
          {/* Logo + texte avec animation */}
          <div className={`flex items-center justify-center gap-3 md:gap-4 mb-2 transition-all duration-700 delay-200 ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}>
            {/* Logo carré arrondi orange dégradé avec G blanche */}
            <span className="flex items-center justify-center animate-pulse" style={logoStyle}>
              <svg width="100%" height="100%" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="g-orange" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FF9100"/>
                    <stop offset="1" stopColor="#FF6A00"/>
                  </linearGradient>
                </defs>
                <rect x="0" y="0" width="56" height="56" rx="16" fill="url(#g-orange)"/>
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fontFamily="Inter, Arial, sans-serif" fontWeight="700" fontSize="32" fill="#fff">G</text>
              </svg>
            </span>
            <span className="flex items-end">
              <span className={`font-extrabold text-3xl sm:text-4xl md:text-5xl leading-none transition-colors duration-500 ${
                isDarkMode ? 'text-white' : 'text-black'
              }`} style={textShadowStyle}>GRIND</span>
              <span className={`font-extrabold text-3xl sm:text-4xl md:text-5xl leading-none ml-1 md:ml-2 transition-colors duration-500 ${
                isDarkMode ? 'text-white' : 'text-black'
              }`} style={textShadowStyle}>Live</span>
            </span>
          </div>
          
          {/* Slogan orange avec animation */}
          <div className={`text-lg sm:text-xl md:text-2xl font-bold text-[#FF6A00] mb-2 transition-all duration-700 delay-300 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            Transforme ta passion en puissance <span role="img" aria-label="flamme" className="animate-bounce inline-block">🔥</span>
          </div>
          
          {/* Valeurs avec animation */}
          <div className={`text-base sm:text-lg md:text-xl font-extrabold mb-3 transition-all duration-700 delay-400 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          } ${isDarkMode ? 'text-gray-200' : 'text-[#232B3A]'}`}>
            Performance • Discipline • Communauté
          </div>
          
          {/* Accroche italique avec animation */}
          <div className={`italic text-sm sm:text-base md:text-lg mb-4 md:mb-6 transition-all duration-700 delay-500 ${
            isLoaded ? 'opacity-90 translate-y-0' : 'opacity-0 translate-y-4'
          } ${isDarkMode ? 'text-gray-300' : 'text-[#232B3A]'}`}>
            Transforme ton quotidien, dépasse-toi.
          </div>
          
          {/* Icônes en deux rangées serrées de 2 avec label et pictos explicites */}
          <div className="flex flex-col items-center w-full mb-4 gap-2">
            <div className="flex flex-row justify-center gap-4">
              {/* Fitness (haut gauche) - Dumbbell */}
              <div className="flex flex-col items-center">
                <span className="flex items-center justify-center rounded-2xl bg-[#F3E8FF] shadow-lg animate-glow" style={{width:52, height:52, boxShadow:'0 0 16px 4px #A259F744'}}>
                  <Dumbbell size={28} color="#A259F7" />
                </span>
                <span className="mt-1 text-xs font-bold text-[#A259F7]">Fitness</span>
              </div>
              {/* Training (haut droite) - Zap */}
              <div className="flex flex-col items-center">
                <span className="flex items-center justify-center rounded-2xl bg-[#FFE7C2] shadow-lg animate-glow" style={{width:52, height:52, boxShadow:'0 0 16px 4px #FF910044'}}>
                  <Zap size={28} color="#FF9100" />
                </span>
                <span className="mt-1 text-xs font-bold text-[#FF9100]">Training</span>
              </div>
            </div>
            <div className="flex flex-row justify-center gap-4">
              {/* Social (bas gauche) - Users */}
              <div className="flex flex-col items-center">
                <span className="flex items-center justify-center rounded-2xl bg-[#D6F9E7] shadow-lg animate-glow" style={{width:52, height:52, boxShadow:'0 0 16px 4px #22C55E44'}}>
                  <Users size={28} color="#22C55E" />
                </span>
                <span className="mt-1 text-xs font-bold text-[#22C55E]">Social</span>
              </div>
              {/* Mental (bas droite) - Brain */}
              <div className="flex flex-col items-center">
                <span className="flex items-center justify-center rounded-2xl bg-[#D6E7FF] shadow-lg animate-glow" style={{width:52, height:52, boxShadow:'0 0 16px 4px #3B82F644'}}>
                  <Brain size={28} color="#3B82F6" />
                </span>
                <span className="mt-1 text-xs font-bold text-[#3B82F6]">Mental</span>
              </div>
            </div>
          </div>
          
          {/* Bouton orange avec animation */}
          <Link href="/auth" className={`block w-full transition-all duration-700 delay-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}>
            <button 
              className="w-full bg-[#FF6A00] hover:bg-[#ff9100] text-white font-bold text-lg md:text-xl rounded-xl md:rounded-2xl py-3 md:py-4 shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 mb-3 touch-manipulation" 
              style={buttonShadowStyle}
            >
              Commencer maintenant
            </button>
          </Link>
          
          {/* Texte bas avec animation */}
          <div className={`text-sm md:text-base mt-1 transition-all duration-700 delay-800 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          } ${isDarkMode ? 'text-gray-400' : 'text-[#B0B8C1]'}`}>
            Rejoins ceux qui partagent les mêmes valeurs
          </div>
        </section>
      </div>
    </div>
  );
}
