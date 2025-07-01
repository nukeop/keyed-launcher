import { useState, useMemo } from 'react';
import { LauncherEntry } from '../components/ResultsList';

let showThemeDebugger = false;
let forceUpdate: (() => void) | null = null;

export const toggleThemeDebugger = () => {
  showThemeDebugger = !showThemeDebugger;
  if (forceUpdate) forceUpdate();
};

export const hideThemeDebugger = () => {
  if (showThemeDebugger) {
    showThemeDebugger = false;
    if (forceUpdate) forceUpdate();
  }
};

export const isThemeDebuggerVisible = () => showThemeDebugger;

const mockResults: LauncherEntry[] = [
  {
    id: 'calculator',
    name: 'calculator',
    title: 'Calculator',
    subtitle: 'System calculator application',
    description: 'Built-in system calculator for basic math operations',
    icon: '🧮',
    mode: 'no-view',
    category: 'Applications',
    pluginId: 'core-applications',
    action: () => console.log('Opening Calculator...'),
    shortcut: '⌘+C',
    keywords: ['calc', 'math', 'numbers'],
  },
  {
    id: 'terminal',
    name: 'terminal',
    title: 'Terminal',
    subtitle: 'Command line interface',
    description: 'Access the command line terminal',
    icon: '💻',
    mode: 'no-view',
    category: 'Applications',
    pluginId: 'core-applications',
    action: () => console.log('Opening Terminal...'),
    shortcut: '⌘+T',
    keywords: ['terminal', 'shell', 'command'],
  },
  {
    id: 'finder',
    name: 'finder',
    title: 'Finder',
    subtitle: 'File manager',
    description: 'Browse and manage files and folders',
    icon: '📁',
    mode: 'no-view',
    category: 'Applications',
    pluginId: 'core-applications',
    action: () => console.log('Opening Finder...'),
    shortcut: '⌘+F',
    keywords: ['files', 'folders', 'browse'],
  },
  {
    id: 'theme-debugger',
    name: 'theme-debugger',
    title: 'Theme Debugger',
    subtitle: 'Toggle theme development tools',
    description: 'Show/hide theme switcher and color palette debugger',
    icon: '🎨',
    mode: 'no-view',
    category: 'Developer',
    pluginId: 'core-dev',
    action: () => {
      console.log('Toggling theme debugger...');
      toggleThemeDebugger();
    },
    shortcut: '⌘+⇧+T',
    keywords: ['theme', 'debug', 'colors', 'palette', 'developer'],
  },
  {
    id: 'settings',
    name: 'system-preferences',
    title: 'System Preferences',
    subtitle: 'System settings and configuration',
    description: 'Configure system settings and preferences',
    icon: '⚙️',
    mode: 'no-view',
    category: 'System',
    pluginId: 'core-system',
    action: () => console.log('Opening Settings...'),
    shortcut: '⌘+,',
    keywords: ['settings', 'preferences', 'config'],
  },
  {
    id: 'safari',
    name: 'safari',
    title: 'Safari',
    subtitle: 'Web browser',
    description: 'Browse the web with Safari',
    icon: '🌐',
    mode: 'no-view',
    category: 'Applications',
    pluginId: 'core-applications',
    action: () => console.log('Opening Safari...'),
    shortcut: '⌘+S',
    keywords: ['browser', 'web', 'internet'],
  },
];

export function useCommandPaletteResults(searchQuery: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  forceUpdate = () => setUpdateTrigger((prev) => prev + 1);

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return mockResults;
    }

    const query = searchQuery.toLowerCase();
    return mockResults.filter(
      (result) =>
        result.title.toLowerCase().includes(query) ||
        (result.subtitle && result.subtitle.toLowerCase().includes(query)) ||
        (result.keywords &&
          result.keywords.some((keyword) =>
            keyword.toLowerCase().includes(query),
          )),
    );
  }, [searchQuery]);

  const executeResult = (result: LauncherEntry) => {
    console.log(`Executing: ${result.title}`);
    result.action();
  };

  return {
    results: filteredResults,
    isLoading,
    setIsLoading,
    executeResult,
  };
}
