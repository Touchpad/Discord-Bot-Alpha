/**
 * Output handler
 *
 * This file contains overrides for console-output to add a bit of styling including timestamp to the output
 * To use this file just require it in the root file of your project
 */

const chalk = require('chalk');
const { logError } = require('./error');

const _log = console.log;

/**
 * This function creates a timestamp: YYYY-MM-DD HH:mm:SS
 * the return value is formatted for cli and slightly dimmed
 *
 * @returns string
 */
const timestamp = () => {
  const _date = new Date();
  const date = [
    _date.getFullYear(),
    (`${_date.getMonth() + 1}`).padStart(2, '0'),
    (`${_date.getDate()}`).padStart(2, '0'),
  ];
  const time = [
    (`${_date.getHours()}`).padStart(2, '0'),
    (`${_date.getMinutes()}`).padStart(2, '0'),
    (`${_date.getSeconds()}`).padStart(2, '0'),
  ];

  return chalk.dim(`${date.join('-')} ${time.join(':')}`);
};

/**
 * Override for console.log
 * adds timestamp to output
 *
 * @param message
 */
console.log = (...message) => {
  _log.apply(console, [timestamp(), chalk.blue.bold(' ->'.padStart(8, ' ')), ...message]);
};

/**
 * Override for console.info
 * adds timestamp and " Info  ->" in magenta to output
 *
 * @param message
 */
console.info = (...message) => {
  _log.apply(console, [timestamp(), chalk.magenta('Info  ->'), ...message]);
};

/**
 * Override for console.warn
 * adds timestamp and " Warn  ->" in yellow to output
 *
 * @param message
 */
console.warn = (...message) => {
  _log.apply(console, [timestamp(), chalk.yellow('Warn  ->'), ...message]);
};

/**
 * Override for console.error
 * adds timestamp and " Error ->" in red to output
 *
 * @param msg mixed
 */
console.error = (...msg) => {
  const { NODE_ENV } = process.env;

  const message = (msg[0].constructor === Object) ? msg[0].message : msg;

  _log.apply(console, [timestamp(), chalk.red('Error ->'), ...message]);

  if (NODE_ENV === 'production') {
    const raw = (msg[0].constructor === Object) ? msg[0].stack : msg;
    logError(...raw);
  }
};
