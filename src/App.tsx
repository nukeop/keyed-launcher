import { useLauncherStore } from './stores/launcher';
import { usePerformanceTracking } from './utils/usePerformanceTracking';
import { useCommandPaletteResults } from './hooks/useCommandPaletteResults';
import { CommandPalette } from './components/CommandPalette';
import { AppContainer } from './components/AppContainer';
import { LauncherTransition } from './components/LauncherTransition';
import { userPerformanceMonitoringStartup } from './hooks/usePerformanceMonitoringStartup';

function App() {
  const { searchQuery, setSearchQuery, isVisible, hideWindow } =
    useLauncherStore();
  const { trackWindowHide } = usePerformanceTracking();
  const { results, executeResult } = useCommandPaletteResults(searchQuery);
  userPerformanceMonitoringStartup();

  const handleClose = async () => {
    await trackWindowHide(hideWindow);
  };

  return (
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
  );
}

export default App;
