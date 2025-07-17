import {
  CommandContext,
  LauncherEntry,
  List,
} from '@keyed-launcher/plugin-sdk';
import { FC } from 'react';

const ShowThemes: FC<CommandContext> = ({ environment }) => {
  const themes = environment.theme.availableThemes;
  console.log('Test');

  console.log({ environment });

  const results: LauncherEntry[] = themes.map((theme) => ({
    id: theme.meta.id,
    commandName: theme.meta.name,
    title: theme.meta.name,
    mode: 'no-view',
    pluginId: 'theme-manager',
    execute: {
      mode: 'no-view',
      execute: async () => {
        // Implement theme switching logic here
      },
    },
  }));
  return <List results={results} onItemAction={() => {}} />;
};

export default ShowThemes;
