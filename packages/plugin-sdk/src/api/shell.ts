import './global';
import { getAPIBridge } from './client';

export const execute = async (
  program: string,
  args: string[] = [],
): Promise<void> => {
  const api = getAPIBridge();
  return api.shell.execute(program, args);
};
