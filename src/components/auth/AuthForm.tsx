'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabaseBrowser } from '@/lib/supabaseClient';
import { useState, useEffect } from 'react';

export default function AuthForm() {
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false);

  useEffect(() => {
    // Vérifier si Supabase est configuré
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // Vérifier que les clés sont définies et ne sont pas les valeurs factices
    const isConfigured = !!(supabaseUrl && supabaseAnonKey && 
      !supabaseUrl.includes('your-project') && 
      !supabaseAnonKey.includes('your-anon-key') &&
      supabaseUrl.startsWith('https://') &&
      supabaseAnonKey.startsWith('eyJ'));
    
    setIsSupabaseConfigured(isConfigured);
  }, []);

  if (!isSupabaseConfigured) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="text-center">
          <div className="text-yellow-600 text-lg font-semibold mb-2">
            🔧 Configuration Supabase requise
          </div>
          <p className="text-yellow-700 text-sm mb-4">
            Pour utiliser l&apos;authentification, configure tes variables d&apos;environnement Supabase dans le fichier <code>.env.local</code>
          </p>
          <div className="bg-white p-4 rounded border text-left text-sm">
            <div className="font-mono text-xs">
              <div>NEXT_PUBLIC_SUPABASE_URL=</div>
              <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=</div>
            </div>
          </div>
          <div className="mt-4">
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Continuer sans auth (démo)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Auth
        supabaseClient={supabaseBrowser}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#f97316',
                brandAccent: '#f59e42',
              },
            },
          },
        }}
        providers={['google']}
        redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`}
        showLinks={true}
        view="magic_link"
        theme="light"
      />
    </div>
  );
}
