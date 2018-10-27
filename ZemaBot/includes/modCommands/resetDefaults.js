module.exports = {
	name: 'resetDefaults',
	description: 'Reset the bot prefix and Activity to defualts.',
	execute(client, options, message, args) {
		// Reset the default settings exist.
		if (options.prefix) {
			options.prefix = '~';
		}
		if (options.Activity) {
			options.Activity = 'Debugging Code';
		}

		// Set the activity back
		client.user.setActivity(options.Activity, {
			name: 'game',
			type: 0
		});

		message.channel.send('The Bot\'s defualts have been reset. The bots prefix is now: ' + options.prefix + ' ');
		saveOptions(options);
	}
};