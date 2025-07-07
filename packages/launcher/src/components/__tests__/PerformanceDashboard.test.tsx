import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { PerformanceDashboard } from '../PerformanceDashboard';
import { isProd } from '../../utils/environment';

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

vi.mock('../../utils/environment', () => ({
  isDev: vi.fn(() => true),
  isProd: vi.fn(() => false),
}));

describe('PerformanceDashboard', () => {
  it('renders FPS', async () => {
    render(<PerformanceDashboard />);
    const dashboard = await screen.findByTestId('performance-dashboard');
    const fps = within(dashboard).getByTestId('fps');
    await expect(fps).toHaveTextContent('FPS60');
  });

  it('renders RAM usage', async () => {
    render(<PerformanceDashboard />);

    const dashboard = await screen.findByTestId('performance-dashboard');
    const ram = within(dashboard).getByTestId('ram');

    expect(ram).toHaveTextContent('RAM32 MB/ 64 MB');
  });

  it('does not render in production', () => {
    vi.mocked(isProd).mockReturnValue(true);

    render(<PerformanceDashboard />);
    const dashboardResult = screen.queryByTestId('performance-dashboard');

    expect(dashboardResult).not.toBeInTheDocument();

    vi.mocked(isProd).mockReturnValue(false);
  });
});
