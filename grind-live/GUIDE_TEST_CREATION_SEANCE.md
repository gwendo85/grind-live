# 🧪 Guide de Test - Création de Séance

## ✅ Corrections Apportées

### Problèmes Résolus :
1. **Erreur d'enum `workout_status`** : `'planned'` → `'draft'` ✅
2. **Structure des données** : Correction insertion `exercises` + `exercise_logs` ✅
3. **Champ `date` manquant** : Ajout automatique de la date ✅
4. **Erreur `useExplorer`** : Ajout vérification authentification ✅
5. **Cache Next.js corrompu** : Nettoyage complet ✅

## 🚀 Test de Création de Séance

### 1. Accès à l'application
- **URL** : http://localhost:3000
- **Statut** : ✅ Serveur fonctionnel
- **Port** : 3000

### 2. Authentification
1. Cliquez sur "Se connecter" ou "Login"
2. Connectez-vous avec votre compte
3. Vérifiez que vous êtes redirigé vers le dashboard

### 3. Test de création de séance simple
1. Sur le dashboard, trouvez la section "Actions rapides"
2. Cliquez sur le bouton **"🧪 Test Création Séance"**
3. Surveillez la console du navigateur (F12 → Console)

### 4. Test de création de séance complète
1. Cliquez sur **"Créer une nouvelle séance"**
2. Remplissez le formulaire :
   - **Nom** : "Ma première séance"
   - **Notes** : "Séance de test"
   - **Exercices** : Ajoutez au moins 1 exercice
3. Cliquez sur **"Créer la séance"**

### 5. Logs à surveiller dans la console
```
🔍 Test création séance simple
🔍 createWorkout appelé avec: {name: "Test Séance...", ...}
🔍 Utilisateur: {id: "...", ...}
🔍 Données de séance à insérer: {name: "...", status: "draft", ...}
🔍 Séance créée avec succès: {id: "...", ...}
🔍 Ajout de la séance à la liste locale: {...}
```

### 6. Vérification des résultats
1. **Dashboard** : La séance doit apparaître dans "Mes séances"
2. **Compteur** : Le nombre de séances doit augmenter
3. **Page Workouts** : La séance doit être visible dans l'onglet "Mes séances"

## 🔧 Outils de Débogage

### Boutons de test disponibles :
- **🧪 Test Création Séance** : Création automatique d'une séance de test
- **🔄 Rafraîchir les séances** : Force le rechargement des données
- **Compteur en temps réel** : Affiche le nombre de séances actuelles

### Scripts de test :
```bash
# Test de connexion Supabase
node test-supabase-connection.js

# Test de création avec authentification
node test-workout-creation-with-auth.js

# Test du serveur
./test-workout-creation.sh
```

## 🚨 En cas de problème

### Erreur d'authentification :
- Vérifiez que vous êtes connecté
- Rechargez la page
- Vérifiez les logs dans la console

### Erreur de création :
- Vérifiez que tous les champs sont remplis
- Surveillez les logs de débogage
- Vérifiez la connexion Supabase

### Erreur de chargement :
- Cliquez sur "🔄 Rafraîchir les séances"
- Vérifiez la connexion internet
- Rechargez la page

## 📊 Résultats Attendus

### Après création réussie :
- ✅ Séance visible dans le dashboard
- ✅ Séance visible dans la page workouts
- ✅ Compteur mis à jour
- ✅ Pas d'erreurs dans la console
- ✅ Données sauvegardées dans Supabase

### Indicateurs de succès :
- Message de confirmation
- Séance apparaît immédiatement
- Pas d'erreurs dans les logs
- Interface responsive et fluide

---

**🎯 Objectif** : Créer une séance et la voir apparaître dans le planning en moins de 30 secondes ! 