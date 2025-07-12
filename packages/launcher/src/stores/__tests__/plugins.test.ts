import {
  createMockPlugin,
  MockPluginBuilder,
} from '../../test/mockPluginBuilder';
import { PluginRegistry, usePluginRegistry } from '../plugins';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockUnregisterCommands = vi.fn();
vi.mock('../commands', () => ({
  useCommandRegistry: {
    getState: () => ({
      unregisterPluginCommands: mockUnregisterCommands,
    }),
  },
}));

describe('Plugin Registry - Basic State Management', () => {
  let registry: PluginRegistry;

  beforeEach(() => {
    registry = usePluginRegistry.getState();
    registry.clearPlugins();
  });

  it('should initialize with empty state', () => {
    const state = usePluginRegistry.getState();

    expect(state.plugins.size).toBe(0);
    expect(state.pluginStatus.size).toBe(0);
    expect(state.enabledPlugins.size).toBe(0);
    expect(state.getAllPlugins()).toEqual([]);
  });

  it('should register plugins', () => {
    const plugin1 = createMockPlugin('plugin-1');
    const plugin2 = createMockPlugin('plugin-2');

    registry.registerPlugin(plugin1);
    registry.registerPlugin(plugin2);

    const state = usePluginRegistry.getState();

    expect(state.plugins.size).toBe(2);
    expect(state.enabledPlugins.size).toBe(2);
    expect(state.pluginStatus.size).toBe(2);
    expect(state.getAllPlugins()).toHaveLength(2);
  });

  it('should disable plugin and update enabled set', () => {
    const mockPlugin = createMockPlugin('test-plugin');
    registry.registerPlugin(mockPlugin);
    expect(registry.isPluginEnabled('test-plugin')).toBe(true);

    registry.disablePlugin('test-plugin');
    const state = usePluginRegistry.getState();

    expect(state.plugins.size).toBe(1);
    expect(state.enabledPlugins.has('test-plugin')).toBe(false);
    expect(state.isPluginEnabled('test-plugin')).toBe(false);
  });

  it('should enable disabled plugin', () => {
    const mockPlugin = createMockPlugin('test-plugin');
    registry.registerPlugin(mockPlugin);
    registry.disablePlugin('test-plugin');

    registry.enablePlugin('test-plugin');
    const state = usePluginRegistry.getState();
    expect(state.enabledPlugins.has('test-plugin')).toBe(true);
    expect(state.isPluginEnabled('test-plugin')).toBe(true);
  });

  it('should update plugin status', () => {
    const mockPlugin = createMockPlugin('test-plugin');
    registry.registerPlugin(mockPlugin);

    const errorStatus = { status: 'error' as const, error: 'Test error' };
    registry.setPluginStatus('test-plugin', errorStatus);

    expect(registry.getPluginStatus('test-plugin')).toEqual(errorStatus);
  });

  it('should return undefined for non-existent plugin status', () => {
    expect(registry.getPluginStatus('non-existent')).toBeUndefined();
  });

  it('should set correct plugin status and timestamp on registration', () => {
    const mockPlugin = createMockPlugin('status-test-plugin');
    const beforeTime = new Date();

    registry.registerPlugin(mockPlugin);

    const status = registry.getPluginStatus('status-test-plugin');
    expect(status?.status).toBe('loaded');
    expect(status?.loadedAt).toBeInstanceOf(Date);
    expect(status?.loadedAt!.getTime()).toBeGreaterThanOrEqual(
      beforeTime.getTime(),
    );
  });

  it('should handle duplicate plugin registration by overwriting', () => {
    const plugin1 = createMockPlugin('duplicate-plugin');
    const plugin2 = new MockPluginBuilder()
      .withId('duplicate-plugin')
      .withName('Updated Plugin')
      .build();

    registry.registerPlugin(plugin1);
    registry.registerPlugin(plugin2);

    const state = usePluginRegistry.getState();
    expect(state.plugins.size).toBe(1);
    expect(state.getPlugin('duplicate-plugin')?.manifest.name).toBe(
      'Updated Plugin',
    );
  });

  it('should call onStartup hook during registration', () => {
    const startupMock = vi.fn().mockResolvedValue(undefined);
    const pluginWithStartup = new MockPluginBuilder()
      .withId('startup-test')
      .withStartupHook(startupMock)
      .build();

    registry.registerPlugin(pluginWithStartup);

    expect(startupMock).toHaveBeenCalledOnce();
  });

  it('should handle onStartup hook errors and update status', async () => {
    const startupError = new Error('Startup failed');
    const startupMock = vi.fn().mockRejectedValue(startupError);
    const pluginWithFailingStartup = new MockPluginBuilder()
      .withId('failing-startup')
      .withStartupHook(startupMock)
      .build();

    registry.registerPlugin(pluginWithFailingStartup);

    // Kick the event loop
    await new Promise((resolve) => setImmediate(resolve));

    const status = registry.getPluginStatus('failing-startup');
    expect(status?.status).toBe('error');
    expect(status?.error).toBe('Startup failed');
  });

  it('should get plugin by ID', () => {
    const mockPlugin = createMockPlugin('get-test');
    registry.registerPlugin(mockPlugin);

    expect(registry.getPlugin('get-test')).toBe(mockPlugin);
    expect(registry.getPlugin('non-existent')).toBeUndefined();
  });

  it('should unregister existing plugin', () => {
    const mockPlugin = createMockPlugin('unregister-test');
    registry.registerPlugin(mockPlugin);

    registry.unregisterPlugin('unregister-test');

    const state = usePluginRegistry.getState();
    expect(state.plugins.size).toBe(0);
    expect(state.enabledPlugins.size).toBe(0);
    expect(state.pluginStatus.size).toBe(0);
    expect(state.getPlugin('unregister-test')).toBeUndefined();
  });

  it('should call onUnload hook during unregistration', () => {
    const unloadMock = vi.fn().mockResolvedValue(undefined);
    const pluginWithUnload = new MockPluginBuilder()
      .withId('unload-test')
      .withUnloadHook(unloadMock)
      .build();

    registry.registerPlugin(pluginWithUnload);
    registry.unregisterPlugin('unload-test');

    expect(unloadMock).toHaveBeenCalledOnce();
  });

  it('should handle unregistering non-existent plugin', () => {
    registry.unregisterPlugin('non-existent');

    const state = usePluginRegistry.getState();
    expect(state.plugins.size).toBe(0);
    expect(state.enabledPlugins.size).toBe(0);
    expect(state.pluginStatus.size).toBe(0);
  });

  it('should unregister plugin commands from command registry', async () => {
    const mockPlugin = new MockPluginBuilder()
      .withId('test-plugin')
      .withCommand({ name: 'command-test' })
      .build();
    registry.registerPlugin(mockPlugin);
    registry.unregisterPlugin('command-test');

    expect(mockUnregisterCommands).toHaveBeenCalledWith('command-test');
  });
});
