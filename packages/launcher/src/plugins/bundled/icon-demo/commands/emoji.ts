import { CommandContext } from '@keyed-launcher/plugin-sdk';

export async function execute(context: CommandContext): Promise<void> {
  console.log('🎉 Emoji command executed!');
  console.log('Context:', context);
}
