import { ViewWithSearchBar } from '../../components/Views/ViewWithSearchBar';
import { createCommandId, useCommandRegistry } from '../../stores/commands';
import { isDev } from '../../utils/environment';
import {
  CommandContext,
  useTheme,
  ViewCommand,
} from '@keyed-launcher/plugin-sdk';
import { FC, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

export type PluginViewProps = {};

export const PluginView: FC<PluginViewProps> = () => {
  const theme = useTheme();
  const getRegisteredCommand = useCommandRegistry(
    (state) => state.getRegisteredCommand,
  );
  const { pluginId, commandName } = useParams<{
    pluginId: string;
    commandName: string;
  }>();
  const commandId = createCommandId(pluginId!, commandName!);
  const command = getRegisteredCommand(commandId);
  const loadPluginComponent = (command?.entry.execute as ViewCommand).execute;

  const context: CommandContext = useMemo(
    () => ({
      environment: {
        theme,
        debug: isDev(),
      },
    }),
    [theme],
  );

  const [PluginComponent, setPluginComponent] = useState<FC<CommandContext>>();
  const [isLoadingPluginComponent, setIsLoadingPluginComponent] =
    useState(true);

  useEffect(() => {
    const loadComponent = async () => {
      const component = await loadPluginComponent(context);
      setPluginComponent(() => component);
      setIsLoadingPluginComponent(false);
    };
    loadComponent();
  }, [loadPluginComponent, context]);

  return (
    <ViewWithSearchBar>
      {isLoadingPluginComponent && <div>Loading...</div>}
      {PluginComponent && <PluginComponent {...context} />}
    </ViewWithSearchBar>
  );
};
