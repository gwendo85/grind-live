#!/bin/bash

# Script de migration des hooks personnalisés
# Usage: ./migrate-hooks.sh [commit-message]

set -e  # Arrêter en cas d'erreur

echo "🚀 Migration des hooks personnalisés - Grind Live"
echo "================================================"

# Vérifier qu'on est dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: Exécutez ce script depuis la racine du projet"
    exit 1
fi

# Message de commit par défaut
COMMIT_MSG=${1:-"feat: intégration hooks personnalisés avec gestion d'erreurs et UX progressive"}

echo "📋 Vérification de l'état actuel..."

# Vérifier les modifications
if git diff --quiet; then
    echo "⚠️  Aucune modification détectée"
    read -p "Continuer quand même ? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 0
    fi
fi

echo "🔍 Vérification des hooks..."

# Vérifier que tous les hooks existent
HOOKS=("useUser" "useProgression" "useFeed" "useWorkouts" "useTabs" "useQuickActions")
for hook in "${HOOKS[@]}"; do
    if [ ! -f "src/hooks/${hook}.ts" ]; then
        echo "❌ Hook manquant: ${hook}.ts"
        exit 1
    fi
done

echo "✅ Tous les hooks sont présents"

echo "🧪 Tests rapides..."

# Vérifier la syntaxe TypeScript
if command -v npx &> /dev/null; then
    echo "🔍 Vérification TypeScript..."
    npx tsc --noEmit --skipLibCheck || {
        echo "❌ Erreurs TypeScript détectées"
        exit 1
    }
    echo "✅ TypeScript OK"
fi

# Vérifier ESLint si disponible
if [ -f "eslint.config.mjs" ] || [ -f ".eslintrc.js" ]; then
    echo "🔍 Vérification ESLint..."
    npx eslint src/hooks/ src/app/dashboard/ --max-warnings 0 || {
        echo "⚠️  Avertissements ESLint détectés"
        read -p "Continuer ? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    }
    echo "✅ ESLint OK"
fi

echo "📦 Préparation du commit..."

# Ajouter tous les fichiers modifiés
git add .

# Vérifier s'il y a des changements à commiter
if git diff --cached --quiet; then
    echo "⚠️  Aucun changement à commiter"
    exit 0
fi

echo "💾 Commit des modifications..."
git commit -m "$COMMIT_MSG"

echo "📊 Résumé des modifications:"
git show --stat --oneline HEAD

echo "🌐 Push vers GitHub..."
git push origin main

echo "✅ Migration terminée avec succès !"
echo ""
echo "📋 Prochaines étapes recommandées:"
echo "1. Tester l'application en local: npm run dev"
echo "2. Vérifier les logs dans la console du navigateur"
echo "3. Tester les interactions (like, commentaire, ajout séance)"
echo "4. Vérifier l'UX sur mobile/4G"
echo "5. Préparer la migration Supabase"
echo ""
echo "🔗 Liens utiles:"
echo "- Dashboard: http://localhost:3000/dashboard"
echo "- GitHub: https://github.com/ton-username/grind-live"
echo "- Supabase: https://supabase.com/dashboard/project/ton-projet" 