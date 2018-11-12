module.exports = {
	name: 'latency',
	description: '',
	execute(client, options, message, args) {

		var pings = [];

		client.pings.forEach(element => {
			pings.push(element);
		});

		console.log(client.pings);
		console.log(pings);

		return message.channel.send(`\`\`\`${pings}\`\`\``);

	}
};