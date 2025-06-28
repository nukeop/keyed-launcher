import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResultsList, Result } from '../ResultsList';

const mockResults: Result[] = [
  {
    id: '1',
    title: 'Calculator',
    subtitle: 'System calculator',
    icon: '🧮',
    action: vi.fn(),
    shortcut: '⌘+C',
  },
  {
    id: '2',
    title: 'Terminal',
    subtitle: 'Command line interface',
    icon: '💻',
    action: vi.fn(),
  },
];

describe('ResultsList', () => {
  it('renders empty state when no results', () => {
    const mockOnItemClick = vi.fn();
    render(
      <ResultsList
        results={[]}
        selectedIndex={0}
        onItemClick={mockOnItemClick}
      />,
    );

    expect(screen.getByText('No results found')).toBeInTheDocument();
    expect(screen.getByText('🔍')).toBeInTheDocument();
  });

  it('renders custom empty message', () => {
    const mockOnItemClick = vi.fn();
    render(
      <ResultsList
        results={[]}
        selectedIndex={0}
        onItemClick={mockOnItemClick}
        emptyMessage="Start typing to search..."
      />,
    );

    expect(screen.getByText('Start typing to search...')).toBeInTheDocument();
  });

  it('renders all results', () => {
    const mockOnItemClick = vi.fn();
    render(
      <ResultsList
        results={mockResults}
        selectedIndex={0}
        onItemClick={mockOnItemClick}
      />,
    );

    expect(screen.getByText('Calculator')).toBeInTheDocument();
    expect(screen.getByText('Terminal')).toBeInTheDocument();
    expect(screen.getByText('System calculator')).toBeInTheDocument();
    expect(screen.getByText('Command line interface')).toBeInTheDocument();
  });

  it('highlights selected item', () => {
    const mockOnItemClick = vi.fn();
    const { container } = render(
      <ResultsList
        results={mockResults}
        selectedIndex={1}
        onItemClick={mockOnItemClick}
      />,
    );

    const resultItems = container.querySelectorAll('[class*="cursor-pointer"]');
    expect(resultItems[1]).toHaveClass('bg-blue-600/30');
    expect(resultItems[0]).not.toHaveClass('bg-blue-600/30');
  });

  it('calls onItemClick when result is clicked', async () => {
    const user = userEvent.setup();
    const mockOnItemClick = vi.fn();
    render(
      <ResultsList
        results={mockResults}
        selectedIndex={0}
        onItemClick={mockOnItemClick}
      />,
    );

    const calculatorItem = screen.getByText('Calculator').closest('div');
    await user.click(calculatorItem!);

    expect(mockOnItemClick).toHaveBeenCalledWith(mockResults[0]);
  });

  it('renders results with all properties', () => {
    const mockOnItemClick = vi.fn();
    render(
      <ResultsList
        results={mockResults}
        selectedIndex={0}
        onItemClick={mockOnItemClick}
      />,
    );

    expect(screen.getByText('🧮')).toBeInTheDocument();
    expect(screen.getByText('💻')).toBeInTheDocument();
    expect(screen.getByText('⌘+C')).toBeInTheDocument();
  });
});
