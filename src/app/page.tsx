import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Dumbbell, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <Image
        src="/hero-bg.jpg"
        alt="Groupe fitness"
        fill
        className="object-cover object-center absolute inset-0 z-0"
        priority
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-yellow-400/40 via-pink-500/30 to-purple-700/40" />
      {/* Glassmorphism Hero */}
      <div className="relative z-20 max-w-xl w-full mx-auto p-8 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 shadow-xl flex flex-col items-center">
        <Dumbbell className="h-14 w-14 text-primary mb-4 drop-shadow-lg" />
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-white drop-shadow">
          GRIND <span className="text-primary">Live</span>
        </h1>
        <p className="text-lg text-center text-white/90 mb-8 drop-shadow">
          Transforme ta force, ton corps et ton mental. XP, progression, social, LIVE.
        </p>
        <Button asChild size="lg" className="text-lg px-8 py-6 shadow-lg">
          <Link href="/auth">
            Commencer gratuitement
            <Zap className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
} 