const clientData = require("./../jsonFiles/ClientData.json");
const util = require('util');
const Discord = require("discord.js");

function clean(text) {
	if (typeof (text) === "string") {
		return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
	}
	else {
		return text;
	}
}

module.exports = {
	name: "eval",
	description: "NodeJs Eval command, only works for @ZemaToxic",
	async execute(client, guildConf, message, args) {
		// Do command stuff here
		if (message.author.id !== clientData.OwnerID) {
			return message.channel.send("You aren't allowed to do that.");
		}
		try {
			let evaled;
			let type;
			let color;
			const start = process.hrtime();
			try {
                console.log('1')
				evaled = eval(args.join(' '));
				if (evaled instanceof Promise) {
                console.log('2')
                    
                    evaled = await evaled;
					type = `Promise<${evaled != null ? evaled.constructor.name : 'None'}>`;
				}
				color = 3066993;
			}
			catch (err) {
				evaled = err;
				color = 15158332;
			}
			const end = process.hrtime(start);
			if (type === undefined) type = evaled != null ? evaled.constructor.name : 'None';
			const output = util.inspect(evaled);
            console.log('4')            
			message.channel.send({
				embed: {
					title: 'Output',
					description: `\`\`\`js\n${output}\n\`\`\``,
					color,
					footer: {
						text: `Type: ${type} | Execution Time: ${end[1] / 1000000}`,
						icon_url: 'https://avatars1.githubusercontent.com/u/9950313?s=400&v=4'
					}
				}
			})
		}
		catch (err) {
			message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
		}
	}
}