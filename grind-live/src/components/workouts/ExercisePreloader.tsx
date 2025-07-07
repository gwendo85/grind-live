'use client';

import { useEffect } from 'react';
import { useExercises } from '@/hooks/useExercises';

interface ExercisePreloaderProps {
  onLoadComplete?: () => void;
  silent?: boolean;
}

export function ExercisePreloader({ onLoadComplete, silent = true }: ExercisePreloaderProps) {
  const { exercises, loading, error } = useExercises();

  useEffect(() => {
    if (!loading && exercises.length > 0 && onLoadComplete) {
      onLoadComplete();
    }
  }, [loading, exercises.length, onLoadComplete]);

  // Composant silencieux - ne rend rien
  if (silent) {
    return null;
  }

  // Version visible pour le debug
  return (
    <div className="fixed bottom-4 right-4 bg-white border rounded-lg shadow-lg p-3 text-sm">
      <div className="flex items-center gap-2">
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span>Chargement exercices...</span>
          </>
        ) : error ? (
          <>
            <span className="text-red-500">❌ Erreur</span>
            <span>{error}</span>
          </>
        ) : (
          <>
            <span className="text-green-500">✅</span>
            <span>{exercises.length} exercices prêts</span>
          </>
        )}
      </div>
    </div>
  );
} 