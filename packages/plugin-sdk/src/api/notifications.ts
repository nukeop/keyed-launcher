import './global';

import { getAPIBridge } from './client';

export const show = (
  message: string,
  type: 'info' | 'success' | 'error' = 'info',
): void => {
  const api = getAPIBridge();
  api.notifications.show(message, type);
};

export const useNotifications = () => {
  return {
    show,
  };
};
