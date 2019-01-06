const { BotEngine } = require('./handlers/engine');

class DiscordBot extends BotEngine {
  constructor() {
    super();
    this.registerCommands();
    this.startBot();
  }
}

new DiscordBot();

// client.on('message', (message) => {
//   if (message.content.startsWith(`${prefix}kick`)) {
//     const member = message.mentions.members.first();
//     member.kick().then((member) => {
//       message.channel.send(`:wave: ${member.displayName} has been successfully kicked :point_right: `);
//     }).catch(() => {
//       message.channel.send('Access Denied');
//     });
//   }
// });
//
