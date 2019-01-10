/**
 * Kick command
 *
 * @type {CommandSchema}
 */
module.exports = {
  name: 'kick',
  title: 'Kick user',
  args: true,
  usage: '@user [reason?]',
  async execute(message, args) {
    const taggedMember = message.mentions.members.first();
    const taggedUser = message.mentions.users.first();

    if (taggedMember === undefined) {
      return message.reply('You need to tag whomever you want to kick');
    }

    if (!message.member.hasPermission('KICK_MEMBERS')) {
      return message.reply('You do no have access to this command');
    }

    const response = [`${taggedUser.username} has been kicked`];
    const reason = (args.length > 1) ? args.slice(1).join(' ') : '';

    if (!taggedMember.kickable) {
      return message.reply('That person is not kickable');
    }

    if (reason !== '') {
      return taggedUser
        .send(`You where kicked from \`${message.guild}\`, reason given \`${reason}\``)
        .then(() => {
          return taggedMember.kick(reason).then(() => {
            response.push(`reason given \`${reason}\``);
            return message.channel.send(response.join(' '));
          }).catch((error) => {
            throw new Error(error);
          });
        }).catch((error) => {
          throw new Error(error);
        });
    }
    return taggedMember.kick().then(() => {
      return message.channel.send(response.join(' '));
    }).catch((error) => {
      throw new Error(error);
    });
  },
};
