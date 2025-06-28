import { useEffect } from 'react';
import { useLauncherStore } from './stores/launcher';

function App() {
  const { searchQuery, setSearchQuery, isVisible, showWindow, hideWindow } =
    useLauncherStore();

  useEffect(() => {
    showWindow();

    const handleFocus = () => {
      showWindow();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [showWindow]);

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        await hideWindow();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [hideWindow]);

  return (
    <div
      className={`app transition-all duration-200 ease-out ${
        isVisible
          ? 'opacity-100 scale-100 translate-y-0'
          : 'opacity-0 scale-95 translate-y-2'
      }`}
    >
      <div className="p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-white">Keyed Launcher</h1>
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
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
        </div>

        <div className="text-xs text-gray-500 space-y-1 text-center">
          <div>Press Escape to hide</div>
          <div>Cmd+Shift+Space (macOS) / Ctrl+Shift+Space to toggle</div>
        </div>
      </div>
    </div>
  );
}

export default App;
