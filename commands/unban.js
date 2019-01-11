const { prefix } = require('../config.json');
/**
 * Revoke ban command
 *
 * @type {CommandSchema}
 */
module.exports = {
  name: 'unban',
  title: 'Revoke bans',
  args: true,
  usage: '[ID|@user] [reason?]',
  async execute(message, args) {

    if (!message.member.hasPermission('BAN_MEMBERS')) {
      return message.reply('You do no have access to this command');
    }

    if (args[0] === 'list') {
      return message.guild.fetchBans()
        .then((bans) => {
          console.log(bans);
          if (bans.size === 0) {
            return message.channel.send('Currently there are no bans in this guild');
          }
          const response = ['Current bans are as follows:'];
          bans.forEach((ban) => {
            response.push(`ID: \`${ban.id}\`  |  Member: <@${ban.id}>`)
          });
          return message.channel.send(response.join('\n'));
        })
        .catch(console.error);
    }

    let userID = '';
    if (/^<@(\d+?)>$/.test(args[0])) {
      userID = /^<@(\d+?)>$/.exec(args[0])[1];
    } else if (/^\d+$/.test(args[0])) {
      userID = args[0];
    }

    if (userID === '') {
      return message.channel.send(`Unable to find that user in the ban-list try \`${prefix}unban list\` to see all banned users`)
    }
    message.guild.unban(userID)
      .then((resp) => {
        return message.channel.send(`\`${resp.username}\` has been unbanned`);
      })
      .catch(console.error);
  }
};



// guild.fetchBans()
//   .then(bans => console.log(`This guild has ${bans.size} bans`))
//   .catch(console.error);
