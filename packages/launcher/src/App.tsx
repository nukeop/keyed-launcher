import { AppContainer } from './components/AppContainer';
import { ColorPaletteDebugger } from './components/ColorPaletteDebugger';
import { CommandPalette } from './components/CommandPalette';
import { LauncherTransition } from './components/LauncherTransition';
import { ThemeDebugger } from './components/ThemeDebugger';
import { isThemeDebuggerVisible } from './hooks/useCommandPaletteResults';
import { userPerformanceMonitoringStartup } from './hooks/usePerformanceMonitoringStartup';
import { PluginView } from './plugins/components/PluginVIew';
import { useLauncherStore } from './stores/launcher';
import { ThemeProvider } from '@keyed-launcher/plugin-sdk';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  const { isVisible } = useLauncherStore();
  const showDebugger = isThemeDebuggerVisible();

  userPerformanceMonitoringStartup();

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
              <Route path="/" element={<CommandPalette />} />
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
