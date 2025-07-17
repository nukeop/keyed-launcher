import './global';

import { getAPIBridge } from './client';

export const readText = async (): Promise<string> => {
  const api = getAPIBridge();
  return api.clipboard.readText();
};

export const writeText = async (text: string): Promise<void> => {
  const api = getAPIBridge();
  return api.clipboard.writeText(text);
};
