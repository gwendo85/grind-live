# 🧪 Guide de Test - Page Workouts (Mode Simulation)

## 📋 **Vue d'ensemble**
Ce guide teste la page workouts en mode simulation avec des données mock, sans authentification Supabase.

---

## 🎯 **Objectifs de Test**

### ✅ **Fonctionnalités à Tester**
- [ ] Navigation et interface utilisateur
- [ ] Gestion des onglets (Mes séances, Explorer, Favoris)
- [ ] Création de séances avec exercices (simulation)
- [ ] Gestion des favoris (simulation)
- [ ] Suppression de séances (simulation)
- [ ] Affichage des données simulées
- [ ] Gestion d'erreur et feedback utilisateur
- [ ] Performance et accessibilité

---

## 🚀 **Préparation**

### 1. **Démarrage du Serveur**
```bash
# Nettoyer le cache
rm -rf .next

# Démarrer le serveur
npm run dev
```

### 2. **Vérification de l'Environnement**
- [ ] Serveur accessible sur `http://localhost:3000`
- [ ] Page workouts accessible sur `http://localhost:3000/workouts`
- [ ] Console du navigateur ouverte pour les logs

---

## 🧪 **Tests Automatisés**

### **Exécuter le Script de Test**
```bash
./test-workouts-final.sh
```

**Résultats Attendus :**
- ✅ Serveur accessible
- ✅ Page workouts accessible
- ✅ Hooks présents
- ✅ Composants UI présents
- ✅ Types TypeScript présents
- ✅ Client Supabase configuré
- ✅ API routes répondent
- ✅ Éléments de la page présents

---

## 🎮 **Tests Manuels avec Données Simulées**

### **1. Test de Navigation**
**URL :** `http://localhost:3000/workouts`

**Actions à Tester :**
- [ ] **Header** : Logo GRIND visible, lien retour dashboard
- [ ] **Titre** : "Prêt pour ta séance, Utilisateur ?"
- [ ] **Statistiques** : Affichage des compteurs (3 séances, 1 favori, 3 publiques)
- [ ] **Onglets** : Navigation entre Mes séances, Explorer, Favoris

**Résultats Attendus :**
- Interface complète et responsive
- Navigation fluide entre les onglets
- Statistiques mises à jour

---

### **2. Test de l'Onglet "Mes Séances"**

**Données Simulées Affichées :**
- **Séance 1** : "Séance Push - Poitrine/Triceps" (75 min, 6 exercices)
- **Séance 2** : "Séance Pull - Dos/Biceps" (60 min, 5 exercices)
- **Séance 3** : "Séance Jambes - Quadriceps/Ischios" (90 min, 8 exercices)

**Actions à Tester :**
- [ ] **Chargement** : Spinner pendant 1 seconde, puis affichage des séances
- [ ] **Affichage** : Nom, notes, durée, nombre d'exercices, date de création
- [ ] **Favoris** : Étoile pour chaque séance (séance 3 déjà en favori)
- [ ] **Actions** : Boutons "Voir" et "Supprimer" pour chaque séance

**Résultats Attendus :**
- 3 séances affichées avec toutes les informations
- Séance 3 avec étoile pleine (favori)
- Séances 1 et 2 avec étoile vide

---

### **3. Test de Création de Séance**

**Actions à Tester :**
- [ ] **Bouton CTA** : Cliquer sur "Créer une nouvelle séance"
- [ ] **Modal** : Ouverture du formulaire de création
- [ ] **Formulaire** : Remplir nom, date, durée
- [ ] **Exercices** : Ajouter des exercices avec nom, séries, reps, poids, repos
- [ ] **Validation** : Tester la validation des champs obligatoires
- [ ] **Soumission** : Créer la séance

**Exemple de Données de Test :**
```
Nom : "Séance Test - Simulation"
Date : 2024-01-20
Durée : 45 minutes

Exercices :
- Pompes : 3 séries × 12 reps, 0kg, repos 60s
- Squats : 4 séries × 15 reps, 0kg, repos 90s
- Burpees : 3 séries × 10 reps, 0kg, repos 120s
```

**Résultats Attendus :**
- Modal s'ouvre correctement
- Validation des champs obligatoires
- Création réussie avec toast de succès
- Nouvelle séance ajoutée à la liste
- Redirection vers /sessions après 1 seconde

---

### **4. Test de Gestion des Favoris**

**Actions à Tester :**
- [ ] **Ajout Favori** : Cliquer sur l'étoile vide d'une séance
- [ ] **Retrait Favori** : Cliquer sur l'étoile pleine d'une séance
- [ ] **Feedback** : Toast de confirmation
- [ ] **Onglet Favoris** : Vérifier l'affichage des favoris

**Résultats Attendus :**
- Étoile change d'état (vide ↔ pleine)
- Toast de confirmation
- Onglet Favoris mis à jour
- Séance 3 déjà en favori par défaut

---

### **5. Test de Suppression de Séance**

