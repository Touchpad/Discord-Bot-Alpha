const Discord = require('discord.js');
const { token } = require('./config.json');

const client = new Discord.Client();

client.on('message', (message) => {
  if (message.content.startsWith('/kick')) {
    const member = message.mentions.members.first();
    member.kick().then((member) => {
      message.channel.send(`:wave: ${member.displayName} has been successfully kicked :point_right: `);
    }).catch(() => {
      message.channel.send('Access Denied');
    });
  }
});

client.login('***');
