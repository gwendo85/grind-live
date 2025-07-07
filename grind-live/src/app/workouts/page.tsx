"use client";
import React, { useState, useCallback, useMemo } from "react";
import { useWorkouts } from "@/hooks/useWorkouts";
import { useExplorer } from "@/hooks/useExplorer";
import { useFavorites } from "@/hooks/useFavorites";
import Link from "next/link";
import { 
  ArrowLeft, 
  Plus, 
  Eye, 
  Trash2, 
  Star, 
  Clock, 
  Dumbbell,
  Menu,
  RefreshCw
} from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function WorkoutsPage() {
  const { workouts, loading: workoutsLoading, error: workoutsError, deleteWorkout, createWorkout, refresh } = useWorkouts();
  const { publicWorkouts, loading: explorerLoading } = useExplorer();
  const { favorites, loading: favoritesLoading, toggleFavorite, isFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState<'mes-seances' | 'explorer' | 'favoris'>('mes-seances');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState({ name: '', date: '', duration: '' });
  const [formError, setFormError] = useState('');
  const [exercises, setExercises] = useState<Array<{
    name: string;
    sets: string;
    reps: string;
    weight: string;
    rest: string;
  }>>([]);
  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: '',
    rest: ''
  });
  
  // Variable temporaire pour le nom d'utilisateur
  const prenom = 'Utilisateur';
  const router = useRouter();

  // Mémoisation des statistiques pour optimiser les performances
  const stats = useMemo(() => ({
    workoutsCount: workoutsLoading ? "..." : workouts?.length || 0,
    favoritesCount: favoritesLoading ? "..." : favorites?.length || 0,
    publicCount: explorerLoading ? "..." : publicWorkouts?.length || 0
  }), [workouts, favorites, publicWorkouts, workoutsLoading, favoritesLoading, explorerLoading]);

  const handleDeleteWorkout = useCallback(async (workoutId: string) => {
    if (!deleteWorkout) {
      toast.error('Fonction de suppression non disponible');
      return;
    }
    try {
      await deleteWorkout(workoutId);
      setShowDeleteConfirm(null);
      toast.success('Séance supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression de la séance');
    }
  }, [deleteWorkout]);

  const handleToggleFavorite = useCallback(async (workoutId: string) => {
    try {
      await toggleFavorite(workoutId);
      if (isFavorite(workoutId)) {
        toast.success('Séance retirée des favoris');
      } else {
        toast.success('Séance ajoutée aux favoris');
      }
    } catch (error) {
      toast.error('Erreur lors de la modification des favoris');
      console.error('Erreur lors de la modification des favoris:', error);
    }
  }, [toggleFavorite, isFavorite]);

  // Fonction pour formater la durée
  const formatDuration = useCallback((minutes: number | null | undefined) => {
    if (!minutes) return "N/A";
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }, []);

  // Fonction pour obtenir le temps écoulé
  const getTimeAgo = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `Il y a ${diffInHours}h`;
    } else if (diffInHours < 168) {
      const days = Math.floor(diffInHours / 24);
      return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    } else {
      const weeks = Math.floor(diffInHours / 168);
      return `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
    }
  }, []);

  // Validation du formulaire
  const validateForm = useCallback(() => {
    if (!form.name.trim()) {
      setFormError('Le nom de la séance est obligatoire');
      return false;
    }
    if (!form.date) {
      setFormError('La date est obligatoire');
      return false;
    }
    if (!form.duration || parseInt(form.duration) <= 0) {
      setFormError('La durée doit être supérieure à 0');
      return false;
    }
    if (exercises.length === 0) {
      setFormError('Ajoute au moins un exercice');
      return false;
    }
    for (const ex of exercises) {
      if (!ex.name.trim() || !ex.sets || !ex.reps) {
        setFormError('Chaque exercice doit avoir un nom, des séries et des répétitions');
        return false;
      }
    }
    return true;
  }, [form, exercises]);

  // Gestion de la soumission du formulaire
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    if (!validateForm()) {
      return;
    }

    try {
      const workoutData = {
        name: form.name.trim(),
        notes: `Durée estimée: ${form.duration} minutes`,
        date: form.date,
        exercises: exercises.map(exercise => ({
          name: exercise.name.trim(),
          sets: parseInt(exercise.sets),
          reps: parseInt(exercise.reps),
          weight: exercise.weight ? parseInt(exercise.weight) : undefined,
          rest: exercise.rest ? parseInt(exercise.rest) : undefined,
          notes: ''
        }))
      };
      
      await createWorkout(workoutData);
      setForm({ name: '', date: '', duration: '' });
      setExercises([]);
      setNewExercise({ name: '', sets: '', reps: '', weight: '', rest: '' });
      setOpenDialog(false);
      toast.success('Séance créée avec succès !');
      setTimeout(() => {
        router.push('/sessions');
      }, 1000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création de la séance';
      setFormError(errorMessage);
      toast.error(errorMessage);
    }
  }, [form, exercises, validateForm, createWorkout, router]);

  // Gestion de l&apos;ajout d'exercice
  const handleAddExercise = useCallback(() => {
    if (!newExercise.name.trim() || !newExercise.sets || !newExercise.reps) {
      toast.error('Remplissez tous les champs obligatoires');
      return;
    }
    
    setExercises([...exercises, { ...newExercise }]);
    setNewExercise({ name: '', sets: '', reps: '', weight: '', rest: '' });
    toast.success('Exercice ajouté');
  }, [newExercise, exercises]);

  // Gestion de la suppression d'exercice
  const handleRemoveExercise = useCallback((index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  }, [exercises]);

  // Gestion du rafraîchissement
  const handleRefresh = useCallback(() => {
    refresh();
    toast.success('Données actualisées');
  }, [refresh]);

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header avec navigation */}
        <header className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Retour au dashboard"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Logo GRIND Live */}
            <div className="text-2xl font-bold text-[#FF6A00]">GRIND</div>
            
            {/* Menu burger */}
            <button 
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Menu"
            >
              <Menu size={20} className="text-gray-600" />
            </button>
            
            {/* Photo de profil */}
            <span className="inline-block w-10 h-10 rounded-full bg-gray-300 border-2 border-white overflow-hidden">
              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-bold">
                {prenom.charAt(0).toUpperCase()}
              </div>
            </span>
          </div>
        </header>

        {/* Titre et accroche */}
        <section className="mb-6">
          <h1 className="text-2xl font-bold text-black mb-2 flex items-center gap-2">
            <span role="img" aria-label="muscle">💪</span> Prêt pour ta séance, {prenom} ?
          </h1>
          <p className="text-[#6B7280] text-base">Retrouve toutes tes séances et lance-toi !</p>
        </section>

        {/* Statistiques rapides */}
        <section className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
            <div className="text-xl font-bold text-black mb-1">
              {stats.workoutsCount}
            </div>
            <div className="text-xs text-[#6B7280]">Mes séances</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
            <div className="text-xl font-bold text-[#FF6A00] mb-1">
              {stats.favoritesCount}
            </div>
            <div className="text-xs text-[#6B7280]">Favoris</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
            <div className="text-xl font-bold text-blue-600 mb-1">
              {stats.publicCount}
            </div>
            <div className="text-xs text-[#6B7280]">Publiques</div>
          </div>
        </section>

        {/* Onglets navigation */}
        <nav className="flex gap-2 mb-6" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'mes-seances'}
            className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 flex-1 ${
              activeTab === 'mes-seances' 
                ? 'bg-[#FF6A00] text-white shadow-md' 
                : 'bg-white text-[#6B7280] hover:bg-gray-50 border border-gray-200'
            }`}
            onClick={() => setActiveTab('mes-seances')}
          >
            Mes séances
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'explorer'}
            className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 flex-1 ${
              activeTab === 'explorer' 
                ? 'bg-[#FF6A00] text-white shadow-md' 
                : 'bg-white text-[#6B7280] hover:bg-gray-50 border border-gray-200'
            }`}
            onClick={() => setActiveTab('explorer')}
          >
            Explorer
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'favoris'}
            className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 flex-1 ${
              activeTab === 'favoris' 
                ? 'bg-[#FF6A00] text-white shadow-md' 
                : 'bg-white text-[#6B7280] hover:bg-gray-50 border border-gray-200'
            }`}
            onClick={() => setActiveTab('favoris')}
          >
            Favoris
          </button>
        </nav>

        {/* Contenu des onglets */}
        {activeTab === 'mes-seances' && (
          <div className="space-y-4">
            {/* Bouton CTA principal */}
            <div className="flex justify-center gap-4 mb-6">
              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                  <button
                    className="bg-[#FF6A00] hover:bg-[#E55A00] text-white px-6 py-3 rounded-xl font-bold transition-colors inline-flex items-center gap-2"
                  >
                    <Plus size={18} />
                    Créer une nouvelle séance
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Créer une nouvelle séance</DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium mb-1">Nom de la séance</label>
                      <input
                        type="text"
                        className="w-full border rounded-lg px-3 py-2"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Date</label>
                      <input
                        type="date"
                        className="w-full border rounded-lg px-3 py-2"
                        value={form.date}
                        onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Durée estimée (minutes)</label>
                      <input
                        type="number"
                        min="1"
                        className="w-full border rounded-lg px-3 py-2"
                        value={form.duration}
                        onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                        required
                      />
                    </div>

                    {/* Section Exercices */}
                    <div>
                      <label className="block text-sm font-medium mb-3">Exercices</label>
                      
                      {/* Liste des exercices ajoutés */}
                      {exercises.length > 0 && (
                        <div className="space-y-2 mb-4">
                          {exercises.map((exercise, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                              <div className="flex-1">
                                <div className="font-medium text-sm">{exercise.name}</div>
                                <div className="text-xs text-gray-600">
                                  {exercise.sets} séries × {exercise.reps} reps • {exercise.weight}kg • Repos: {exercise.rest}s
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveExercise(index)}
                                className="text-red-500 hover:text-red-700 ml-2"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Formulaire pour ajouter un exercice */}
                      <div className="border rounded-lg p-3 bg-gray-50">
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div>
                            <label className="block text-xs font-medium mb-1">Nom de l'exercice</label>
                            <input
                              type="text"
                              className="w-full border rounded px-2 py-1 text-sm"
                              value={newExercise.name}
                              onChange={e => setNewExercise(ex => ({ ...ex, name: e.target.value }))}
                              placeholder="ex: Pompes"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">Séries</label>
                            <input
                              type="number"
                              min="1"
                              className="w-full border rounded px-2 py-1 text-sm"
                              value={newExercise.sets}
                              onChange={e => setNewExercise(ex => ({ ...ex, sets: e.target.value }))}
                              placeholder="3"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">Reps</label>
                            <input
                              type="number"
                              min="1"
                              className="w-full border rounded px-2 py-1 text-sm"
                              value={newExercise.reps}
                              onChange={e => setNewExercise(ex => ({ ...ex, reps: e.target.value }))}
                              placeholder="12"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">Poids (kg)</label>
                            <input
                              type="number"
                              min="0"
                              className="w-full border rounded px-2 py-1 text-sm"
                              value={newExercise.weight}
                              onChange={e => setNewExercise(ex => ({ ...ex, weight: e.target.value }))}
                              placeholder="0"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-xs font-medium mb-1">Repos (secondes)</label>
                            <input
                              type="number"
                              min="0"
                              className="w-full border rounded px-2 py-1 text-sm"
                              value={newExercise.rest}
                              onChange={e => setNewExercise(ex => ({ ...ex, rest: e.target.value }))}
                              placeholder="60"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleAddExercise}
                          className="w-full bg-[#FF6A00] hover:bg-[#E55A00] text-white py-2 rounded-lg font-medium text-sm transition-colors"
                        >
                          + Ajouter l'exercice
                        </button>
                      </div>
                    </div>

                    {formError && <div className="text-red-500 text-sm">{formError}</div>}
                    <DialogFooter>
                      <DialogClose asChild>
                        <button type="button" className="px-4 py-2 rounded-lg border font-medium">Annuler</button>
                      </DialogClose>
                      <button type="submit" className="bg-[#FF6A00] hover:bg-[#E55A00] text-white px-4 py-2 rounded-lg font-bold">Créer</button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              
              <button
                onClick={handleRefresh}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-medium transition-colors inline-flex items-center gap-2"
                disabled={workoutsLoading}
              >
                <RefreshCw size={16} />
                {workoutsLoading ? 'Chargement...' : 'Actualiser'}
              </button>
            </div>

            {/* Liste des séances */}
            {workoutsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6A00] mx-auto mb-4"></div>
                <p className="text-[#6B7280]">Chargement de tes séances...</p>
              </div>
            ) : workoutsError ? (
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">Erreur: {workoutsError}</p>
                <button className="bg-[#FF6A00] text-white px-4 py-2 rounded-xl font-medium">
                  Réessayer
                </button>
              </div>
            ) : workouts && workouts.length > 0 ? (
              <div className="space-y-4">
                {workouts.map((workout) => (
                  <div key={workout.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-black text-lg">{workout.name}</h3>
                      <button
                        onClick={() => handleToggleFavorite(workout.id)}
                        className={`p-2 rounded-full transition-colors ${
                          isFavorite(workout.id) 
                            ? 'text-[#FF6A00] hover:text-[#E55A00]' 
                            : 'text-gray-400 hover:text-[#FF6A00]'
                        }`}
                      >
                        <Star size={18} fill={isFavorite(workout.id) ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                    
                    {workout.notes && (
                      <p className="text-[#6B7280] text-sm mb-3">{workout.notes}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-[#6B7280] mb-4">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{formatDuration(workout.estimated_duration)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Dumbbell size={14} />
                        <span>{workout.exercise_count || 0} exercices</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[#6B7280]">{getTimeAgo(workout.created_at)}</span>
                      
                      <div className="flex gap-2">
                        <Link
                          href={`/session-details/${workout.id}`}
                          className="bg-[#FF6A00] hover:bg-[#E55A00] text-white px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-1"
                        >
                          <Eye size={14} />
                          Voir
                        </Link>
                        
                        <button
                          onClick={() => setShowDeleteConfirm(workout.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-1"
                        >
                          <Trash2 size={14} />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">💪</div>
                <p className="text-[#6B7280] mb-6 text-lg">Aucune séance trouvée</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'explorer' && (
          <div className="space-y-4">
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-[#6B7280] mb-2 text-lg">Explorer les séances</p>
              <p className="text-[#6B7280] text-sm">Cette fonctionnalité sera disponible bientôt !</p>
            </div>
          </div>
        )}

        {activeTab === 'favoris' && (
          <div className="space-y-4">
            {favoritesLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6A00] mx-auto mb-4"></div>
                <p className="text-[#6B7280]">Chargement de tes favoris...</p>
              </div>
            ) : favorites && favorites.length > 0 ? (
              <div className="space-y-4">
                {favorites.map((fav) => (
                  <div key={fav.workout_id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-black text-lg">{fav.workout?.name || 'Séance'}</h3>
                      <button
                        onClick={() => handleToggleFavorite(fav.workout_id)}
                        className={`p-2 rounded-full transition-colors ${
                          isFavorite(fav.workout_id)
                            ? 'text-[#FF6A00] hover:text-[#E55A00]'
                            : 'text-gray-400 hover:text-[#FF6A00]'
                        }`}
                        aria-label={isFavorite(fav.workout_id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                      >
                        <Star size={18} fill={isFavorite(fav.workout_id) ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[#6B7280] mb-4">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{fav.workout && 'estimated_duration' in fav.workout && fav.workout.estimated_duration ? `${fav.workout.estimated_duration} min` : 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Dumbbell size={14} />
                        <span>{fav.workout && Object.prototype.hasOwnProperty.call(fav.workout, 'exercise_count') ? (fav.workout as any).exercise_count : 0} exercices</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[#6B7280]">{fav.workout?.created_at ? getTimeAgo(fav.workout.created_at) : ''}</span>
                      <Link
                        href={`/session-details/${fav.workout_id}`}
                        className="bg-[#FF6A00] hover:bg-[#E55A00] text-white px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-1"
                      >
                        <Eye size={14} />
                        Voir
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">⭐</div>
                <p className="text-[#6B7280] mb-2 text-lg">Aucun favori</p>
                <p className="text-[#6B7280] text-sm">Explore les séances publiques pour en ajouter !</p>
              </div>
            )}
          </div>
        )}

        {/* Modal de confirmation de suppression */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full">
              <h3 className="font-bold text-black text-lg mb-4">Supprimer la séance ?</h3>
              <p className="text-[#6B7280] mb-6">Cette action est irréversible.</p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-[#6B7280] font-medium hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleDeleteWorkout(showDeleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 