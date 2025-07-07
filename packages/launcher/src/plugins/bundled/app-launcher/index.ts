import { registerMultipleDynamicEntries } from '../../commands';
import { LauncherEntry, CommandContext } from '../../types';
import { invoke } from '@tauri-apps/api/core';

interface MacOSApp {
  name: string;
  path: string;
  bundle_id: string;
  icon: string;
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
  try {
    const apps = await invoke<MacOSApp[]>('get_macos_applications');
    return apps;
  } catch (error) {
    console.error('Failed to get macOS applications from Rust backend:', error);
    throw error;
  }
}

function createLauncherEntries(
  apps: MacOSApp[],
): Array<Omit<LauncherEntry, 'pluginId'>> {
  return apps.map((app) => ({
    id: `app.${app.bundle_id || app.name.toLowerCase().replace(/\s+/g, '-')}`,
    commandName: `launch-${app.bundle_id || app.name.toLowerCase().replace(/\s+/g, '-')}`,
    title: app.name,
    subtitle: 'Application',
    description: `Launch ${app.name}`,
    mode: 'no-view' as const,
    category: 'Applications',
    icon: app.icon || undefined,
    keywords: [
      app.name.toLowerCase(),
      ...app.name.toLowerCase().split(' '),
      'app',
      'application',
      'launch',
    ],
    execute: {
      mode: 'no-view' as const,
      execute: async (_context: CommandContext): Promise<void> => {
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
