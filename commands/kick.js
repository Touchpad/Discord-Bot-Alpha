/**
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

    if (!message.member.hasPermission('KICK_MEMBERS')) {
      return message.reply('I\'m sorry you do no have access to this command');
    }

    const response = [`${taggedUser.username} has been kicked`];
    const reason = (args.length > 1) ? args.slice(1).join(' ') : '';

    if (taggedMember.kickable) {
      if (reason !== '') {
        return taggedUser
          .send(`You where kicked from \`${message.guild}\`, reason given \`${reason}\``)
          .then(() => {
            taggedMember.kick(reason).then(() => {
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
    }
    return message.channel.send('That person is not kickable');
  },
};
