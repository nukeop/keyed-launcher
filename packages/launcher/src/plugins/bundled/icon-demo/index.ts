import { Plugin, PluginManifest } from '@keyed-launcher/plugin-sdk';
import manifest from './manifest.json';

export const pluginManifest: PluginManifest = manifest as PluginManifest;

export async function onStartup(): Promise<void> {
  console.log('🎨 Icon Demo Plugin loaded!');
}

export async function onUnload(): Promise<void> {
  console.log('🎨 Icon Demo Plugin unloaded!');
}

export const plugin: Plugin = {
  manifest: pluginManifest,
  onStartup,
  onUnload,
};
