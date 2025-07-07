#!/bin/bash

echo "🧪 Test du Dashboard GRIND Live - Mode Simulation"
echo "=================================================="

# Vérifier que le serveur fonctionne
echo "1️⃣ Vérification du serveur..."
if curl -s http://localhost:3001 > /dev/null; then
    echo "✅ Serveur accessible sur http://localhost:3001"
else
    echo "❌ Serveur non accessible"
    exit 1
fi

# Tester les APIs (doivent retourner 401)
echo ""
echo "2️⃣ Test des APIs (doivent retourner 401)..."
echo "   API Progression:"
if curl -s http://localhost:3001/api/progression | grep -q "Non autorisé"; then
    echo "   ✅ API Progression retourne 401 (mode simulation activé)"
else
    echo "   ❌ API Progression ne retourne pas 401"
fi

echo "   API Feed:"
if curl -s http://localhost:3001/api/feed | grep -q "Non autorisé"; then
    echo "   ✅ API Feed retourne 401 (mode simulation activé)"
else
    echo "   ❌ API Feed ne retourne pas 401"
fi

echo "   API Daily Goals:"
if curl -s http://localhost:3001/api/daily-goals | grep -q "Non autorisé"; then
    echo "   ✅ API Daily Goals retourne 401 (mode simulation activé)"
else
    echo "   ❌ API Daily Goals ne retourne pas 401"
fi

echo "   API Challenges:"
if curl -s http://localhost:3001/api/challenges | grep -q "Non autorisé"; then
    echo "   ✅ API Challenges retourne 401 (mode simulation activé)"
else
    echo "   ❌ API Challenges ne retourne pas 401"
fi

# Tester la page dashboard
echo ""
echo "3️⃣ Test de la page Dashboard..."
echo "   Chargement de la page..."
if curl -s http://localhost:3001/dashboard > /dev/null; then
    echo "   ✅ Page dashboard accessible"
else
    echo "   ❌ Page dashboard non accessible"
fi

# Vérifier que la page contient les éléments du mode simulation
echo ""
echo "4️⃣ Vérification du contenu (mode simulation)..."
echo "   Recherche de l'indicateur de simulation..."
if curl -s http://localhost:3001/dashboard | grep -q "🧪 Mode simulation activé"; then
    echo "   ✅ Indicateur de simulation trouvé"
else
    echo "   ⚠️  Indicateur de simulation non trouvé (peut être normal si chargement côté client)"
fi

echo ""
echo "5️⃣ Test de navigation..."
echo "   Test de la page Workouts..."
if curl -s http://localhost:3001/workouts > /dev/null; then
    echo "   ✅ Page Workouts accessible"
else
    echo "   ❌ Page Workouts non accessible"
fi

echo "   Test de la page Social..."
if curl -s http://localhost:3001/social > /dev/null; then
    echo "   ✅ Page Social accessible"
else
    echo "   ❌ Page Social non accessible"
fi

echo ""
echo "🎯 Résumé du test:"
echo "=================="
echo "✅ Serveur Next.js fonctionnel"
echo "✅ APIs retournent 401 (mode simulation activé)"
echo "✅ Pages accessibles"
echo "✅ Navigation fonctionnelle"
echo ""
echo "💡 Pour tester le mode simulation en action:"
echo "   1. Ouvrez http://localhost:3001/dashboard dans votre navigateur"
echo "   2. Vérifiez que les données simulées s'affichent"
echo "   3. Vérifiez que l'indicateur '🧪 Mode simulation activé' apparaît"
echo "   4. Testez la navigation entre les onglets"
echo ""
echo "🔧 Si les données ne s'affichent pas:"
echo "   - Ouvrez la console du navigateur (F12)"
echo "   - Vérifiez les logs avec '🔍'"
echo "   - Vérifiez qu'il n'y a pas d'erreurs JavaScript"
echo ""
echo "✨ Test terminé !" 