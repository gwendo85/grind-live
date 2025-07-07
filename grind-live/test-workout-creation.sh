#!/bin/bash

echo "🧪 Test de création de séance"
echo "=============================="

# Vérifier que le serveur fonctionne
echo "1. Vérification du serveur..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Serveur accessible sur http://localhost:3000"
else
    echo "❌ Serveur non accessible"
    exit 1
fi

# Test de l'API de création de séance
echo ""
echo "2. Test de l'API de création de séance..."
echo "   (Note: Nécessite une authentification)"

echo ""
echo "📋 Instructions de test:"
echo "1. Ouvrez http://localhost:3000 dans votre navigateur"
echo "2. Connectez-vous si nécessaire"
echo "3. Allez sur le dashboard"
echo "4. Cliquez sur le bouton '🧪 Test Création Séance'"
echo "5. Vérifiez les logs dans la console du navigateur"
echo "6. Vérifiez que la séance apparaît dans la liste"

echo ""
echo "🔍 Logs à surveiller:"
echo "- '🔍 Test création séance simple'"
echo "- '🔍 createWorkout appelé avec:'"
echo "- '🔍 Données de séance à insérer:'"
echo "- '🔍 Résultat création séance:'"
echo "- '🔍 Ajout de la séance à la liste locale:'"

echo ""
echo "📊 Vérifications:"
echo "- La séance apparaît-elle dans la liste ?"
echo "- Y a-t-il des erreurs dans la console ?"
echo "- La séance est-elle visible dans Supabase ?" 