import './global';

export interface PluginAPIBridge {
  system: {
    getApplications(): Promise<
      Array<{
        name: string;
        path: string;
        bundle_id: string;
        icon: string;
      }>
    >;
  };
  clipboard: {
    readText(): Promise<string>;
    writeText(text: string): Promise<void>;
  };
  environment: {
    getEnvironment(): {
      theme: string;
      platform: string;
      debug: boolean;
    };
  };
  notifications: {
    show(message: string, type?: 'info' | 'success' | 'error'): void;
  };
  shell: {
    execute(program: string, args?: string[]): Promise<void>;
  };
}

function getAPIBridge(): PluginAPIBridge {
  if (typeof window === 'undefined' || !window.__LAUNCHER_API__) {
    throw new Error(
      'Launcher API not available - this plugin must run within Keyed Launcher',
    );
  }
  return window.__LAUNCHER_API__ as unknown as PluginAPIBridge;
}

export { getAPIBridge };
