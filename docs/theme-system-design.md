# Theme System Design

## 🎯 Overview

Developer-friendly theme system with real-time development experience and easy sharing. Themes are JSON configuration files with no executable code.

## 🏗️ Architecture Decisions

### 1. Theme File Format

**Structure**:
```json
{
  "meta": {
    "name": "Raycast Inspired",
    "author": "keyed-launcher",
    "version": "1.0.0",
    "description": "Clean, modern theme inspired by Raycast",
    "type": "dark",
    "id": "raycast-inspired"
  },
  "colors": {
    "primary": "#007AFF",
    "primaryHover": "#0056CC",
    "background": "#1C1C1E",
    "backgroundElevated": "#2C2C2E",
    "surface": "#38383A",
    "surfaceHover": "#48484A",
    "text": "#FFFFFF",
    "textSecondary": "#8E8E93",
    "textTertiary": "#636366",
    "textInverse": "#000000",
    "border": "#48484A",
    "borderFocus": "#007AFF",
    "accent": "#30D158",
    "accentHover": "#28CD4F",
    "warning": "#FF9F0A",
    "warningHover": "#FF8C00",
    "error": "#FF453A",
    "errorHover": "#FF2D1A",
    "success": "#30D158",
    "successHover": "#28CD4F",
    "overlay": "rgba(0, 0, 0, 0.5)"
  },
  "spacing": {
    "xs": "0.25rem",
    "sm": "0.5rem",
    "md": "1rem",
    "lg": "1.5rem",
    "xl": "2rem",
    "2xl": "3rem"
  },
  "borderRadius": {
    "sm": "0.25rem",
    "md": "0.5rem",
    "lg": "0.75rem",
    "xl": "1rem"
  },
  "shadows": {
    "sm": "0 1px 2px rgba(0, 0, 0, 0.1)",
    "md": "0 4px 8px rgba(0, 0, 0, 0.15)",
    "lg": "0 8px 16px rgba(0, 0, 0, 0.2)",
    "xl": "0 16px 32px rgba(0, 0, 0, 0.25)"
  }
}
```

### 2. Technical Implementation

#### 2.1 Theme Provider Architecture

```typescript
interface ThemeContextType {
  currentTheme: Theme;
  availableThemes: Theme[];
  switchTheme: (themeId: string) => void;
  reloadTheme: () => void;
}
```

#### 2.2 Real-time Development Experience

**File Watcher System**:
- Watch user config directory for theme changes
- Parse and validate theme files on change
- Hot reload theme without page refresh
- Error reporting for invalid themes

#### 2.3 Integration with Tailwind v4

Convert theme JSON to CSS custom properties and inject into document root:
```css
@theme {
  --color-primary: theme('colors.primary');
  --color-background: theme('colors.background');
  --spacing-md: theme('spacing.md');
}
```

### 3. Plugin Widget System

Predefined widget components will exist and automatically conform to the current theme.

### 4. Theme Loading & Management

#### 4.1 Theme Discovery

**Location Strategy**:
- Built-in themes: `src/themes/`
- User themes: User config directory (`~/.config/keyed-launcher/themes/` on Linux, `~/Library/Application Support/keyed-launcher/themes/` on macOS, `%APPDATA%/keyed-launcher/themes/` on Windows)

#### 4.2 Theme Validation

JSON Schema validation with runtime checks, helpful error messages, and fallback to default theme on errors.

#### 4.3 Theme Storage

Current theme ID persisted in localStorage, theme files cached in memory with lazy loading.

## 🛠️ Implementation Plan

### Phase 1: Core Infrastructure
1. Theme schema and TypeScript interfaces
2. Theme provider context and CSS integration
3. Basic theme loading and switching
4. Default theme implementation

### Phase 2: Development Experience
1. File watcher and hot reload system
2. Theme validation and error handling

### Phase 3: Widget System
1. Predefined widget components with theme conformity

## 🔧 Technical Dependencies

**New Dependencies**:
- `chokidar` - File watching for development
- `ajv` - JSON schema validation

**Integration Points**:
- Tailwind v4 CSS custom properties
- React Context API
- Zustand for theme state management
- Tauri file system APIs for user config directory
