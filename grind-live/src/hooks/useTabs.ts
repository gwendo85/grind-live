import { useState, useEffect, useCallback, useMemo } from 'react';

export function useTabs<T extends string>(tabs: T[], defaultTab: T, storageKey?: string) {
  // Validation des paramètres avec useMemo pour éviter les recalculs
  const validatedConfig = useMemo(() => {
    if (!Array.isArray(tabs) || tabs.length === 0) {
      console.warn('⚠️ useTabs: tabs doit être un tableau non vide');
      return {
        tabs: [] as T[],
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

  const [activeTab, setActiveTab] = useState<T>(validatedConfig.defaultTab);

  console.log('🔍 useTabs: Initialisation avec', { 
    tabs: validatedConfig.tabs, 
    defaultTab: validatedConfig.defaultTab, 
    storageKey,
    isValid: validatedConfig.isValid
  });

  // Fonction stable pour changer d'onglet
  const setActiveTabStable = useCallback((tab: T) => {
    if (validatedConfig.tabs.includes(tab)) {
      console.log('💾 useTabs: Changement d\'onglet vers:', tab);
      setActiveTab(tab);
    } else {
      console.warn('⚠️ useTabs: Onglet invalide:', tab);
    }
  }, [validatedConfig.tabs]);

  // Persistance dans le localStorage si storageKey fourni
  useEffect(() => {
    if (!storageKey || typeof window === 'undefined' || !validatedConfig.isValid) return;
    
    try {
      console.log('🔍 useTabs: Lecture localStorage pour', storageKey);
      const saved = window.localStorage.getItem(storageKey);
      if (saved && validatedConfig.tabs.includes(saved as T)) {
        console.log('✅ useTabs: Tab restauré:', saved);
        setActiveTab(saved as T);
      }
    } catch (error) {
      console.warn('⚠️ useTabs: Erreur lors de la lecture du localStorage:', error);
    }
  }, [storageKey, validatedConfig.tabs, validatedConfig.isValid]);

  useEffect(() => {
    if (!storageKey || typeof window === 'undefined' || !validatedConfig.isValid) return;
    
    try {
      console.log('💾 useTabs: Sauvegarde localStorage:', activeTab);
      window.localStorage.setItem(storageKey, activeTab);
    } catch (error) {
      console.warn('⚠️ useTabs: Erreur lors de l\'écriture dans le localStorage:', error);
    }
  }, [activeTab, storageKey, validatedConfig.isValid]);

  // Retourner un objet stable
  return useMemo(() => ({
    activeTab,
    setActiveTab: setActiveTabStable,
    isActive: (tab: T) => activeTab === tab,
    tabs: validatedConfig.tabs,
  }), [activeTab, setActiveTabStable, validatedConfig.tabs]);
} 