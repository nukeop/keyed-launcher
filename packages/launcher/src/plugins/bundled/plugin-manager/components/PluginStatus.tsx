import { PluginLoadingStatus } from '../../../../stores/plugins';
import { AlertCircle, CheckCircle, Loader2, XCircle } from 'lucide-react';
import { FC } from 'react';

interface PluginStatusProps {
  status?: PluginLoadingStatus;
  enabled: boolean;
}

export const PluginStatus: FC<PluginStatusProps> = ({ status, enabled }) => {
  if (!status) {
    return (
      <div className="flex items-center space-x-1">
        <AlertCircle size={16} className="text-gray-500" />
        <span className="text-xs text-gray-500">Unknown</span>
      </div>
    );
  }

  if (status.status === 'loading') {
    return (
      <div className="flex items-center space-x-1">
        <Loader2 size={16} className="animate-spin text-blue-400" />
        <span className="text-xs text-blue-400">Loading</span>
      </div>
    );
  }

  if (status.status === 'error') {
    return (
      <div className="flex items-center space-x-1">
        <XCircle size={16} className="text-red-400" />
        <span className="text-xs text-red-400">Error</span>
      </div>
    );
  }

  if (!enabled) {
    return (
      <div className="flex items-center space-x-1">
        <XCircle size={16} className="text-gray-500" />
        <span className="text-xs text-gray-500">Disabled</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1">
      <CheckCircle size={16} className="text-green-400" />
      <span className="text-xs text-green-400">Enabled</span>
    </div>
  );
};
