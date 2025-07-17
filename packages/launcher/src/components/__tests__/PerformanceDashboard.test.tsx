import { mockPerformance } from '../../test/performanceHelpers';
import { isProd } from '../../utils/environment';
import { PerformanceDashboard } from '../PerformanceDashboard';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

mockPerformance();

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
