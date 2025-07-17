import { PluginAPI } from '@keyed-launcher/plugin-sdk';

export async function shutdownSystem(): Promise<void> {
  try {
    console.log('🔌 Shutting down system...');
    await PluginAPI.shell.execute('sudo', ['shutdown', '-h', 'now']);
  } catch (error) {
    console.error('Failed to shutdown system:', error);
    throw new Error(`Failed to shutdown system: ${error}`);
  }
}

export async function restartSystem(): Promise<void> {
  try {
    console.log('🔄 Restarting system...');
    await PluginAPI.shell.execute('sudo', ['shutdown', '-r', 'now']);
  } catch (error) {
    console.error('Failed to restart system:', error);
    throw new Error(`Failed to restart system: ${error}`);
  }
}

export async function sleepSystem(): Promise<void> {
  try {
    console.log('😴 Putting system to sleep...');
    await PluginAPI.shell.execute('pmset', ['sleepnow']);
  } catch (error) {
    console.error('Failed to sleep system:', error);
    throw new Error(`Failed to sleep system: ${error}`);
  }
}

export async function logoutUser(): Promise<void> {
  try {
    console.log('👋 Logging out user...');
    await PluginAPI.shell.execute('osascript', [
      '-e',
      'tell application "System Events" to log out',
    ]);
  } catch (error) {
    console.error('Failed to logout user:', error);
    throw new Error(`Failed to logout user: ${error}`);
  }
}

export async function lockScreen(): Promise<void> {
  try {
    console.log('🔒 Locking screen...');
    await PluginAPI.shell.execute('open', ['-a', 'ScreenSaverEngine']);
  } catch (error) {
    console.error('Failed to lock screen:', error);
    throw new Error(`Failed to lock screen: ${error}`);
  }
}

export async function onStartup(): Promise<void> {
  console.log('⚙️ macOS System Operations plugin loaded');
}

export async function onUnload(): Promise<void> {
  console.log('⚙️ macOS System Operations plugin unloaded');
}
