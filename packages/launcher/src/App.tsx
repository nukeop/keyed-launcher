import { useLauncherStore } from './stores/launcher';
import { usePerformanceTracking } from './utils/usePerformanceTracking';
import { CommandPalette } from './components/CommandPalette';
import { AppContainer } from './components/AppContainer';
import { LauncherTransition } from './components/LauncherTransition';
import { userPerformanceMonitoringStartup } from './hooks/usePerformanceMonitoringStartup';
import { ThemeDebugger } from './components/ThemeDebugger';
import { ColorPaletteDebugger } from './components/ColorPaletteDebugger';
import { isThemeDebuggerVisible } from './hooks/useCommandPaletteResults';
import { ThemeProvider } from '@keyed-launcher/plugin-sdk';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PluginView } from './plugins/components/PluginVIew';

function App() {
  const { searchQuery, setSearchQuery, isVisible, hideWindow } =
    useLauncherStore();
  const { trackWindowHide } = usePerformanceTracking();
  const showDebugger = isThemeDebuggerVisible();

  userPerformanceMonitoringStartup();

  const handleClose = async () => {
    await trackWindowHide(hideWindow);
  };

  return (
    <BrowserRouter>
      <ThemeProvider>
        {showDebugger && (
          <div className="fixed right-4 top-4 z-50 space-y-4">
            <ThemeDebugger />
            <ColorPaletteDebugger />
          </div>
        )}
        <LauncherTransition isVisible={isVisible}>
          <AppContainer>
            <Routes>
              <Route
                path="/"
                element={
                  <CommandPalette
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onClose={handleClose}
                    emptyMessage="Start typing to search applications..."
                  />
                }
              />
              <Route
                path="/plugin/:pluginId/:commandName"
                element={<PluginView />}
              />
            </Routes>
          </AppContainer>
        </LauncherTransition>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
