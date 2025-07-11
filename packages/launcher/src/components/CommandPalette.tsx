import { useState, useEffect } from 'react';
import { ResultsList, LauncherEntry } from './ResultsList';
import { ActionBar } from './ActionBar';
import {
  isThemeDebuggerVisible,
  hideThemeDebugger,
  useCommandPaletteResults,
} from '../hooks/useCommandPaletteResults';
import { ViewWithSearchBar } from './Views/ViewWithSearchBar';
import { useLauncherStore } from '../stores/launcher';

interface CommandPaletteProps {
  onClose: () => Promise<void>;
}

export function CommandPalette({ onClose }: CommandPaletteProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { searchQuery, setSearchQuery } = useLauncherStore();

  const { results, executeResult } = useCommandPaletteResults(searchQuery);

  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          if (isThemeDebuggerVisible()) {
            hideThemeDebugger();
          } else if (searchQuery.length > 0) {
            setSearchQuery('');
          } else {
            onClose();
          }
          break;
        case 'ArrowDown':
          if (results.length === 0) return;
          event.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
          break;
        case 'ArrowUp':
          if (results.length === 0) return;
          event.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'PageDown':
          if (results.length === 0) return;
          event.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 10, results.length - 1));
          break;
        case 'PageUp':
          if (results.length === 0) return;
          event.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 10, 0));
          break;
        case 'Enter':
          if (results.length === 0) return;
          event.preventDefault();
          if (results[selectedIndex]) {
            executeResult(results[selectedIndex]);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    results,
    selectedIndex,
    executeResult,
    searchQuery,
    setSearchQuery,
    onClose,
  ]);

  const handleItemClick = (result: LauncherEntry) => {
    executeResult(result);
  };

  return (
    <ViewWithSearchBar data-testid="command-palette">
      <ResultsList
        results={results}
        selectedIndex={selectedIndex}
        onItemClick={handleItemClick}
      />
      <ActionBar icon="⚙️" />
    </ViewWithSearchBar>
  );
}
