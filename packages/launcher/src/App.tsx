import { useLauncherStore } from './stores/launcher';
import { usePerformanceTracking } from './utils/usePerformanceTracking';
import { useCommandPaletteResults } from './hooks/useCommandPaletteResults';
import { CommandPalette } from './components/CommandPalette';
import { AppContainer } from './components/AppContainer';
import { LauncherTransition } from './components/LauncherTransition';
import { userPerformanceMonitoringStartup } from './hooks/usePerformanceMonitoringStartup';
import { ThemeDebugger } from './components/ThemeDebugger';
import { ColorPaletteDebugger } from './components/ColorPaletteDebugger';
import { isThemeDebuggerVisible } from './hooks/useCommandPaletteResults';
import { ThemeProvider } from '@keyed-launcher/plugin-sdk';

function App() {
  const { searchQuery, setSearchQuery, isVisible, hideWindow } =
    useLauncherStore();
  const { trackWindowHide } = usePerformanceTracking();
  const { results, executeResult } = useCommandPaletteResults(searchQuery);
  const showDebugger = isThemeDebuggerVisible();

  userPerformanceMonitoringStartup();

  const handleClose = async () => {
    await trackWindowHide(hideWindow);
  };

  return (
    <ThemeProvider>
      {showDebugger && (
        <div className="fixed right-4 top-4 z-50 space-y-4">
          <ThemeDebugger />
          <ColorPaletteDebugger />
        </div>
      )}
      <LauncherTransition isVisible={isVisible}>
        <AppContainer>
          <CommandPalette
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            results={results}
            onResultExecute={executeResult}
            onClose={handleClose}
            emptyMessage="Start typing to search applications..."
          />
        </AppContainer>
      </LauncherTransition>
    </ThemeProvider>
  );
}

export default App;
