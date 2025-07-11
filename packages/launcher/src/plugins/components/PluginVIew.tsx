import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  CommandContext,
  useTheme,
  ViewCommand,
} from '@keyed-launcher/plugin-sdk';
import { createCommandId, useCommandRegistry } from '../../stores/commands';
import { ViewWithSearchBar } from '../../components/Views/ViewWithSearchBar';

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

  const context: CommandContext = {
    environment: {
      theme,
      platform: 'web',
      debug: true,
    },
  };

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

  console.log({ PluginComponent });

  return (
    <ViewWithSearchBar>
      {isLoadingPluginComponent && <div>Loading...</div>}
      {PluginComponent && <PluginComponent {...context} />}
    </ViewWithSearchBar>
  );
};
