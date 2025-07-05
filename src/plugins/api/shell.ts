import { invoke } from '@tauri-apps/api/core';

export const execute = async (
  program: string,
  args: string[] = [],
): Promise<void> => {
  try {
    await invoke('plugin:shell|execute', {
      program,
      args,
    });
  } catch (error) {
    console.error(`Failed to execute shell command: ${program}`, error);
    throw error;
  }
};
