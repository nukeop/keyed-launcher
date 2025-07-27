import { mockPerformance } from '../../test/performanceHelpers';
import { ActionBar, ActionBarProps } from './ActionBar';
import { ActionProvider } from '@keyed-launcher/plugin-sdk';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../../utils/environment', () => ({
  isDev: vi.fn(() => false),
  isProd: vi.fn(() => false), // Set to false so performance dashboard renders
}));

mockPerformance();

describe('ActionBar', () => {
  const renderActionBar = (props?: ActionBarProps) =>
    render(
      <ActionProvider>
        <ActionBar {...props} />
      </ActionProvider>,
    );

  it('renders with default props', async () => {
    renderActionBar();

    const performanceDashboard = await screen.findByTestId(
      'performance-dashboard',
    );
    expect(performanceDashboard).toBeInTheDocument();
  });

  it('renders with icon prop as string', () => {
    renderActionBar({ icon: '⚙️' });

    expect(screen.getByText('⚙️')).toBeInTheDocument();
    expect(screen.getByTestId('performance-dashboard')).toBeInTheDocument();
  });

  it('renders with icon prop as ReactNode', () => {
    const IconComponent = () => (
      <span data-testid="custom-icon">Custom Icon</span>
    );
    renderActionBar({ icon: <IconComponent /> });

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    expect(screen.getByText('Custom Icon')).toBeInTheDocument();
    expect(screen.getByTestId('performance-dashboard')).toBeInTheDocument();
  });

  it('matches snapshot', async () => {
    const { container } = renderActionBar({ icon: '⚙️' });
    await waitFor(() => {
      expect(screen.getByTestId('performance-dashboard')).toBeInTheDocument();
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot without icon', async () => {
    const { container } = renderActionBar();
    await waitFor(() => {
      expect(screen.getByTestId('performance-dashboard')).toBeInTheDocument();
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders performance dashboard with stats', async () => {
    renderActionBar();

    const performanceDashboard = await screen.findByTestId(
      'performance-dashboard',
    );

    expect(performanceDashboard).toHaveTextContent('FPS60RAM32 MB/ 64 MB');
  });
});
