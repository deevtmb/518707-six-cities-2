import chalk from 'chalk';
import { CliCommandInterface } from './cli-command.interface.js';

export default class HelpCommand implements CliCommandInterface {
  public readonly name = '--help';

  public async execute() {
    console.log(`
      ${chalk.bgBlue.bold('Программа для подготовки данных для REST API сервера.')}

      Example:
        ${chalk.blue('main.js')} ${chalk.cyan('--<command> [--arguments]')}

      Commands:
        ${chalk.cyan('--help')}:     # ${chalk.blue('Памятка по командам для CLI')}

        ${chalk.cyan('--version')}:  # ${chalk.blue('Текущая версия проекта')}

        ${chalk.cyan('--generate <n> <filepath> <url>')}:
                    # ${chalk.blue('Генерация случайных данных в .tsv файл')}
                    # ${chalk.blue('- <n> - количество записей')}
                    # ${chalk.blue('- <filepath> - путь и имя файла с данными')}
                    # ${chalk.blue('- <url> - адрес сервера с моковыми данными')}
                    # ${chalk.blue('При вызове команды без аргументов будут использованы дефолтные значения')}

        ${chalk.cyan('--import <filepath> <login> <password> <dbhost> <dbname> <salt>')}:
                    # ${chalk.blue('Импортирует файл .tsv в базу данных')}
                    # ${chalk.blue('Для вызова команды без аргументов должны быть настроены переменные окружения')}
                    # ${chalk.blue('Подробнее про переменные окружения: ./Readme.md')}
    `);
  }
}
