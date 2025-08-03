import { List } from '.';
import { ActionProvider } from '../../providers';
import { useSearchStore } from '../../stores/search';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import { describe, expect, it } from 'vitest';

describe('List', () => {
  it('renders an empty list', () => {
    const list = render(
      <List>
        <></>
      </List>,
    );
    expect(list.asFragment()).toMatchSnapshot();
  });

  it('renders items', () => {
    const list = render(
      <ActionProvider>
        <List>
          <List.Item id="1" title="Test" />
        </List>
      </ActionProvider>,
    );
    expect(list.asFragment()).toMatchSnapshot();
  });

  it('renders sections', () => {
    const list = render(
      <ActionProvider>
        <List>
          <List.Section title="Section 1">
            <List.Item id="1" title="Test" />
          </List.Section>
        </List>
      </ActionProvider>,
    );
    expect(list.asFragment()).toMatchSnapshot();
  });

  it('filters items', () => {
    useSearchStore.setState({ searchQuery: 'Test' });
    render(
      <ActionProvider>
        <List filtering>
          <List.Item id="1" title="Test" />
          <List.Item id="2" title="Not" />
        </List>
      </ActionProvider>,
    );

    expect(screen.queryByText('Not')).toBeNull();
  });

  it('filters items preserving sections nesting', () => {
    useSearchStore.setState({ searchQuery: 'Test' });
    render(
      <ActionProvider>
        <List filtering>
          <List.Section title="Section 1">
            <List.Item id="1" title="Test 1" />
            <List.Item id="2" title="Not" />
          </List.Section>
          <List.Section title="Section 2">
            <List.Item id="3" title="Test 2" />
            <List.Item id="4" title="Not" />
          </List.Section>
          <List.Section title="This one will disappear">
            <List.Item id="5" title="Not" />
          </List.Section>
        </List>
      </ActionProvider>,
    );

    expect(screen.queryByText('Not')).toBeNull();
    expect(screen.queryByText('This one will disappear')).toBeNull();
    expect(screen.queryByText('Section 1')).not.toBeNull();
    expect(screen.queryByText('Section 2')).not.toBeNull();
    expect(screen.queryByText('Test 1')).not.toBeNull();
    expect(screen.queryByText('Test 2')).not.toBeNull();
  });

  it('keyboard navigation works correctly with filtered items', () => {
    useSearchStore.setState({ searchQuery: 'Apple' });

    render(
      <ActionProvider>
        <List filtering>
          <List.Item id="apple1" title="Apple 1" />
          <List.Item id="banana1" title="Banana 1" />
          <List.Item id="apple2" title="Apple 2" />
          <List.Item id="banana2" title="Banana 2" />
          <List.Item id="apple3" title="Apple 3" />
        </List>
      </ActionProvider>,
    );

    expect(screen.queryByText('Apple 1')).not.toBeNull();
    expect(screen.queryByText('Apple 2')).not.toBeNull();
    expect(screen.queryByText('Apple 3')).not.toBeNull();
    expect(screen.queryByText('Banana 1')).toBeNull();
    expect(screen.queryByText('Banana 2')).toBeNull();

    const apple1 = screen
      .getByText('Apple 1')
      .closest('[data-testid="plugin-list-item"]');
    const apple2 = screen
      .getByText('Apple 2')
      .closest('[data-testid="plugin-list-item"]');
    const apple3 = screen
      .getByText('Apple 3')
      .closest('[data-testid="plugin-list-item"]');

    expect(apple1?.getAttribute('data-selected')).toBe('true');

    fireEvent.keyDown(document, { key: 'ArrowDown' });
    expect(apple1?.getAttribute('data-selected')).toBe('false');
    expect(apple2?.getAttribute('data-selected')).toBe('true');

    fireEvent.keyDown(document, { key: 'ArrowDown' });
    expect(apple2?.getAttribute('data-selected')).toBe('false');
    expect(apple3?.getAttribute('data-selected')).toBe('true');
  });

  it('resets selection to first item when search query changes', async () => {
    useSearchStore.setState({ searchQuery: '' });

    render(
      <ActionProvider>
        <List filtering>
          <List.Item id="apple1" title="Apple 1" />
          <List.Item id="banana1" title="Banana 1" />
          <List.Item id="apple2" title="Apple 2" />
        </List>
      </ActionProvider>,
    );

    fireEvent.keyDown(document, { key: 'ArrowDown' });

    const banana1 = screen
      .getByText('Banana 1')
      .closest('[data-testid="plugin-list-item"]');
    expect(banana1?.getAttribute('data-selected')).toBe('true');

    await act(() => useSearchStore.setState({ searchQuery: 'Apple' }));

    await waitFor(() => {
      const apple1 = screen
        .getByText('Apple 1')
        .closest('[data-testid="plugin-list-item"]');
      expect(apple1?.getAttribute('data-selected')).toBe('true');
    });
  });
});
