import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });

    // Échanger le code contre une session
    await supabase.auth.exchangeCodeForSession(code);

    // Récupérer l'utilisateur
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Vérifier si l'utilisateur a déjà un profil
      const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single();

      if (!profile) {
        // Créer le profil utilisateur s'il n'existe pas
        await supabase.from('users').insert({
          id: user.id,
          email: user.email!,
          username: user.email!.split('@')[0], // Username temporaire
        });
      }
    }
  }

  // Rediriger vers le dashboard
  return NextResponse.redirect(new URL('/dashboard', request.url));
}
