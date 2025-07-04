import { useState, useCallback, useMemo } from 'react';

export function useTabs(tabs: string[], defaultTab: string, storageKey?: string) {
  // Validation des paramètres avec useMemo pour éviter les recalculs
  const validatedConfig = useMemo(() => {
    if (!Array.isArray(tabs) || tabs.length === 0) {
      console.warn('⚠️ useTabs: tabs doit être un tableau non vide');
      return {
        tabs: [] as string[],
        defaultTab: defaultTab,
        isValid: false
      };
    }

    if (!tabs.includes(defaultTab)) {
      console.warn('⚠️ useTabs: defaultTab doit être dans la liste des tabs');
      return {
        tabs,
        defaultTab: tabs[0],
        isValid: true
      };
    }

    return {
      tabs,
      defaultTab,
      isValid: true
    };
  }, [tabs, defaultTab]);

  const [activeTab, setActiveTab] = useState<string>(validatedConfig.defaultTab);

  console.log('🔍 useTabs: Initialisation avec', { 
    tabs: validatedConfig.tabs, 
    defaultTab: validatedConfig.defaultTab, 
    storageKey,
    isValid: validatedConfig.isValid
  });

  // Fonction stable pour changer d'onglet
  const setActiveTabStable = useCallback((tab: string) => {
    if (validatedConfig.tabs.includes(tab)) {
      console.log('💾 useTabs: Changement d\'onglet vers:', tab);
      setActiveTab(tab);
    } else {
      console.warn('⚠️ useTabs: Onglet invalide:', tab);
    }
  }, [validatedConfig.tabs]);

  // Retourner un objet stable
  return useMemo(() => ({
    activeTab,
    setActiveTab: setActiveTabStable,
    isActive: (tab: string) => activeTab === tab,
    tabs: validatedConfig.tabs,
  }), [activeTab, setActiveTabStable, validatedConfig.tabs]);
} 