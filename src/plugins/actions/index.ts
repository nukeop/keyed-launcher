import { writeText } from '@tauri-apps/plugin-clipboard-manager';
import { open } from '@tauri-apps/plugin-shell';

// Basic actions for plugin commands
export class Action {
  // Open URL in default browser
  static OpenInBrowser(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      open(url).then(resolve).catch(reject);
    });
  }

  // Copy text to clipboard
  static CopyToClipboard(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      writeText(text).then(resolve).catch(reject);
    });
  }

  // Close current view and return to command palette
  static Close(): Promise<void> {
    return new Promise((resolve) => {
      // Emit event to close current plugin view
      window.dispatchEvent(new CustomEvent('plugin:close'));
      resolve();
    });
  }
}

// Basic error handling for actions
export class ActionError extends Error {
  constructor(
    message: string,
    public readonly action: string,
  ) {
    super(message);
    this.name = 'ActionError';
  }
}

// Helper for action execution with error handling
export async function executeAction(
  actionFn: () => Promise<void>,
  actionName: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await actionFn();
    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error(`Action failed: ${actionName}`, error);
    return { success: false, error: errorMessage };
  }
}
