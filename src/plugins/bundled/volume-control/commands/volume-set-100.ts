import { CommandContext } from '../../../types';
import { setVolume } from '../index';

export default async function (_context: CommandContext): Promise<void> {
  await setVolume(100);
}
