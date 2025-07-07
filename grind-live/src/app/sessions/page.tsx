'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useExplorer } from '@/hooks/useExplorer';
import { useFavorites } from '@/hooks/useFavorites';
import { Plus, Trash2, Eye, Edit, Calendar, Clock, Dumbbell } from 'lucide-react';
import { toast } from 'sonner';

export default function SessionsPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const { workouts, loading: workoutsLoading, deleteWorkout, refresh } = useWorkouts();
  const { publicWorkouts } = useExplorer();
  const { favorites } = useFavorites();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Redirection si non connecté
  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/auth');
    }
  }, [user, userLoading, router]);

  const handleDelete = useCallback(async (workoutId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette séance ?')) {
      return;
    }

    setIsDeleting(workoutId);
    try {
      await deleteWorkout(workoutId);
      toast.success('Séance supprimée avec succès');
      refresh();
    } catch (error) {
      console.error('Erreur suppression:', error);
      toast.error('Erreur lors de la suppression');
    } finally {
      setIsDeleting(null);
    }
  }, [deleteWorkout, refresh]);

  const handleCreateSession = useCallback(() => {
    router.push('/workouts?create=true');
  }, [router]);

  const handleViewSession = useCallback((workoutId: string) => {
    router.push(`/workouts/${workoutId}`);
  }, [router]);

  const handleEditSession = useCallback((workoutId: string) => {
    router.push(`/workouts/${workoutId}?edit=true`);
  }, [router]);

  // Calcul des statistiques (mémorisées pour performance)
  const stats = useMemo(() => ({
    mySessions: workouts?.length || 0,
    favorites: favorites?.length || 0,
    public: publicWorkouts?.length || 0
  }), [workouts, favorites, publicWorkouts]);

  if (userLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="flex space-x-2 mb-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl p-4 flex-1 h-20"></div>
            ))}
          </div>
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirection en cours
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 text-gray-900">
          💪 Prêt pour ta séance, {user.user_metadata?.full_name?.split(' ')[0] || 'Athlète'} ?
        </h1>
        <p className="text-gray-600">Retrouve toutes tes séances et lance-toi !</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Mes séances</p>
              <p className="text-2xl font-bold text-gray-900">{stats.mySessions}</p>
            </div>
            <Dumbbell className="text-[#FF6A00] h-6 w-6" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Favoris</p>
              <p className="text-2xl font-bold text-gray-900">{stats.favorites}</p>
            </div>
            <div className="text-[#FF6A00] h-6 w-6">❤️</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Publiques</p>
              <p className="text-2xl font-bold text-gray-900">{stats.public}</p>
            </div>
            <div className="text-[#FF6A00] h-6 w-6">🌍</div>
          </div>
        </div>
      </div>

      {/* CTA Principal */}
      <button
        onClick={handleCreateSession}
        className="bg-[#FF6A00] text-white w-full rounded-xl py-4 font-bold hover:bg-orange-600 transition-colors mb-6 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
      >
        <Plus className="h-5 w-5" />
        + Créer une nouvelle séance
      </button>

      {/* Liste des séances */}
      {workoutsLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-4 rounded-xl shadow-sm animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : workouts?.length === 0 ? (
        <div className="text-center mt-12">
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="text-6xl mb-4">💪</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune séance trouvée</h3>
            <p className="text-gray-600 mb-6">Commence par créer ta première séance d'entraînement</p>
            <button
              onClick={handleCreateSession}
              className="bg-[#FF6A00] text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl"
            >
              Créer ta première séance
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {workouts?.map(workout => (
            <div key={workout.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {workout.name || 'Séance sans nom'}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(workout.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>~45 min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Dumbbell className="h-4 w-4" />
                      <span>{workout.exercise_count || 0} exercices</span>
                    </div>
                  </div>

                  {workout.notes && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {workout.notes}
                    </p>
                  )}

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      workout.status === 'completed' ? 'bg-green-100 text-green-800' :
                      workout.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      workout.status === 'live' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {workout.status === 'completed' ? 'Terminée' :
                       workout.status === 'in_progress' ? 'En cours' :
                       workout.status === 'live' ? 'En direct' :
                       'Brouillon'}
                    </span>
                    
                    {workout.is_live && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        🔴 Live
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleViewSession(workout.id)}
                  className="flex items-center gap-1 bg-[#FF6A00] text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  Voir
                </button>
                
                <button
                  onClick={() => handleEditSession(workout.id)}
                  className="flex items-center gap-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  Modifier
                </button>
                
                <button
                  onClick={() => handleDelete(workout.id)}
                  disabled={isDeleting === workout.id}
                  className="flex items-center gap-1 bg-red-100 text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-red-200 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  {isDeleting === workout.id ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Navigation rapide */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center gap-4">
          <Link 
            href="/dashboard" 
            className="text-[#FF6A00] hover:text-orange-600 font-medium transition-colors"
          >
            ← Retour au dashboard
          </Link>
          <span className="text-gray-400">•</span>
          <Link 
            href="/workouts" 
            className="text-[#FF6A00] hover:text-orange-600 font-medium transition-colors"
          >
            Gérer les séances
          </Link>
        </div>
      </div>
    </div>
  );
} 