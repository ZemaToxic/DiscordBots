module.exports = {
	name: 'test',
	description: ' ',
	execute(client, options, message, args) {
		// Do command stuff here
		var serverRoles = message.guild.roles.sort((first, next) => first.position - next.position).map(r => `${r.name}`).reverse().join(', ');

		console.log(message.guild.roles);
		
		
		message.channel.send(`\`\`\` ${serverRoles} \`\`\``);
	}
};