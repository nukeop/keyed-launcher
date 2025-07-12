import { ActionBar } from '../ActionBar';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../../utils/environment', () => ({
  isDev: vi.fn(() => false),
  isProd: vi.fn(() => false), // Set to false so performance dashboard renders
}));

vi.mock('../../utils/performance', () => ({
  PerformanceMonitor: {
    getCurrentFPS: vi.fn(() => 60),
    getMemoryStats: vi.fn(() =>
      Promise.resolve({
        used: '128 MB',
        total: '8 GB',
      }),
    ),
  },
}));

describe('ActionBar', () => {
  it('renders with default props', () => {
    render(<ActionBar />);

    expect(screen.getByTestId('performance-dashboard')).toBeInTheDocument();
  });

  it('renders with icon prop as string', () => {
    render(<ActionBar icon="⚙️" />);

    expect(screen.getByText('⚙️')).toBeInTheDocument();
    expect(screen.getByTestId('performance-dashboard')).toBeInTheDocument();
  });

  it('renders with icon prop as ReactNode', () => {
    const IconComponent = () => (
      <span data-testid="custom-icon">Custom Icon</span>
    );
    render(<ActionBar icon={<IconComponent />} />);

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    expect(screen.getByText('Custom Icon')).toBeInTheDocument();
    expect(screen.getByTestId('performance-dashboard')).toBeInTheDocument();
  });

  it('matches snapshot', async () => {
    const { container } = render(<ActionBar icon="⚙️" />);
    await waitFor(() => {
      expect(screen.getByTestId('performance-dashboard')).toBeInTheDocument();
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot without icon', async () => {
    const { container } = render(<ActionBar />);
    await waitFor(() => {
      expect(screen.getByTestId('performance-dashboard')).toBeInTheDocument();
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders performance dashboard with stats', async () => {
    render(<ActionBar icon="⚙️" />);

    const performanceDashboard = await screen.findByTestId(
      'performance-dashboard',
    );

    expect(performanceDashboard).toHaveTextContent('FPS60RAM128 MB/ 8 GB');
  });
});
