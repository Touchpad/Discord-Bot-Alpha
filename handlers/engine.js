require('./output');
require('./error');
const { Client, Collection } = require('discord.js');
const { Commands } = require('./commands');
const { token } = require('../config.json');

/**
 * This class initiates the bot and is used as a core
 * in here we extend Commands and set up the basics of the bot
 *
 * @extends Commands
 */
class BotEngine extends Commands {
  /**
   * Initializes a new instance of Client and saves it to Commands client-variable
   * as this one is used as the core client-variable throughout this entire project
   */
  constructor() {
    super();
    super.cds = new Collection();

    this.client = new Client();
    this.client.commands = new Collection();

    this.registerCommands();
  }

  /**
   * This function connects the bot to the discord network using the token from the config-file
   * to login. Once logged in sets a listener to check for commands
   */
  startBot() {
    this.client.login(token)
      .then(() => {
        this.client.on('message', async message => await this.runCommand(message));
      })
      .catch((error) => {
        throw new Error(error);
      });
  }
}

module.exports = {
  BotEngine
};
