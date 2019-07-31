// Bot Info
const clientData = require('./includes/jsonFiles/ClientData.json');

// Utility Imports
const eventHandler = require('./utility/eventHandler.js');
require('./utility/utils.js')();

const path = require('path');
// Change the Directory incase of spawned as child
process.chdir(__dirname);
process.title = `Bot/Discord/${path.basename(__dirname)}`;

// Imports and Declarations.
let options = {}; // -- Used for prefix and activity etc.
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();

const moment = require('moment');
require('moment-duration-format');

// Enmap setup 
const Enmap = require('enmap');

client.settings = new Enmap({
	name: 'settings',
	fetchAll: false,
	autoFetch: true,
	cloneLevel: 'deep'
});

// Just setting up a default configuration object here, to have somethign to insert.
const defaultSettings = {
	prefix: '!',
	modLogChannel: 'mod-log',
	modRole: 'Moderator',
	adminRole: 'Administrator',
	ignoreChannel: 'IgnoreThis',
	sillyStuff: 'false'
};

// New collections of Commands
client.commands = new Discord.Collection();
client.modCommands = new Discord.Collection();
client.adminCommands = new Discord.Collection();
client.sillyStuff = new Discord.Collection();

var commandFiles, modCommandFiles, adminCommandFiles, sillyStuffFiles;

// Make a new const of all files in the commands folder which end in .js
commandFiles = fs.readdirSync('./includes/commands').filter(file => file.endsWith('.js'));
// Make a new const of all files in the modCommands folder which end in .js
modCommandFiles = fs.readdirSync('./includes/modCommands').filter(file => file.endsWith('.js'));
// Make a new const of all files in the adminFiles folder which end in .js
adminCommandFiles = fs.readdirSync('./includes/adminCommands').filter(file => file.endsWith('.js'));
// Make a new const of all files in the sillyStuff folder which end in .js
sillyStuffFiles = fs.readdirSync('./includes/sillyStuff').filter(file => file.endsWith('.js'));

// Iterate through and add them to the client.commands Collection.
for (const file of commandFiles) {
	const command = require(`./includes/commands/${file}`);
	client.commands.set(command.name, command);
}
// Iterate through and add them to the client.modCommands Collection.
for (const file of modCommandFiles) {
	const modcommand = require(`./includes/modCommands/${file}`);
	client.modCommands.set(modcommand.name, modcommand);
}
// Iterate through and add them to the client.adminCommands Collection.
for (const file of adminCommandFiles) {
	const admincommand = require(`./includes/adminCommands/${file}`);
	client.adminCommands.set(admincommand.name, admincommand);
}
// Iterate through and add them to the client.sillyStuff Collection.
for (const file of sillyStuffFiles) {
	const sillycommand = require(`./includes/sillyStuff/${file}`);
	client.sillyStuff.set(sillycommand.name, sillycommand);
}

function _setActivity() {
	// Set the Activity to what is saved.
	client.user.setActivity(options.Activity,
		{
			name: 'game',
			type: 0
		});
}

// ---------- Event Handlers ----------

// Bot is Ready to communicate
client.on('ready', () => {
	// Print to console that we have logged in.
	console.log(`Logged in as ${client.user.tag}!`);
	loadOptions(options);
	setInterval(_setActivity(), 43200); // 43200 -> 12 Hours
});

// Member Joins
client.on('guildMemberAdd', member => {
	eventHandler.memberAdd(client, client.settings, member);
});

// Member leaves or is kicked
client.on('guildMemberRemove', member => {
	eventHandler.memberRemove(client, client.settings, member);
});

// Client Name change / new roles
client.on('guildMemberUpdate', (oldMember, newMember) => {
	eventHandler.memberUpdate(client, client.settings, oldMember, newMember);
});

// Member Banned
client.on('guildBanAdd', member => {
	eventHandler.banAdd(client, client.settings, member);
});

// Message gets deleted
client.on('messageDelete', message => {
	eventHandler.messageDelete(client, client.settings, message);
});

// Message edited
client.on('messageUpdate', (oldMessage, newMessage) => {
	eventHandler.messageUpdate(client, client.settings, oldMessage, newMessage);
});

// Bulk Message deleted.f
client.on('messageDeleteBulk', messages => {
	eventHandler.bulkDelete(client, client.settings, messages);
});

// Client experiances an error
client.on('error', error => {
	eventHandler.errorHandler(client, client.settings, error);
});

// Client recieves a message
client.on('message', message => {

	if (message.channel.id === client.settings.ignoreChannel) return;
	if (message.author.bot) return;

	const guildConf = client.settings.ensure(message.guild.id, defaultSettings);

	if (guildConf.sillyStuff == 'true') {
		var stringToTest = message.content.toLowerCase();

		if (stringToTest.match(/(^| )heck($|.)/g)) {
			client.sillyStuff.get('heck').execute(message);
		}
	}



	// Return if message does not start with the prefix.
	if (message.content.indexOf(guildConf.prefix) !== 0) return;

	// Split the message up then remove the prefix
	const args = message.content.split(/\s+/g);
	const commands = args.shift().slice(guildConf.prefix.length);

	console.log(commands);
	console.log(client.modCommands);
	console.log(client.modCommands.get(commands));
	console.log(message.member.roles.has(guildConf.modRole));

	// Check if its an Admin command.
	if (client.adminCommands.get(commands) && (message.author.id === clientData.OwnerID)) {
		client.adminCommands.get(commands).execute(client, guildConf, message, args);
		return;
	}
	// Check if its in a Mod command.
	if (client.modCommands.get(commands) && (message.member.roles.has(guildConf.modRole))) {
		client.modCommands.get(commands).execute(client, guildConf, message, args);
		return;
	}
	// Check if its a normal command.
	if (client.commands.get(commands)) {
		client.commands.get(commands).execute(client, guildConf, message, args);
		return;
	}
	// Else error out.
	else {
		message.reply('that is not a command use ' + guildConf.prefix + 'help, to see the list of commands.');
		return;
	}
});

// Log the bot in.
client.login(clientData.Token);

// Process listeners 
process.on('exit', (code) => {
	console.log('Bot exited with code: ' + code);
});

process.on('unhandledRejection', err => {
	console.error('Unhandled Rejection: \n', err);
});

process.on('error', err => {
	console.error('Error happened: \n ', err);
});

process.on('message', (m) => {
	let response;
	let duration = moment.duration(client.uptime).format(' D [days], H [hrs], m [mins], s [secs]');
	let ZemaBot = client.commands.map(command => ({ name: command.name, description: command.description }));
	let ZemaBot_Info = {
		Name: client.user.tag,
		Users: client.users.size,
		MemoryUsage: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + ' MB',
		BotUptime: duration,
		Servers: client.guilds.size,
		Channels: client.channels.size,
		DiscordjsVersion: Discord.version,
		NodejsVersion: process.version
	};
	switch (m) {
		case 'botinfo': response = { ZemaBot_Info };
			break;
		case 'commands': response = { ZemaBot };
			break;
		default: response = { response: 'is not a valid api route' };
	}
	process.send(response);
});