import {
  Action,
  ActionPanel,
  CommandContext,
  LauncherEntry,
  List,
  useTheme,
} from '@keyed-launcher/plugin-sdk';
import { FC } from 'react';

const ShowThemes: FC<CommandContext> = (context) => {
  const { availableThemes, switchTheme } = useTheme();

  const results: LauncherEntry[] = availableThemes.map((theme) => ({
    id: theme.meta.id,
    commandName: theme.meta.name,
    title: theme.meta.name,
    mode: 'no-view',
    pluginId: 'theme-manager',
    execute: {
      mode: 'no-view',
      execute: async () => {
        switchTheme(theme.meta.id);
      },
    },
  }));
  return (
    <List>
      {results.map((result) => (
        <List.Item
          key={result.id}
          id={result.id}
          title={result.title}
          actions={
            <ActionPanel title={result.title}>
              <Action
                title="Switch to"
                shortcut={{ key: 'return', modifiers: [] }}
                onAction={() => result.execute.execute(context)}
                style="default"
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
};

export default ShowThemes;
