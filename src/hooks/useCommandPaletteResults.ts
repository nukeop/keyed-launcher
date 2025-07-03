import { useState, useMemo } from 'react';
import { LauncherEntry } from '../components/ResultsList';
import { getAllLauncherEntries } from '../plugins/commands';
import { usePluginRegistry } from '../stores/plugins';

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
    id: 'core-applications.calculator',
    commandName: 'calculator',
    title: 'Calculator',
    subtitle: 'System calculator application',
    description: 'Built-in system calculator for basic math operations',
    mode: 'no-view',
    category: 'Applications',
    pluginId: 'core-applications',
    execute: {
      mode: 'no-view',
      execute: async () => console.log('Opening Calculator...'),
    },
    icon: '🧮',
    shortcut: '⌘+C',
    keywords: ['calc', 'math', 'numbers'],
  },
  {
    id: 'core-applications.terminal',
    commandName: 'terminal',
    title: 'Terminal',
    subtitle: 'Command line interface',
    description: 'Access the command line terminal',
    mode: 'no-view',
    category: 'Applications',
    pluginId: 'core-applications',
    execute: {
      mode: 'no-view',
      execute: async () => console.log('Opening Terminal...'),
    },
    icon: '💻',
    shortcut: '⌘+T',
    keywords: ['terminal', 'shell', 'command'],
  },
  {
    id: 'core-applications.finder',
    commandName: 'finder',
    title: 'Finder',
    subtitle: 'File manager',
    description: 'Browse and manage files and folders',
    mode: 'no-view',
    category: 'Applications',
    pluginId: 'core-applications',
    execute: {
      mode: 'no-view',
      execute: async () => console.log('Opening Finder...'),
    },
    icon: '📁',
    shortcut: '⌘+F',
    keywords: ['files', 'folders', 'browse'],
  },
  {
    id: 'core-dev.theme-debugger',
    commandName: 'theme-debugger',
    title: 'Theme Debugger',
    subtitle: 'Toggle theme development tools',
    description: 'Show/hide theme switcher and color palette debugger',
    mode: 'no-view',
    category: 'Developer',
    pluginId: 'core-dev',
    execute: {
      mode: 'no-view',
      execute: async () => {
        console.log('Toggling theme debugger...');
        toggleThemeDebugger();
      },
    },
    icon: '🎨',
    shortcut: '⌘+⇧+T',
    keywords: ['theme', 'debug', 'colors', 'palette', 'developer'],
  },
  {
    id: 'core-system.settings',
    commandName: 'system-preferences',
    title: 'System Preferences',
    subtitle: 'System settings and configuration',
    description: 'Configure system settings and preferences',
    mode: 'no-view',
    category: 'System',
    pluginId: 'core-system',
    execute: {
      mode: 'no-view',
      execute: async () => console.log('Opening Settings...'),
    },
    icon: '⚙️',
    shortcut: '⌘+,',
    keywords: ['settings', 'preferences', 'config'],
  },
  {
    id: 'core-applications.safari',
    commandName: 'safari',
    title: 'Safari',
    subtitle: 'Web browser',
    description: 'Browse the web with Safari',
    mode: 'no-view',
    category: 'Applications',
    pluginId: 'core-applications',
    execute: {
      mode: 'no-view',
      execute: async () => console.log('Opening Safari...'),
    },
    icon: '🌐',
    shortcut: '⌘+S',
    keywords: ['browser', 'web', 'internet'],
  },
];

export function useCommandPaletteResults(searchQuery: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [_updateTrigger, setUpdateTrigger] = useState(0);
  const plugins = usePluginRegistry((state) => state.plugins);

  forceUpdate = () => setUpdateTrigger((prev) => prev + 1);

  const allResults = useMemo(() => {
    const pluginEntries = getAllLauncherEntries();
    return [...mockResults, ...pluginEntries];
  }, [plugins]);

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return allResults;
    }

    const query = searchQuery.toLowerCase();
    return allResults.filter(
      (result) =>
        result.title.toLowerCase().includes(query) ||
        (result.subtitle && result.subtitle.toLowerCase().includes(query)) ||
        (result.keywords &&
          result.keywords.some((keyword) =>
            keyword.toLowerCase().includes(query),
          )),
    );
  }, [searchQuery, allResults]);

  const executeResult = (result: LauncherEntry) => {
    if (result.execute) {
      const context = {
        environment: {
          theme: 'default',
          platform: 'web',
          debug: true,
        },
      };

      if (result.execute.mode === 'no-view') {
        result.execute.execute(context).catch((error) => {
          console.error(`Error executing command ${result.id}:`, error);
        });
      } else {
        result.execute.execute(context).catch((error) => {
          console.error(`Error executing view command ${result.id}:`, error);
        });
      }
    }
  };

  return {
    results: filteredResults,
    isLoading,
    setIsLoading,
    executeResult,
  };
}
