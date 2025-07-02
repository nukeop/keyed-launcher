import {
  Plugin,
  LauncherEntry,
  CommandContext,
  NoViewCommand,
  ViewCommand,
} from './types';
import { usePluginRegistry } from '../stores/plugins';
import { safePluginExecution } from './loader';

export interface RegisteredCommand {
  pluginId: string;
  commandName: string;
  entry: LauncherEntry;
  execute: NoViewCommand | ViewCommand;
}

const registeredCommands = new Map<string, RegisteredCommand>();

export function registerCommand(plugin: Plugin, commandName: string): void {
  const command = plugin.manifest.commands.find((c) => c.name === commandName);
  if (!command) {
    throw new Error(
      `Command ${commandName} not found in plugin ${plugin.manifest.id}`,
    );
  }

  const commandId = `${plugin.manifest.id}.${commandName}`;

  const entry: LauncherEntry = {
    id: commandId,
    commandName: command.name,
    title: command.title,
    subtitle: command.subtitle,
    description: command.description,
    mode: command.mode,
    category: command.category,
    pluginId: plugin.manifest.id,
    execute: createCommandExecutor(plugin, command.name),
  };

  const registeredCommand: RegisteredCommand = {
    pluginId: plugin.manifest.id,
    commandName: command.name,
    entry,
    execute: entry.execute,
  };

  registeredCommands.set(commandId, registeredCommand);
  console.log(`Registered command: ${commandId}`);
}

export function unregisterCommand(commandId: string): void {
  if (registeredCommands.has(commandId)) {
    registeredCommands.delete(commandId);
    console.log(`Unregistered command: ${commandId}`);
  }
}

export function getRegisteredCommand(
  commandId: string,
): RegisteredCommand | undefined {
  return registeredCommands.get(commandId);
}

export function getAllRegisteredCommands(): RegisteredCommand[] {
  return Array.from(registeredCommands.values());
}

export function getCommandsByPlugin(pluginId: string): RegisteredCommand[] {
  return Array.from(registeredCommands.values()).filter(
    (cmd) => cmd.pluginId === pluginId,
  );
}

export function unregisterPluginCommands(pluginId: string): void {
  const commandsToRemove: string[] = [];

  for (const [commandId, command] of registeredCommands.entries()) {
    if (command.pluginId === pluginId) {
      commandsToRemove.push(commandId);
    }
  }

  for (const commandId of commandsToRemove) {
    unregisterCommand(commandId);
  }
}

export function registerPluginCommands(plugin: Plugin): void {
  for (const command of plugin.manifest.commands) {
    try {
      registerCommand(plugin, command.name);
    } catch (error) {
      console.error(
        `Failed to register command ${command.name} from plugin ${plugin.manifest.id}:`,
        error,
      );
    }
  }
}

export function commandToLauncherEntry(
  command: RegisteredCommand,
): LauncherEntry {
  return command.entry;
}

export function getAllLauncherEntries(): LauncherEntry[] {
  const registry = usePluginRegistry.getState();

  return Array.from(registeredCommands.values())
    .filter((command) => registry.isPluginEnabled(command.pluginId))
    .map((command) => command.entry);
}

function createCommandExecutor(
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
            `${plugin.manifest.id}/${command.handler}`
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
              `${plugin.manifest.id}/${command.handler}`
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
