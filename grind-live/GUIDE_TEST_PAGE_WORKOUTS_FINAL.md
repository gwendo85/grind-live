# 🧪 Guide de Test - Page Workouts (Version Finale)

## 📋 **Vue d'ensemble**
Ce guide teste la page workouts après toutes les corrections apportées lors de l'audit complet.

---

## 🎯 **Objectifs de Test**

### ✅ **Fonctionnalités Principales**
- [ ] Navigation et interface utilisateur
- [ ] Gestion des onglets (Mes séances, Explorer, Favoris)
- [ ] Création de séances avec exercices
- [ ] Gestion des favoris
- [ ] Suppression de séances
- [ ] Gestion d'erreur et feedback utilisateur
- [ ] Performance et accessibilité

---

## 🚀 **Préparation**

### 1. **Démarrage Propre**
```bash
# Utiliser le script de nettoyage
./clean-start.sh

# Ou manuellement
rm -rf .next
pkill -f "next dev"
npm run dev
```

### 2. **Vérification de l'Environnement**
- [ ] Serveur démarre sur `http://localhost:3000`
- [ ] Aucune erreur dans la console
- [ ] Variables d'environnement chargées

---

## 🧪 **Tests Détaillés**

### **Test 1: Navigation et Interface** ⭐⭐⭐

#### **1.1 Header et Navigation**
- [ ] **Accès à la page** : Aller sur `/workouts`
- [ ] **Bouton retour** : Cliquer sur "Dashboard" → redirection vers `/dashboard`
- [ ] **Logo GRIND** : Affichage correct en orange
- [ ] **Photo de profil** : Affichage de l'initiale de l'utilisateur
- [ ] **Menu burger** : Bouton présent (fonctionnalité à implémenter)

#### **1.2 Titre et Statistiques**
- [ ] **Titre motivant** : "Prêt pour ta séance, Utilisateur ?"
- [ ] **Statistiques** : Affichage des compteurs (Mes séances, Favoris, Publiques)
- [ ] **Responsive** : Test sur mobile et desktop

#### **1.3 Onglets**
- [ ] **Onglet actif** : "Mes séances" sélectionné par défaut
- [ ] **Navigation** : Clic sur "Explorer" → contenu placeholder
- [ ] **Navigation** : Clic sur "Favoris" → liste des favoris
- [ ] **Accessibilité** : Rôles ARIA corrects

---

### **Test 2: Création de Séance** ⭐⭐⭐⭐⭐

#### **2.1 Ouverture du Modal**
- [ ] **Bouton CTA** : "Créer une nouvelle séance" visible
- [ ] **Ouverture** : Clic → modal s'ouvre
- [ ] **Titre** : "Créer une nouvelle séance"

#### **2.2 Formulaire Principal**
- [ ] **Nom** : Champ obligatoire
- [ ] **Date** : Sélecteur de date
- [ ] **Durée** : Champ numérique (minutes)
- [ ] **Validation** : Message d'erreur si champs vides

#### **2.3 Gestion des Exercices**
- [ ] **Ajout exercice** : Remplir nom, séries, reps
- [ ] **Validation** : Message si champs manquants
- [ ] **Affichage** : Exercice ajouté dans la liste
- [ ] **Suppression** : Bouton poubelle fonctionne
- [ ] **Champs optionnels** : Poids et repos

#### **2.4 Soumission**
- [ ] **Validation complète** : Tous les champs requis
- [ ] **Création** : Toast de succès
- [ ] **Redirection** : Vers `/sessions` après 1 seconde
- [ ] **Reset** : Formulaire vidé

---

### **Test 3: Liste des Séances** ⭐⭐⭐⭐

#### **3.1 Affichage**
- [ ] **Chargement** : Spinner pendant le chargement
- [ ] **Liste vide** : Message "Aucune séance trouvée"
- [ ] **Séances existantes** : Affichage correct

#### **3.2 Informations Séance**
- [ ] **Nom** : Affichage en gras
- [ ] **Notes** : Description si présente
- [ ] **Durée** : Format correct (ex: "45m" ou "1h 30m")
- [ ] **Exercices** : Nombre d'exercices affiché
- [ ] **Date** : "Il y a X heures/jours/semaines"

#### **3.3 Actions**
- [ ] **Favoris** : Étoile cliquable
- [ ] **Ajout favoris** : Toast de confirmation
- [ ] **Retrait favoris** : Toast de confirmation
- [ ] **Bouton Voir** : Lien vers détails
- [ ] **Bouton Supprimer** : Ouverture modal de confirmation

---

### **Test 4: Gestion des Favoris** ⭐⭐⭐⭐

#### **4.1 Onglet Favoris**
- [ ] **Navigation** : Clic sur onglet "Favoris"
- [ ] **Chargement** : Spinner pendant le chargement
- [ ] **Liste vide** : Message "Aucun favori"
- [ ] **Séances favorites** : Affichage correct

#### **4.2 Actions Favoris**
- [ ] **Étoile pleine** : Séance en favoris
- [ ] **Étoile vide** : Séance non favorite
- [ ] **Toggle** : Clic change l'état
- [ ] **Feedback** : Toast de confirmation
- [ ] **Synchronisation** : État cohérent entre onglets

---

### **Test 5: Suppression de Séances** ⭐⭐⭐

#### **5.1 Modal de Confirmation**
- [ ] **Ouverture** : Clic sur "Supprimer"
- [ ] **Message** : "Supprimer la séance ?"
- [ ] **Avertissement** : "Cette action est irréversible"
- [ ] **Boutons** : "Annuler" et "Supprimer"

