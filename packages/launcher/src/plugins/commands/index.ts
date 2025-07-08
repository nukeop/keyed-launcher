import { Plugin, LauncherEntry } from '@keyed-launcher/plugin-sdk';
import { usePluginRegistry } from '../../stores/plugins';
import { useCommandRegistry, RegisteredCommand } from '../../stores/commands';
import { createCommandExecutor } from './command-executor';

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
    title: command.displayName,
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
    source: 'plugin',
  };

  const registry = useCommandRegistry.getState();
  registry.registerCommand(registeredCommand);
}

export function unregisterCommand(commandId: string): void {
  const registry = useCommandRegistry.getState();
  registry.unregisterCommand(commandId);
}

export function getRegisteredCommand(
  commandId: string,
): RegisteredCommand | undefined {
  const registry = useCommandRegistry.getState();
  return registry.getRegisteredCommand(commandId);
}

export function getAllRegisteredCommands(): RegisteredCommand[] {
  const registry = useCommandRegistry.getState();
  return registry.getAllRegisteredCommands();
}

export function getCommandsByPlugin(pluginId: string): RegisteredCommand[] {
  const registry = useCommandRegistry.getState();
  return registry.getCommandsByPlugin(pluginId);
}

export function unregisterPluginCommands(pluginId: string): void {
  const registry = useCommandRegistry.getState();
  registry.unregisterPluginCommands(pluginId);
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
  const commandRegistry = useCommandRegistry.getState();
  const pluginRegistry = usePluginRegistry.getState();

  return commandRegistry
    .getAllRegisteredCommands()
    .filter(
      (command) =>
        !command.pluginId || pluginRegistry.isPluginEnabled(command.pluginId),
    )
    .map((command) => command.entry);
}

export function registerDynamicEntry(
  pluginId: string,
  entry: Omit<LauncherEntry, 'pluginId'>,
): void {
  const fullEntry: LauncherEntry = {
    ...entry,
    pluginId,
  };

  const registeredCommand: RegisteredCommand = {
    pluginId,
    commandName: entry.commandName,
    entry: fullEntry,
    source: 'plugin',
  };

  const registry = useCommandRegistry.getState();
  registry.registerCommand(registeredCommand);
}

export function unregisterDynamicEntry(
  pluginId: string,
  commandName: string,
): void {
  const commandId = `${pluginId}.${commandName}`;
  unregisterCommand(commandId);
}

export function registerMultipleDynamicEntries(
  pluginId: string,
  entries: Array<Omit<LauncherEntry, 'pluginId'>>,
): void {
  for (const entry of entries) {
    registerDynamicEntry(pluginId, entry);
  }
}
