#!/bin/bash

echo "🔧 Correction automatique des erreurs de build..."

# Supprimer les imports inutilisés dans CreateWorkoutForm
sed -i '' 's/Badge, //g' src/components/workouts/CreateWorkoutForm.tsx

# Corriger les apostrophes dans les fichiers
find src -name "*.tsx" -type f -exec sed -i '' "s/l'idée/l\&apos;idée/g" {} \;
find src -name "*.tsx" -type f -exec sed -i '' "s/d'exercices/d\&apos;exercices/g" {} \;
find src -name "*.tsx" -type f -exec sed -i '' "s/C'est/C\&apos;est/g" {} \;
find src -name "*.tsx" -type f -exec sed -i '' "s/c'est/c\&apos;est/g" {} \;
find src -name "*.tsx" -type f -exec sed -i '' "s/l'ajout/l\&apos;ajout/g" {} \;

# Supprimer les variables non utilisées dans les hooks
sed -i '' 's/, e)/)/g' src/hooks/useChallenges.ts
sed -i '' 's/, error)/)/g' src/hooks/useProgression.ts
sed -i '' 's/, err)/)/g' src/hooks/useFavorites.ts
sed -i '' 's/const data = /\/\/ const data = /g' src/hooks/useDailyGoals.ts

echo "✅ Corrections appliquées"
echo "🧪 Test du build..."

npm run build 