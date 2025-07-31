import { useCommandRegistry } from '../stores/commands';
import { usePluginRegistry } from '../stores/plugins';
import { LauncherEntry } from '@keyed-launcher/plugin-sdk';
import { useMemo, useState } from 'react';

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
        toggleThemeDebugger();
      },
    },
    icon: { type: 'emoji', emoji: '🎨' },
    keywords: ['theme', 'debug', 'colors', 'palette', 'developer'],
  },
];

export function useCommandPaletteResults() {
  const [isLoading, setIsLoading] = useState(false);
  const [_updateTrigger, setUpdateTrigger] = useState(0);
  const registeredCommands = useCommandRegistry(
    (state) => state.registeredCommands,
  );
  const isPluginEnabled = usePluginRegistry((state) => state.isPluginEnabled);
  forceUpdate = () => setUpdateTrigger((prev) => prev + 1);

  const allResults = useMemo(() => {
    const pluginEntries = Array.from(registeredCommands.values())
      .filter(
        (command) => !command.pluginId || isPluginEnabled(command.pluginId),
      )
      .map((command) => command.entry);

    return [...mockResults, ...pluginEntries];
  }, [registeredCommands, isPluginEnabled]);

  return {
    results: allResults,
    isLoading,
    setIsLoading,
  };
}
