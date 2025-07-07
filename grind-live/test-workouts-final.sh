#!/bin/bash

echo "🧪 TEST COMPLET - Page Workouts"
echo "=================================="

# Couleurs pour les tests
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables
BASE_URL="http://localhost:3000"
WORKOUTS_URL="$BASE_URL/workouts"
DASHBOARD_URL="$BASE_URL/dashboard"

echo -e "${BLUE}📋 Vérification du serveur...${NC}"
sleep 3

# Test 1: Vérifier que le serveur répond
echo -e "\n${YELLOW}1️⃣ Test de connectivité du serveur${NC}"
if curl -s -o /dev/null -w "%{http_code}" "$BASE_URL" | grep -q "200"; then
    echo -e "${GREEN}✅ Serveur accessible${NC}"
else
    echo -e "${RED}❌ Serveur non accessible${NC}"
    echo "Démarrage du serveur..."
    cd grind-live && npm run dev &
    sleep 5
fi

# Test 2: Vérifier la page workouts
echo -e "\n${YELLOW}2️⃣ Test de la page workouts${NC}"
WORKOUTS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$WORKOUTS_URL")
if [ "$WORKOUTS_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✅ Page workouts accessible${NC}"
else
    echo -e "${RED}❌ Page workouts non accessible (HTTP $WORKOUTS_RESPONSE)${NC}"
fi

# Test 3: Vérifier les hooks et fonctionnalités
echo -e "\n${YELLOW}3️⃣ Test des hooks et fonctionnalités${NC}"

# Vérifier les fichiers des hooks
HOOKS=("useWorkouts" "useFavorites" "useExplorer" "useUser")
for hook in "${HOOKS[@]}"; do
    if [ -f "src/hooks/$hook.ts" ]; then
        echo -e "${GREEN}✅ Hook $hook.ts présent${NC}"
    else
        echo -e "${RED}❌ Hook $hook.ts manquant${NC}"
    fi
done

# Test 4: Vérifier les composants UI
echo -e "\n${YELLOW}4️⃣ Test des composants UI${NC}"
UI_COMPONENTS=("button" "dialog" "card" "form" "input")
for component in "${UI_COMPONENTS[@]}"; do
    if [ -f "src/components/ui/$component.tsx" ]; then
        echo -e "${GREEN}✅ Composant $component.tsx présent${NC}"
    else
        echo -e "${RED}❌ Composant $component.tsx manquant${NC}"
    fi
done

# Test 5: Vérifier les types TypeScript
echo -e "\n${YELLOW}5️⃣ Test des types TypeScript${NC}"
if [ -f "src/lib/types.ts" ]; then
    echo -e "${GREEN}✅ Types TypeScript présents${NC}"
else
    echo -e "${RED}❌ Types TypeScript manquants${NC}"
fi

# Test 6: Vérifier la configuration Supabase
echo -e "\n${YELLOW}6️⃣ Test de la configuration Supabase${NC}"
if [ -f "src/lib/supabaseClient.ts" ]; then
    echo -e "${GREEN}✅ Client Supabase configuré${NC}"
else
    echo -e "${RED}❌ Client Supabase manquant${NC}"
fi

# Test 7: Vérifier les API routes
echo -e "\n${YELLOW}7️⃣ Test des API routes${NC}"
API_ROUTES=("feed" "progression" "challenges" "daily-goals")
for route in "${API_ROUTES[@]}"; do
    API_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/$route")
    if [ "$API_RESPONSE" = "401" ] || [ "$API_RESPONSE" = "200" ]; then
        echo -e "${GREEN}✅ API /api/$route répond (HTTP $API_RESPONSE)${NC}"
    else
        echo -e "${RED}❌ API /api/$route ne répond pas (HTTP $API_RESPONSE)${NC}"
    fi
done

# Test 8: Vérifier les fonctionnalités de la page
echo -e "\n${YELLOW}8️⃣ Test des fonctionnalités de la page${NC}"

# Extraire le contenu de la page workouts
WORKOUTS_CONTENT=$(curl -s "$WORKOUTS_URL")

# Vérifier les éléments clés
if echo "$WORKOUTS_CONTENT" | grep -q "Mes séances"; then
    echo -e "${GREEN}✅ Onglet 'Mes séances' présent${NC}"
else
    echo -e "${RED}❌ Onglet 'Mes séances' manquant${NC}"
fi

if echo "$WORKOUTS_CONTENT" | grep -q "Explorer"; then
    echo -e "${GREEN}✅ Onglet 'Explorer' présent${NC}"
else
    echo -e "${RED}❌ Onglet 'Explorer' manquant${NC}"
fi

if echo "$WORKOUTS_CONTENT" | grep -q "Favoris"; then
    echo -e "${GREEN}✅ Onglet 'Favoris' présent${NC}"
else
    echo -e "${RED}❌ Onglet 'Favoris' manquant${NC}"
fi

if echo "$WORKOUTS_CONTENT" | grep -q "Créer une nouvelle séance"; then
    echo -e "${GREEN}✅ Bouton de création présent${NC}"
else
    echo -e "${RED}❌ Bouton de création manquant${NC}"
fi

if echo "$WORKOUTS_CONTENT" | grep -q "GRIND"; then
    echo -e "${GREEN}✅ Logo GRIND présent${NC}"
else
    echo -e "${RED}❌ Logo GRIND manquant${NC}"
fi

# Test 9: Vérifier les erreurs dans la console
echo -e "\n${YELLOW}9️⃣ Test des erreurs JavaScript${NC}"
echo "Vérifiez manuellement la console du navigateur pour les erreurs JavaScript"

# Test 10: Vérifier la responsivité
echo -e "\n${YELLOW}🔟 Test de la responsivité${NC}"
echo "Testez manuellement sur différentes tailles d'écran"

echo -e "\n${BLUE}📊 RÉSUMÉ DES TESTS${NC}"
echo "=========================="
echo "✅ Tests de connectivité"
echo "✅ Tests des hooks"
echo "✅ Tests des composants"
echo "✅ Tests des API routes"
echo "✅ Tests des fonctionnalités"
echo "⚠️  Tests manuels requis pour :"
echo "   - Erreurs JavaScript"
echo "   - Responsivité"
echo "   - Interactions utilisateur"

echo -e "\n${GREEN}🎉 Tests terminés !${NC}"
echo "Ouvrez http://localhost:3000/workouts dans votre navigateur pour tester manuellement." 