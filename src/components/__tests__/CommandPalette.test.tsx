import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CommandPalette } from '../CommandPalette';
import { Result } from '../ResultsList';

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
    shortcut: '⌘+T',
  },
  {
    id: '3',
    title: 'Finder',
    subtitle: 'File manager',
    icon: '📁',
    action: vi.fn(),
  },
];

describe('CommandPalette Integration', () => {
  let mockOnSearchChange: ReturnType<typeof vi.fn>;
  let mockOnResultExecute: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnSearchChange = vi.fn();
    mockOnResultExecute = vi.fn();
  });

  it('renders search bar and results list', () => {
    render(
      <CommandPalette
        searchQuery=""
        onSearchChange={mockOnSearchChange}
        results={mockResults}
        onResultExecute={mockOnResultExecute}
      />,
    );

    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('results-list')).toBeInTheDocument();
    expect(screen.getByText('Calculator')).toBeInTheDocument();
    expect(screen.getByText('Terminal')).toBeInTheDocument();
    expect(screen.getByText('Finder')).toBeInTheDocument();
  });

  it('calls onSearchChange when typing in search bar', async () => {
    const user = userEvent.setup();
    render(
      <CommandPalette
        searchQuery=""
        onSearchChange={mockOnSearchChange}
        results={mockResults}
        onResultExecute={mockOnResultExecute}
      />,
    );

    const searchInput = screen.getByTestId('search-input');
    await user.type(searchInput, 'calc');

    expect(mockOnSearchChange).toHaveBeenCalledTimes(4);
    expect(mockOnSearchChange).toHaveBeenCalledWith(expect.any(String));
  });

  it('navigates through results with arrow keys', async () => {
    const user = userEvent.setup();
    render(
      <CommandPalette
        searchQuery=""
        onSearchChange={mockOnSearchChange}
        results={mockResults}
        onResultExecute={mockOnResultExecute}
      />,
    );

    let selectedItem = screen.getByTestId('result-item-1');
    expect(selectedItem).toHaveAttribute('data-selected', 'true');

    await user.keyboard('{ArrowDown}');
    selectedItem = screen.getByTestId('result-item-2');
    expect(selectedItem).toHaveAttribute('data-selected', 'true');

    await user.keyboard('{ArrowDown}');
    selectedItem = screen.getByTestId('result-item-3');
    expect(selectedItem).toHaveAttribute('data-selected', 'true');

    await user.keyboard('{ArrowUp}');
    selectedItem = screen.getByTestId('result-item-2');
    expect(selectedItem).toHaveAttribute('data-selected', 'true');
  });

  it('executes result with Enter key', async () => {
    const user = userEvent.setup();
    render(
      <CommandPalette
        searchQuery=""
        onSearchChange={mockOnSearchChange}
        results={mockResults}
        onResultExecute={mockOnResultExecute}
      />,
    );

    await user.keyboard('{Enter}');

    expect(mockOnResultExecute).toHaveBeenCalledWith(mockResults[0]);
  });

  it('executes result when clicked', async () => {
    const user = userEvent.setup();
    render(
      <CommandPalette
        searchQuery=""
        onSearchChange={mockOnSearchChange}
        results={mockResults}
        onResultExecute={mockOnResultExecute}
      />,
    );

    const terminalItem = screen.getByTestId('result-item-2');
    await user.click(terminalItem);

    expect(mockOnResultExecute).toHaveBeenCalledWith(mockResults[1]);
  });

  it('shows empty state when no results and no search query', () => {
    render(
      <CommandPalette
        searchQuery=""
        onSearchChange={mockOnSearchChange}
        results={[]}
        onResultExecute={mockOnResultExecute}
        emptyMessage="Start typing to search..."
      />,
    );

    expect(screen.getByTestId('empty-results')).toBeInTheDocument();
    expect(screen.getByText('Start typing to search...')).toBeInTheDocument();
  });

  it('shows "no results found" when searching with no results', () => {
    render(
      <CommandPalette
        searchQuery="nonexistent"
        onSearchChange={mockOnSearchChange}
        results={[]}
        onResultExecute={mockOnResultExecute}
      />,
    );

    expect(screen.getByTestId('empty-results')).toBeInTheDocument();
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('resets selected index when results change', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <CommandPalette
        searchQuery=""
        onSearchChange={mockOnSearchChange}
        results={mockResults}
        onResultExecute={mockOnResultExecute}
      />,
    );

    await user.keyboard('{ArrowDown}');
    expect(screen.getByTestId('result-item-2')).toHaveAttribute(
      'data-selected',
      'true',
    );

    const newResults = [mockResults[0]];
    rerender(
      <CommandPalette
        searchQuery="calc"
        onSearchChange={mockOnSearchChange}
        results={newResults}
        onResultExecute={mockOnResultExecute}
      />,
    );

    expect(screen.getByTestId('result-item-1')).toHaveAttribute(
      'data-selected',
      'true',
    );
  });

  it('handles keyboard navigation at boundaries', async () => {
    const user = userEvent.setup();
    render(
      <CommandPalette
        searchQuery=""
        onSearchChange={mockOnSearchChange}
        results={mockResults}
        onResultExecute={mockOnResultExecute}
      />,
    );

    await user.keyboard('{ArrowUp}');

    await user.keyboard('{ArrowDown}');
    await user.keyboard('{ArrowDown}');

    await user.keyboard('{ArrowDown}');

    await user.keyboard('{Enter}');
    expect(mockOnResultExecute).toHaveBeenCalled();
  });
});
