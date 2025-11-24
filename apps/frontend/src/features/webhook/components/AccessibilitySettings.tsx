// src/features/settings/components/AccessibilitySettings.tsx

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/hooks/useTheme';

export const AccessibilitySettings = () => {
  const { colorScheme, fontScheme, setColorScheme, setFontScheme } = useTheme();

  return (
    <div className="space-y-4">
      <h3>Options de Police (Dyslexie)</h3>
      <Select onValueChange={setFontScheme as (value: string) => void} value={fontScheme}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Police" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Par défaut</SelectItem>
          <SelectItem value="theme-dyslexia">Police Dyslexie</SelectItem>
          {/* ... autres options */}
        </SelectContent>
      </Select>

      <h3>Palettes de Couleur (Daltonisme)</h3>
      <Select onValueChange={setColorScheme as (value: string) => void} value={colorScheme}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Couleurs" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Palette Standard</SelectItem>
          <SelectItem value="theme-a11y-red-green">Daltonisme R/V</SelectItem>
          {/* ... autres options */}
        </SelectContent>
      </Select>
    </div>
  );
};
