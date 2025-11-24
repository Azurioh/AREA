import React, { createContext, type ReactNode, useEffect, useState } from 'react';

// Définition des options disponibles
type ColorScheme = 'default' | 'theme-a11y-red-green' | 'theme-a11y-blue-yellow';
type FontScheme = 'default' | 'theme-dyslexia' | 'theme-high-contrast';

interface ThemeSettings {
  colorScheme: ColorScheme;
  fontScheme: FontScheme;
}

interface ThemeContextType extends ThemeSettings {
  setColorScheme: (scheme: ColorScheme) => void;
  setFontScheme: (scheme: FontScheme) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// --- Provider ---

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ThemeSettings>(() => {
    // Lire les paramètres depuis localStorage au montage
    const savedSettings = localStorage.getItem('themeSettings');
    return savedSettings ? JSON.parse(savedSettings) : { colorScheme: 'default', fontScheme: 'default' };
  });

  // Sauvegarder les paramètres et appliquer les classes au <body>
  useEffect(() => {
    localStorage.setItem('themeSettings', JSON.stringify(settings));

    // Réinitialiser les classes de thème
    document.body.className = '';

    // Appliquer la classe de couleur
    if (settings.colorScheme !== 'default') {
      document.body.classList.add(settings.colorScheme);
    }
    // Appliquer la classe de police
    if (settings.fontScheme !== 'default') {
      document.body.classList.add(settings.fontScheme);
    }
  }, [settings]);

  const setColorScheme = (scheme: ColorScheme) => setSettings((prev) => ({ ...prev, colorScheme: scheme }));
  const setFontScheme = (scheme: FontScheme) => setSettings((prev) => ({ ...prev, fontScheme: scheme }));

  return (
    <ThemeContext.Provider value={{ ...settings, setColorScheme, setFontScheme }}>{children}</ThemeContext.Provider>
  );
};
