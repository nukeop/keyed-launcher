import { safePluginExecution } from '../loader';
import {
  CommandContext,
  InlineCommand,
  NoViewCommand,
  Plugin,
  ViewCommand,
} from '@keyed-launcher/plugin-sdk';

const commandModules = import.meta.glob('../bundled/**/commands/*.{ts,tsx}');

async function loadCommandModule(pluginId: string, handlerPath: string) {
  const getBundledCommandPath = (pluginId: string, handlerPath: string) => {
    const pluginName = pluginId.split('.').pop();
    return `../bundled/${pluginName}/${handlerPath}`;
  };

  const commandPath = getBundledCommandPath(pluginId, handlerPath);
  const moduleLoader = commandModules[commandPath];

  if (moduleLoader) {
    return await moduleLoader();
  } else {
    return await import(/* @vite-ignore */ commandPath);
  }
}

export function createCommandExecutor(
  plugin: Plugin,
  commandName: string,
): NoViewCommand | ViewCommand | InlineCommand {
  const command = plugin.manifest.commands.find((c) => c.name === commandName);
  if (!command) {
    throw new Error(`Command ${commandName} not found`);
  }

  if (command.mode === 'no-view') {
    return {
      mode: 'no-view',
      execute: async (context: CommandContext): Promise<void> => {
        await safePluginExecution(plugin.manifest.id, async () => {
          const commandModule = await loadCommandModule(
            plugin.manifest.id,
            command.handler,
          );
          await commandModule.default(context);
        });
      },
    };
  } else if (command.mode === 'view') {
    return {
      mode: 'view',
      execute: async () => {
        const commandModule = await loadCommandModule(
          plugin.manifest.id,
          command.handler,
        );
        return commandModule.default;
      },
    };
  } else if (command.mode === 'inline') {
    return {
      mode: 'inline',
      shouldActivate: async (input: string): Promise<boolean> => {
        return (
          (await safePluginExecution(plugin.manifest.id, async () => {
            const commandModule = await loadCommandModule(
              plugin.manifest.id,
              command.handler,
            );

            if (
              !commandModule.shouldActivate ||
              typeof commandModule.shouldActivate !== 'function'
            ) {
              throw new Error(
                `Inline command ${commandName} must export a shouldActivate function`,
              );
            }

            return await commandModule.shouldActivate(input);
          })) ?? false
        );
      },
      execute: async (context: CommandContext): Promise<React.ReactElement> => {
        const result = await safePluginExecution(
          plugin.manifest.id,
          async () => {
            const commandModule = await loadCommandModule(
              plugin.manifest.id,
              command.handler,
            );

            if (!commandModule.default) {
              throw new Error(
                `Inline command ${commandName} must export a default React component`,
              );
            }

            return commandModule.default;
          },
        );

        if (!result) {
          throw new Error(`Failed to load inline command ${commandName}`);
        }

        return result;
      },
    };
  } else {
    throw new Error(`Unsupported command mode: ${command.mode}`);
  }
}
