export { List, ListItem, Detail } from '../components/index';
export type {
  ListProps,
  ListItemProps,
  DetailProps,
} from '../components/index';

import * as system from './system';
import * as shell from './shell';
import * as notifications from './notifications';
import * as environment from './environment';
import * as clipboard from './clipboard';

export const PluginAPI = {
  system,
  shell,
  clipboard,
  notifications,
  environment,
};

export const useEnvironment = environment.useEnvironment;
export const useNotifications = notifications.useNotifications;
