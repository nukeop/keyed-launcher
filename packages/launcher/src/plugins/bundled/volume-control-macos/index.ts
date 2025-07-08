import { PluginAPI } from '@keyed-launcher/plugin-sdk';

export async function adjustVolume(change: string): Promise<void> {
  try {
    await PluginAPI.shell.execute('osascript', [
      '-e',
      `set volume output volume (output volume of (get volume settings) ${change})`,
    ]);
  } catch (error) {
    console.error(`Failed to adjust volume by ${change}:`, error);
    throw new Error(`Failed to adjust volume: ${error}`);
  }
}

export async function setVolume(level: number): Promise<void> {
  try {
    await PluginAPI.shell.execute('osascript', [
      '-e',
      `set volume output volume ${level}`,
    ]);
  } catch (error) {
    console.error(`Failed to set volume to ${level}%:`, error);
    throw new Error(`Failed to set volume: ${error}`);
  }
}

export async function toggleMute(): Promise<void> {
  try {
    await PluginAPI.shell.execute('osascript', [
      '-e',
      'set volume output muted not (output muted of (get volume settings))',
    ]);
  } catch (error) {
    console.error('Failed to toggle mute:', error);
    throw new Error(`Failed to toggle mute: ${error}`);
  }
}
