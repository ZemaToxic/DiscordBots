module.exports = {
	name: 'ping',
	description: 'Ping~ Pong!',
	execute(message) {
		message.channel.send('Pong.');
	}
};