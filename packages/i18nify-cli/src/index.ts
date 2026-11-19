import { Command } from 'commander';
import { registerAllCommands } from './registry';

const [major] = process.versions.node.split('.').map(Number);
if (major < 18) {
  console.error('Error: @razorpay/i18nify-cli requires Node.js >= 18.0.0');
  process.exit(1);
}

const program = new Command()
  .name('i18n')
  .description('i18n CLI — i18n utilities for developers')
  .version('0.1.0');

registerAllCommands(program);

program.parseAsync(process.argv).catch(() => {
  // commander errors are already printed to stderr
});
