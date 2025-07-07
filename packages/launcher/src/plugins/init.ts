import { ensurePluginDirectories, getPluginDirectories } from './utils';

export async function initializePluginSystem(): Promise<void> {
  try {
    console.log('Initializing plugin system...');

    const createdPaths = await ensurePluginDirectories();
    console.log('Plugin directories created:', createdPaths);

    const directories = await getPluginDirectories();
    console.log('Plugin directories:', directories);

    console.log('Plugin system initialized successfully');
  } catch (error) {
    console.error('Failed to initialize plugin system:', error);
    throw error;
  }
}
