import { useCommandRegistry } from '../../stores/commands';
import { useLauncherStore } from '../../stores/launcher';
import { MockCommandBuilder } from '../../test/mockCommandBuilder';
import { MockPluginBuilder } from '../../test/mockPluginBuilder';
import {
  clear,
  withDefaultPlugins,
  withPlugin,
} from '../../test/pluginHelpers';
import { CommandPalette } from '../CommandPalette';
import { ThemeProvider } from '@keyed-launcher/plugin-sdk';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));

vi.mock('../../utils/performance', () => ({
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

window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('CommandPalette Integration', () => {
  const renderCommandPalette = () => {
    return render(
      <MemoryRouter>
        <ThemeProvider>
          <CommandPalette />
        </ThemeProvider>
      </MemoryRouter>,
    );
  };

  beforeEach(() => {
    withDefaultPlugins();
  });

  it('renders search bar and results list', () => {
    renderCommandPalette();

    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('command-palette-list')).toBeInTheDocument();
    expect(screen.getByText('Calculator')).toBeInTheDocument();
    expect(screen.getByText('Terminal')).toBeInTheDocument();
    expect(screen.getByText('Finder')).toBeInTheDocument();
  });

  it('renders category headers', () => {
    renderCommandPalette();

    expect(screen.getByText('Applications')).toBeInTheDocument();
  });

  it('groups results by category', async () => {
    clear();
    const { manifest: manifest1 } = new MockCommandBuilder()
      .withName('test-command')
      .withCategory('Test category')
      .build();
    const { manifest: manifest2 } = new MockCommandBuilder()
      .withName('zozzle')
      .withCategory('Zozzle')
      .build();
    withPlugin(
      new MockPluginBuilder()
        .withCommand(manifest1)
        .withCommand(manifest2)
        .build(),
    );

    renderCommandPalette();

    const headers = await screen.findAllByTestId('category-header');
    const headerTexts = headers.map((header) => header.textContent);

    expect(headers).toHaveLength(3);
    expect(headerTexts).toContain('Developer');
    expect(headerTexts).toContain('Test category');
    expect(headerTexts).toContain('Zozzle');
  });

  it('handles entries without category', () => {
    clear();
    const { manifest } = new MockCommandBuilder()
      .withName('com.keyed.uncategorized')
      .withCategory('')
      .build();
    withPlugin(new MockPluginBuilder().withCommand(manifest).build());

    renderCommandPalette();

    expect(screen.getByText('Other')).toBeInTheDocument();
  });

  it('updates the search input when typing in search bar', async () => {
    renderCommandPalette();

    const searchInput = screen.getByTestId('search-input');
    await userEvent.type(searchInput, 'calc');

    expect(searchInput).toHaveValue('calc');
  });

  it('navigates through results with arrow keys', async () => {
    renderCommandPalette();

    let selectedItem = screen.getByTestId(
      'result-item-core-dev.theme-debugger',
    );
    expect(selectedItem).toHaveAttribute('data-selected', 'true');

    await userEvent.keyboard('{ArrowDown}');
    selectedItem = screen.getByTestId(
      'result-item-com.tools-plugin.calculator',
    );
    expect(selectedItem).toHaveAttribute('data-selected', 'true');

    await userEvent.keyboard('{ArrowDown}');
    selectedItem = screen.getByTestId('result-item-com.tools-plugin.terminal');
    expect(selectedItem).toHaveAttribute('data-selected', 'true');

    await userEvent.keyboard('{ArrowUp}');
    selectedItem = screen.getByTestId(
      'result-item-com.tools-plugin.calculator',
    );
    expect(selectedItem).toHaveAttribute('data-selected', 'true');
  });

  it('executes result with Enter key', async () => {
    clear();
    const { manifest } = new MockCommandBuilder()
      .withName('zozzle')
      .withCategory('Zozzle')
      .withMockExecuteFunction()
      .build();
    withPlugin(new MockPluginBuilder().withCommand(manifest).build());

    const action = useCommandRegistry
      .getState()
      .getCommandsByPlugin('com.test.mock-plugin')[0].entry.execute;

    const spy = vi.spyOn(action, 'execute');

    renderCommandPalette();

    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{Enter}');
    expect(spy).toHaveBeenCalledWith({
      environment: {
        debug: true,
        platform: 'web',
        theme: expect.anything(),
      },
    });
  });

  it('executes result when clicked', async () => {
    clear();
    const { manifest } = new MockCommandBuilder()
      .withName('terminal-command')
      .withCategory('Tools')
      .withMockExecuteFunction()
      .build();
    withPlugin(new MockPluginBuilder().withCommand(manifest).build());

    const action = useCommandRegistry
      .getState()
      .getCommandsByPlugin('com.test.mock-plugin')[0].entry.execute;

    const spy = vi.spyOn(action, 'execute');

    renderCommandPalette();

    const terminalItem = screen.getByText('Mock Command');
    await userEvent.click(terminalItem);

    expect(spy).toHaveBeenCalledWith({
      environment: {
        debug: true,
        platform: 'web',
        theme: expect.anything(),
      },
    });
  });

  // TODO: Reenable when the theme debugger is turned into a plugin
  it.skip('shows empty state when no results and no search query', () => {
    clear();
    renderCommandPalette();

    expect(screen.getByTestId('empty-results')).toBeInTheDocument();
    expect(screen.getByText('Start typing to search...')).toBeInTheDocument();
  });

  it('shows "no results found" when searching with no results', async () => {
    renderCommandPalette();

    const searchInput = screen.getByTestId('search-input');
    await userEvent.type(searchInput, 'zxcvbnm');

    expect(screen.getByTestId('empty-results')).toBeInTheDocument();
    expect(screen.getByText('No results')).toBeInTheDocument();
  });

  it('resets selected index when results change', async () => {
    renderCommandPalette();

    await userEvent.keyboard('{ArrowDown}');
    expect(
      screen.getByTestId('result-item-com.tools-plugin.calculator'),
    ).toHaveAttribute('data-selected', 'true');

    await userEvent.type(screen.getByTestId('search-input'), 'term');

    expect(
      screen.getByTestId('result-item-com.tools-plugin.terminal'),
    ).toHaveAttribute('data-selected', 'true');
  });

  it('handles keyboard navigation at boundaries', async () => {
    const action = useCommandRegistry
      .getState()
      .getCommandsByPlugin('com.tools-plugin')[2].entry.execute;

    const spy = vi.spyOn(action, 'execute');

    renderCommandPalette();

    await userEvent.keyboard('{ArrowUp}');

    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');

    await userEvent.keyboard('{ArrowDown}');

    await userEvent.keyboard('{Enter}');
    expect(spy).toHaveBeenCalled();
  });

  it('clears search on Escape when query is not empty', async () => {
    renderCommandPalette();

    const searchInput = screen.getByTestId('search-input');
    await userEvent.type(searchInput, 'term');
    await userEvent.keyboard('{Escape}');

    expect(searchInput).toHaveValue('');
  });

  it('calls onClose on Escape when query is empty', async () => {
    const store = useLauncherStore.getState();
    const spy = vi.spyOn(store, 'hideWindow');
    renderCommandPalette();
    await userEvent.keyboard('{Escape}');
    expect(spy).toHaveBeenCalled();
  });

  it('handles Page Down navigation', async () => {
    clear();

    // Create 15 mock commands to test pagination
    const mockPlugin = new MockPluginBuilder();
    for (let i = 1; i <= 15; i++) {
      const { manifest } = new MockCommandBuilder()
        .withName(`item${i}`)
        .withCategory('Test')
        .build();
      mockPlugin.withCommand(manifest);
    }
    withPlugin(mockPlugin.build());

    renderCommandPalette();

    // First item should be selected initially
    const firstItem = screen.getAllByTestId(/^result-item-/)[0];
    expect(firstItem).toHaveAttribute('data-selected', 'true');

    // Page Down should move 10 positions down
    await userEvent.keyboard('{PageDown}');

    const eleventhItem = screen.getAllByTestId(/^result-item-/)[10];
    expect(eleventhItem).toHaveAttribute('data-selected', 'true');

    // Page Down again should go to the last item (16)
    await userEvent.keyboard('{PageDown}');

    const lastItem = screen.getAllByTestId(/^result-item-/)[15];
    expect(lastItem).toHaveAttribute('data-selected', 'true');
  });

  it('handles Page Up navigation', async () => {
    clear();

    // Create 15 mock commands to test pagination
    const mockPlugin = new MockPluginBuilder();
    for (let i = 1; i <= 15; i++) {
      const { manifest } = new MockCommandBuilder()
        .withName(`item${i}`)
        .withCategory('Test')
        .build();
      mockPlugin.withCommand(manifest);
    }
    withPlugin(mockPlugin.build());

    renderCommandPalette();

    // Move to the end first
    await userEvent.keyboard('{PageDown}');
    await userEvent.keyboard('{PageDown}');

    const lastItem = screen.getAllByTestId(/^result-item-/)[15];
    expect(lastItem).toHaveAttribute('data-selected', 'true');

    // Page Up should move 10 positions up
    await userEvent.keyboard('{PageUp}');

    const fifthItem = screen.getAllByTestId(/^result-item-/)[5];
    expect(fifthItem).toHaveAttribute('data-selected', 'true');

    // Page Up again should go to the first item
    await userEvent.keyboard('{PageUp}');

    const firstItem = screen.getAllByTestId(/^result-item-/)[0];
    expect(firstItem).toHaveAttribute('data-selected', 'true');
  });

  it('handles Page Up/Down with no results', async () => {
    clear();
    renderCommandPalette();

    // Search for something that won't match to get no results
    const searchInput = screen.getByTestId('search-input');
    await userEvent.type(searchInput, 'nonexistentcommand');

    await userEvent.keyboard('{PageDown}');
    await userEvent.keyboard('{PageUp}');

    expect(screen.getByTestId('empty-results')).toBeInTheDocument();
  });
});
