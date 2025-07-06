import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { setInvoke } from './test/tauri';
import { PluginRegistry, usePluginRegistry } from './stores/plugins';
import { MockPluginBuilder } from './test/mockPluginBuilder';
import { CommandRegistry, useCommandRegistry } from './stores/commands';
import { registerCommand } from './plugins/commands';

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));

vi.mock('./utils/usePerformanceTracking', () => ({
  usePerformanceTracking: () => ({
    trackStartup: () => ({ end: vi.fn() }),
    trackWindowShow: vi.fn(),
    trackWindowHide: vi.fn(),
    startMonitoring: () => undefined,
  }),
}));

vi.mock('./utils/performance', () => ({
  PerformanceMonitor: {
    getCurrentFPS: vi.fn(() => 60),
    getMemoryStats: vi.fn(() =>
      Promise.resolve({
        used: '32 MB',
        total: '64 MB',
      }),
    ),
  },
}));

vi.mock('./utils/environment', () => ({
  isDev: vi.fn(() => false),
  isProd: vi.fn(() => true),
}));

const commandExecute = vi.fn();
vi.mock('./plugins/commands/command-executor', () => ({
  createCommandExecutor: vi.fn(() => ({
    mode: 'no-view',
    execute: commandExecute,
  })),
}));

window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('App Integration', () => {
  let pluginRegistry: PluginRegistry;
  let commandRegistry: CommandRegistry;

  beforeAll(() => {
    setInvoke('get_memory_usage', () => [32, 64]);
    setInvoke('hide_window', () => undefined);
  });

  beforeEach(() => {
    pluginRegistry = usePluginRegistry.getState();
    pluginRegistry.clearPlugins();
    commandRegistry = useCommandRegistry.getState();
    commandRegistry.clearCommands();
    const mockPlugin = new MockPluginBuilder()
      .withId('test-plugin')
      .withCommand({ name: 'command-test', displayName: 'Test Command' })
      .build();
    pluginRegistry.registerPlugin(mockPlugin);
    registerCommand(mockPlugin, mockPlugin.manifest.commands[0].name);
  });

  it('renders the command palette interface', () => {
    render(<App />);

    expect(screen.getByTestId('command-palette')).toBeInTheDocument();
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByText('Theme Debugger')).toBeInTheDocument();
    expect(screen.getByText('Test Command')).toBeInTheDocument();
  });

  it('filters results when searching', async () => {
    const user = userEvent.setup();
    render(<App />);

    const searchInput = screen.getByTestId('search-input');
    await user.type(searchInput, 'test');

    expect(screen.queryByText('Theme Debugger')).not.toBeInTheDocument();
    expect(screen.queryByText('Test Command')).toBeInTheDocument();
  });

  it('shows all results when search is cleared', async () => {
    const user = userEvent.setup();
    render(<App />);

    const searchInput = screen.getByTestId('search-input');

    await user.type(searchInput, 'calc');
    await user.clear(searchInput);

    expect(screen.getByText('Theme Debugger')).toBeInTheDocument();
    expect(screen.getByText('Test Command')).toBeInTheDocument();
  });

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<App />);

    let selectedItem = await screen.findByTestId(
      'result-item-core-dev.theme-debugger',
    );
    expect(selectedItem).toHaveAttribute('data-selected', 'true');

    await user.keyboard('{ArrowDown}');
    selectedItem = await screen.findByTestId(
      'result-item-test-plugin.command-test',
    );
    expect(selectedItem).toHaveAttribute('data-selected', 'true');
  });

  it('executes result actions', async () => {
    render(<App />);
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{Enter}');
    expect(commandExecute).toHaveBeenCalledWith({
      environment: {
        debug: true,
        platform: 'web',
        theme: 'default',
      },
    });
  });

  it('maintains launcher state integration', () => {
    render(<App />);

    const searchInput = screen.getByTestId('search-input');
    expect(searchInput).toBeInTheDocument();
    expect(screen.getByTestId('command-palette')).toBeInTheDocument();
  });
});
