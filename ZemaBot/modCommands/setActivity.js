module.exports = {
	name: 'setActivity',
	description: 'Set the text for what the Bot is doing.',
	execute(client, options, message, args) {
		// Join the args together on space.
		const newActivity = args.join(' ');
		options.Activity = newActivity;
		// Set the new Activity
		client.user.setActivity(options.Activity, {
			name: 'game',
			type: 0
		});
		// Tell the client the Activity has been updated.
		message.channel.send('The Bot\'s Activity has been set');
		// Save changes.
		saveOptions(options);
	}
};