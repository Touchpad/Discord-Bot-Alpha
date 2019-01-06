const { BotEngine } = require('./handlers/engine');

class DiscordBot extends BotEngine {
  constructor() {
    super();
    this.registerCommands();
    this.startBot();
  }
}

new DiscordBot();
