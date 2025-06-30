import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CommandPalette } from '../CommandPalette';
import { LauncherEntry } from '../ResultsList';

const mockResults: LauncherEntry[] = [
  {
    id: '1',
    name: 'calculator',
    title: 'Calculator',
    subtitle: 'System calculator',
    description: 'Built-in calculator app',
    icon: '🧮',
    mode: 'no-view',
    category: 'Applications',
    pluginId: 'test-plugin',
    action: vi.fn(),
    shortcut: '⌘+C',
  },
  {
    id: '2',
    name: 'terminal',
    title: 'Terminal',
    subtitle: 'Command line interface',
    description: 'Terminal application',
    icon: '💻',
    mode: 'no-view',
    category: 'Applications',
    pluginId: 'test-plugin',
    action: vi.fn(),
    shortcut: '⌘+T',
  },
  {
    id: '3',
    name: 'finder',
    title: 'Finder',
    subtitle: 'File manager',
    description: 'File browser',
    icon: '📁',
    mode: 'no-view',
    category: 'Applications',
    pluginId: 'test-plugin',
    action: vi.fn(),
  },
];

describe('CommandPalette Integration', () => {
  let mockOnSearchChange: ReturnType<typeof vi.fn>;
  let mockOnResultExecute: ReturnType<typeof vi.fn>;
  let mockOnClose: ReturnType<typeof vi.fn>;

  const renderCommandPalette = (
    props: Partial<Parameters<typeof CommandPalette>[0]> = {},
  ) => {
    const defaultProps = {
      searchQuery: '',
      onSearchChange: mockOnSearchChange,
      results: mockResults,
      onResultExecute: mockOnResultExecute,
      onClose: mockOnClose,
    };

    return render(<CommandPalette {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    mockOnSearchChange = vi.fn();
    mockOnResultExecute = vi.fn();
    mockOnClose = vi.fn();
  });

  it('renders search bar and results list', () => {
    renderCommandPalette();

    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('results-list')).toBeInTheDocument();
    expect(screen.getByText('Calculator')).toBeInTheDocument();
    expect(screen.getByText('Terminal')).toBeInTheDocument();
    expect(screen.getByText('Finder')).toBeInTheDocument();
  });

  it('calls onSearchChange when typing in search bar', async () => {
    const user = userEvent.setup();
    renderCommandPalette();

    const searchInput = screen.getByTestId('search-input');
    await user.type(searchInput, 'calc');

    expect(mockOnSearchChange).toHaveBeenCalledTimes(4);
    expect(mockOnSearchChange).toHaveBeenCalledWith(expect.any(String));
  });

  it('navigates through results with arrow keys', async () => {
    const user = userEvent.setup();
    renderCommandPalette();

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
    renderCommandPalette();

    await user.keyboard('{Enter}');

    expect(mockOnResultExecute).toHaveBeenCalledWith(mockResults[0]);
  });

  it('executes result when clicked', async () => {
    const user = userEvent.setup();
    renderCommandPalette();

    const terminalItem = screen.getByTestId('result-item-2');
    await user.click(terminalItem);

    expect(mockOnResultExecute).toHaveBeenCalledWith(mockResults[1]);
  });

  it('shows empty state when no results and no search query', () => {
    renderCommandPalette({
      results: [],
      emptyMessage: 'Start typing to search...',
    });

    expect(screen.getByTestId('empty-results')).toBeInTheDocument();
    expect(screen.getByText('Start typing to search...')).toBeInTheDocument();
  });

  it('shows "no results found" when searching with no results', () => {
    renderCommandPalette({
      searchQuery: 'nonexistent',
      results: [],
    });

    expect(screen.getByTestId('empty-results')).toBeInTheDocument();
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('resets selected index when results change', async () => {
    const user = userEvent.setup();
    const { rerender } = renderCommandPalette();

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
        onClose={mockOnClose}
      />,
    );

    expect(screen.getByTestId('result-item-1')).toHaveAttribute(
      'data-selected',
      'true',
    );
  });

  it('handles keyboard navigation at boundaries', async () => {
    const user = userEvent.setup();
    renderCommandPalette();

    await user.keyboard('{ArrowUp}');

    await user.keyboard('{ArrowDown}');
    await user.keyboard('{ArrowDown}');

    await user.keyboard('{ArrowDown}');

    await user.keyboard('{Enter}');
    expect(mockOnResultExecute).toHaveBeenCalled();
  });

  it('clears search on Escape when query is not empty', async () => {
    const user = userEvent.setup();
    renderCommandPalette({
      searchQuery: 'test query',
    });

    await user.keyboard('{Escape}');

    expect(mockOnSearchChange).toHaveBeenCalledWith('');
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('calls onClose on Escape when query is empty', async () => {
    const user = userEvent.setup();

    renderCommandPalette();

    await user.keyboard('{Escape}');

    expect(mockOnSearchChange).not.toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('handles Page Down navigation', async () => {
    const largeResults = Array.from({ length: 15 }, (_, i) => ({
      id: String(i + 1),
      title: `Item ${i + 1}`,
      action: vi.fn(),
    }));

    const user = userEvent.setup();
    renderCommandPalette({
      results: largeResults,
    });

    // First item should be selected initially
    expect(screen.getByTestId('result-item-1')).toHaveAttribute(
      'data-selected',
      'true',
    );

    // Page Down should move 10 positions down
    await user.keyboard('{PageDown}');

    expect(screen.getByTestId('result-item-11')).toHaveAttribute(
      'data-selected',
      'true',
    );

    // Page Down again should go to the last item (15)
    await user.keyboard('{PageDown}');

    expect(screen.getByTestId('result-item-15')).toHaveAttribute(
      'data-selected',
      'true',
    );
  });

  it('handles Page Up navigation', async () => {
    const largeResults = Array.from({ length: 15 }, (_, i) => ({
      id: String(i + 1),
      title: `Item ${i + 1}`,
      action: vi.fn(),
    }));

    const user = userEvent.setup();
    renderCommandPalette({
      results: largeResults,
    });

    // Move to the end first
    await user.keyboard('{PageDown}');
    await user.keyboard('{PageDown}');

    expect(screen.getByTestId('result-item-15')).toHaveAttribute(
      'data-selected',
      'true',
    );

    // Page Up should move 10 positions up
    await user.keyboard('{PageUp}');

    expect(screen.getByTestId('result-item-5')).toHaveAttribute(
      'data-selected',
      'true',
    );

    // Page Up again should go to the first item
    await user.keyboard('{PageUp}');

    expect(screen.getByTestId('result-item-1')).toHaveAttribute(
      'data-selected',
      'true',
    );
  });

  it('handles Page Up/Down with no results', async () => {
    const user = userEvent.setup();
    renderCommandPalette({
      results: [],
    });

    await user.keyboard('{PageDown}');
    await user.keyboard('{PageUp}');

    expect(screen.getByTestId('empty-results')).toBeInTheDocument();
  });
});
