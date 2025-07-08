import { CommandContext } from '@keyed-launcher/plugin-sdk';
import { restartSystem } from '../index';

export default async function (_context: CommandContext): Promise<void> {
  await restartSystem();
}
