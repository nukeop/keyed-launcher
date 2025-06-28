import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PerformanceDashboard } from '../PerformanceDashboard';

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

Object.defineProperty(import.meta, 'env', {
  value: { DEV: true },
  writable: true,
});

describe('PerformanceDashboard', () => {
  it('renders minimized by default showing FPS', () => {
    render(<PerformanceDashboard />);
    expect(screen.getByText('60 FPS')).toBeInTheDocument();
  });

  it('expands when clicked to show detailed stats', async () => {
    const user = userEvent.setup();
    render(<PerformanceDashboard />);

    const minimizedView = screen.getByText('60 FPS');
    await user.click(minimizedView);

    expect(screen.getByText('Performance')).toBeInTheDocument();
    expect(screen.getByText('FPS:')).toBeInTheDocument();
    expect(screen.getByText('Memory:')).toBeInTheDocument();
    expect(screen.getByText('Total:')).toBeInTheDocument();
  });

  it('can be minimized after expanding', async () => {
    const user = userEvent.setup();
    render(<PerformanceDashboard />);

    const minimizedView = screen.getByText('60 FPS');
    await user.click(minimizedView);

    const closeButton = screen.getByTitle('Minimize');
    await user.click(closeButton);

    expect(screen.getByText('60 FPS')).toBeInTheDocument();
    expect(screen.queryByText('Performance')).not.toBeInTheDocument();
  });

  it('shows color-coded FPS when expanded', async () => {
    const user = userEvent.setup();
    render(<PerformanceDashboard />);

    const minimizedView = screen.getByText('60 FPS');
    await user.click(minimizedView);

    const fpsValue = screen.getByText('60');
    expect(fpsValue).toHaveClass('text-green-400');
  });

  it('does not render in production', () => {
    Object.defineProperty(import.meta, 'env', {
      value: { DEV: false },
      writable: true,
    });

    const { container } = render(<PerformanceDashboard />);
    expect(container.firstChild).toBeNull();

    Object.defineProperty(import.meta, 'env', {
      value: { DEV: true },
      writable: true,
    });
  });
});
