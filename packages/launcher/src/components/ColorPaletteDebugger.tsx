import { useTheme } from '../theming';
import { generateColorPalette } from '../theming/colorUtils';

export function ColorPaletteDebugger() {
  const { currentTheme } = useTheme();

  return (
    <div className="fixed left-4 top-4 z-50 max-h-96 overflow-auto rounded-lg border border-white/20 bg-black/90 p-4 text-white">
      <h3 className="mb-3 text-sm font-bold">
        Color Palette: {currentTheme.meta.name}
      </h3>

      <div className="space-y-3">
        {Object.entries(currentTheme.colors).map(([colorName, baseColor]) => {
          const palette = generateColorPalette(baseColor);

          return (
            <div key={colorName} className="space-y-1">
              <div className="text-xs font-semibold">
                {colorName} (base: {baseColor})
              </div>
              <div className="grid grid-cols-11 gap-1">
                {Object.entries(palette).map(([shade, hexColor]) => (
                  <div
                    key={shade}
                    className="group relative h-6 w-6 cursor-pointer rounded border border-white/20"
                    style={{ backgroundColor: hexColor }}
                    title={`${colorName}-${shade}: ${hexColor}`}
                  >
                    <div className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 transform whitespace-nowrap rounded bg-black/80 px-1 text-xs text-white opacity-0 group-hover:opacity-100">
                      {shade}
                    </div>
                  </div>
                ))}
              </div>

              {/* Show how it appears in actual CSS variables */}
              <div className="text-xs text-gray-400">
                CSS: --color-{colorName}-500 = {palette['500']}
              </div>

              {/* Test actual applied styles */}
              <div className="flex gap-2 text-xs">
                <div
                  className={`rounded px-2 py-1`}
                  style={{
                    backgroundColor: `var(--color-${colorName}-500)`,
                    color: `var(--color-${colorName}-50)`,
                  }}
                >
                  var(--color-{colorName}-500)
                </div>
                <div
                  className={`rounded border px-2 py-1`}
                  style={{
                    borderColor: `var(--color-${colorName}-300)`,
                    color: `var(--color-${colorName}-700)`,
                  }}
                >
                  border-{colorName}-300
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Special test for black and white */}
      <div className="mt-4 border-t border-white/20 p-2">
        <div className="mb-2 text-xs font-semibold">Black/White Test:</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div
            className="rounded p-2"
            style={{
              backgroundColor: 'var(--color-black-500)',
              color: 'var(--color-white-50)',
            }}
          >
            CSS var black-500
          </div>
          <div className="rounded bg-black p-2 text-white">
            Tailwind bg-black
          </div>
          <div
            className="rounded border p-2"
            style={{
              backgroundColor: 'var(--color-white-500)',
              color: 'var(--color-black-500)',
            }}
          >
            CSS var white-500
          </div>
          <div className="rounded bg-white p-2 text-black">
            Tailwind bg-white
          </div>
        </div>
      </div>
    </div>
  );
}
