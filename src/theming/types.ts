export interface ThemeMeta {
  name: string;
  author: string;
  version: string;
  description: string;
  type: 'light' | 'dark';
  id: string;
}

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  background: string;
  backgroundElevated: string;
  surface: string;
  surfaceHover: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  border: string;
  borderFocus: string;
  accent: string;
  accentHover: string;
  warning: string;
  warningHover: string;
  error: string;
  errorHover: string;
  success: string;
  successHover: string;
  overlay: string;
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
  colors: ThemeColors;
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
