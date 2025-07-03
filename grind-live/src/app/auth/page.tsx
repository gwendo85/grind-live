import { Trophy } from 'lucide-react';
import AuthForm from '@/components/auth/AuthForm';

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <Trophy className="h-12 w-12 text-primary" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight">Rejoins GRIND Live</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Connecte-toi pour commencer ton aventure fitness
          </p>
        </div>

        {/* Auth Form */}
        <div className="mt-8">
          <AuthForm />
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            En continuant, tu acceptes nos{' '}
            <a href="/terms" className="text-primary hover:underline">
              conditions d'utilisation
            </a>{' '}
            et notre{' '}
            <a href="/privacy" className="text-primary hover:underline">
              politique de confidentialité
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
