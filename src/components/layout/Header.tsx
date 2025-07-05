'use client';

import { useState, useEffect, useId } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { User, LogOut, Settings, Trophy, Users, Home, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabaseBrowser } from '@/lib/supabaseClient';
import type { User as UserType } from '@/lib/types';
import { motion } from 'framer-motion';

export default function Header() {
  const [user, setUser] = useState<UserType | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const gradientId = useId();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabaseBrowser.auth.getUser();
      if (user) {
        const { data: profile } = await supabaseBrowser
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        setUser(profile);
      }
    };

    getUser();

    const {
      data: { subscription },
    } = supabaseBrowser.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabaseBrowser
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setUser(profile);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabaseBrowser.auth.signOut();
    router.push('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 w-full border-b bg-white/60 backdrop-blur-xl supports-[backdrop-filter]:bg-white/40 shadow-lg border-white/30"
      style={{
        WebkitBackdropFilter: 'blur(16px)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1.5px solid rgba(255,255,255,0.25)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
      }}
    >
      <div className={`flex h-14 items-center w-full ${pathname === '/' ? 'px-4 md:px-8 max-w-3xl mx-auto' : 'container'}`}>
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3">
          {/* Logo carré arrondi orange dégradé avec G blanche */}
          <span className="w-12 h-12 flex items-center justify-center rounded-xl shadow-md">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF9100"/>
                  <stop offset="1" stopColor="#FF6A00"/>
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="48" height="48" rx="12" fill={`url(#${gradientId})`}/>
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fontFamily="Inter, Arial, sans-serif" fontWeight="700" fontSize="24" fill="#fff">G</text>
            </svg>
          </span>
          {/* Texte logo */}
          <span className="flex items-end">
            <span className="font-extrabold text-3xl text-black leading-none" style={{ letterSpacing: '-0.04em', textShadow: '0 2px 8px rgba(0,0,0,0.10)' }}>GRIND</span>
            <span className="font-semibold text-3xl text-black leading-none ml-2" style={{ letterSpacing: '-0.04em', textShadow: '0 2px 8px rgba(0,0,0,0.10)' }}>Live</span>
          </span>
        </Link>

        {/* Desktop Navigation - masqué sauf sur la landing page */}
        {pathname !== '/' && (
          <nav className="hidden md:flex items-center space-x-6 ml-6">
            <Link href="/dashboard" className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary">
              <Home className="h-4 w-4" style={{ color: '#FF9100' }} />
              <span>Dashboard</span>
            </Link>
            <Link href="/workouts" className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary">
              <Trophy className="h-4 w-4" style={{ color: '#FF9100' }} />
              <span>Workouts</span>
            </Link>
            <Link href="/social" className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary">
              <Users className="h-4 w-4" style={{ color: '#FF9100' }} />
              <span>Social</span>
            </Link>
          </nav>
        )}

        <div className="flex flex-1 items-center justify-end space-x-4">
          {user ? (
            <>
              {/* XP Display */}
              <div className="hidden md:flex items-center space-x-2 text-sm">
                <span className="font-medium">Level {user.level}</span>
                <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${user.xp % 100}%` }}
                  />
                </div>
                <span className="text-muted-foreground">{user.xp} XP</span>
              </div>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar_url || ''} alt={user.username} />
                      <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.username}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            pathname === '/' && (
              <div className="flex items-center space-x-2">
                <Button asChild>
                  <Link href="/auth">Connexion</Link>
                </Button>
              </div>
            )
          )}

          {/* Icône de déconnexion à l'extrême droite, visible si connecté et pas sur la landing page */}
          {user && pathname !== '/' && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Déconnexion"
              onClick={handleSignOut}
              className="text-orange-500 hover:bg-orange-100 hover:text-orange-600 transition-colors"
            >
              <LogOut className="w-6 h-6" />
            </Button>
          )}

          {/* Mobile Menu Button - masqué sauf sur la landing page */}
          {pathname !== '/' && (
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation - masqué sauf sur la landing page */}
      {isMenuOpen && pathname !== '/' && (
        <div className="md:hidden border-t bg-background">
          <nav className="container py-4 space-y-4">
            <Link href="/dashboard" className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link href="/workouts" className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              <Trophy className="h-4 w-4" />
              <span>Workouts</span>
            </Link>
            <Link href="/social" className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              <Users className="h-4 w-4" />
              <span>Social</span>
            </Link>
          </nav>
        </div>
      )}
    </motion.header>
  );
}
