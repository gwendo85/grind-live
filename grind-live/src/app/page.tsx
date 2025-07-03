import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, Zap, Target, TrendingUp, Play, Award, BarChart3 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            🚀 Nouveau - Mode LIVE disponible
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Transforme tes
            <span className="text-primary block">entraînements</span>
            en aventure
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            GRIND Live révolutionne le fitness avec la gamification, le social et le mode LIVE.
            Gagne de l'XP, débloque des badges, défie tes amis et partage tes séances en direct.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/auth">
                Commencer gratuitement
                <Zap className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link href="#features">
                Découvrir les features
                <Play className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tout ce dont tu as besoin pour progresser
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Une plateforme complète qui combine tracking intelligent, gamification et social
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Tracking Intelligent */}
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Tracking Intelligent</CardTitle>
                <CardDescription>
                  Suis tes performances avec précision. Volume, PR, progression - tout est
                  automatiquement calculé.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Calcul automatique du volume</li>
                  <li>• Suivi des records personnels</li>
                  <li>• Statistiques détaillées</li>
                  <li>• Historique complet</li>
                </ul>
              </CardContent>
            </Card>

            {/* Gamification */}
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Gamification</CardTitle>
                <CardDescription>
                  Gagne de l'XP à chaque séance, monte en niveau et débloque des badges exclusifs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Système d'XP et de niveaux</li>
                  <li>• Badges à débloquer</li>
                  <li>• Défis hebdomadaires</li>
                  <li>• Classements</li>
                </ul>
              </CardContent>
            </Card>

            {/* Mode LIVE */}
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Play className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Mode LIVE</CardTitle>
                <CardDescription>
                  Partage tes séances en direct avec tes amis. Motivation et encouragement en temps
                  réel.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Séances en direct</li>
                  <li>• Statistiques temps réel</li>
                  <li>• Chat intégré</li>
                  <li>• Replays disponibles</li>
                </ul>
              </CardContent>
            </Card>

            {/* Social */}
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Social</CardTitle>
                <CardDescription>
                  Connecte-toi avec d'autres passionnés, partage tes progrès et motive tes amis.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Feed d'activités</li>
                  <li>• Système d'amis</li>
                  <li>• Likes et commentaires</li>
                  <li>• Défis entre amis</li>
                </ul>
              </CardContent>
            </Card>

            {/* Progression */}
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Progression Structurée</CardTitle>
                <CardDescription>
                  Des objectifs clairs et des programmes adaptés pour une progression constante.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Objectifs personnalisés</li>
                  <li>• Programmes adaptés</li>
                  <li>• Suivi de progression</li>
                  <li>• Recommandations IA</li>
                </ul>
              </CardContent>
            </Card>

            {/* Récompenses */}
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Récompenses</CardTitle>
                <CardDescription>
                  Débloque des récompenses exclusives et montre tes accomplissements.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Badges exclusifs</li>
                  <li>• Titres personnalisés</li>
                  <li>• Récompenses saisonnières</li>
                  <li>• Hall of Fame</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prêt à transformer tes entraînements ?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Rejoins des milliers d'athlètes qui ont déjà révolutionné leur approche du fitness
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/auth">
              Commencer maintenant
              <Target className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
