import { CommandContext } from '@keyed-launcher/plugin-sdk';
import { adjustVolume } from '../index';

export default async function (_context: CommandContext): Promise<void> {
  await adjustVolume('+10');
}
