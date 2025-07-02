import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
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
  const [availableThemes, setAvailableThemes] = useState<Theme[]>([
    raycastTheme as Theme,
    draculaTheme as Theme,
  ]);

  const loadThemesFromDisk = async (): Promise<Theme[]> => {
    try {
      const bundledThemes = [raycastTheme as Theme, draculaTheme as Theme];

      const userThemesData = await invoke<unknown[]>('load_user_themes');

      const userThemes = userThemesData.filter(
        (themeData): themeData is Theme => {
          return (
            typeof themeData === 'object' &&
            themeData !== null &&
            'meta' in themeData &&
            'colors' in themeData
          );
        },
      );

      const allThemes = [...bundledThemes, ...userThemes];
      return allThemes;
    } catch (error) {
      console.error('Failed to load themes:', error);
      const bundledThemes = [raycastTheme as Theme, draculaTheme as Theme];
      return bundledThemes;
    }
  };

  const reloadCurrentTheme = (freshThemes?: Theme[]) => {
    const themesToSearch = freshThemes || availableThemes;
    const savedThemeId = localStorage.getItem('keyed-launcher-theme');
    const themeIdToFind = savedThemeId || currentTheme.meta.id;

    const updatedTheme = themesToSearch.find(
      (t) => t.meta.id === themeIdToFind,
    );
    if (updatedTheme) {
      setCurrentTheme(updatedTheme);
      applyTheme(updatedTheme);
    }
  };

  const switchTheme = (themeId: string) => {
    const theme = availableThemes.find((t) => t.meta.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      applyTheme(theme);
      localStorage.setItem('keyed-launcher-theme', themeId);
    } else {
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
    const initializeThemes = async () => {
      const themes = await loadThemesFromDisk();
      setAvailableThemes(themes);

      const savedThemeId = localStorage.getItem('keyed-launcher-theme');
      if (savedThemeId) {
        const savedTheme = themes.find((t) => t.meta.id === savedThemeId);
        if (savedTheme) {
          setCurrentTheme(savedTheme);
          applyTheme(savedTheme);
        } else {
          applyTheme(currentTheme);
        }
      } else {
        applyTheme(currentTheme);
      }

      try {
        await invoke('start_theme_watcher');

        const unlisten = await listen('theme-file-changed', () => {
          loadThemesFromDisk().then((freshThemes) => {
            setAvailableThemes(freshThemes);
            reloadCurrentTheme(freshThemes);
          });
        });

        return () => {
          unlisten();
        };
      } catch (error) {
        console.error('Failed to setup theme watcher:', error);
      }
    };

    initializeThemes();
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
