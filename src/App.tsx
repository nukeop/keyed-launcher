import { useEffect } from 'react';
import { useLauncherStore } from './stores/launcher';
import { usePerformanceTracking } from './utils/usePerformanceTracking';
import { useCommandPaletteResults } from './hooks/useCommandPaletteResults';
import { CommandPalette } from './components/CommandPalette';
import { PerformanceDashboard } from './components/PerformanceDashboard';
import { AppContainer } from './components/AppContainer';
import { LauncherTransition } from './components/LauncherTransition';

function App() {
  const { searchQuery, setSearchQuery, isVisible, showWindow, hideWindow } =
    useLauncherStore();
  const { trackStartup, trackWindowShow, trackWindowHide, startMonitoring } =
    usePerformanceTracking();
  const { results, executeResult } = useCommandPaletteResults(searchQuery);

  useEffect(() => {
    const startup = trackStartup();
    showWindow();
    startup.end();

    const memoryInterval = startMonitoring();

    const handleFocus = () => {
      trackWindowShow(showWindow);
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
      if (memoryInterval) {
        clearInterval(memoryInterval);
      }
    };
  }, [showWindow]);

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        await trackWindowHide(hideWindow);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [hideWindow, trackWindowHide]);

  return (
    <LauncherTransition isVisible={isVisible}>
      <AppContainer>
        <CommandPalette
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          results={results}
          onResultExecute={executeResult}
          emptyMessage="Start typing to search applications..."
        />

        <PerformanceDashboard />
      </AppContainer>
    </LauncherTransition>
  );
}

export default App;
