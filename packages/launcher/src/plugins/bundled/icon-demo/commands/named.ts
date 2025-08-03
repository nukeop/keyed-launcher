import { CommandContext } from '@keyed-launcher/plugin-sdk';

export async function execute(context: CommandContext): Promise<void> {
  console.log('⚙️ Named Settings command executed!');
  console.log('Context:', context);
}
