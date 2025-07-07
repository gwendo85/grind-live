"use client";
import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Play, Check, Pause, RotateCcw, SkipForward, Timer, Volume2, VolumeX, Bell, BellOff } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Progress } from "../../../components/ui/progress";

// Mock data pour une séance
const mockWorkout = {
  id: 1,
  name: "Push Day",
  type: "Poitrine/Triceps",
  duration: "1h 10m",
  exercises: [
    {
      id: 1,
      name: "Développé couché",
      sets: 4,
      reps: "8-12",
      weight: "80kg",
      completed: false,
      currentSet: 1,
      currentReps: 0,
      restTime: 180, // 3 minutes
    },
    {
      id: 2,
      name: "Inclined Dumbbell Press",
      sets: 3,
      reps: "10-12",
      weight: "32kg",
      completed: false,
      currentSet: 1,
      currentReps: 0,
      restTime: 120, // 2 minutes
    },
    {
      id: 3,
      name: "Dips",
      sets: 3,
      reps: "8-10",
      weight: "Bodyweight",
      completed: false,
      currentSet: 1,
      currentReps: 0,
      restTime: 90, // 1.5 minutes
    },
    {
      id: 4,
      name: "Tricep Extensions",
      sets: 3,
      reps: "12-15",
      weight: "20kg",
      completed: false,
      currentSet: 1,
      currentReps: 0,
      restTime: 60, // 1 minute
    },
    {
      id: 5,
      name: "Push-ups",
      sets: 3,
      reps: "15-20",
      weight: "Bodyweight",
      completed: false,
      currentSet: 1,
      currentReps: 0,
      restTime: 60, // 1 minute
    },
  ],
};

