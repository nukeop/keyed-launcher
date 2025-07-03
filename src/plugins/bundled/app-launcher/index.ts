import { registerMultipleDynamicEntries } from '../../commands';
import { LauncherEntry, CommandContext } from '../../types';
import { invoke } from '@tauri-apps/api/core';
import { readDir, exists } from '@tauri-apps/plugin-fs';
import { homeDir } from '@tauri-apps/api/path';

interface MacOSApp {
  name: string;
  path: string;
  bundleId?: string;
}

const PLUGIN_ID = 'com.keyed-launcher.app-launcher-macos';

export async function onStartup(): Promise<void> {
  console.log('🍎 Starting macOS App Launcher plugin...');

  try {
    const apps = await discoverApps();
    const entries = createLauncherEntries(apps);

    registerMultipleDynamicEntries(PLUGIN_ID, entries);

    console.log(`✅ Registered ${entries.length} applications`);
  } catch (error) {
    console.error('❌ Failed to initialize app launcher plugin:', error);
    throw error;
  }
}

async function discoverApps(): Promise<MacOSApp[]> {
  const apps: MacOSApp[] = [];

  // Scan system Applications directory
  try {
    const systemApps = await scanApplicationsDirectory('/Applications');
    apps.push(...systemApps);
  } catch (error) {
    console.warn('Failed to scan /Applications:', error);
  }

  // Scan user Applications directory
  try {
    const homePath = await homeDir();
    const userAppsPath = `${homePath}Applications`;

    if (await exists(userAppsPath)) {
      const userApps = await scanApplicationsDirectory(userAppsPath);
      apps.push(...userApps);
    }
  } catch (error) {
    console.warn('Failed to scan ~/Applications:', error);
  }

  // Remove duplicates based on bundle ID or name
  const uniqueApps = apps.filter(
    (app, index, self) =>
      index ===
      self.findIndex(
        (a) =>
          (a.bundleId && app.bundleId && a.bundleId === app.bundleId) ||
          (!a.bundleId && !app.bundleId && a.name === app.name),
      ),
  );

  return uniqueApps.sort((a, b) => a.name.localeCompare(b.name));
}

async function scanApplicationsDirectory(
  directoryPath: string,
): Promise<MacOSApp[]> {
  const apps: MacOSApp[] = [];

  try {
    const entries = await readDir(directoryPath);

    for (const entry of entries) {
      if (entry.name && entry.name.endsWith('.app')) {
        try {
          const app = await parseAppBundle(entry.path);
          if (app) {
            apps.push(app);
          }
        } catch (error) {
          console.warn(`Failed to parse app bundle ${entry.name}:`, error);
        }
      }
    }
  } catch (error) {
    console.error(`Failed to read directory ${directoryPath}:`, error);
    throw error;
  }

  return apps;
}

async function parseAppBundle(appPath: string): Promise<MacOSApp | null> {
  try {
    // Try to read Info.plist to get proper app name and bundle ID
    const infoPlistPath = `${appPath}/Contents/Info.plist`;

    let appName =
      appPath.split('/').pop()?.replace('.app', '') || 'Unknown App';
    let bundleId: string | undefined;

    try {
      if (await exists(infoPlistPath)) {
        // For now, just use the folder name since parsing plist requires additional setup
        // TODO: Implement proper plist parsing or use Tauri command for this
        appName =
          appPath.split('/').pop()?.replace('.app', '') || 'Unknown App';
      }
    } catch (error) {
      // If we can't read Info.plist, just use the folder name
      console.debug(`Could not read Info.plist for ${appPath}:`, error);
    }

    // Skip system files and hidden apps
    if (appName.startsWith('.') || appName === 'Unknown App') {
      return null;
    }

    return {
      name: appName,
      path: appPath,
      bundleId,
    };
  } catch (error) {
    console.warn(`Failed to parse app bundle ${appPath}:`, error);
    return null;
  }
}

function createLauncherEntries(
  apps: MacOSApp[],
): Array<Omit<LauncherEntry, 'pluginId'>> {
  return apps.map((app) => ({
    id: `app.${app.bundleId || app.name.toLowerCase().replace(/\s+/g, '-')}`,
    commandName: `launch-${app.bundleId || app.name.toLowerCase().replace(/\s+/g, '-')}`,
    title: app.name,
    subtitle: 'Application',
    description: `Launch ${app.name}`,
    mode: 'no-view' as const,
    category: 'Applications',
    keywords: [
      app.name.toLowerCase(),
      ...app.name.toLowerCase().split(' '),
      'app',
      'application',
      'launch',
    ],
    execute: {
      mode: 'no-view' as const,
      execute: async (context: CommandContext): Promise<void> => {
        await launchApp(app);
      },
    },
  }));
}

async function launchApp(app: MacOSApp): Promise<void> {
  try {
    console.log(`🚀 Launching ${app.name} at ${app.path}`);

    await invoke('plugin:shell|execute', {
      program: 'open',
      args: [app.path],
    });
  } catch (error) {
    console.error(`Failed to launch ${app.name}:`, error);
    throw new Error(`Failed to launch ${app.name}: ${error}`);
  }
}

export async function onUnload(): Promise<void> {
  console.log('🍎 Unloading macOS App Launcher plugin...');
}
