import { Command } from 'commander';

export interface CommandModule {
  name: string;
  description: string;
  register(parent: Command): void;
}
