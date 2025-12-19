import { useState, useEffect, useCallback } from 'react';

export type SettingsCategory = 
  | 'dashboard' 
  | 'connections' 
  | 'data' 
  | 'system' 
  | 'appearance' 
  | 'security' 
  | 'integrations';

const STORAGE_KEY = 'settings_active_category';
const VALID_CATEGORIES: SettingsCategory[] = [
  'dashboard', 
  'connections', 
  'data', 
  'system', 
  'appearance', 
  'security', 
  'integrations'
];

interface UseSettingsNavigationReturn {
  activeCategory: SettingsCategory;
  setActiveCategory: (category: SettingsCategory) => void;
  categoryTitles: Record<SettingsCategory, string>;
}

export function useSettingsNavigation(): UseSettingsNavigationReturn {
  const [activeCategory, setActiveCategoryState] = useState<SettingsCategory>('dashboard');

  // Load persisted category on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && VALID_CATEGORIES.includes(saved as SettingsCategory)) {
      setActiveCategoryState(saved as SettingsCategory);
    }
  }, []);

  // Persist category changes
  const setActiveCategory = useCallback((category: SettingsCategory) => {
    setActiveCategoryState(category);
    localStorage.setItem(STORAGE_KEY, category);
  }, []);

  const categoryTitles: Record<SettingsCategory, string> = {
    dashboard: 'Dashboard',
    connections: 'Conexões',
    data: 'Dados & Backup',
    system: 'Sistema',
    appearance: 'Aparência',
    security: 'Segurança & Usuários',
    integrations: 'Integrações',
  };

  return {
    activeCategory,
    setActiveCategory,
    categoryTitles,
  };
}
