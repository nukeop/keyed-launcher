import { lockScreen } from '../index';
import { CommandContext } from '@keyed-launcher/plugin-sdk';

export default async function (_context: CommandContext): Promise<void> {
  await lockScreen();
}
