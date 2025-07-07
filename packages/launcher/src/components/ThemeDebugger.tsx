import { useTheme } from '../theming';

export function ThemeDebugger() {
  const { currentTheme, availableThemes, switchTheme } = useTheme();

  return (
    <div className="fixed right-4 top-4 z-50 rounded-lg border border-white/20 bg-black/80 p-4 text-white">
      <h3 className="mb-2 text-sm font-bold">Theme Debugger</h3>
      <div className="mb-2 text-xs">Current: {currentTheme.meta.name}</div>
      <div className="space-y-1">
        {availableThemes.map((theme) => (
          <button
            key={theme.meta.id}
            onClick={() => switchTheme(theme.meta.id)}
            className={`block w-full rounded px-2 py-1 text-left text-xs ${
              currentTheme.meta.id === theme.meta.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {theme.meta.name}
          </button>
        ))}
      </div>
    </div>
  );
}
