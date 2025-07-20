import { invoke } from '@tauri-apps/api/core';

interface OSInfo {
  name: string;
  version: string;
  platform: string;
}

export type Platform = 'macOS' | 'windows' | 'linux' | 'unknown';

let cachedPlatform: Platform | null = null;

export async function getPlatform(): Promise<Platform> {
  if (cachedPlatform) {
    return cachedPlatform;
  }

  try {
    const osInfo = await invoke<OSInfo>('get_os_info');
    cachedPlatform = osInfo.platform as Platform;
    return cachedPlatform;
  } catch (error) {
    console.warn(
      'Failed to get OS info from Tauri, falling back to navigator.platform:',
      error,
    );

    // Fallback to browser detection
    const platform = navigator.platform.toLowerCase();
    if (platform.includes('mac')) {
      cachedPlatform = 'macOS';
    } else if (platform.includes('win')) {
      cachedPlatform = 'windows';
    } else if (platform.includes('linux')) {
      cachedPlatform = 'linux';
    } else {
      cachedPlatform = 'unknown';
    }

    return cachedPlatform;
  }
}
