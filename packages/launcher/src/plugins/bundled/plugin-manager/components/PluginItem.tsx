import { PluginLoadingStatus } from '../../../../stores/plugins';
import { PluginStatus } from './PluginStatus';
import { IconRenderer, Plugin } from '@keyed-launcher/plugin-sdk';
import { FC } from 'react';

interface PluginItemProps {
  plugin: Plugin;
  status?: PluginLoadingStatus;
  enabled: boolean;
  'data-testid'?: string;
}

export const PluginItem: FC<PluginItemProps> = ({
  plugin,
  status,
  enabled,
  'data-testid': testId,
}) => {
  const manifest = plugin.manifest;

  return (
    <div
      className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-white/5"
      data-testid={testId}
    >
      <div className="flex min-w-0 flex-1 items-center space-x-3">
        <div className="flex-shrink-0">
          <IconRenderer icon={{ type: 'emoji', emoji: '🔌' }} size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="truncate font-medium text-white">{manifest.name}</h3>
            <span className="flex-shrink-0 text-xs text-gray-400">
              v{manifest.version}
            </span>
          </div>

          <p className="truncate text-sm text-gray-400">
            {manifest.description}
          </p>

          <div className="mt-1 flex items-center space-x-2">
            <span className="text-xs text-gray-500">by {manifest.author}</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-500">
              {manifest.commands.length} command
              {manifest.commands.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-shrink-0 items-center space-x-2">
        <PluginStatus status={status} enabled={enabled} />
      </div>
    </div>
  );
};
