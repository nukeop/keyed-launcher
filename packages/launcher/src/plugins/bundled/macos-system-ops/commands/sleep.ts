import { CommandContext } from '@keyed-launcher/plugin-sdk';
import { sleepSystem } from '../index';

export default async function (_context: CommandContext): Promise<void> {
  await sleepSystem();
}
