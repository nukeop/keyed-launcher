import { List } from '.';
import { ActionProvider } from '../../providers';
import { useSearchStore } from '../../stores/search';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('List', () => {
  it('renders an empty list', () => {
    const list = render(<List />);
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
});
