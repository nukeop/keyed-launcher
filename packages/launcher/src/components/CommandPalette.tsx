import { useCommandPaletteResults } from '../hooks/useCommandPaletteResults';
import { useInlineCommands } from '../hooks/useInlineCommands';
import { useLauncherStore } from '../stores/launcher';
import { ViewWithSearchBar } from './Views/ViewWithSearchBar';
import {
  Action,
  ActionPanel,
  ItemKind,
  LauncherEntry,
  List,
} from '@keyed-launcher/plugin-sdk';
import { FC } from 'react';

export const CommandPalette: FC = () => {
  const { searchQuery } = useLauncherStore();
  const { results, executeResult } = useCommandPaletteResults(searchQuery);
  const { activeCommand } = useInlineCommands(searchQuery);

  const handleItemClick = (result: LauncherEntry) => {
    executeResult(result);
  };

  const allResults = activeCommand ? [activeCommand, ...results] : results;

  return (
    <ViewWithSearchBar data-testid="command-palette">
      <List data-testid="command-palette-list" onSelectionChange={() => {}}>
        {allResults.map((result) => (
          <List.Item
            data-testid="command-palette-list-item"
            key={result.id}
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
      </List>
    </ViewWithSearchBar>
  );
};
