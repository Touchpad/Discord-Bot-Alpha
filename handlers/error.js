const chalk = require('chalk');
const fs = require('fs');

const errorLog = fs.createWriteStream(`${__dirname}/../logs/bot-error.log`, { flags: 'a' });

const ERROR_CODES = Object.freeze({
  EACCES: `${chalk.bold('EACCES')} (${chalk.italic('Permission denied')}`,
  EADDRINUSE: `${chalk.bold('EADDRINUSE')} (${chalk.italic('Address already in use')})`,
  ECONNREFUSED: `${chalk.bold('ECONNREFUSED')} (${chalk.italic('Connection refused')})`,
  ECONNRESET: `${chalk.bold('ECONNRESET')}' (Connection reset by peer')})`,
  EEXIST: `${chalk.bold('EEXIST')} (${chalk.italic('File exists')})`,
  EISDIR: `${chalk.bold('EISDIR')} (${chalk.italic('Is a directory')})`,
  EMFILE: `${chalk.bold('EMFILE')} (${chalk.italic('Too many open files in system')})`,
  ENOENT: `${chalk.bold('ENOENT')} (${chalk.italic('No such file or directory')})`,
  ENOTDIR: `${chalk.bold('ENOTDIR')} (${chalk.italic('Not a directory')})`,
  ENOTEMPTY: `${chalk.bold('ENOTEMPTY')} (${chalk.italic('Directory not empty')})`,
  EPERM: `${chalk.bold('EPERM')} (${chalk.italic('Operation not permitted')})`,
  EPIPE: `${chalk.bold('EPIPE')} (${chalk.italic('Broken pipe')})`,
  ETIMEDOUT: `${chalk.bold('ETIMEDOUT')} (${chalk.italic('Operation timed out')})`,
  '': '',
});

process.on('uncaughtException', (error) => {
  const { NODE_ENV } = process.env;
  const { stack } = error;
  const pattern = new RegExp(/^Error: (EACCES|EADDRINUSE|ECONNREFUSED|ECONNRESET|EEXIST|EISDIR|EMFILE|ENOENT|ENOTDIR|ENOTEMPTY|EPERM|EPIPE|ETIMEDOUT|)/);

  console.error(stack
    .replace(pattern, (_, match) => ERROR_CODES[match]));
  if (NODE_ENV === 'production') {
    errorLog.write(stack);
    errorLog.write('\n');
  }
});