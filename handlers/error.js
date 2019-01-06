/**
 * This file contains some basic error handling
 * customize console-output for uncaught exceptions
 * also contains function to write to local-logfile
 *
 * To use this file add `require('<path>/error')` in the root file of your project
 *
 * @requires chalk
 *
 * @todo Add support for additional exceptions
 */

const chalk = require('chalk');
const fs = require('fs');

const errorLog = fs.createWriteStream(`${__dirname}/../logs/bot-error.log`, { flags: 'a' });

/**
 * Enum for error codes to add a little bit more descriptive console-output
 *
 * @enum string
 */
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
});

/**
 * Writes to error-log-file
 *
 * @param logMessage string
 */
const logError = (logMessage) => {
  errorLog.write(logMessage);
  errorLog.write('\n');
};

/**
 * Customize console output for uncaught exceptions
 * and send it as object to console.error-override
 *
 * @override
 */
process.on('uncaughtException', (error) => {
  const { stack } = error;
  const pattern = new RegExp(/(EACCES|EADDRINUSE|ECONNREFUSED|ECONNRESET|EEXIST|EISDIR|EMFILE|ENOENT|ENOTDIR|ENOTEMPTY|EPERM|EPIPE|ETIMEDOUT|)/);

  console.error({
    stack: [stack],
    message: [
      stack
        .replace(/^Error(:?) /, '')
        .replace(pattern, (_, match) => (match !== '') ? ERROR_CODES[match] : ''),
    ],
  });
});

module.exports = {
  logError,
};