#### **5.2 Actions**
- [ ] **Annuler** : Modal se ferme, séance conservée
- [ ] **Supprimer** : Séance supprimée, toast de confirmation
- [ ] **Liste mise à jour** : Séance disparaît

---

### **Test 6: Gestion d'Erreur** ⭐⭐⭐⭐

#### **6.1 Erreurs Réseau**
- [ ] **Déconnexion** : Message d'erreur approprié
- [ ] **Timeout** : Gestion des timeouts
- [ ] **Erreur 401** : Redirection vers auth si nécessaire

#### **6.2 Erreurs Validation**
- [ ] **Formulaire incomplet** : Messages d'erreur clairs
- [ ] **Données invalides** : Validation côté client
- [ ] **Erreur serveur** : Toast d'erreur avec message

#### **6.3 États de Chargement**
- [ ] **Spinners** : Affichage pendant les opérations
- [ ] **Boutons désactivés** : Pendant les requêtes
- [ ] **Feedback visuel** : États de succès/erreur

---

### **Test 7: Performance et UX** ⭐⭐⭐

#### **7.1 Performance**
- [ ] **Chargement initial** : < 3 secondes
- [ ] **Navigation** : Transitions fluides
- [ ] **Mémoire** : Pas de fuites mémoire
- [ ] **Optimisations** : useCallback, useMemo utilisés

#### **7.2 Accessibilité**
- [ ] **Rôles ARIA** : Correctement définis
- [ ] **Navigation clavier** : Tabulation fonctionne
- [ ] **Contraste** : Couleurs lisibles
- [ ] **Labels** : Éléments correctement étiquetés

#### **7.3 Responsive**
- [ ] **Mobile** : Interface adaptée
- [ ] **Tablet** : Affichage correct
- [ ] **Desktop** : Utilisation optimale de l'espace

---

## 🔧 **Tests Techniques**

### **Test 8: Hooks et État** ⭐⭐⭐⭐

#### **8.1 useWorkouts**
- [ ] **Chargement** : État loading correct
- [ ] **Données** : Séances récupérées
- [ ] **Erreurs** : Gestion des erreurs
- [ ] **Rafraîchissement** : Fonction refresh

#### **8.2 useExplorer**
- [ ] **Séances publiques** : Récupération correcte
- [ ] **Erreurs** : Gestion des erreurs 401
- [ ] **État loading** : Affichage correct

#### **8.3 useFavorites**
- [ ] **Favoris** : Liste récupérée
- [ ] **Toggle** : Ajout/suppression fonctionne
- [ ] **État** : isFavorite retourne le bon état

---

### **Test 9: API et Authentification** ⭐⭐⭐⭐

#### **9.1 Authentification**
- [ ] **Token** : Transmission correcte
- [ ] **Headers** : Authorization Bearer
- [ ] **Session** : Vérification côté serveur
- [ ] **Expiration** : Gestion des tokens expirés

#### **9.2 API Routes**
- [ ] **/api/feed** : Retourne les données
- [ ] **/api/workouts** : CRUD fonctionne
- [ ] **/api/favorites** : Gestion des favoris
- [ ] **Erreurs** : Codes d'erreur appropriés

---

## 🐛 **Scénarios d'Erreur**

### **Test 10: Cas d'Erreur** ⭐⭐⭐

#### **10.1 Erreurs Réseau**
```bash
# Simuler une déconnexion réseau
# Vérifier les messages d'erreur
```

#### **10.2 Erreurs Authentification**
```bash
# Supprimer le token local
# Vérifier la redirection vers auth
```

#### **10.3 Erreurs Validation**
```bash
# Soumettre un formulaire incomplet
# Vérifier les messages d'erreur
```

---

## 📊 **Critères de Succès**

### **✅ Fonctionnel**
- [ ] Toutes les fonctionnalités principales fonctionnent
- [ ] Pas d'erreurs dans la console
- [ ] Gestion d'erreur appropriée
- [ ] Feedback utilisateur clair

### **✅ Performance**
- [ ] Temps de chargement < 3s
- [ ] Pas de fuites mémoire
- [ ] Optimisations React appliquées

### **✅ Accessibilité**
- [ ] Navigation clavier possible
- [ ] Rôles ARIA corrects
- [ ] Contraste suffisant

### **✅ UX**
- [ ] Interface intuitive
- [ ] Feedback visuel clair
- [ ] Responsive design
- [ ] Animations fluides

---

## 🎯 **Résultats Attendus**

### **🟢 Succès**
- Page workouts entièrement fonctionnelle
- Gestion d'erreur robuste
- Performance optimisée
- Accessibilité respectée

### **🟡 Améliorations Possibles**
- Tests unitaires
- Tests d'intégration
- Monitoring des performances
- Analytics utilisateur

### **🔴 Problèmes Critiques**
- Erreurs 401 non gérées
- Fuites mémoire
- Problèmes d'accessibilité majeurs
- Performance dégradée

---

## 📝 **Notes de Test**

### **Date de Test** : _______________
### **Testeur** : _______________
### **Version** : Finale (Post-Audit)

### **Observations** :
- [ ] Tous les tests passent
- [ ] Problèmes mineurs identifiés
- [ ] Problèmes majeurs identifiés
- [ ] Recommandations d'amélioration

### **Actions Suivantes** :
- [ ] Correction des problèmes identifiés
- [ ] Tests de régression
- [ ] Déploiement en production
- [ ] Monitoring post-déploiement

---

## 🚀 **Démarrage Rapide**

```bash
# 1. Nettoyer et démarrer
./clean-start.sh

# 2. Ouvrir dans le navigateur
open http://localhost:3000/workouts

# 3. Suivre ce guide de test
```

**🎉 La page workouts est maintenant prête pour la production !** 