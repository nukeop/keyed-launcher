import manifest from './manifest.json';
import { Plugin, PluginManifest } from '@keyed-launcher/plugin-sdk';

export const pluginManifest: PluginManifest = manifest as PluginManifest;

export const plugin: Plugin = {
  manifest: pluginManifest,
};
