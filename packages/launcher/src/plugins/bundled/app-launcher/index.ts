import { registerMultipleDynamicEntries } from '../../commands';
import {
  CommandContext,
  LauncherEntry,
  MacOSApp,
  PluginAPI,
} from '@keyed-launcher/plugin-sdk';

const PLUGIN_ID = 'com.keyed-launcher.app-launcher-macos';

export async function onStartup(): Promise<void> {
  try {
    const apps = await discoverApps();
    const entries = createLauncherEntries(apps);

    registerMultipleDynamicEntries(PLUGIN_ID, entries);
  } catch (error) {
    console.error('❌ Failed to initialize app launcher plugin:', error);
    throw error;
  }
}

async function discoverApps(): Promise<MacOSApp[]> {
  try {
    const apps = await PluginAPI.system.getApplications();
    return apps;
  } catch (error) {
    console.error('Failed to get macOS applications from system API:', error);
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
    icon: app.icon ? { type: 'base64', data: app.icon } : undefined,
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
    await PluginAPI.shell.execute('open', [app.path]);
  } catch (error) {
    console.error(`Failed to launch ${app.name}:`, error);
    throw new Error(`Failed to launch ${app.name}: ${error}`);
  }
}

export async function onUnload(): Promise<void> {}
