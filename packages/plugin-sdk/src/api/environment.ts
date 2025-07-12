import './global';

import { getAPIBridge } from './client';

export interface Environment {
  theme: string;
  platform: string;
  debug: boolean;
}

export const getEnvironment = (): Environment => {
  const api = getAPIBridge();
  return api.environment.getEnvironment();
};

export const useEnvironment = (): Environment => {
  return getEnvironment();
};
