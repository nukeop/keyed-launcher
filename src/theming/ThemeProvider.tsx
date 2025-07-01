import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Theme, ThemeContextType } from './types';
import { generateTailwindColorProperties } from './colorUtils';
import raycastTheme from '../themes/raycast-inspired.json';
import draculaTheme from '../themes/dracula.json';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(
    raycastTheme as Theme,
  );
  const [availableThemes] = useState<Theme[]>([
    raycastTheme as Theme,
    draculaTheme as Theme,
  ]);

  const switchTheme = (themeId: string) => {
    const theme = availableThemes.find((t) => t.meta.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      applyTheme(theme);
      localStorage.setItem('keyed-launcher-theme', themeId);
    }
  };

  const reloadTheme = () => {
    applyTheme(currentTheme);
  };

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;

    const colorProperties = generateTailwindColorProperties(theme.colors);

    Object.entries(colorProperties).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    Object.entries(theme.colors).forEach(([colorName, baseColor]) => {
      root.style.setProperty(`--color-${colorName}`, baseColor);
    });

    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });

    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value);
    });

    Object.entries(theme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });
  };

  useEffect(() => {
    const savedThemeId = localStorage.getItem('keyed-launcher-theme');
    if (savedThemeId) {
      switchTheme(savedThemeId);
    } else {
      applyTheme(currentTheme);
    }
  }, []);

  const value: ThemeContextType = {
    currentTheme,
    availableThemes,
    switchTheme,
    reloadTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
