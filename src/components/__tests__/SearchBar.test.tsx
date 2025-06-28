import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from '../SearchBar';

describe('SearchBar', () => {
  it('renders with placeholder text', () => {
    const mockOnChange = vi.fn();
    render(<SearchBar value="" onChange={mockOnChange} />);

    expect(
      screen.getByPlaceholderText('Type to search...'),
    ).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    const mockOnChange = vi.fn();
    render(
      <SearchBar
        value=""
        onChange={mockOnChange}
        placeholder="Custom placeholder"
      />,
    );

    expect(
      screen.getByPlaceholderText('Custom placeholder'),
    ).toBeInTheDocument();
  });

  it('displays the current value', () => {
    const mockOnChange = vi.fn();
    render(<SearchBar value="test query" onChange={mockOnChange} />);

    expect(screen.getByDisplayValue('test query')).toBeInTheDocument();
  });

  it('calls onChange when user types', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    render(<SearchBar value="" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('Type to search...');
    await user.type(input, 'hello');

    expect(mockOnChange).toHaveBeenCalledTimes(5);
    expect(mockOnChange).toHaveBeenCalledWith(expect.any(String));
  });

  it('focuses automatically when autoFocus is true', () => {
    const mockOnChange = vi.fn();
    render(<SearchBar value="" onChange={mockOnChange} autoFocus={true} />);

    const input = screen.getByPlaceholderText('Type to search...');
    expect(input).toHaveFocus();
  });
});
