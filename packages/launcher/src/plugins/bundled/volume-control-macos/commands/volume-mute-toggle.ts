import { CommandContext } from '@keyed-launcher/plugin-sdk';
import { toggleMute } from '../index';

export default async function (_context: CommandContext): Promise<void> {
  await toggleMute();
}
