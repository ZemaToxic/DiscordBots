module.exports = {
	name: "modHelp",
	description: "List all of the modCommands or info about a specific command.",
	execute(client, guildConf, message, args) {
		// Do command stuff here
		const data = [];
		// If no modCommand is specified then return list of modCommands.
		if (!args.length) {
			data.push("Here's a list of all my modCommands: ");
			data.push(client.modCommands.map(modCommand => modCommand.name).join(", "));
			data.push(
				`\nYou can send \`${guildConf.prefix}modHelp [modCommand name]\` to get info on a specific modCommand!`);

			message.channel.send(data,
				{
					split: true
				});
			return;
		}

		// If a modCommand is specified.
		const name = args[0]; /*.toLowerCase();*/
		const modCommand = client.modCommands.get(name); /* \\ commads.find(c => c.aliases && c.aliases.includes(name)); */

		// If a modCommand is specified make sure its valid.
		if (!modCommand) {
			return message.reply("that's not a valid modCommand!");
		}

		// Format the data.
		data.push(`**Name:** ${modCommand.name}`);

		// If the modCommand has Aliases.
		if (modCommand.aliases) data.push(`**Aliases:** ${modCommand.aliases.join(", ")}`);
		// If the modCommand has a Description.
		if (modCommand.description) data.push(`**Description:** ${modCommand.description}`);
		// If the modCommand has a Usage variable.
		if (modCommand.usage) data.push(`**Usage:** ${guildConf.prefix}${modCommand.name} ${modCommand.usage}`);
		// If the modCommand has a cooldown.
		if (modCommand.cooldown) data.push(`**Cooldown:** ${modCommand.cooldown || 3} second(s)`);

		// Send the help info for the specified modCommand to the channel.
		message.channel.send(data,
			{
				split: true
			});
	}
};