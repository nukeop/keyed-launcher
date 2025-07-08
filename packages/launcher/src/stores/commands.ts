import { create } from 'zustand';
import { LauncherEntry } from '@keyed-launcher/plugin-sdk';

export interface RegisteredCommand {
  pluginId?: string;
  commandName: string;
  entry: LauncherEntry;
  source: 'plugin' | 'builtin' | 'user';
}

export interface CommandRegistryState {
  registeredCommands: Map<string, RegisteredCommand>;
  _commandsVersion?: number; // Performance hack: Internal counter for triggering re-renders. We can keep this map mutable, if we increment this every time we modify it
}

export interface CommandRegistryActions {
  registerCommand: (command: RegisteredCommand) => void;
  unregisterCommand: (commandId: string) => void;
  getRegisteredCommand: (commandId: string) => RegisteredCommand | undefined;
  getAllRegisteredCommands: () => RegisteredCommand[];
  getCommandsBySource: (
    source: RegisteredCommand['source'],
  ) => RegisteredCommand[];
  getCommandsByPlugin: (pluginId: string) => RegisteredCommand[];
  unregisterPluginCommands: (pluginId: string) => void;
  getAllLauncherEntries: () => LauncherEntry[];
  clearCommands: () => void;
}

export type CommandRegistry = CommandRegistryState & CommandRegistryActions;

export const useCommandRegistry = create<CommandRegistry>((set, get) => ({
  registeredCommands: new Map(),

  registerCommand: (command: RegisteredCommand) => {
    const state = get();
    const commandId = command.pluginId
      ? `${command.pluginId}.${command.commandName}`
      : command.commandName;

    state.registeredCommands.set(commandId, command);
    console.log(`Registered command: ${commandId} (${command.source})`);

    // Trigger re-render
    set((prevState) => ({
      ...prevState,
      _commandsVersion: (prevState._commandsVersion || 0) + 1,
    }));
  },

  unregisterCommand: (commandId: string) => {
    const state = get();
    if (state.registeredCommands.has(commandId)) {
      state.registeredCommands.delete(commandId);
      console.log(`Unregistered command: ${commandId}`);

      // Trigger re-render
      set((prevState) => ({
        ...prevState,
        _commandsVersion: (prevState._commandsVersion || 0) + 1,
      }));
    }
  },

  getRegisteredCommand: (commandId: string) => {
    return get().registeredCommands.get(commandId);
  },

  getAllRegisteredCommands: () => {
    return Array.from(get().registeredCommands.values());
  },

  getCommandsBySource: (source: RegisteredCommand['source']) => {
    return Array.from(get().registeredCommands.values()).filter(
      (cmd) => cmd.source === source,
    );
  },

  getCommandsByPlugin: (pluginId: string) => {
    return Array.from(get().registeredCommands.values()).filter(
      (cmd) => cmd.pluginId === pluginId,
    );
  },

  unregisterPluginCommands: (pluginId: string) => {
    const state = get();
    const commandsToRemove: string[] = [];

    for (const [commandId, command] of state.registeredCommands.entries()) {
      if (command.pluginId === pluginId) {
        commandsToRemove.push(commandId);
      }
    }

    for (const commandId of commandsToRemove) {
      state.registeredCommands.delete(commandId);
      console.log(`Unregistered command: ${commandId}`);
    }

    if (commandsToRemove.length > 0) {
      // Trigger re-render
      set((prevState) => ({
        ...prevState,
        _commandsVersion: (prevState._commandsVersion || 0) + 1,
      }));
    }
  },

  getAllLauncherEntries: () => {
    return Array.from(get().registeredCommands.values()).map(
      (command) => command.entry,
    );
  },

  clearCommands: () => {
    set({
      registeredCommands: new Map(),
      _commandsVersion: 0,
    });
  },
}));
