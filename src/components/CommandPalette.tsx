import { useState, useEffect } from 'react';
import { SearchBar } from './SearchBar';
import { ResultsList, LauncherEntry } from './ResultsList';
import { ActionBar } from './ActionBar';

interface CommandPaletteProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  results: LauncherEntry[];
  onResultExecute: (result: LauncherEntry) => void;
  onClose: () => Promise<void>;
  emptyMessage?: string;
}

export function CommandPalette({
  searchQuery,
  onSearchChange,
  results,
  onResultExecute,
  onClose,
  emptyMessage = 'Start typing to search...',
}: CommandPaletteProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          if (searchQuery.length > 0) {
            onSearchChange('');
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
            onResultExecute(results[selectedIndex]);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    results,
    selectedIndex,
    onResultExecute,
    searchQuery,
    onSearchChange,
    onClose,
  ]);

  const handleItemClick = (result: LauncherEntry) => {
    onResultExecute(result);
  };

  return (
    <div data-testid="command-palette" className="flex flex-1 flex-col">
      <SearchBar
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Type to search..."
      />

      <ResultsList
        results={results}
        selectedIndex={selectedIndex}
        onItemClick={handleItemClick}
        emptyMessage={
          searchQuery.length === 0 ? emptyMessage : 'No results found'
        }
      />
      <ActionBar icon="⚙️" />
    </div>
  );
}
