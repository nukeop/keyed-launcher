import { CommandContext } from '@keyed-launcher/plugin-sdk';
import { setVolume } from '../index';

export default async function (_context: CommandContext): Promise<void> {
  await setVolume(75);
}
