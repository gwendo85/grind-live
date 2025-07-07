# Guide de Test - Page Dashboard 🏠

## 🎯 Objectif
Tester la page dashboard avec les données simulées pour s'assurer que toutes les fonctionnalités fonctionnent correctement sans authentification.

## 🚀 Démarrage Rapide

### 1. **Lancer le Serveur**
```bash
cd grind-live
npm run dev
```

### 2. **Accéder à la Page**
- Ouvrir : `http://localhost:3000/dashboard`
- La page devrait se charger avec les données simulées
- Indicateur "🧪 Mode simulation activé" visible

## 📋 Tests à Effectuer

### ✅ **Test 1 : Chargement Initial**
- [ ] Page se charge sans erreur
- [ ] Indicateur "Mode simulation activé" visible
- [ ] Tous les hooks se chargent avec des données simulées
- [ ] Pas d'erreurs 401 dans la console

### ✅ **Test 2 : Header et Navigation**
- [ ] Titre "Salut, Champion ! 💪" affiché
- [ ] Bouton "Séances" fonctionne (redirige vers /workouts)
- [ ] Bouton "Social" fonctionne (redirige vers /social)
- [ ] Indicateur de mode simulation visible

### ✅ **Test 3 : Stats Principales**
- [ ] **Séances** : 3 séances affichées (60% de l'objectif)
- [ ] **Volume** : 6500kg affiché (65% de l'objectif)
- [ ] Pourcentages calculés correctement
- [ ] Icônes et couleurs appropriées

### ✅ **Test 4 : Objectifs du Jour**
- [ ] 4 objectifs affichés :
  - ✅ Faire une séance de musculation (Terminé)
  - 🟠 Marcher 10 000 pas (6500/10000)
  - 🟠 Boire 2L d'eau (1200/2000)
  - ⚪ Faire du cardio (À faire)
- [ ] Indicateurs visuels corrects (vert, orange, gris)
- [ ] Progression affichée correctement

### ✅ **Test 5 : Système de Tabs**
- [ ] 3 onglets visibles : Feed, Progression, Séances
- [ ] Onglet "Feed" actif par défaut
- [ ] Changement d'onglet fonctionne
- [ ] Contenu approprié pour chaque onglet

### ✅ **Test 6 : Onglet Feed**
- [ ] Titre "Feed d'activité" avec icône
- [ ] 3 activités récentes affichées :
  - Marie a terminé sa séance "Push"
  - Thomas a battu son record au développé couché
  - Sarah a complété son défi de la semaine
- [ ] Informations utilisateur, temps et détails visibles

### ✅ **Test 7 : Onglet Progression**
- [ ] Titre "Ta progression" avec icône
- [ ] 3 métriques affichées :
  - Séances cette semaine: 3/5
  - Temps total: 4.5h/8h
  - Volume total: 6500kg/10000kg
- [ ] Données cohérentes avec les stats principales

### ✅ **Test 8 : Onglet Séances**
- [ ] Titre "Tes séances" avec icône
- [ ] Bouton "Créer une séance" fonctionne
- [ ] 3 séances récentes affichées :
  - Séance Push (3 exercices, ~45 min)
  - Séance Pull (4 exercices, ~50 min)
  - Séance Jambes (5 exercices, ~60 min)
- [ ] Dates formatées correctement
- [ ] Lien "Voir toutes mes séances" fonctionne

### ✅ **Test 9 : Actions Rapides**
- [ ] Titre "Actions rapides" avec icône
- [ ] Bouton "🧪 Test Création Séance" fonctionne
- [ ] Compteur "Séances actuelles: 3" affiché
- [ ] Bouton "🔄 Rafraîchir les séances" fonctionne
- [ ] Messages de succès/erreur appropriés

### ✅ **Test 10 : Défi Principal**
- [ ] Carte dégradée violet/rose visible
- [ ] Titre "Défi de la semaine"
- [ ] Description "Faire 5 séances cette semaine"
- [ ] Barre de progression à 60%
- [ ] Progression "3/5" affichée
- [ ] Icône trophée visible

### ✅ **Test 11 : Modal Création Séance**
- [ ] Clic sur "Créer une séance" ouvre le modal
- [ ] Formulaire de création visible
- [ ] Fermeture du modal fonctionne
- [ ] Intégration avec useWorkouts

### ✅ **Test 12 : Responsivité**
- [ ] Page s'affiche correctement sur mobile
- [ ] Grille des stats responsive
- [ ] Tabs adaptés aux petits écrans
- [ ] Navigation mobile fonctionnelle

### ✅ **Test 13 : Performance**
- [ ] Chargement rapide (< 3 secondes)
- [ ] Pas de re-renders inutiles
- [ ] Animations fluides
- [ ] Pas d'erreurs de console

### ✅ **Test 14 : Gestion d'Erreur**
- [ ] Mode simulation gère les erreurs 401
- [ ] Messages d'erreur informatifs
- [ ] Bouton "Réessayer" fonctionne
- [ ] Fallback vers données simulées

## 🔧 Tests Fonctionnels

### **Test de Création de Séance**
1. Cliquer sur "🧪 Test Création Séance"
2. Vérifier le message de succès
3. Vérifier que la séance apparaît dans la liste
4. Vérifier le compteur mis à jour

### **Test de Rafraîchissement**
1. Cliquer sur "🔄 Rafraîchir les séances"
2. Vérifier que les données se rechargent
3. Vérifier les logs dans la console

### **Test de Navigation**
1. Cliquer sur "Séances" → vérifier redirection vers /workouts
2. Cliquer sur "Social" → vérifier redirection vers /social
3. Cliquer sur "Voir toutes mes séances" → vérifier redirection

## 📊 Données Simulées Utilisées

### **Progression**
```javascript
{
  sessionsDone: 3,
  sessionsGoal: 5,
  sessionsPercent: 60,
  volumeDone: 6500,
  volumeGoal: 10000,
  volumePercent: 65,
  timeDone: 4.5,
  timeGoal: 8,
  timePercent: 56
}
```

### **Objectifs Quotidiens**
```javascript
[
  { id: '1', title: 'Faire une séance de musculation', completed: true, type: 'workout', target: 1, current: 1 },
  { id: '2', title: 'Marcher 10 000 pas', completed: false, type: 'steps', target: 10000, current: 6500 },
  { id: '3', title: 'Boire 2L d\'eau', completed: false, type: 'water', target: 2000, current: 1200 },
  { id: '4', title: 'Faire du cardio', completed: false, type: 'workout', target: 1, current: 0 }
]
```

### **Défis**
```javascript
[
  {
    id: '1',
    title: 'Défi de la semaine',
    description: 'Faire 5 séances cette semaine',
    current: 3,
    target: 5,
    progress: 60,
    completed: false,
    type: 'workout_count',
    period: 'week'
  }
]
```

## 🐛 Problèmes Connus

### **Résolus**
- ✅ Erreurs 401 gérées avec mode simulation
- ✅ Données simulées réalistes
- ✅ Gestion d'erreur améliorée
- ✅ États de chargement optimisés

### **À Surveiller**
- Performance avec beaucoup de données
- Synchronisation entre hooks
- Gestion de la mémoire

## ✅ Critères de Succès

- [ ] Tous les tests passent
- [ ] Interface utilisateur responsive
- [ ] Données simulées cohérentes
- [ ] Navigation fonctionnelle
- [ ] Performance acceptable
- [ ] Pas d'erreurs de console
- [ ] Mode simulation stable

## 🎉 Résultat Attendu

La page dashboard devrait être entièrement fonctionnelle avec des données simulées réalistes, une interface utilisateur moderne et responsive, et une gestion d'erreur robuste. Tous les composants doivent s'afficher correctement et les interactions utilisateur doivent être fluides. 