import { colord } from 'colord';

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

/**
 * Generate a complete Tailwind color palette (50-950) from a base color
 */
export function generateColorPalette(
  baseColor: string,
): Record<string, string> {
  const base = colord(baseColor);
  const palette: Record<string, string> = {};

  // Generate shades using lightness adjustments
  // 500 is the base color, others are generated from it
  SHADES.forEach((shade) => {
    if (shade === 500) {
      palette[shade.toString()] = base.toHex();
    } else if (shade < 500) {
      // Lighter shades - increase lightness
      const lightnessAdjustment = ((500 - shade) / 500) * 0.7;
      palette[shade.toString()] = base.lighten(lightnessAdjustment).toHex();
    } else {
      // Darker shades - decrease lightness
      const darknessAdjustment = ((shade - 500) / 450) * 0.5;
      palette[shade.toString()] = base.darken(darknessAdjustment).toHex();
    }
  });

  return palette;
}

/**
 * Generate all Tailwind color CSS custom properties for a theme
 */
export function generateTailwindColorProperties(
  colors: Record<string, string>,
): Record<string, string> {
  const properties: Record<string, string> = {};

  Object.entries(colors).forEach(([colorName, baseColor]) => {
    const palette = generateColorPalette(baseColor);

    Object.entries(palette).forEach(([shade, hexColor]) => {
      properties[`--color-${colorName}-${shade}`] = hexColor;
    });
  });

  return properties;
}