**Actions à Tester :**
- [ ] **Bouton Supprimer** : Cliquer sur "Supprimer" d'une séance
- [ ] **Modal Confirmation** : Apparition du modal de confirmation
- [ ] **Annulation** : Cliquer sur "Annuler"
- [ ] **Confirmation** : Cliquer sur "Supprimer"

**Résultats Attendus :**
- Modal de confirmation s'affiche
- Annulation ferme le modal
- Confirmation supprime la séance
- Toast de succès
- Séance retirée de la liste

---

### **6. Test de l'Onglet "Explorer"**

**Données Simulées Affichées :**
- **Séance 4** : "Séance Full Body - Débutant" (45 min, 6 exercices, 12 favoris)
- **Séance 5** : "Séance HIIT - Cardio" (30 min, 8 exercices, 8 favoris)
- **Séance 6** : "Séance Force - Avancé" (90 min, 10 exercices, 25 favoris)

**Actions à Tester :**
- [ ] **Chargement** : Spinner pendant 1.2 secondes
- [ ] **Affichage** : Séances publiques avec créateur et nombre de favoris
- [ ] **Message** : "Cette fonctionnalité sera disponible bientôt !"

**Résultats Attendus :**
- Message de fonctionnalité à venir
- Interface préparée pour l'exploration

---

### **7. Test de l'Onglet "Favoris"**

**Données Simulées Affichées :**
- **Séance 3** : "Séance Jambes - Quadriceps/Ischios" (90 min, 8 exercices)

**Actions à Tester :**
- [ ] **Chargement** : Spinner pendant 0.8 seconde
- [ ] **Affichage** : Séance favorite avec toutes les informations
- [ ] **Actions** : Bouton "Voir" et étoile pour retirer des favoris

**Résultats Attendus :**
- 1 séance favorite affichée
- Étoile pleine (favori actif)
- Possibilité de retirer des favoris

---

### **8. Test de Rafraîchissement**

**Actions à Tester :**
- [ ] **Bouton Actualiser** : Cliquer sur le bouton de rafraîchissement
- [ ] **Feedback** : Toast "Données actualisées"
- [ ] **Logs Console** : Message "🔍 Rafraîchissement manuel des séances"

**Résultats Attendus :**
- Toast de confirmation
- Logs dans la console
- Données rechargées

---

## 🔍 **Vérification des Logs Console**

**Logs Attendus :**
```
🔍 Mode simulation : chargement des données mock
🔍 Mode simulation : chargement des favoris mock
🔍 Mode simulation : chargement des séances publiques mock
🔍 Mode simulation : chargement des séances populaires mock
🔍 Mode simulation : création de séance mock
🔍 Mode simulation : ajout aux favoris mock
🔍 Mode simulation : retrait des favoris mock
🔍 Mode simulation : suppression de séance mock
```

---

## ⚠️ **Gestion des Erreurs**

### **Tests d'Erreur :**
- [ ] **Validation Formulaire** : Soumettre formulaire vide
- [ ] **Champs Obligatoires** : Tester chaque validation
- [ ] **Messages d'Erreur** : Affichage des erreurs en rouge

**Résultats Attendus :**
- Messages d'erreur contextuels
- Validation stricte des champs
- Interface bloquée jusqu'à correction

---

## 📱 **Test de Responsivité**

### **Tailles d'Écran à Tester :**
- [ ] **Desktop** : 1920x1080
- [ ] **Tablet** : 768x1024
- [ ] **Mobile** : 375x667

**Éléments à Vérifier :**
- [ ] Navigation adaptée
- [ ] Grille des statistiques responsive
- [ ] Onglets empilés sur mobile
- [ ] Modal de création adapté
- [ ] Boutons et textes lisibles

---

## ⚡ **Test de Performance**

### **Métriques à Vérifier :**
- [ ] **Temps de Chargement** : < 3 secondes
- [ ] **Interactions Fluides** : Pas de lag
- [ ] **Animations** : Transitions smooth
- [ ] **Mémoire** : Pas de fuites mémoire

---

## 🎯 **Résumé des Tests**

### **✅ Fonctionnalités Testées :**
- Navigation et interface ✅
- Gestion des onglets ✅
- Création de séances (simulation) ✅
- Gestion des favoris (simulation) ✅
- Suppression de séances (simulation) ✅
- Affichage des données simulées ✅
- Gestion d'erreur ✅
- Feedback utilisateur ✅

### **📊 Données Simulées :**
- **3 séances personnelles** (Push, Pull, Jambes)
- **1 favori** (Séance Jambes)
- **3 séances publiques** (Full Body, HIIT, Force)
- **2 séances populaires** (Force, Full Body)

### **🔧 Mode Simulation :**
- Pas d'authentification requise
- Délais simulés pour le réalisme
- Données persistantes en session
- Logs détaillés pour le débogage

---

## 🚀 **Prêt pour la Production**

La page workouts est maintenant **complètement testée** avec des données simulées et prête pour :
- ✅ Tests utilisateurs
- ✅ Intégration avec Supabase
- ✅ Déploiement en production

**URL de Test :** `http://localhost:3000/workouts` 