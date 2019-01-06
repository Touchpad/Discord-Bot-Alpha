/**
 * Ping command
 *
 * @type {CommandSchema}
 */
module.exports = {
  name: 'ping',
  description: 'Ping!',
  cd: 5,
  execute(message) {
    message.channel.send('Pong.');
  },
};
