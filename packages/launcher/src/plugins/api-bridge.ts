import { invoke } from '@tauri-apps/api/core';
import {
  writeText as writeTextTauri,
  readText as readTextTauri,
} from '@tauri-apps/plugin-clipboard-manager';
import type { PluginAPIBridge, MacOSApp } from '@keyed-launcher/plugin-sdk';

class LauncherAPIBridge implements PluginAPIBridge {
  system = {
    async getApplications(): Promise<MacOSApp[]> {
      try {
        return await invoke<MacOSApp[]>('get_macos_applications');
      } catch (error) {
        console.error('Failed to get applications:', error);
        throw error;
      }
    },
  };

  clipboard = {
    async readText(): Promise<string> {
      try {
        return await readTextTauri();
      } catch (error) {
        console.error('Failed to read clipboard:', error);
        throw error;
      }
    },

    async writeText(text: string): Promise<void> {
      try {
        await writeTextTauri(text);
      } catch (error) {
        console.error('Failed to write to clipboard:', error);
        throw error;
      }
    },
  };

  environment = {
    getEnvironment() {
      return {
        theme: 'default', // TODO: get from theme system
        platform: navigator.platform,
        debug: process.env.NODE_ENV === 'development',
      };
    },
  };

  notifications = {
    show(message: string, type: 'info' | 'success' | 'error' = 'info'): void {
      // TODO: Implement proper notification system
      console.log(`[${type.toUpperCase()}] ${message}`);
    },
  };

  shell = {
    async execute(program: string, args: string[] = []): Promise<void> {
      try {
        await invoke('plugin:shell|execute', {
          program,
          args,
        });
      } catch (error) {
        console.error(`Failed to execute shell command: ${program}`, error);
        throw error;
      }
    },
  };
}

export function initializeLauncherAPI(): void {
  if (typeof window !== 'undefined') {
    const apiInstance = new LauncherAPIBridge();
    (window as any).__LAUNCHER_API__ = apiInstance;

    console.log('🔗 Launcher API bridge initialized');
  }
}
