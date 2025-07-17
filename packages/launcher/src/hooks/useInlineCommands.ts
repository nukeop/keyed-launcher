import { useCommandRegistry } from '../stores/commands';
import { usePluginRegistry } from '../stores/plugins';
import { LauncherEntry } from '@keyed-launcher/plugin-sdk';
import { useEffect, useState } from 'react';

export interface UseInlineCommandsResult {
  activeCommand: LauncherEntry | null;
  isLoading: boolean;
}

export function useInlineCommands(
  searchQuery: string,
): UseInlineCommandsResult {
  const [activeCommand, setActiveCommand] = useState<LauncherEntry | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const registeredCommands = useCommandRegistry(
    (state) => state.registeredCommands,
  );
  const isPluginEnabled = usePluginRegistry((state) => state.isPluginEnabled);

  useEffect(() => {
    const evaluateInlineCommands = async () => {
      if (!searchQuery.trim()) {
        setActiveCommand(null);
        return;
      }

      setIsLoading(true);

      try {
        const inlineCommands = Array.from(registeredCommands.values())
          .filter(
            (command) =>
              command.entry.mode === 'inline' &&
              (!command.pluginId || isPluginEnabled(command.pluginId)),
          )
          .map((command) => command.entry);

        for (const command of inlineCommands) {
          if (command.execute.mode === 'inline') {
            try {
              const shouldActivate =
                await command.execute.shouldActivate(searchQuery);
              if (shouldActivate) {
                setActiveCommand(command);
                return;
              }
            } catch (error) {
              console.error(
                `Error evaluating shouldActivate for command ${command.id}:`,
                error,
              );
            }
          }
        }

        setActiveCommand(null);
      } catch (error) {
        console.error('Error evaluating inline commands:', error);
        setActiveCommand(null);
      } finally {
        setIsLoading(false);
      }
    };

    evaluateInlineCommands();
  }, [searchQuery, registeredCommands, isPluginEnabled]);

  return {
    activeCommand,
    isLoading,
  };
}
