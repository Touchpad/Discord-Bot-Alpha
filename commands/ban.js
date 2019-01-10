const stringTimeToMS = (stringTime) => {
  const duration = stringTime.substr(0, stringTime.length - 1);
  switch (stringTime.substr(stringTime.length - 1)) {
    case 'y': // 31556952000 = 1 year in milliseconds
      return {
        timeout: duration * 31556952000,
        type: duration > 1 ? 'years' : 'year',
        duration,
      };
    case 'M': // 2592000000 = 1 month in milliseconds
      return {
        timeout: duration * 2592000000,
        type: duration > 1 ? 'months' : 'month',
        duration,
      };
    case 'd': // 86400000 = 1 day in milliseconds
      return {
        timeout: duration * 86400000,
        type: duration > 1 ? 'days' : 'day',
        duration,
      };
    case 'h': // 3600000 = 1 hour in milliseconds
      return {
        timeout: duration * 3600000,
        type: duration > 1 ? 'hours' : 'hour',
        duration,
      };
    case 'm': // 60000 = 1 minute in milliseconds
      return {
        timeout: duration * 60000,
        type: duration > 1 ? 'minutes' : 'minute',
        duration,
      };
    case 's': // 1000 = 1 second in milliseconds
      return {
        timeout: duration * 1000,
        type: duration > 1 ? 'seconds' : 'second',
        duration,
      };
  }
};

const revokeTimedBan = async (message, options) => {
  const { user, timeout } = options;
  new setTimeout(() => {
    return message.guild
      .unban(user, 'Temporary ban duration has run out')
      .then(() => (
        message.channel.send(`${user.username} has been unbanned, temporary ban duration has run out`)
      ))
      .catch(console.error);
  }, timeout);
};

/**
 * Ban command
 *
 * @type {CommandSchema}
 */
module.exports = {
  name: 'ban',
  title: 'Ban user',
  args: true,
  usage: '@user [duration?] [reason?]',
  async execute(message, args) {
    const taggedMember = message.mentions.members.first();
    const taggedUser = message.mentions.users.first();

    if (taggedMember === undefined) {
      return message.reply('You need to tag whomever you want to ban');
    }

    if (!message.member.hasPermission('BAN_MEMBERS')) {
      return message.reply('You do no have access to this command');
    }

    if (!taggedMember.bannable) {
      return message.reply('That person is not bannable');
    }

    const response = [];

    let sliceOffset = 1;
    let timeSet = {
      timeout: 0,
      type: null,
      duration: 0,
    };

    if (/^\d+[yMdhms]$/.exec(args[1].trim())) {
      sliceOffset += 1;

      timeSet = stringTimeToMS(args[1]);
      response.push(`for \`${timeSet.duration} ${timeSet.type}\``);

      revokeTimedBan(message, { user: taggedUser, timeout: timeSet.timeout })
        .catch(console.error);
    }

    if (args.length > sliceOffset) {
      const reason = args.slice(sliceOffset).join(' ');
      response.push(`reason given \`${reason}\``);

      return taggedUser
        .send([`You where banned from \`${message.guild}\``, ...response].join(' '))
        .then(() => {
          return taggedMember.ban(reason)
            .then(() => {
              return message.channel
                .send([`\`${taggedUser.username}\` has been banned`, ...response].join(' '));
            })
            .catch(console.error);
        })
        .catch(console.error);
    }

    return taggedMember.ban()
      .then(() => {
        return message.channel.send(response.join(' '));
      })
      .catch(console.error);
  },
};
