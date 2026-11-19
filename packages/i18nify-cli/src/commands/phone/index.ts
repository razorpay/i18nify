import { Command } from 'commander';
import type { CommandModule } from '../../types';
import dial from './dial';
import gen from './gen';

const leafCommands: CommandModule[] = [dial, gen];

const mod: CommandModule = {
  name: 'phone',
  description: 'Phone number utilities',
  register(parent: Command) {
    const group = parent.command('phone').description(this.description);
    leafCommands.forEach((cmd) => cmd.register(group));
  },
};

export default mod;
