import { invoke } from '@tauri-apps/api/core';

interface MacOSApp {
  name: string;
  path: string;
  bundle_id: string;
  icon: string;
}

export const getApplications = async (): Promise<MacOSApp[]> => {
  try {
    const apps = await invoke<MacOSApp[]>('get_macos_applications');
    return apps;
  } catch (error) {
    console.error('Failed to get macOS applications:', error);
    throw error;
  }
};
