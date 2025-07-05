import { invoke } from '@tauri-apps/api/core';

export interface PluginDirectories {
  bundled: string;
  user: string;
  development: string;
}

export async function ensurePluginDirectories(): Promise<string[]> {
  try {
    return await invoke<string[]>('ensure_plugin_directories');
  } catch (error) {
    console.error('Failed to ensure plugin directories:', error);
    throw error;
  }
}

export async function getPluginDirectories(): Promise<PluginDirectories> {
  try {
    const paths = await invoke<string[]>('get_plugin_directories');

    if (paths.length !== 3) {
      throw new Error('Expected 3 plugin directory paths');
    }

    return {
      bundled: paths[0],
      user: paths[1],
      development: paths[2],
    };
  } catch (error) {
    console.error('Failed to get plugin directories:', error);
    throw error;
  }
}

export function getPluginPath(
  pluginId: string,
  directory: 'bundled' | 'user' | 'development',
): string {
  return `${directory}/${pluginId}`;
}

export function getPluginManifestPath(pluginPath: string): string {
  return `${pluginPath}/manifest.json`;
}

export function getPluginCommandPath(
  pluginPath: string,
  commandHandler: string,
): string {
  return `${pluginPath}/${commandHandler}`;
}
