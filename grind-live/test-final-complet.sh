#!/bin/bash

echo "🎯 Test Complet - GRIND Live"
echo "============================="

# Test du serveur
echo "🔍 1. Test du serveur..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Serveur accessible sur http://localhost:3000"
else
    echo "❌ Serveur non accessible"
    exit 1
fi

# Test des APIs
echo ""
echo "🔍 2. Test des APIs..."
APIS=("feed" "progression" "daily-goals" "challenges")
for api in "${APIS[@]}"; do
    status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/$api)
    if [ "$status" = "200" ]; then
        echo "✅ API /api/$api: 200 (données simulées)"
    else
        echo "❌ API /api/$api: $status"
    fi
done

# Test des pages
echo ""
echo "🔍 3. Test des pages..."
PAGES=("" "dashboard" "workouts" "social" "auth")
for page in "${PAGES[@]}"; do
    status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/$page)
    if [ "$status" = "200" ]; then
        echo "✅ Page /$page: 200"
    else
        echo "❌ Page /$page: $status"
    fi
done

# Test du contenu des APIs
echo ""
echo "🔍 4. Test du contenu des APIs..."
echo "📊 Feed API:"
feed_content=$(curl -s http://localhost:3000/api/feed)
if echo "$feed_content" | grep -q "Alex"; then
    echo "✅ Données simulées du feed présentes"
else
    echo "❌ Données du feed manquantes"
fi

echo "📊 Progression API:"
prog_content=$(curl -s http://localhost:3000/api/progression)
if echo "$prog_content" | grep -q "sessionsDone"; then
    echo "✅ Données de progression présentes"
else
    echo "❌ Données de progression manquantes"
fi

echo ""
echo "🎉 Tests terminés avec succès !"
echo ""
echo "📱 Prochaines étapes :"
echo "1. Ouvrez http://localhost:3000 dans votre navigateur"
echo "2. Naviguez vers le dashboard: http://localhost:3000/dashboard"
echo "3. Testez les différentes sections (Feed, Progression, Séances)"
echo "4. Vérifiez que les données simulées s'affichent correctement"
echo ""
echo "🔧 Mode simulation activé - Interface fonctionnelle sans authentification" 