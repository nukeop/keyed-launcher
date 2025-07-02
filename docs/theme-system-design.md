# Theme System Design

## 🎯 Overview

Theme system that overrides Tailwind's base colors via CSS custom properties. Themes are JSON files that define colors, spacing, borders, and shadows. Components use standard Tailwind classes unchanged.

## 🏗️ Architecture

### Theme File Format

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
    "black": "#1C1C1E",
    "white": "#FFFFFF",
    "gray": "#8E8E93", 
    "blue": "#007AFF",
    "green": "#30D158",
    "red": "#FF453A"
  },
  "spacing": {
    "xs": "0.25rem",
    "sm": "0.5rem",
    "md": "1rem"
  },
  "borderRadius": {
    "sm": "0.25rem", 
    "md": "0.5rem"
  },
  "shadows": {
    "sm": "0 1px 2px rgba(0, 0, 0, 0.1)",
    "md": "0 4px 8px rgba(0, 0, 0, 0.15)"
  }
}
```

### Implementation

**Theme Provider** (`ThemeProvider.tsx`):
- React Context manages theme state and switching
- Generates full color palettes (50-950 shades) from base colors
- Injects CSS custom properties into document root
- Persists theme selection in localStorage

**Color Generation** (`colorUtils.ts`):
- Each base color generates 11 shades using colord library
- Outputs CSS variables: `--color-{name}-{shade}` and `--color-{name}`

**Component Integration**:
- Components use standard Tailwind classes: `bg-black/60`, `text-blue-500`  
- No component changes needed for theme support
- Theme switching updates all components instantly

### CSS Output

```css
:root {
  --color-black: #1C1C1E;
  --color-black-50: #f8f8f8;
  --color-black-500: #1C1C1E;
  --color-black-950: #0a0a0a;
  /* Full palette for each color */
}
```

### Dependencies

- `colord` - Color manipulation and palette generation
