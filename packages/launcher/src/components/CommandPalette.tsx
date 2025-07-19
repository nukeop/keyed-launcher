import { useCommandPaletteResults } from '../hooks/useCommandPaletteResults';
import { useInlineCommands } from '../hooks/useInlineCommands';
import { useLauncherStore } from '../stores/launcher';
import { ViewWithSearchBar } from './Views/ViewWithSearchBar';
import { ItemKind, LauncherEntry, List } from '@keyed-launcher/plugin-sdk';
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
      <List data-testid="command-palette-list">
        {allResults.map((result) => (
          <List.Item
            key={result.id}
            id={result.id}
            title={result.title}
            subtitle={result.subtitle}
            kind={ItemKind.Application}
            icon={result.icon}
            onClick={() => handleItemClick(result)}
            data-testid="command-palette-list-item"
          >
            {result.title}
          </List.Item>
        ))}
      </List>
    </ViewWithSearchBar>
  );
};
