import { Plugin, PluginManifest } from '@keyed-launcher/plugin-sdk';
import { loadPluginManifest } from './manifest';

interface PluginModule {
  onStartup?: () => Promise<void>;
  onUnload?: () => Promise<void>;
}

interface ManifestModule {
  default: PluginManifest;
}

export async function loadBundledPlugins(): Promise<{
  loaded: Plugin[];
  errors: Array<{ pluginId: string; error: string }>;
}> {
  const results = {
    loaded: [] as Plugin[],
    errors: [] as Array<{ pluginId: string; error: string }>,
  };

  const manifestModules = import.meta.glob<ManifestModule>(
    './bundled/*/manifest.json',
  );
  const pluginModules = import.meta.glob<PluginModule>('./bundled/*/index.ts');

  for (const manifestPath in manifestModules) {
    try {
      const pluginMatch = manifestPath.match(
        /\.\/bundled\/([^\/]+)\/manifest\.json$/,
      );
      if (!pluginMatch) continue;

      const pluginId = pluginMatch[1];
      const pluginModulePath = `./bundled/${pluginId}/index.ts`;

      if (!pluginModules[pluginModulePath]) {
        results.errors.push({
          pluginId,
          error: `No index.ts found for plugin ${pluginId}`,
        });
        continue;
      }

      const manifestModule = await manifestModules[manifestPath]();
      const manifest = manifestModule.default;

      await loadPluginManifest(manifestPath);

      const pluginModule = await pluginModules[pluginModulePath]();

      const plugin: Plugin = {
        manifest,
        onStartup: pluginModule.onStartup,
        onUnload: pluginModule.onUnload,
      };

      results.loaded.push(plugin);
    } catch (error) {
      const pluginId =
        manifestPath.match(/\.\/bundled\/([^\/]+)\//)?.[1] || 'unknown';
      results.errors.push({
        pluginId,
        error: error instanceof Error ? error.message : String(error),
      });
      console.error(`❌ Failed to load bundled plugin ${pluginId}:`, error);
      console.error(results.errors);
    }
  }

  return results;
}
