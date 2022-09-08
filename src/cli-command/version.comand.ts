import { readFileSync } from 'fs';
import chalk from 'chalk';
import { CliCommandInterface } from './cli-command.interface.js';

export default class VersionCommand implements CliCommandInterface {
  public readonly name = '--version';

  private readVersion(): string {
    const contentFileJSON = readFileSync('./package.json', {encoding: 'utf-8'});
    const content = JSON.parse(contentFileJSON);
    return content.version;
  }

  public async execute() {
    const version = this.readVersion();
    const [major, minor, patch] = version.split('.');
    console.log(chalk.bold(`${chalk.blueBright(major)}.${chalk.cyan(minor)}.${chalk.blue(patch)}`));
  }
}
