import { safePluginExecution } from '../loader';
import { NoViewCommand, ViewCommand, Plugin, CommandContext } from '../types';

export function createCommandExecutor(
  plugin: Plugin,
  commandName: string,
): NoViewCommand | ViewCommand {
  const command = plugin.manifest.commands.find((c) => c.name === commandName);
  if (!command) {
    throw new Error(`Command ${commandName} not found`);
  }

  if (command.mode === 'no-view') {
    return {
      mode: 'no-view',
      execute: async (context: CommandContext): Promise<void> => {
        await safePluginExecution(plugin.manifest.id, async () => {
          const commandModule = await import(
            /* @vite-ignore */ `${plugin.manifest.id}/${command.handler}`
          );
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
            const commandModule = await import(
              /* @vite-ignore */ `${plugin.manifest.id}/${command.handler}`
            );
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
