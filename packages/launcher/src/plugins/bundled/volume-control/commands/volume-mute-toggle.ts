import { CommandContext } from '../../../types';
import { toggleMute } from '../index';

export default async function (_context: CommandContext): Promise<void> {
  await toggleMute();
}
