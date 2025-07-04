import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import { Toaster } from '@/components/ui/sonner';
import { LogOut } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GRIND Live - Fitness Gamified',
  description:
    'Track your workouts, earn XP, compete with friends, and go live with your fitness journey.',
  keywords: 'fitness, workout, gamification, social, live, tracking',
  authors: [{ name: 'GRIND Live Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="flex-1">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
