import { CommandContext } from '@keyed-launcher/plugin-sdk';
import { lockScreen } from '../index';

export default async function (_context: CommandContext): Promise<void> {
  await lockScreen();
}