export default function WorkoutDetailPage() {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showRestControls, setShowRestControls] = useState(false);
  const [nextExercise, setNextExercise] = useState<{ id: number; name: string } | null>(null);

  const currentExercise = mockWorkout.exercises[currentExerciseIndex];

  // Vérifier les permissions de notification
  useEffect(() => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        setNotificationsEnabled(true);
      } else if (Notification.permission === 'default') {
        // Demander la permission
        Notification.requestPermission().then((permission) => {
          setNotificationsEnabled(permission === 'granted');
        });
      }
    }
  }, []);

  // Vérifier le support des vibrations
  useEffect(() => {
    if (!('vibrate' in navigator)) {
      setVibrationEnabled(false);
    }
  }, []);

  const vibrate = useCallback(() => {
    if (vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate(200);
    }
  }, [vibrationEnabled]);

  const sendNotification = useCallback(() => {
    if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Grind Live', {
        body: 'Séance terminée ! Félicitations !',
        icon: '/icon-192x192.png'
      });
    }
  }, [notificationsEnabled]);

  // Timer pour le temps de repos
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isResting && restTimeLeft > 0 && !isPaused) {
      interval = setInterval(() => {
        setRestTimeLeft((prev) => {
          if (prev <= 1) {
            // Fin du repos - notifications
            if (soundEnabled) {
              console.log("🔔 Temps de repos terminé !");
            }
            if (vibrationEnabled) {
              vibrate();
            }
            if (notificationsEnabled) {
              sendNotification();
            }
            setIsResting(false);
            setShowRestControls(false);
            return 0;
          }
          
          // Alertes à 30s et 10s restantes
          if (prev === 30 || prev === 10) {
            if (vibrationEnabled) {
              vibrate();
            }
            if (notificationsEnabled) {
              sendNotification();
            }
          }
          
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isResting, restTimeLeft, isPaused, soundEnabled, vibrationEnabled, notificationsEnabled, sendNotification, vibrate]);

  // Timer pour le temps total de séance
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isWorkoutActive && !isPaused) {
      interval = setInterval(() => {
        setWorkoutTime((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isWorkoutActive, isPaused]);

  // Préparer le prochain exercice
  useEffect(() => {
    if (currentExerciseIndex < mockWorkout.exercises.length - 1) {
      setNextExercise(mockWorkout.exercises[currentExerciseIndex + 1]);
    } else {
      setNextExercise(null);
    }
  }, [currentExerciseIndex]);

  const startRest = () => {
    setIsResting(true);
    setRestTimeLeft(currentExercise.restTime);
    setShowRestControls(true);
    
    // Notifications de début de repos
    if (soundEnabled) {
      console.log("⏰ Début du temps de repos");
    }
    if (vibrationEnabled) {
      vibrate();
    }
    if (notificationsEnabled) {
      sendNotification();
    }
  };

  const skipRest = () => {
    setIsResting(false);
    setRestTimeLeft(0);
    setShowRestControls(false);
    
    if (vibrationEnabled) {
      vibrate();
    }
  };

  const adjustRestTime = (seconds: number) => {
    setRestTimeLeft(Math.max(0, restTimeLeft + seconds));
    
    if (vibrationEnabled) {
      vibrate();
    }
  };

  const completeSet = () => {
    const updatedExercises = [...mockWorkout.exercises];
    const exercise = updatedExercises[currentExerciseIndex];
    
    // Vibration de complétion
    if (vibrationEnabled) {
      vibrate();
    }
    
    if (exercise.currentSet < exercise.sets) {
      exercise.currentSet++;
      startRest();
    } else {
      exercise.completed = true;
      
      // Notification de fin d'exercice
      if (notificationsEnabled) {
        sendNotification();
      }
      
      if (currentExerciseIndex < mockWorkout.exercises.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        // Auto-démarrage du repos entre exercices
        setTimeout(() => {
          startRest();
        }, 1000);
      } else {
        // Séance terminée
        if (vibrationEnabled) {
          vibrate();
        }
        if (notificationsEnabled) {
          sendNotification();
        }
        setIsWorkoutActive(false);
        setIsResting(false);
        setShowRestControls(false);
      }
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        setNotificationsEnabled(permission === 'granted');
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatWorkoutTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRestProgress = () => {
    return ((currentExercise.restTime - restTimeLeft) / currentExercise.restTime) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <button className="p-2 rounded-full bg-white shadow-sm">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">{mockWorkout.name}</h1>
          <div className="flex gap-2">
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-full bg-white shadow-sm"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5 text-gray-600" /> : <VolumeX className="w-5 h-5 text-gray-600" />}
            </button>
            <button 
              onClick={() => setVibrationEnabled(!vibrationEnabled)}
              className={`p-2 rounded-full shadow-sm ${
                vibrationEnabled ? 'bg-green-100 text-green-600' : 'bg-white text-gray-600'
              }`}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <div className={`w-2 h-2 rounded-full ${vibrationEnabled ? 'bg-green-600' : 'bg-gray-400'}`}></div>
              </div>
            </button>
            <button 
              onClick={requestNotificationPermission}
              className={`p-2 rounded-full shadow-sm ${
                notificationsEnabled ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600'
              }`}
            >
              {notificationsEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Timer de séance */}
        {isWorkoutActive && (
          <div className="px-4 mb-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Timer className="w-5 h-5 text-orange-500" />
                  <span className="text-sm text-gray-600">Temps de séance</span>
                </div>
                <span className="text-xl font-bold text-gray-800">
                  {formatWorkoutTime(workoutTime)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Section déroulement de l'exercice */}
        {isWorkoutActive && (
          <div className="px-4 mb-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {currentExercise.name}
                </h2>
                <p className="text-gray-600">
                  Exercice {currentExerciseIndex + 1} sur {mockWorkout.exercises.length}
                </p>
              </div>

              {/* Progression de l'exercice */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Progression</span>
                  <span className="text-sm font-medium text-gray-800">
                    {currentExercise.currentSet} / {currentExercise.sets} séries
                  </span>
                </div>
                <Progress 
                  value={(currentExercise.currentSet / currentExercise.sets) * 100} 
                  className="h-2"
                />
              </div>

              {/* Timer de repos amélioré */}
              {isResting && (
                <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Timer className="w-5 h-5 text-orange-500" />
                      <span className="text-sm text-orange-700 font-medium">Temps de repos</span>
                    </div>
                    <div className="text-4xl font-bold text-orange-600 mb-2">
                      {formatTime(restTimeLeft)}
                    </div>
                    <div className="mb-3">
                      <Progress value={getRestProgress()} className="h-2 bg-orange-100" />
                    </div>
                    <p className="text-xs text-orange-600">
                      Prochain exercice : {nextExercise?.name || "Fin de séance"}
                    </p>
                  </div>

                  {/* Contrôles du repos */}
                  {showRestControls && (
                    <div className="space-y-3">
                      <div className="flex gap-2 justify-center">
                        <Button
                          onClick={() => adjustRestTime(-30)}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          -30s
                        </Button>
                        <Button
                          onClick={() => adjustRestTime(30)}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          +30s
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={skipRest}
                          variant="outline"
                          className="flex-1 text-sm"
                        >
                          <SkipForward className="w-4 h-4 mr-2" />
                          Passer le repos
                        </Button>
                        <Button
                          onClick={() => setIsPaused(!isPaused)}
                          variant="outline"
                          className="flex-1 text-sm"
                        >
                          {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                          {isPaused ? "Reprendre" : "Pause"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Contrôles principaux */}
              <div className="flex gap-3 mb-4">
                <Button
                  onClick={() => setIsPaused(!isPaused)}
                  variant="outline"
                  className="flex-1"
                  disabled={isResting}
                >
                  {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                  {isPaused ? "Reprendre" : "Pause"}
                </Button>
                <Button
                  onClick={() => {
                    setWorkoutTime(0);
                    setIsPaused(false);
                    setIsResting(false);
                    setRestTimeLeft(0);
                    setShowRestControls(false);
                  }}
                  variant="outline"
                  size="icon"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>

              {/* Bouton compléter la série */}
              {!isResting && (
                <Button
                  onClick={completeSet}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Compléter la série {currentExercise.currentSet}
                </Button>
              )}

              {/* Détails de l'exercice */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Poids</p>
                    <p className="font-semibold text-gray-800">{currentExercise.weight}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Reps cible</p>
                    <p className="font-semibold text-gray-800">{currentExercise.reps}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Repos</p>
                    <p className="font-semibold text-gray-800">{formatTime(currentExercise.restTime)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Série actuelle</p>
                    <p className="font-semibold text-gray-800">{currentExercise.currentSet}/{currentExercise.sets}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bloc résumé */}
        <div className="px-4 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                {mockWorkout.type}
              </Badge>
              <span className="text-sm text-gray-500">{mockWorkout.duration}</span>
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-600">Exercices</p>
                <p className="text-2xl font-bold text-gray-800">{mockWorkout.exercises.length}</p>
              </div>
              <Button 
                onClick={() => setIsWorkoutActive(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl"
              >
                <Play className="w-4 h-4 mr-2" />
                {isWorkoutActive ? "Séance en cours" : "Démarrer la séance"}
              </Button>
            </div>
          </div>
        </div>

        {/* Liste des exercices */}
        <div className="px-4 mb-20">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Exercices</h2>
          <div className="space-y-3">
            {mockWorkout.exercises.map((exercise, index) => (
              <div
                key={exercise.id}
                className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${
                  exercise.completed ? "border-green-500" : 
                  index === currentExerciseIndex && isWorkoutActive ? "border-orange-500" : "border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        exercise.completed ? "bg-green-500" : 
                        index === currentExerciseIndex && isWorkoutActive ? "bg-orange-500" : "bg-gray-200"
                      }`}>
                        {exercise.completed ? (
                          <Check className="w-4 h-4 text-white" />
                        ) : index === currentExerciseIndex && isWorkoutActive ? (
                          <Play className="w-4 h-4 text-white" />
                        ) : (
                          <span className="text-xs text-gray-500">{index + 1}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{exercise.name}</h3>
                        <p className="text-sm text-gray-600">
                          {exercise.sets} séries × {exercise.reps} reps
                        </p>
                        {isWorkoutActive && index === currentExerciseIndex && (
                          <p className="text-xs text-orange-600 font-medium">
                            Série {exercise.currentSet}/{exercise.sets}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800">{exercise.weight}</p>
                    <p className="text-xs text-gray-500">{formatTime(exercise.restTime)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bouton terminer sticky */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <div className="max-w-md mx-auto">
            <Button className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-xl">
              Terminer la séance
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 