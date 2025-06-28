import { useState, useEffect } from 'react';
import { SearchBar } from './SearchBar';
import { ResultsList, Result } from './ResultsList';

interface CommandPaletteProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  results: Result[];
  onResultExecute: (result: Result) => void;
  emptyMessage?: string;
}

export function CommandPalette({
  searchQuery,
  onSearchChange,
  results,
  onResultExecute,
  emptyMessage = 'Start typing to search...',
}: CommandPaletteProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (results.length === 0) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          event.preventDefault();
          if (results[selectedIndex]) {
            onResultExecute(results[selectedIndex]);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [results, selectedIndex, onResultExecute]);

  const handleItemClick = (result: Result) => {
    onResultExecute(result);
  };

  return (
    <div className="flex flex-col h-full max-w-2xl w-full bg-black/40 backdrop-blur-sm rounded-lg border border-white/20 shadow-2xl">
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
    </div>
  );
}
