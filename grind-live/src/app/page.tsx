import { Zap, Brain, Users, Dumbbell, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#e9f0ff] to-[#f6f7fb] px-2 pb-safe overflow-hidden">
      <section
        className="bg-white rounded-[2.5rem] shadow-2xl flex flex-col items-center text-center"
        style={{
          boxShadow: '0 8px 40px 0 rgba(31,38,135,0.10)',
          width: '100%',
          maxWidth: 440,
          height: 'auto',
          minHeight: 520,
          maxHeight: 700,
          padding: '2.5rem 2rem',
        }}
      >
        {/* Logo + texte */}
        <div className="flex items-center justify-center gap-4 mb-2">
          {/* Logo carré arrondi orange dégradé avec G blanche */}
          <span className="flex items-center justify-center" style={{ width: 56, height: 56 }}>
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <span className="font-extrabold text-4xl md:text-5xl text-black leading-none" style={{letterSpacing:'-0.04em',textShadow:'0 2px 8px rgba(0,0,0,0.18)'}}>GRIND</span>
            <span className="font-extrabold text-4xl md:text-5xl text-black leading-none ml-2" style={{letterSpacing:'-0.04em',textShadow:'0 2px 8px rgba(0,0,0,0.18)'}}>Live</span>
          </span>
        </div>
        {/* Slogan orange */}
        <div className="text-xl md:text-2xl font-bold text-[#FF6A00] mb-2">Transforme ta passion en puissance <span role="img" aria-label="flamme">🔥</span></div>
        {/* Valeurs */}
        <div className="text-lg md:text-xl font-extrabold text-[#232B3A] mb-3">Performance • Discipline • Communauté</div>
        {/* Accroche italique */}
        <div className="italic text-[#232B3A] text-base md:text-lg mb-6 opacity-90">Transforme ton quotidien, dépasse-toi.</div>
        {/* Icônes features */}
        <div className="flex justify-center gap-6 mb-7 w-full">
          <div className="flex flex-col items-center flex-1">
            <span className="bg-[#FFE7C2] rounded-2xl p-6 mb-2 flex items-center justify-center transition-all duration-200 shadow-sm backdrop-blur-md bg-opacity-70 hover:scale-105 hover:shadow-lg hover:bg-[#ffe0b2]/80 hover:backdrop-blur-xl cursor-pointer">
              {/* Éclair orange */}
              <svg width="40" height="40" viewBox="0 0 32 32" fill="none"><path d="M13.5 3L6 18h7l-2 9L26 14h-7l2-11-7.5 11z" fill="#FF9100"/></svg>
            </span>
            <span className="text-lg font-bold text-[#232B3A] mt-1">Training</span>
          </div>
          <div className="flex flex-col items-center flex-1">
            <span className="bg-[#D6E7FF] rounded-2xl p-6 mb-2 flex items-center justify-center transition-all duration-200 shadow-sm backdrop-blur-md bg-opacity-70 hover:scale-105 hover:shadow-lg hover:bg-[#dbeafe]/80 hover:backdrop-blur-xl cursor-pointer">
              {/* Cerveau bleu */}
              <svg width="40" height="40" viewBox="0 0 32 32" fill="none"><path d="M10.5 19.5C8 19.5 6 17.5 6 15s2-4.5 4.5-4.5c.5-2 2.5-3.5 4.5-3.5s4 1.5 4.5 3.5C24 10.5 26 12.5 26 15s-2 4.5-4.5 4.5" stroke="#3B82F6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 11v10M13 13v6M19 13v6" stroke="#3B82F6" strokeWidth="2.2" strokeLinecap="round"/></svg>
            </span>
            <span className="text-lg font-bold text-[#232B3A] mt-1">Mental</span>
          </div>
          <div className="flex flex-col items-center flex-1">
            <span className="bg-[#D6F9E7] rounded-2xl p-6 mb-2 flex items-center justify-center transition-all duration-200 shadow-sm backdrop-blur-md bg-opacity-70 hover:scale-105 hover:shadow-lg hover:bg-[#bbf7d0]/80 hover:backdrop-blur-xl cursor-pointer">
              {/* Personne verte */}
              <svg width="40" height="40" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="12" r="5" fill="#22C55E"/><rect x="8" y="20" width="16" height="6" rx="3" fill="#22C55E"/></svg>
            </span>
            <span className="text-lg font-bold text-[#232B3A] mt-1">Social</span>
          </div>
          <div className="flex flex-col items-center flex-1">
            <span className="bg-[#F3E8FF] rounded-2xl p-6 mb-2 flex items-center justify-center transition-all duration-200 shadow-sm backdrop-blur-md bg-opacity-70 hover:scale-105 hover:shadow-lg hover:bg-[#f3e8ff]/90 hover:backdrop-blur-xl cursor-pointer">
              {/* Haltères violettes */}
              <svg width="40" height="40" viewBox="0 0 32 32" fill="none"><rect x="8" y="14" width="16" height="4" rx="2" fill="#A259F7"/><rect x="10" y="10" width="4" height="12" rx="2" fill="#A259F7"/><rect x="18" y="10" width="4" height="12" rx="2" fill="#A259F7"/></svg>
            </span>
            <span className="text-lg font-bold text-[#232B3A] mt-1">Fitness</span>
          </div>
        </div>
        {/* Bouton orange */}
        <Link href="/auth" className="block w-full">
          <button className="w-full bg-[#FF6A00] hover:bg-[#ff9100] text-white font-bold text-xl rounded-2xl py-4 shadow-lg transition-all mb-3" style={{boxShadow:'0 4px 16px 0 rgba(255,105,0,0.15)'}}>Commencer maintenant</button>
        </Link>
        {/* Texte bas */}
        <div className="text-[#B0B8C1] text-base mt-1">Rejoins ceux qui partagent les mêmes valeurs</div>
      </section>
      {/* Bouton déconnexion en bas sur mobile */}
      <div className="w-full flex justify-end pr-6 pb-6 md:hidden">
        <button className="bg-[#FF6A00] rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-transform active:scale-90 active:shadow-inner">
          <LogOut className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
}
