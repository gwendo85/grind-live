#!/bin/bash

echo "🧪 Test complet des APIs GRIND Live"
echo "=================================="

# Attendre que le serveur démarre
echo "⏳ Attente du démarrage du serveur..."
sleep 5

# Fonction pour tester une API
test_api() {
    local name=$1
    local url=$2
    local method=${3:-GET}
    local data=${4:-""}
    
    echo "🔍 Test de $name..."
    
    if [ "$method" = "POST" ] && [ -n "$data" ]; then
        response=$(curl -s -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "$data" "$url")
    else
        response=$(curl -s -w "%{http_code}" "$url")
    fi
    
    http_code="${response: -3}"
    body="${response%???}"
    
    if [ "$http_code" = "200" ]; then
        echo "✅ $name: OK (HTTP $http_code)"
        echo "   Réponse: ${body:0:100}..."
    else
        echo "❌ $name: ERREUR (HTTP $http_code)"
        echo "   Réponse: $body"
    fi
    echo ""
}

# Tests des APIs
test_api "Feed" "http://localhost:3000/api/feed"
test_api "Progression" "http://localhost:3000/api/progression"
test_api "Daily Goals" "http://localhost:3000/api/daily-goals"
test_api "Challenges" "http://localhost:3000/api/challenges"
test_api "Favorites GET" "http://localhost:3000/api/favorites"
test_api "Favorites POST" "http://localhost:3000/api/favorites" "POST" '{"userId":"mock-user","workoutId":"test-1"}'

# Tests des pages principales
echo "🌐 Test des pages principales..."
test_api "Page d'accueil" "http://localhost:3000/"
test_api "Dashboard" "http://localhost:3000/dashboard"
test_api "Workouts" "http://localhost:3000/workouts"
test_api "Social" "http://localhost:3000/social"
test_api "Auth" "http://localhost:3000/auth"

echo "✅ Tests terminés !" 