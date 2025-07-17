import { useCommandPaletteResults } from '../hooks/useCommandPaletteResults';
import { useInlineCommands } from '../hooks/useInlineCommands';
import { useLauncherStore } from '../stores/launcher';
import { ViewWithSearchBar } from './Views/ViewWithSearchBar';
import { LauncherEntry, List } from '@keyed-launcher/plugin-sdk';
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
      <List
        results={allResults}
        onItemAction={handleItemClick}
        data-testid="command-palette-list"
      />
    </ViewWithSearchBar>
  );
};
