import React, { createContext, type ReactNode, useEffect, useState } from 'react';

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

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ThemeSettings>(() => {
    const savedSettings = localStorage.getItem('themeSettings');
    return savedSettings ? JSON.parse(savedSettings) : { colorScheme: 'default', fontScheme: 'default' };
  });
  useEffect(() => {
    localStorage.setItem('themeSettings', JSON.stringify(settings));

    document.body.className = '';

    if (settings.colorScheme !== 'default') {
      document.body.classList.add(settings.colorScheme);
    }
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
