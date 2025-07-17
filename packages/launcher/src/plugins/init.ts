import { ensurePluginDirectories, getPluginDirectories } from './utils';

export async function initializePluginSystem(): Promise<void> {
  try {
    await ensurePluginDirectories();
    await getPluginDirectories();
  } catch (error) {
    console.error('Failed to initialize plugin system:', error);
    throw error;
  }
}
