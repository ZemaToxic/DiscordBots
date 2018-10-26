module.exports = {
	name: 'purge',
	description: 'Purge a channel of messages, Maximum of 100 messages to be purged at a time.',
	execute(client, options, message, args) {
		// Check if a user was specified
		const user = message.mentions.users.first();

		// Get the amount of messages to delete ( max 100 )
		const amount = parseInt(message.content.split(' ')[1]) ? parseInt(message.content.split(' ')[1]) : parseInt(message.content.split(' ')[2]);

		// If no amount and no user.
		if (!amount && !user) return message.reply('Please specify a user and amount, or just an amount of messages to purge!');
		// If no amount specified return.
		else if (!amount) return message.reply('Please specify an amount of messages to delete.');

		// Get the last (amount) of messages from the channel.
		message.channel.fetchMessages({
			limit: amount + 1,
		}).then((messages) => {
			//if a user is specifed then fetch their last (amount) of messaages.
			if (user) {
				const filterBy = user ? user.id : message.client.user.id;
				messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
			}
			// Delete the (amount) of messages.
			message.channel.bulkDelete(messages, true).catch(error => {
				console.log(error.stack);
				message.channel.send('there was an error purging messages');
			});
		});
	}
};