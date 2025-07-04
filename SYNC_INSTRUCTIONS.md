# 🔄 Instructions de Synchronisation - Grind Live

## **Synchronisation Automatique**

### **Utilisation du script sync.sh**

```bash
# Synchronisation simple (message automatique)
./sync.sh

# Synchronisation avec message personnalisé
./sync.sh "Ajout de nouvelles fonctionnalités"
```

### **Ce que fait le script automatiquement :**
1. ✅ Vérifie qu'on est dans un repo Git
2. ✅ Ajoute tous les fichiers modifiés
3. ✅ Crée un commit avec la date/heure
4. ✅ Pousse le code sur GitHub
5. ✅ Exporte le schéma Supabase (si CLI installé)
6. ✅ Affiche un résumé coloré

---

## **Récupération sur un autre ordinateur**

```bash
# 1. Cloner le projet
git clone https://github.com/gwendo85/grind-live.git

# 2. Aller dans le dossier
cd grind-live

# 3. Installer les dépendances
npm install

# 4. Lancer le projet
npm run dev

# 5. (Optionnel) Restaurer la base Supabase
supabase db push
```

---

## **Installation Supabase CLI (optionnel)**

```bash
npm install -g supabase
```

---

## **Raccourcis utiles**

### **Alias Git (ajouter dans ~/.bashrc ou ~/.zshrc)**
```bash
alias sync='./sync.sh'
alias sync-msg='./sync.sh "$1"'
```

### **Utilisation avec alias**
```bash
sync                    # Synchronisation simple
sync-msg "Mon message"  # Avec message personnalisé
```

---

## **Workflow quotidien recommandé**

1. **Développer** tes fonctionnalités
2. **Tester** que tout fonctionne
3. **Synchroniser** avec `./sync.sh`
4. **Répéter** 🚀

---

## **En cas de problème**

### **Erreur de permissions**
```bash
chmod +x sync.sh
```

### **Supabase CLI non trouvé**
```bash
npm install -g supabase
```

### **Git non configuré**
```bash
git config --global user.name "Ton Nom"
git config --global user.email "ton@email.com"
```

---

## **Notes importantes**

- 📱 Le script fonctionne sur macOS, Linux et Windows (Git Bash)
- 🔒 Tes données sont sauvegardées sur GitHub à chaque synchronisation
- 🗄️ Le schéma Supabase est exporté automatiquement
- 🌐 Tu peux récupérer ton projet sur n'importe quel ordinateur

---

*Dernière mise à jour : $(date)* 