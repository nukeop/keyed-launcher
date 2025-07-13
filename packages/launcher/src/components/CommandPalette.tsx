import { useCommandPaletteResults } from '../hooks/useCommandPaletteResults';
import { useLauncherStore } from '../stores/launcher';
import { ViewWithSearchBar } from './Views/ViewWithSearchBar';
import { LauncherEntry, List } from '@keyed-launcher/plugin-sdk';
import { FC } from 'react';

export const CommandPalette: FC = () => {
  const { searchQuery } = useLauncherStore();
  const { results, executeResult } = useCommandPaletteResults(searchQuery);

  const handleItemClick = (result: LauncherEntry) => {
    executeResult(result);
  };

  return (
    <ViewWithSearchBar data-testid="command-palette">
      <List results={results} onItemAction={handleItemClick} />
    </ViewWithSearchBar>
  );
};
