import { Command } from 'commander';
import type { CommandModule } from './types';
import phone from './commands/phone/index';

const commandModules: CommandModule[] = [phone];

export function registerAllCommands(program: Command): void {
  commandModules.forEach((mod) => mod.register(program));
}
