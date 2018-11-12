// Bot Info
const clientData = require('./includes/jsonFiles/ClientData.json');

const dbManager = require('./dbManager.js');

// Utility Imports
const eventHandler = require('./utility/eventHandler.js');
require('./utility/utils.js')();

// Imports and Declarations.
let options = {}; // -- Used for prefix and activity etc.
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();

// New collections of Commands
client.commands = new Discord.Collection();
client.modCommands = new Discord.Collection();
client.adminCommands = new Discord.Collection();
client.sillyStuff = new Discord.Collection();

var commandFiles;
var modCommandFiles;
var adminCommandFiles;
var sillyStuffFiles;

// Check if spawned as a child, if so adjust the dir
if (process.env.Child) {
	console.log('Spawned as a child');
	// Make a new const of all files in the commands folder which end in .js
	commandFiles = fs.readdirSync('./ZemaBot/includes/commands').filter(file => file.endsWith('.js'));
	// Make a new const of all files in the modCommands folder which end in .js
	modCommandFiles = fs.readdirSync('./ZemaBot/includes/modCommands').filter(file => file.endsWith('.js'));
	// Make a new const of all files in the adminCommands folder which end in .js
	adminCommandFiles = fs.readdirSync('./ZemaBot/includes/adminCommands').filter(file => file.endsWith('.js'));
	// Make a new const of all files in the sillyStuff folder which end in .js
	sillyStuffFiles = fs.readdirSync('./ZemaBot/includes/sillyStuff').filter(file => file.endsWith('.js'));
} else {
	// Make a new const of all files in the commands folder which end in .js
	commandFiles = fs.readdirSync('./includes/commands').filter(file => file.endsWith('.js'));
	// Make a new const of all files in the modCommands folder which end in .js
	modCommandFiles = fs.readdirSync('./includes/modCommands').filter(file => file.endsWith('.js'));
	// Make a new const of all files in the adminFiles folder which end in .js
	adminCommandFiles = fs.readdirSync('./includes/adminCommands').filter(file => file.endsWith('.js'));
	// Make a new const of all files in the sillyStuff folder which end in .js
	sillyStuffFiles = fs.readdirSync('./includes/sillyStuff').filter(file => file.endsWith('.js'));
}

// Iterate through and add them to the client.commands Collection.
for (const file of commandFiles) {
	const command = require(`./includes/commands/${file}`);
	client.commands.set(command.name, command);
}
// Iterate through and add them to the client.modCommands Collection.
for (const file of modCommandFiles) {
	const command = require(`./includes/modCommands/${file}`);
	client.modCommands.set(command.name, command);
}
// Iterate through and add them to the client.adminCommands Collection.
for (const file of adminCommandFiles) {
	const command = require(`./includes/adminCommands/${file}`);
	client.adminCommands.set(command.name, command);
}
// Iterate through and add them to the client.sillyStuff Collection.
for (const file of sillyStuffFiles) {
	const command = require(`./includes/sillyStuff/${file}`);
	client.sillyStuff.set(command.name, command);
}

// ---------- Event Handlers ----------

// Bot is Ready to communicate
client.on('ready', () => {
	// Load the options.
	loadOptions(options);
	// Check if the options loaded.
	if (Object.keys(options).length <= 1) {
		// Initalise defualt values if they arent there.
		initValues(options);
		// Save the changes.
		saveOptions(options);
	}
	// Print to console that we have logged in.
	console.log(`Logged in as ${client.user.tag}!`);
	// Set the Activity to what is saved.
	client.user.setActivity(options.Activity, {
		name: 'game',
		type: 0
	});
});

// Member Joins
client.on('guildMemberAdd', member => {
	eventHandler.memberAdd(client, options, member);
});

// Member leaves or is kicked
client.on('guildMemberRemove', member => {
	eventHandler.memberRemove(client, options, member);
});

// Client Name change / new roles
client.on('guildMemberUpdate', (oldMember, newMember) => {
	eventHandler.memberUpdate(client, options, oldMember, newMember);
});

// Member Banned
client.on('guildBanAdd', member => {
	eventHandler.banAdd(client, options, member);
});

// Message gets deleted
client.on('messageDelete', message => {
	eventHandler.messageDelete(client, options, message);
});

// Message edited
client.on('messageUpdate', (oldMessage, newMessage) => {
	eventHandler.messageUpdate(client, options, oldMessage, newMessage);
});

// Bulk Message deleted.f
client.on('messageDeleteBulk', messages => {
	eventHandler.bulkDelete(client, options, messages);
});

// Client experiances an error
client.on('error', error => {
	eventHandler.errorHandler(client, options, error);
});

// Client recieves a message
client.on('message', message => {

	//console.log(message);

	if (message.channel.id === options.ignoreChannel) return;
	if (message.author.bot) return;

	var stringToTest = message.content.toLowerCase();

	if (stringToTest.match(/(^| )heck($|.)/g)) {
		client.sillyStuff.get('heck').heck(message);
	}
	
	// Return if message does not start with the prefix.
	if (!message.content.startsWith(options.prefix)) return;
	
	// Split the message up then remove the prefix
	let commands = message.content.split(' ')[0];
	commands = commands.slice(options.prefix.length);
	
	// Split the remaining message into 'args'
	let args = message.content.split(' ').slice(1);
	
	// Check if the command is in the commands or modCommands object.
	if (!client.commands.has(commands) && !client.modCommands.has(commands) && !client.adminCommands.has(commands)) {
		message.reply('that is not a command use ' + options.prefix + 'help, to see the list of commands.');
		return;
	}
	// Check if its an Admin command.
	else if(client.adminCommands.get(commands) && (message.author.id === clientData.OwnerID)) {
		client.adminCommands.get(commands).execute(client,options,message,args);
		return;
	}
	// Check if its in a Mod command.
	else if (client.modCommands.get(commands) && (message.member.roles.has(options.modRole) || (message.guild.owner.user.username === message.author.username))) {
		client.modCommands.get(commands).execute(client, options, message, args);
		return;
	}
	// Check if its a normal command.
	else if (client.commands.get(commands)) {
		client.commands.get(commands).execute(client, options, message, args);
		return;
	}
	// Else error out.
	else {
		message.reply('either there was an error, or you dont have permission to use that command.');
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