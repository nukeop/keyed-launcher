export interface ThemeMeta {
  name: string;
  author: string;
  version: string;
  description: string;
  type: 'light' | 'dark';
  id: string;
}

export interface ThemeBaseColors {
  slate: string;
  gray: string;
  zinc: string;
  neutral: string;
  stone: string;
  red: string;
  orange: string;
  amber: string;
  yellow: string;
  lime: string;
  green: string;
  emerald: string;
  teal: string;
  cyan: string;
  sky: string;
  blue: string;
  indigo: string;
  violet: string;
  purple: string;
  fuchsia: string;
  pink: string;
  rose: string;
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

export interface ThemeBorderRadius {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface ThemeShadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface Theme {
  meta: ThemeMeta;
  colors: Partial<ThemeBaseColors>;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
  shadows: ThemeShadows;
}

export interface ThemeContextType {
  currentTheme: Theme;
  availableThemes: Theme[];
  switchTheme: (themeId: string) => void;
  reloadTheme: () => void;
}
