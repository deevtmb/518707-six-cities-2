#!/usr/bin/env node

import VersionCommand from './cli-command/version.comand.js';
import HelpCommand from './cli-command/help.command.js';
import CLIApplication from './cli-application/cli-application.js';
import ImportCommand from './cli-command/import.command.js';

const myManager = new CLIApplication();

myManager.registerCommands([
  new VersionCommand, new HelpCommand, new ImportCommand
]);

myManager.processCommand(process.argv);
