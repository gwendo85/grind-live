'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, TrendingUp, Users, Play, Plus, Calendar, Award } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabaseClient';
import type { User, Workout } from '@/lib/types';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user: authUser },
      } = await supabaseBrowser().auth.getUser();

      if (authUser) {
        // Récupérer le profil utilisateur
        const { data: profile } = await supabaseBrowser()
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();

        setUser(profile);

        // Récupérer les workouts récents
        const { data: workouts } = await supabaseBrowser()
          .from('workouts')
          .select('*')
          .eq('user_id', authUser.id)
          .order('created_at', { ascending: false })
          .limit(5);

        setRecentWorkouts(workouts || []);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p>Veuillez vous connecter pour accéder au dashboard.</p>
      </div>
    );
  }

  const xpToNextLevel = 100 - (user.xp % 100);
  const progressPercentage = user.xp % 100;

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bonjour, {user.username} ! 👋</h1>
        <p className="text-muted-foreground">Prêt pour ton prochain entraînement ?</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Level & XP */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Niveau</CardTitle>
            <Trophy className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.level}</div>
            <p className="text-xs text-muted-foreground">{user.xp} XP total</p>
            <div className="mt-2">
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {xpToNextLevel} XP pour le niveau suivant
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Goal */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Objectif</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.goal || 'Non défini'}</div>
            <p className="text-xs text-muted-foreground">Ton objectif principal</p>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Séances récentes</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentWorkouts.length}</div>
            <p className="text-xs text-muted-foreground">Cette semaine</p>
          </CardContent>
        </Card>

        {/* Social */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Amis</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Connectés</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Actions rapides
            </CardTitle>
            <CardDescription>
              Commence ton entraînement ou explore les fonctionnalités
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle séance
            </Button>
            <Button variant="outline" className="w-full" size="lg">
              <Play className="mr-2 h-4 w-4" />
              Mode LIVE
            </Button>
            <Button variant="outline" className="w-full" size="lg">
              <Calendar className="mr-2 h-4 w-4" />
              Planifier
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Badges récents
            </CardTitle>
            <CardDescription>Tes accomplissements et récompenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun badge encore débloqué</p>
              <p className="text-sm text-muted-foreground">
                Continue tes entraînements pour débloquer des badges !
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Workouts */}
      <Card>
        <CardHeader>
          <CardTitle>Séances récentes</CardTitle>
          <CardDescription>Tes derniers entraînements</CardDescription>
        </CardHeader>
        <CardContent>
          {recentWorkouts.length > 0 ? (
            <div className="space-y-4">
              {recentWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{workout.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(workout.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={workout.status === 'completed' ? 'default' : 'secondary'}>
                      {workout.status}
                    </Badge>
                    {workout.is_live && <Badge variant="destructive">LIVE</Badge>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucune séance encore</p>
              <p className="text-sm text-muted-foreground">Commence ton premier entraînement !</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
