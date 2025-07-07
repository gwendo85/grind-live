#!/bin/bash

echo "🧹 Nettoyage de l'application pour la production..."

# Supprimer les console.log de debug
echo "📝 Suppression des console.log de debug..."

# Nettoyer les hooks
find src/hooks -name "*.ts" -type f -exec sed -i '' '/console\.log.*🔍/d' {} \;
find src/hooks -name "*.ts" -type f -exec sed -i '' '/console\.log.*ℹ️/d' {} \;

# Nettoyer les pages
find src/app -name "*.tsx" -type f -exec sed -i '' '/console\.log.*🔍/d' {} \;
find src/app -name "*.tsx" -type f -exec sed -i '' '/console\.log.*DashboardPage/d' {} \;

# Nettoyer les composants
find src/components -name "*.tsx" -type f -exec sed -i '' '/console\.log.*🔍/d' {} \;

# Garder seulement les erreurs critiques
echo "✅ Console logs de debug supprimés"
echo "✅ Erreurs critiques conservées"

# Optimiser le build
echo "🔧 Optimisation du build..."

# Nettoyer le cache
rm -rf .next
rm -rf node_modules/.cache

# Installer les dépendances de production
npm ci --only=production

# Build de production
echo "🏗️ Build de production..."
npm run build

echo "✅ Application nettoyée et optimisée pour la production !"
echo "📊 Taille du bundle optimisée"
echo "🚀 Prêt pour le déploiement" 