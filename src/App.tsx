import { useEffect } from 'react';
import { useLauncherStore } from './stores/launcher';
import { PerformanceMonitor } from './utils/performance';
import { PerformanceDashboard } from './components/PerformanceDashboard';

function App() {
  const { searchQuery, setSearchQuery, isVisible, showWindow, hideWindow } =
    useLauncherStore();

  useEffect(() => {
    if (import.meta.env.DEV) {
      PerformanceMonitor.startupTimer();
    }

    showWindow();

    if (import.meta.env.DEV) {
      setTimeout(() => {
        PerformanceMonitor.endStartupTimer();
      }, 0);

      PerformanceMonitor.startFPSMonitoring();
    }

    const memoryInterval = import.meta.env.DEV
      ? setInterval(() => {
          PerformanceMonitor.logMemoryUsage();
        }, 30000)
      : null;

    const handleFocus = () => {
      if (import.meta.env.DEV) {
        const showStart = performance.now();
        showWindow();
        setTimeout(() => {
          const showTime = performance.now() - showStart;
          console.log(`Window show time: ${showTime.toFixed(2)}ms`);
        }, 0);
      } else {
        showWindow();
      }
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
        if (import.meta.env.DEV) {
          const hideStart = performance.now();
          await hideWindow();
          const hideTime = performance.now() - hideStart;
          console.log(`Window hide time: ${hideTime.toFixed(2)}ms`);
        } else {
          await hideWindow();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [hideWindow]);

  return (
    <div
      className={`w-full h-full flex justify-center items-center rounded-lg border border-white/20 transition-all duration-200 ease-out ${
        isVisible
          ? 'opacity-100 scale-100 translate-y-0'
          : 'opacity-0 scale-95 translate-y-2'
      }`}
    >
      <div className="h-6 w-6 min-h-6 min-w-6 border-2 border-white flex relative rounded bg-blue-500 top-4 left-4 p-4">
        test
      </div>
      <div className="p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-white">Launcher</h1>
          <p className="text-gray-400 text-sm">
            High-performance multiplatform launcher
          </p>
        </div>

        <div className="w-full max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type to search..."
            className="w-full px-4 py-3 text-white placeholder-gray-400 focus:outline-none"
            autoFocus
          />
        </div>

        <div className="text-xs text-gray-500 space-y-1 text-center">
          <div>Press Escape to hide</div>
          <div>Cmd+Shift+Space (macOS) / Ctrl+Shift+Space to toggle</div>
        </div>
      </div>

      <PerformanceDashboard />
    </div>
  );
}

export default App;
