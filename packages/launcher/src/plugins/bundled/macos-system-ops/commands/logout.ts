import { CommandContext } from '@keyed-launcher/plugin-sdk';
import { logoutUser } from '../index';

export default async function (_context: CommandContext): Promise<void> {
  await logoutUser();
}
