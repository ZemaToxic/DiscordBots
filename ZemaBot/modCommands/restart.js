module.exports = {
	name: 'test',
	description: 'Restarts the bot if something is being funky',
	execute(message, client) {

		client.destroy()
			.then(message.reply('Restarting the bot... BRB'))
			.catch(console.error);		

	}
};