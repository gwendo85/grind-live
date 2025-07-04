#!/bin/bash

echo "🧪 Test des APIs du Dashboard"
echo "=============================="

BASE_URL="http://localhost:3000"

# Test de l'API progression
echo "📊 Test API progression..."
curl -s "$BASE_URL/api/progression" | jq '.' || echo "❌ Erreur API progression"

echo ""

# Test de l'API feed
echo "📰 Test API feed..."
curl -s "$BASE_URL/api/feed" | jq '.' || echo "❌ Erreur API feed"

echo ""

# Test de l'API daily-goals
echo "🎯 Test API daily-goals..."
curl -s "$BASE_URL/api/daily-goals" | jq '.' || echo "❌ Erreur API daily-goals"

echo ""

# Test de l'API challenges
echo "🏆 Test API challenges..."
curl -s "$BASE_URL/api/challenges" | jq '.' || echo "❌ Erreur API challenges"

echo ""
echo "✅ Tests terminés !" 