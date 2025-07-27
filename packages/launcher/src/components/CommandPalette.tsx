import { useCommandPaletteResults } from '../hooks/useCommandPaletteResults';
import { useInlineCommands } from '../hooks/useInlineCommands';
import { useLauncherStore } from '../stores/launcher';
import { ViewWithSearchBar } from './Views/ViewWithSearchBar';
import {
  Action,
  ActionPanel,
  groupEntriesByCategory,
  ItemKind,
  List,
} from '@keyed-launcher/plugin-sdk';
import { FC, Fragment } from 'react';

export const CommandPalette: FC = () => {
  const { searchQuery } = useLauncherStore();
  const { results } = useCommandPaletteResults(searchQuery);
  const { activeCommand } = useInlineCommands(searchQuery);

  const allResults = activeCommand ? [activeCommand, ...results] : results;

  const groupedByCategory = groupEntriesByCategory(allResults);

  return (
    <ViewWithSearchBar data-testid="command-palette">
      <List data-testid="command-palette-list" onSelectionChange={() => {}}>
        {groupedByCategory.map((group) => {
          return (
            <Fragment key={group.category}>
              <List.Section
                data-testid="category-header"
                title={group.category}
              >
                {group.entries.map((result) => (
                  <List.Item
                    key={result.id}
                    data-testid="command-palette-list-item"
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
            </Fragment>
          );
        })}
      </List>
    </ViewWithSearchBar>
  );
};
