import type { Platform } from '@keyed-launcher/plugin-sdk';
import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, expect, vi } from 'vitest';

expect.extend(matchers);

vi.mock('@keyed-launcher/plugin-sdk', async () => {
  const actual = await vi.importActual('@keyed-launcher/plugin-sdk');

  let mockPlatform: Platform = 'macOS';

  return {
    ...actual,
    initializePlatform: vi
      .fn()
      .mockImplementation(() => Promise.resolve(mockPlatform)),
    getPlatform: vi.fn().mockImplementation(() => mockPlatform),
    __setMockPlatform: (platform: Platform) => {
      mockPlatform = platform;
    },
  };
});

beforeEach(async () => {
  const { initializePlatform } = await vi.importMock<
    typeof import('@keyed-launcher/plugin-sdk')
  >('@keyed-launcher/plugin-sdk');
  await initializePlatform();
});

afterEach(() => {
  cleanup();
});
