export { List, ListItem, Detail } from '../components/index';
export { Action, ActionError, executeAction } from '../actions';
export type {
  ListProps,
  ListItemProps,
  DetailProps,
} from '../components/index';
import { Action } from '../actions';

export const useEnvironment = () => {
  return {
    theme: 'default', // TODO: get from theme system
    platform: navigator.platform,
    debug: process.env.NODE_ENV === 'development',
  };
};

export const useClipboard = () => {
  return {
    writeText: (text: string) => Action.CopyToClipboard(text),
  };
};

export const useNotifications = () => {
  return {
    show: (message: string, type: 'info' | 'success' | 'error' = 'info') => {
      // TODO: Implement proper notification system
      console.log(`[${type.toUpperCase()}] ${message}`);
    },
  };
};
