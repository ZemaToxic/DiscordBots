module.exports = {
	name: 'latency',
	description: '',
	execute(client, options, message, args) {

		var pings = [];

		client.pings.forEach(element => {
			pings.push(' ' + element);
		});

		return message.channel.send(`\`\`\`xl\n${pings}\`\`\``);

	}
};