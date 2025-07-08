import { CommandContext } from '@keyed-launcher/plugin-sdk';
import { shutdownSystem } from '../index';

export default async function (_context: CommandContext): Promise<void> {
  await shutdownSystem();
}
