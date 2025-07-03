import { Plugin, PluginManifest } from './types';
import { loadPluginManifest } from './manifest';
import { usePluginRegistry } from '../stores/plugins';
import { getPluginManifestPath, getPluginCommandPath } from './utils';

export interface PluginLoadErrorInfo {
  pluginPath: string;
  error: string;
  type: 'manifest' | 'module' | 'validation' | 'permission';
}

export async function loadPlugin(pluginPath: string): Promise<Plugin> {
  try {
    const manifestPath = getPluginManifestPath(pluginPath);
    const manifest = await loadPluginManifest(manifestPath);

    const plugin: Plugin = {
      manifest,
      onUnload: undefined,
    };

    await validatePluginPermissions(manifest);
    await loadPluginModules(plugin, pluginPath);

    return plugin;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new PluginLoadError(pluginPath, errorMessage, getErrorType(error));
  }
}

export async function loadPluginsFromDirectory(directoryPath: string): Promise<{
  loaded: Plugin[];
  errors: PluginLoadErrorInfo[];
}> {
  const results = {
    loaded: [] as Plugin[],
    errors: [] as PluginLoadErrorInfo[],
  };

  try {
    const pluginDirs = await discoverPluginDirectories(directoryPath);

    for (const pluginDir of pluginDirs) {
      try {
        const plugin = await loadPlugin(pluginDir);
        results.loaded.push(plugin);
      } catch (error) {
        if (error instanceof PluginLoadError) {
          results.errors.push({
            pluginPath: error.pluginPath,
            error: error.message,
            type: getErrorType(error),
          });
        } else {
          results.errors.push({
            pluginPath: pluginDir,
            error: error instanceof Error ? error.message : String(error),
            type: 'validation',
          });
        }
        console.error(`Failed to load plugin from ${pluginDir}:`, error);
      }
    }
  } catch (error) {
    console.error(`Failed to scan directory ${directoryPath}:`, error);
  }

  return results;
}

async function validatePluginPermissions(
  manifest: PluginManifest,
): Promise<void> {
  const permissions = manifest.permissions;

  if (permissions.filesystem === 'write' || permissions.system === 'write') {
    console.warn(
      `Plugin ${manifest.id} requests write permissions - this should be reviewed`,
    );
  }

  if (permissions.shell === 'full') {
    console.warn(
      `Plugin ${manifest.id} requests full shell access - this should be reviewed`,
    );
  }

  if (permissions.network === 'internet') {
    console.warn(
      `Plugin ${manifest.id} requests internet access - this should be reviewed`,
    );
  }
}

async function loadPluginModules(
  plugin: Plugin,
  pluginPath: string,
): Promise<void> {
  const manifest = plugin.manifest;

  for (const command of manifest.commands) {
    try {
      const commandPath = getPluginCommandPath(pluginPath, command.handler);
      const commandModule = await import(/* @vite-ignore */ commandPath);

      if (!commandModule.default) {
        throw new Error(
          `Command ${command.name} does not export a default function`,
        );
      }

      if (typeof commandModule.default !== 'function') {
        throw new Error(
          `Command ${command.name} default export is not a function`,
        );
      }

      if (
        commandModule.onUnload &&
        typeof commandModule.onUnload === 'function'
      ) {
        const existingOnUnload = plugin.onUnload;
        plugin.onUnload = async () => {
          if (existingOnUnload) {
            await existingOnUnload();
          }
          await commandModule.onUnload();
        };
      }
    } catch (error) {
      throw new Error(
        `Failed to load command "${command.name}" from ${command.handler}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }
}

async function discoverPluginDirectories(
  directoryPath: string,
): Promise<string[]> {
  try {
    const response = await fetch(`file://${directoryPath}`);
    if (!response.ok) {
      return [];
    }

    return [];
  } catch {
    return [];
  }
}

function getErrorType(error: unknown): PluginLoadErrorInfo['type'] {
  if (error instanceof Error) {
    if (
      error.message.includes('manifest') ||
      error.message.includes('Invalid plugin manifest')
    ) {
      return 'manifest';
    }
    if (error.message.includes('permission')) {
      return 'permission';
    }
    if (error.message.includes('import') || error.message.includes('module')) {
      return 'module';
    }
  }
  return 'validation';
}

export class PluginLoadError extends Error {
  constructor(
    public readonly pluginPath: string,
    message: string,
    public readonly type: 'manifest' | 'module' | 'validation' | 'permission',
  ) {
    super(message);
    this.name = 'PluginLoadError';
  }
}

export function isolatePluginError(
  pluginId: string,
  operation: () => void,
): void {
  try {
    operation();
  } catch (error) {
    console.error(`Plugin ${pluginId} error:`, error);

    const registry = usePluginRegistry.getState();
    registry.setPluginStatus(pluginId, {
      status: 'error',
      error: error instanceof Error ? error.message : String(error),
    });

    registry.disablePlugin(pluginId);
  }
}

export async function safePluginExecution<T>(
  pluginId: string,
  operation: () => Promise<T>,
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    console.error(`Plugin ${pluginId} execution error:`, error);

    const registry = usePluginRegistry.getState();
    registry.setPluginStatus(pluginId, {
      status: 'error',
      error: error instanceof Error ? error.message : String(error),
    });

    return null;
  }
}
