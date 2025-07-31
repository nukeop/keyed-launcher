import { useCommandPaletteResults } from '../hooks/useCommandPaletteResults';
import { useInlineCommands } from '../hooks/useInlineCommands';
import { ViewWithSearchBar } from './Views/ViewWithSearchBar';
import {
  Action,
  ActionPanel,
  groupEntriesByCategory,
  ItemKind,
  List,
  useSearchStore,
} from '@keyed-launcher/plugin-sdk';
import { FC } from 'react';

export const CommandPalette: FC = () => {
  const { searchQuery } = useSearchStore();
  const { results } = useCommandPaletteResults();
  const { activeCommand } = useInlineCommands(searchQuery);

  const allResults = activeCommand ? [activeCommand, ...results] : results;

  const groupedByCategory = groupEntriesByCategory(allResults);

  return (
    <ViewWithSearchBar data-testid="command-palette">
      <List data-testid="command-palette-list">
        {groupedByCategory.map((group) => (
          <List.Section
            key={group.category}
            data-testid="category-header"
            title={group.category}
          >
            {group.entries.map((result) => (
              <List.Item
                key={result.id}
                data-testid={`command-palette-list-item-${result.id}`}
                id={result.id}
                title={result.title}
                subtitle={result.subtitle}
                kind={result.kind ?? ItemKind.Command}
                icon={result.icon}
                actions={
                  <ActionPanel title={result.title}>
                    <Action
                      title={
                        {
                          [ItemKind.Application]: 'Open',
                          [ItemKind.Command]: 'Run command',
                          [ItemKind.PluginCommand]: 'Run command',
                          [ItemKind.QuickLink]: 'Open',
                          [ItemKind.SystemSettings]: 'Apply setting',
                        }[result.kind ?? ItemKind.Command]
                      }
                      onAction={() => {}}
                      shortcut={{ key: 'return', modifiers: [] }}
                      icon={{
                        type: 'named',
                        variant: 'bare',
                        name:
                          result.kind === ItemKind.Command
                            ? 'Terminal'
                            : 'AppWindow',
                      }}
                      style={'default'}
                    />
                  </ActionPanel>
                }
              />
            ))}
          </List.Section>
        ))}
      </List>
    </ViewWithSearchBar>
  );
};
