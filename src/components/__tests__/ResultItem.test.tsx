import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResultItem } from '../ResultItem';

describe('ResultItem', () => {
  it('renders title correctly', () => {
    render(<ResultItem title="Test App" />);
    expect(screen.getByText('Test App')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<ResultItem title="Test App" subtitle="Test description" />);
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(<ResultItem title="Test App" icon="🧮" />);
    expect(screen.getByText('🧮')).toBeInTheDocument();
  });

  it('renders shortcut when provided', () => {
    render(<ResultItem title="Test App" shortcut="⌘+T" />);
    expect(screen.getByText('⌘+T')).toBeInTheDocument();
  });

  it('applies selected styling when selected', () => {
    const { container } = render(
      <ResultItem title="Test App" isSelected={true} />,
    );
    const resultItem = container.firstChild as HTMLElement;
    expect(resultItem).toHaveClass(
      'bg-blue-600/30',
      'border-l-2',
      'border-blue-400',
    );
  });

  it('applies hover styling when not selected', () => {
    const { container } = render(
      <ResultItem title="Test App" isSelected={false} />,
    );
    const resultItem = container.firstChild as HTMLElement;
    expect(resultItem).toHaveClass('hover:bg-white/5');
    expect(resultItem).not.toHaveClass('bg-blue-600/30');
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();
    render(<ResultItem title="Test App" onClick={mockOnClick} />);

    const resultItem = screen.getByText('Test App').closest('div');
    await user.click(resultItem!);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('renders all props together correctly', () => {
    render(
      <ResultItem
        title="Calculator"
        subtitle="System calculator"
        icon="🧮"
        shortcut="⌘+C"
        isSelected={true}
      />,
    );

    expect(screen.getByText('Calculator')).toBeInTheDocument();
    expect(screen.getByText('System calculator')).toBeInTheDocument();
    expect(screen.getByText('🧮')).toBeInTheDocument();
    expect(screen.getByText('⌘+C')).toBeInTheDocument();
  });
});
