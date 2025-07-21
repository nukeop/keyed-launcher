import { invoke } from '@tauri-apps/api/core';

interface OSInfo {
  name: string;
  version: string;
  platform: string;
}

export type Platform = 'macOS' | 'windows' | 'linux' | 'unknown';

let cachedPlatform: Platform | null = null;
let initializationPromise: Promise<Platform> | null = null;

async function fetchPlatform(): Promise<Platform> {
  try {
    const osInfo = await invoke<OSInfo>('get_os_info');
    return osInfo.platform as Platform;
  } catch (error) {
    console.warn(
      'Failed to get OS info from Tauri, falling back to navigator.platform:',
      error,
    );

    // Fallback to browser detection
    const platform = navigator.platform.toLowerCase();
    if (platform.includes('mac')) {
      return 'macOS';
    } else if (platform.includes('win')) {
      return 'windows';
    } else if (platform.includes('linux')) {
      return 'linux';
    } else {
      return 'unknown';
    }
  }
}

export async function initializePlatform(): Promise<Platform> {
  if (!initializationPromise) {
    initializationPromise = fetchPlatform().then((platform) => {
      cachedPlatform = platform;
      return platform;
    });
  }
  return initializationPromise;
}

export function getPlatform(): Platform {
  if (cachedPlatform === null) {
    throw new Error(
      'Platform not initialized. Call initializePlatform() first.',
    );
  }
  return cachedPlatform;
}
