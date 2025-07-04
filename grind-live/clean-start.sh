#!/bin/bash

echo "🧹 Nettoyage du cache Next.js..."
rm -rf .next
rm -rf node_modules/.cache

echo "🔪 Arrêt des processus Next.js existants..."
pkill -f "next dev" || true
pkill -f "next start" || true

echo "⏳ Attente de 2 secondes..."
sleep 2

echo "🚀 Démarrage du serveur de développement..."
npm run dev 