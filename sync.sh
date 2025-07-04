#!/bin/bash

# Script de synchronisation automatique pour Grind Live
# Synchronise le code avec GitHub et exporte le schéma Supabase

echo "🔄 Début de la synchronisation..."

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages colorés
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 1. Vérifier si on est dans un repo git
if [ ! -d ".git" ]; then
    print_error "Ce dossier n'est pas un repository Git !"
    exit 1
fi

# 2. Vérifier s'il y a des changements
if [ -z "$(git status --porcelain)" ]; then
    print_warning "Aucun changement détecté. Synchronisation terminée."
    exit 0
fi

# 3. Ajouter tous les fichiers
print_status "Ajout des fichiers..."
git add .

# 4. Créer le message de commit
COMMIT_MESSAGE="${1:-'Sauvegarde automatique - $(date "+%Y-%m-%d %H:%M:%S")'}"

# 5. Committer les changements
print_status "Création du commit..."
if git commit -m "$COMMIT_MESSAGE"; then
    print_status "Commit créé avec succès"
else
    print_error "Erreur lors de la création du commit"
    exit 1
fi

# 6. Pousser sur GitHub
print_status "Poussée vers GitHub..."
if git push; then
    print_status "Code synchronisé sur GitHub"
else
    print_error "Erreur lors de la poussée vers GitHub"
    exit 1
fi

# 7. Exporter le schéma Supabase (si Supabase CLI est installé)
if command -v supabase &> /dev/null; then
    print_status "Export du schéma Supabase..."
    if [ -f "supabase/config.toml" ]; then
        # Si on est dans le projet Supabase
        if supabase db diff --schema public > supabase-schema.sql 2>/dev/null; then
            print_status "Schéma Supabase exporté"
            
            # Ajouter et committer le schéma exporté
            git add supabase-schema.sql
            if git commit -m "Mise à jour du schéma Supabase - $(date "+%Y-%m-%d %H:%M:%S")"; then
                git push
                print_status "Schéma Supabase synchronisé"
            fi
        else
            print_warning "Impossible d'exporter le schéma Supabase (vérifiez la configuration)"
        fi
    else
        print_warning "Fichier supabase/config.toml non trouvé"
    fi
else
    print_warning "Supabase CLI non installé - schéma non exporté"
    echo "Pour installer Supabase CLI: npm install -g supabase"
fi

# 8. Vérifier le statut final
print_status "Vérification du statut..."
git status --porcelain

echo ""
print_status "🎉 Synchronisation terminée avec succès !"
echo ""
echo "📋 Résumé:"
echo "   • Code poussé sur GitHub"
echo "   • Schéma Supabase exporté (si disponible)"
echo "   • Commit: $COMMIT_MESSAGE"
echo ""
echo "🌐 Pour récupérer sur un autre ordinateur:"
echo "   git clone https://github.com/gwendo85/grind-live.git"
echo "   cd grind-live"
echo "   npm install"
echo "   supabase db push  # (si Supabase CLI installé)" 