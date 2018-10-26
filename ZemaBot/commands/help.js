module.exports = {
	name: 'help',
	description: 'List all of the commands or info about a specific command.',
	execute(client, options, message, args) {
		// Do command stuff here
		const data = [];
		const {
			commands
		} = message.client;

		// If no command is specified then return list of commands.
		if (!args.length) {
			data.push('Here\'s a list of all my commands: ');
			data.push(commands.map(command => command.name).join(', '));
			data.push(`\nYou can send \`${options.prefix}help [command name]\` to get info on a specific command!`);

			// Send the message in a DM if user DM's the bot.
			if (message.channel.type === 'dm') {
				return message.author.send(data, {split: true})
					.then(() => {
						if (message.channel.type === 'dm') return;
					})
					.catch(error => {
						// Error catching.
						console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
						message.reply('it seems like i cant\'t DM you!');
					});
			}
			// Else send it to the channel.
			else {
				message.channel.send(data, {
					split: true
				});
				return;
			}
		}
		// If a command is specified.
		const name = args[0]; /*.toLowerCase();*/

		const command = commands.get(name); /* \\ commads.find(c => c.aliases && c.aliases.includes(name)); */
		// If a command is specified make sure its valid.
		if (!command) {
			return message.reply('that\'s not a valid command!');
		}

		// Format the data.
		data.push(`**Name:** ${command.name}`);

		// If the command has Aliases.
		if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
		// If the command has a Description.
		if (command.description) data.push(`**Description:** ${command.description}`);
		// If the command has a Usage variable.
		if (command.usage) data.push(`**Usage:** ${options.prefix}${command.name} ${command.usage}`);
		// If the command has a cooldown.
		if (command.cooldown) data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

		// Send the help info for the specified command to the channel.
		message.channel.send(data, {
			split: true
		});
	}
};