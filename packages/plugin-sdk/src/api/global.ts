export {};

declare global {
  interface Window {
    __LAUNCHER_API__?: {
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
    };
  }
}
