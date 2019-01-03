const chalk = require('chalk');

const _log = console.log;

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

console.log = (...message) => {
  _log.apply(console, [timestamp(), chalk.blue.bold(' ->'.padStart(8, ' ')), ...message]);
};

console.info = (...message) => {
  _log.apply(console, [timestamp(), chalk.magenta('Info  ->'), ...message]);
};

console.warn = (...message) => {
  _log.apply(console, [timestamp(), chalk.yellow('Warn  ->'), ...message]);
};

console.error = (...message) => {
  _log.apply(console, [timestamp(), chalk.red('Error ->'), ...message]);
};
