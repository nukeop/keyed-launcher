import * as clipboard from './clipboard';
import * as environment from './environment';
import * as notifications from './notifications';
import * as shell from './shell';
import * as system from './system';

export { getAPIBridge } from './client';
export type { MacOSApp } from './system';
export type { Environment } from './environment';
export type { PluginAPIBridge } from './client';

export const PluginAPI = {
  system,
  shell,
  clipboard,
  notifications,
  environment,
};

export const useEnvironment = environment.useEnvironment;
export const useNotifications = notifications.useNotifications;
