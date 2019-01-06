const fs = require('fs');
const { Collection } = require('discord.js');
const { prefix } = require('../config.json');

/**
 * Command file format
 *
 * @typedef CommandSchema
 * @type {object}
 * @property {string} title                 Full name of command, used by the help command
 * @property {string} name                  Command name, used after prefix to call command
 * @property {string} description           Longer description of the command, used by the help command
 * @property {string|number} [accessLevel]  Set if command should have limited access
 * @property {number} [cd]                  Duration between command can be rerun
 * @property {boolean} [args]               Determines if command requires args
 * @property {string} [usage]               Contains example arguments if command takes arguments
 * @property {function} execute             What should happen if command ir run
 */

class Commands {
  constructor() {
    this.client = {};
    this.cds = {};
  }

  /**
   * Fetching all commands and register them to the client object
   */
  registerCommands() {
    // fetch all files from commands folder
    fs.readdir(`${__dirname}/../commands`, (error, commandFiles) => {
      if (error) {
        throw error;
      }
      commandFiles
        .filter(file => file.endsWith('.js'))
        .forEach((file) => {
          // require all js-files from the commands folder
          const command = require(`../commands/${file}`);
          // register command into the bot-object
          this.client.commands.set(command.name, command);
        });
    });
  }

  /**
   * Checks for valid commands and run them if found
   *
   * @param message
   * @returns {Promise<*>}
   */
  async runCommand(message) {
    // Filter out all messages sent by bots and not starting with configured prefix
    if (!message.content.startsWith(prefix) || message.author.bot) {
      return;
    }

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = this.client.commands.get(commandName)
      || this.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    // check if command exists
    if (!command) {
      return;
    }

    if (command.guildOnly && message.channel.type !== 'text') {
      return message.reply('This command can\'t be run in private messages');
    }

    if (command.args && !args.length) {
      const reply = [`This command requires arguments`];

      if (command.usage) {
        reply.push(`the correct way to use this command is: \`${prefix}${command.name} ${command.usage}\``);
      }

      return message.channel.send(reply.join(', '));
    }

    /**
     * Set a timeout on this command to avoid spamming
     * default timeout is set to 3 seconds
     */
    if (!this.cds.has(command.name)) {
      this.cds.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = this.cds.get(command.name);
    const cdAmount = (command.cd || 3) * 1000;

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cdAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return message.reply(`Please wait a further ${timeLeft.toFixed(1)} second(s) until you try this command again.`);
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cdAmount);

    try {
      await command.execute(message, args, this.client);
    } catch (error) {
      console.error(error);
      message.reply('An error has occurred!');
    }
  }
}

module.exports = {
  Commands,
};

