import { LauncherEntry } from '../components/ResultsList';
import { useCommandRegistry } from '../stores/commands';
import { usePluginRegistry } from '../stores/plugins';
import { CommandContext, useTheme } from '@keyed-launcher/plugin-sdk';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    icon: { type: 'emoji', emoji: '🎨' },
    shortcut: '⌘+⇧+T',
    keywords: ['theme', 'debug', 'colors', 'palette', 'developer'],
  },
];

export function useCommandPaletteResults(searchQuery: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [_updateTrigger, setUpdateTrigger] = useState(0);
  const registeredCommands = useCommandRegistry(
    (state) => state.registeredCommands,
  );
  const commandsVersion = useCommandRegistry((state) => state._commandsVersion);
  const isPluginEnabled = usePluginRegistry((state) => state.isPluginEnabled);
  const theme = useTheme();
  const navigate = useNavigate();

  forceUpdate = () => setUpdateTrigger((prev) => prev + 1);

  const allResults = useMemo(() => {
    const pluginEntries = Array.from(registeredCommands.values())
      .filter(
        (command) => !command.pluginId || isPluginEnabled(command.pluginId),
      )
      .map((command) => command.entry);

    return [...mockResults, ...pluginEntries];
  }, [registeredCommands, commandsVersion, isPluginEnabled]);

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
      const context: CommandContext = {
        environment: {
          theme,
          platform: 'web',
          debug: true,
        },
      };

      if (result.execute.mode === 'no-view') {
        result.execute.execute(context).catch((error) => {
          console.error(`Error executing command ${result.id}:`, error);
        });
      } else {
        navigate(`/plugin/${result.pluginId}/${result.commandName}`);
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
