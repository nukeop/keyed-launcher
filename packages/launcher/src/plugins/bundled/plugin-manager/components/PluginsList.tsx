import { CategoryHeader } from '../../../../components/CategoryHeader';
import { usePluginRegistry } from '../../../../stores/plugins';
import { PluginItem } from './PluginItem';
import { Plugin } from '@keyed-launcher/plugin-sdk';
import { FC, useMemo } from 'react';

interface PluginGroup {
  category: string;
  plugins: Plugin[];
}

interface PluginsListProps {
  searchQuery?: string;
}

export const PluginsList: FC<PluginsListProps> = ({ searchQuery = '' }) => {
  const getAllPlugins = usePluginRegistry((state) => state.getAllPlugins);
  const getPluginStatus = usePluginRegistry((state) => state.getPluginStatus);
  const isPluginEnabled = usePluginRegistry((state) => state.isPluginEnabled);

  const plugins = getAllPlugins();

  const filteredAndGroupedPlugins = useMemo(() => {
    let filteredPlugins = plugins;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredPlugins = plugins.filter(
        (plugin) =>
          plugin.manifest.name.toLowerCase().includes(query) ||
          plugin.manifest.description.toLowerCase().includes(query) ||
          plugin.manifest.author.toLowerCase().includes(query) ||
          (plugin.manifest.category &&
            plugin.manifest.category.toLowerCase().includes(query)),
      );
    }

    const grouped = filteredPlugins.reduce(
      (acc, plugin) => {
        const category = plugin.manifest.category || 'Other';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(plugin);
        return acc;
      },
      {} as Record<string, Plugin[]>,
    );

    return Object.entries(grouped)
      .map(([category, plugins]): PluginGroup => ({ category, plugins }))
      .sort((a, b) => a.category.localeCompare(b.category));
  }, [plugins, searchQuery]);

  if (filteredAndGroupedPlugins.length === 0) {
    return (
      <div
        className="flex flex-1 items-center justify-center py-12"
        data-testid="empty-plugins"
      >
        <div className="text-center">
          <div className="mb-2 text-lg text-gray-400">🔌</div>
          <div className="text-gray-400">
            {searchQuery ? 'No matching plugins found' : 'No plugins loaded'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-2">
      {filteredAndGroupedPlugins.map((group) => (
        <div key={group.category}>
          <CategoryHeader
            title={`${group.category} (${group.plugins.length})`}
            data-testid="plugin-category-header"
          />
          {group.plugins.map((plugin) => {
            const status = getPluginStatus(plugin.manifest.id);
            const enabled = isPluginEnabled(plugin.manifest.id);

            return (
              <PluginItem
                key={plugin.manifest.id}
                plugin={plugin}
                status={status}
                enabled={enabled}
                data-testid={`plugin-item-${plugin.manifest.id}`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};
