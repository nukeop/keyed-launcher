import './global';

import { getAPIBridge } from './client';

export interface MacOSApp {
  name: string;
  path: string;
  bundle_id: string;
  icon: string;
}

export const getApplications = async (): Promise<MacOSApp[]> => {
  const api = getAPIBridge();
  return api.system.getApplications();
};
