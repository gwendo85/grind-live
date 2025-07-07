import { AuthForm } from '@/components/auth/AuthForm';

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <span className="flex items-center justify-center" style={{ width: 56, height: 56 }}>
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="g-orange-auth" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FF9100"/>
                    <stop offset="1" stopColor="#FF6A00"/>
                  </linearGradient>
                </defs>
                <rect x="0" y="0" width="56" height="56" rx="16" fill="url(#g-orange-auth)"/>
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fontFamily="Inter, Arial, sans-serif" fontWeight="700" fontSize="32" fill="#fff">G</text>
              </svg>
            </span>
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
              conditions d&apos;utilisation
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
