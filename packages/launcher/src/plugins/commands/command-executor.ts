import { safePluginExecution } from '../loader';
import {
  NoViewCommand,
  ViewCommand,
  Plugin,
  CommandContext,
} from '@keyed-launcher/plugin-sdk';

const commandModules = import.meta.glob('../bundled/**/commands/*.ts');

export function createCommandExecutor(
  plugin: Plugin,
  commandName: string,
): NoViewCommand | ViewCommand {
  const command = plugin.manifest.commands.find((c) => c.name === commandName);
  if (!command) {
    throw new Error(`Command ${commandName} not found`);
  }

  const getBundledCommandPath = (pluginId: string, handlerPath: string) => {
    const pluginName = pluginId.split('.').pop();
    return `../bundled/${pluginName}/${handlerPath}`;
  };

  if (command.mode === 'no-view') {
    return {
      mode: 'no-view',
      execute: async (context: CommandContext): Promise<void> => {
        await safePluginExecution(plugin.manifest.id, async () => {
          const commandPath = getBundledCommandPath(
            plugin.manifest.id,
            command.handler,
          );

          const moduleLoader = commandModules[commandPath];
          let commandModule;

          if (moduleLoader) {
            commandModule = await moduleLoader();
          } else {
            commandModule = await import(/* @vite-ignore */ commandPath);
          }

          await commandModule.default(context);
        });
      },
    };
  } else {
    return {
      mode: 'view',
      execute: async (context: CommandContext): Promise<React.ReactElement> => {
        const result = await safePluginExecution(
          plugin.manifest.id,
          async () => {
            const commandPath = getBundledCommandPath(
              plugin.manifest.id,
              command.handler,
            );

            const moduleLoader = commandModules[commandPath];
            let commandModule;

            if (moduleLoader) {
              commandModule = await moduleLoader();
            } else {
              commandModule = await import(/* @vite-ignore */ commandPath);
            }

            return await commandModule.default(context);
          },
        );

        if (!result) {
          throw new Error(`Command ${commandName} failed to execute`);
        }

        return result;
      },
    };
  }
}
