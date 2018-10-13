module.exports = {
	name: 'test',
	description: ' ',
	execute(message, args, options, client) {
		// Do command stuff here
		var serverRoles = message.guild.roles.sort((first, next) => first.position - next.position).map(r => `${r.name}`).reverse().join(', ');

		console.log(message.guild.roles);
		
		
		message.channel.send(`\`\`\` ${serverRoles} \`\`\``);
	}
};