import { create } from 'zustand';
import { Plugin } from '@keyed-launcher/plugin-sdk';
import { useCommandRegistry } from './commands';
import { registerPluginCommands } from '../plugins/commands';

export interface PluginLoadingStatus {
  status: 'loading' | 'loaded' | 'error' | 'disabled';
  error?: string;
  loadedAt?: Date;
}

export interface PluginRegistryState {
  plugins: Map<string, Plugin>;
  pluginStatus: Map<string, PluginLoadingStatus>;
  enabledPlugins: Set<string>;
}

export interface PluginRegistryActions {
  registerPlugin: (plugin: Plugin) => void;
  unregisterPlugin: (pluginId: string) => void;
  getPlugin: (pluginId: string) => Plugin | undefined;
  getAllPlugins: () => Plugin[];
  isPluginEnabled: (pluginId: string) => boolean;
  enablePlugin: (pluginId: string) => void;
  disablePlugin: (pluginId: string) => void;
  setPluginStatus: (pluginId: string, status: PluginLoadingStatus) => void;
  getPluginStatus: (pluginId: string) => PluginLoadingStatus | undefined;
  clearPlugins: () => void;
}

export type PluginRegistry = PluginRegistryState & PluginRegistryActions;

export const usePluginRegistry = create<PluginRegistry>((set, get) => ({
  plugins: new Map(),
  pluginStatus: new Map(),
  enabledPlugins: new Set(),

  registerPlugin: (plugin: Plugin) => {
    set((state) => {
      const newPlugins = new Map(state.plugins);
      const newEnabledPlugins = new Set(state.enabledPlugins);
      const newStatus = new Map(state.pluginStatus);

      newPlugins.set(plugin.manifest.id, plugin);
      newEnabledPlugins.add(plugin.manifest.id);
      newStatus.set(plugin.manifest.id, {
        status: 'loaded',
        loadedAt: new Date(),
      });

      return {
        plugins: newPlugins,
        enabledPlugins: newEnabledPlugins,
        pluginStatus: newStatus,
      };
    });

    registerPluginCommands(plugin);

    if (plugin.onStartup) {
      plugin.onStartup().catch((error) => {
        console.error(
          `Error in plugin ${plugin.manifest.id} startup hook:`,
          error,
        );
        get().setPluginStatus(plugin.manifest.id, {
          status: 'error',
          error: error instanceof Error ? error.message : String(error),
        });
      });
    }
  },

  unregisterPlugin: (pluginId: string) => {
    set((state) => {
      const newPlugins = new Map(state.plugins);
      const newEnabledPlugins = new Set(state.enabledPlugins);
      const newStatus = new Map(state.pluginStatus);

      const plugin = newPlugins.get(pluginId);
      if (plugin && plugin.onUnload) {
        plugin.onUnload().catch((error) => {
          console.error(`Error unloading plugin ${pluginId}:`, error);
        });
      }

      newPlugins.delete(pluginId);
      newEnabledPlugins.delete(pluginId);
      newStatus.delete(pluginId);

      return {
        plugins: newPlugins,
        enabledPlugins: newEnabledPlugins,
        pluginStatus: newStatus,
      };
    });

    const commandRegistry = useCommandRegistry.getState();
    commandRegistry.unregisterPluginCommands(pluginId);
  },

  getPlugin: (pluginId: string) => {
    return get().plugins.get(pluginId);
  },

  getAllPlugins: () => {
    return Array.from(get().plugins.values());
  },

  isPluginEnabled: (pluginId: string) => {
    return get().enabledPlugins.has(pluginId);
  },

  enablePlugin: (pluginId: string) => {
    set((state) => {
      const newEnabledPlugins = new Set(state.enabledPlugins);
      newEnabledPlugins.add(pluginId);
      return { enabledPlugins: newEnabledPlugins };
    });
  },

  disablePlugin: (pluginId: string) => {
    set((state) => {
      const newEnabledPlugins = new Set(state.enabledPlugins);
      newEnabledPlugins.delete(pluginId);
      return { enabledPlugins: newEnabledPlugins };
    });
  },

  setPluginStatus: (pluginId: string, status: PluginLoadingStatus) => {
    set((state) => {
      const newStatus = new Map(state.pluginStatus);
      newStatus.set(pluginId, status);
      return { pluginStatus: newStatus };
    });
  },

  getPluginStatus: (pluginId: string) => {
    return get().pluginStatus.get(pluginId);
  },

  clearPlugins: () => {
    const plugins = get().plugins;
    plugins.forEach(async (plugin, pluginId) => {
      if (plugin.onUnload) {
        try {
          await plugin.onUnload();
        } catch (error) {
          console.error(`Error unloading plugin ${pluginId}:`, error);
        }
      }
    });

    set({
      plugins: new Map(),
      pluginStatus: new Map(),
      enabledPlugins: new Set(),
    });
  },
}));
