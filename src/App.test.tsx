import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { setInvoke } from './test/tauri';

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

describe('App Integration', () => {
  beforeAll(() => {
    setInvoke('get_memory_usage', () => [32, 64]);
    setInvoke('hide_window', () => undefined);
  });

  it('renders the command palette interface', () => {
    render(<App />);

    expect(screen.getByTestId('command-palette')).toBeInTheDocument();
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByText('Calculator')).toBeInTheDocument();
    expect(screen.getByText('Terminal')).toBeInTheDocument();
  });

  it('filters results when searching', async () => {
    const user = userEvent.setup();
    render(<App />);

    const searchInput = screen.getByTestId('search-input');
    await user.type(searchInput, 'calc');

    expect(screen.getByText('Calculator')).toBeInTheDocument();
    expect(screen.queryByText('Terminal')).not.toBeInTheDocument();
  });

  it('shows all results when search is cleared', async () => {
    const user = userEvent.setup();
    render(<App />);

    const searchInput = screen.getByTestId('search-input');

    await user.type(searchInput, 'calc');
    await user.clear(searchInput);

    expect(screen.getByText('Calculator')).toBeInTheDocument();
    expect(screen.getByText('Terminal')).toBeInTheDocument();
    expect(screen.getByText('Finder')).toBeInTheDocument();
  });

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<App />);

    let selectedItem = screen.getByTestId(
      'result-item-core-applications.calculator',
    );
    expect(selectedItem).toHaveAttribute('data-selected', 'true');

    await user.keyboard('{ArrowDown}');
    selectedItem = screen.getByTestId('result-item-core-applications.terminal');
    expect(selectedItem).toHaveAttribute('data-selected', 'true');
  });

  it('executes result actions', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    render(<App />);
    await userEvent.keyboard('{Enter}');

    expect(consoleSpy).toHaveBeenCalledWith('Opening Calculator...');

    consoleSpy.mockRestore();
  });

  it('maintains launcher state integration', () => {
    render(<App />);

    const searchInput = screen.getByTestId('search-input');
    expect(searchInput).toBeInTheDocument();
    expect(screen.getByTestId('command-palette')).toBeInTheDocument();
  });
});
