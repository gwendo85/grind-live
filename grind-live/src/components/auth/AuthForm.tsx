'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabaseBrowser } from '@/lib/supabaseClient';

export default function AuthForm() {
  return (
    <div className="w-full max-w-md mx-auto">
      <Auth
        supabaseClient={supabaseBrowser()}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: 'hsl(var(--primary))',
                brandAccent: 'hsl(var(--primary-foreground))',
              },
            },
          },
        }}
        providers={['google']}
        redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`}
        showLinks={true}
        view="magic_link"
        theme="dark"
      />
    </div>
  );
}
