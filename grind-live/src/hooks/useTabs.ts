import { useState, useEffect } from 'react';

export function useTabs<T extends string>(tabs: T[], defaultTab: T, storageKey?: string) {
  const [activeTab, setActiveTab] = useState<T>(defaultTab);

  // Persistance dans le localStorage si storageKey fourni
  useEffect(() => {
    if (!storageKey) return;
    const saved = window.localStorage.getItem(storageKey);
    if (saved && tabs.includes(saved as T)) {
      setActiveTab(saved as T);
    }
  }, [storageKey, tabs]);

  useEffect(() => {
    if (storageKey) {
      window.localStorage.setItem(storageKey, activeTab);
    }
  }, [activeTab, storageKey]);

  return {
    activeTab,
    setActiveTab,
    isActive: (tab: T) => activeTab === tab,
    tabs,
  };
} 