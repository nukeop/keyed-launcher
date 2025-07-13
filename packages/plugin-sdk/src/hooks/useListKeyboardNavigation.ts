import { LauncherEntry } from '../types';
import { useEffect, useState } from 'react';

interface UseListKeyboardNavigationProps {
  results: LauncherEntry[];
  onItemAction: (item: LauncherEntry) => void;
}

export function useListKeyboardNavigation({
  results,
  onItemAction,
}: UseListKeyboardNavigationProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
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
            onItemAction(results[selectedIndex]);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [results, selectedIndex, onItemAction]);

  return { selectedIndex };
}
