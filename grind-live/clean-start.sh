#!/bin/bash

echo "🧹 Nettoyage complet de l'application GRIND Live..."

# Arrêter tous les processus Node.js
echo "🛑 Arrêt des processus Node.js..."
pkill -f "next\|node" 2>/dev/null || true

# Attendre un peu pour s'assurer que les processus sont arrêtés
sleep 2

# Nettoyer le cache Next.js
echo "🗑️ Nettoyage du cache Next.js..."
rm -rf .next 2>/dev/null || true

# Nettoyer le cache npm/pnpm
echo "🗑️ Nettoyage du cache des dépendances..."
rm -rf node_modules/.cache 2>/dev/null || true

# Vérifier les ports utilisés
echo "🔍 Vérification des ports..."
lsof -ti:3000,3001,3002,3003,3004,3005,3006,3010 | xargs kill -9 2>/dev/null || true

# Attendre un peu
sleep 1

echo "✅ Nettoyage terminé !"
echo "🚀 Redémarrage de l'application..."

# Redémarrer l'application
npm run dev 