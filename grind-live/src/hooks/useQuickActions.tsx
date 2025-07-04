import React from 'react';
import { Plus, Users, BarChart2 } from 'lucide-react';

export interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export function useQuickActions() {
  // Ici, tu peux brancher des vraies actions (navigation, modale, etc.)
  const actions: QuickAction[] = [
    {
      id: 'add-exercise',
      label: 'Ajouter un exercice',
      icon: <Plus className="w-5 h-5 text-gray-500" />,
      onClick: () => {
        console.log('Action: Ajouter un exercice');
        // TODO: Ouvrir modale d'ajout d'exercice
        // TODO: Navigation vers /exercises/add
      },
    },
    {
      id: 'invite-friends',
      label: 'Inviter des amis',
      icon: <Users className="w-5 h-5 text-gray-500" />,
      onClick: () => {
        console.log('Action: Inviter des amis');
        // TODO: Ouvrir modale d'invitation
        // TODO: Intégration avec système d'amis
      },
    },
    {
      id: 'see-stats',
      label: 'Voir les stats',
      icon: <BarChart2 className="w-5 h-5 text-gray-500" />,
      onClick: () => {
        console.log('Action: Voir les stats');
        // TODO: Navigation vers /stats
        // TODO: Ouverture de modale avec graphiques
      },
    },
  ];

  return { actions };
} 