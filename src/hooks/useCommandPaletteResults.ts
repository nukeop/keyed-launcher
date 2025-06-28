import { useState, useMemo } from 'react';
import { Result } from '../components/ResultsList';

const mockResults: Result[] = [
  {
    id: 'calculator',
    title: 'Calculator',
    subtitle: 'System calculator application',
    icon: '🧮',
    action: () => console.log('Opening Calculator...'),
    shortcut: '⌘+C',
  },
  {
    id: 'terminal',
    title: 'Terminal',
    subtitle: 'Command line interface',
    icon: '💻',
    action: () => console.log('Opening Terminal...'),
    shortcut: '⌘+T',
  },
  {
    id: 'finder',
    title: 'Finder',
    subtitle: 'File manager',
    icon: '📁',
    action: () => console.log('Opening Finder...'),
    shortcut: '⌘+F',
  },
  {
    id: 'settings',
    title: 'System Preferences',
    subtitle: 'System settings and configuration',
    icon: '⚙️',
    action: () => console.log('Opening Settings...'),
    shortcut: '⌘+,',
  },
  {
    id: 'safari',
    title: 'Safari',
    subtitle: 'Web browser',
    icon: '🌐',
    action: () => console.log('Opening Safari...'),
    shortcut: '⌘+S',
  },
];

export function useCommandPaletteResults(searchQuery: string) {
  const [isLoading, setIsLoading] = useState(false);

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return mockResults;
    }

    const query = searchQuery.toLowerCase();
    return mockResults.filter(
      (result) =>
        result.title.toLowerCase().includes(query) ||
        (result.subtitle && result.subtitle.toLowerCase().includes(query)),
    );
  }, [searchQuery]);

  const executeResult = (result: Result) => {
    console.log(`Executing: ${result.title}`);
    result.action();
  };

  return {
    results: filteredResults,
    isLoading,
    executeResult,
  };
}
