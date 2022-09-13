import chalk from 'chalk';
import { CliCommandInterface } from './cli-command.interface.js';

export default class HelpCommand implements CliCommandInterface {
  public readonly name = '--help';

  public async execute() {
    console.log(`
      ${chalk.bgBlue.bold('Data preparation program for REST API server.')}

      Example:
          ${chalk.blue('main.js')} ${chalk.cyan('--<command> [--arguments]')}

      Commands:
          ${chalk.cyan('--version')}:                         # ${chalk.blue('current version')}
          ${chalk.cyan('--help')}:                            # ${chalk.blue('prints this guide')}
          ${chalk.cyan('--import <path>')}:                   # ${chalk.blue('imports data from TSV file')}
          ${chalk.cyan('--generate <n> <filepath> <url>')}:   # ${chalk.blue('generates <n> offers in TSV file')}
    `);
  }
}
