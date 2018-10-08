module.exports = {
    name: 'ping',
    description: 'Ping~ Pong!',
    execute(message, args) {
      message.channel.send('Pong.');
    }
};
