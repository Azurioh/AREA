import React, { createContext, type ReactNode, useEffect, useState } from 'react';

type ColorScheme = 'default';
type FontScheme = 'default' | 'theme-dyslexia';

/**
 * @interface ThemeSettings
 * @description Theme settings
 *
 * @property {ColorScheme} colorScheme - The color scheme
 * @property {FontScheme} fontScheme - The font scheme
 */
interface ThemeSettings {
  colorScheme: ColorScheme;
  fontScheme: FontScheme;
}

/**
 * @interface ThemeContextType
 * @description Theme context type
 *
 * @property {ColorScheme} colorScheme - The color scheme
 * @property {FontScheme} fontScheme - The font scheme
 * @property {Function} setColorScheme - The function to set the color scheme
 * @property {Function} setFontScheme - The function to set the font scheme
 */
interface ThemeContextType extends ThemeSettings {
  setColorScheme: (scheme: ColorScheme) => void;
  setFontScheme: (scheme: FontScheme) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * @function ThemeProvider
 * @description Theme provider
 *
 * @param {ReactNode} children - The children to render
 * @returns {JSX.Element} The theme provider component
 */
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
