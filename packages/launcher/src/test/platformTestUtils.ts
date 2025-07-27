import type { Platform } from '@keyed-launcher/plugin-sdk';

declare module '@keyed-launcher/plugin-sdk' {
  function __setMockPlatform(platform: Platform): void;
}

export async function setPlatformForTest(platform: Platform): Promise<void> {
  const pluginSdk = await import('@keyed-launcher/plugin-sdk');
  (pluginSdk as any).__setMockPlatform(platform);
}
