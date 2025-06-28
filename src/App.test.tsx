import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

vi.mock('./utils/usePerformanceTracking', () => ({
  usePerformanceTracking: () => ({
    trackStartup: () => ({ end: vi.fn() }),
    trackWindowShow: vi.fn(),
    trackWindowHide: vi.fn(),
    startMonitoring: () => undefined,
  }),
}));

describe('App Integration', () => {
  it('renders the command palette interface', () => {
    render(<App />);

    expect(
      screen.getByPlaceholderText('Type to search...'),
    ).toBeInTheDocument();

    expect(screen.getByText('Calculator')).toBeInTheDocument();
    expect(screen.getByText('Terminal')).toBeInTheDocument();
  });

  it('filters results when searching', async () => {
    const user = userEvent.setup();
    render(<App />);

    const searchInput = screen.getByPlaceholderText('Type to search...');
    await user.type(searchInput, 'calc');

    expect(screen.getByText('Calculator')).toBeInTheDocument();
    expect(screen.queryByText('Terminal')).not.toBeInTheDocument();
  });

  it('shows all results when search is cleared', async () => {
    const user = userEvent.setup();
    render(<App />);

    const searchInput = screen.getByPlaceholderText('Type to search...');

    await user.type(searchInput, 'calc');
    await user.clear(searchInput);

    expect(screen.getByText('Calculator')).toBeInTheDocument();
    expect(screen.getByText('Terminal')).toBeInTheDocument();
    expect(screen.getByText('Finder')).toBeInTheDocument();
  });

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    let selectedItems = container.querySelectorAll('.bg-blue-600\\/30');
    expect(selectedItems).toHaveLength(1);

    await user.keyboard('{ArrowDown}');
    selectedItems = container.querySelectorAll('.bg-blue-600\\/30');
    expect(selectedItems).toHaveLength(1);
  });

  it('executes result actions', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    render(<App />);

    expect(consoleSpy).toHaveBeenCalledWith('Executing: Calculator');
    expect(consoleSpy).toHaveBeenCalledWith('Opening Calculator...');

    consoleSpy.mockRestore();
  });

  it('renders performance dashboard', () => {
    render(<App />);

    expect(screen.getByText(/FPS:/)).toBeInTheDocument();
  });

  it('maintains launcher state integration', () => {
    render(<App />);

    const searchInput = screen.getByPlaceholderText('Type to search...');
    expect(searchInput).toBeInTheDocument();
  });
});
