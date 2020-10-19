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
const urlHandler = require('./utility/urlHandler')

// New collections of Commands
client.commands = new Discord.Collection();
client.modCommands = new Discord.Collection();
client.adminCommands = new Discord.Collection();
client.sillyStuff = new Discord.Collection();

let commandFiles, modCommandFiles, adminCommandFiles, sillyStuffFiles;

// Make a new const of all files in the commands folder which end in .js
commandFiles = fs.readdirSync('./includes/commands').filter(file => file.endsWith('.js'));
// Make a new const of all files in the modCommands folder which end in .js
modCommandFiles = fs.readdirSync('./includes/modCommands').filter(file => file.endsWith('.js'));
// Make a new const of all files in the adminFiles folder which end in .js
adminCommandFiles = fs.readdirSync('./includes/adminCommands').filter(file => file.endsWith('.js'));
// Make a new const of all files in the sillyStuff folder which end in .js
sillyStuffFiles = fs.readdirSync('./includes/sillyStuff').filter(file => file.endsWith('.js'));

// Iterate through and add them to the client.commands Collection.
for (const file of commandFiles) { const command = require(`./includes/commands/${file}`); client.commands.set(command.name, command); }
// Iterate through and add them to the client.modCommands Collection.
for (const file of modCommandFiles) { const modcommand = require(`./includes/modCommands/${file}`); client.modCommands.set(modcommand.name, modcommand); }
// Iterate through and add them to the client.adminCommands Collection.
for (const file of adminCommandFiles) { const admincommand = require(`./includes/adminCommands/${file}`); client.adminCommands.set(admincommand.name, admincommand); }
// Iterate through and add them to the client.sillyStuff Collection.
for (const file of sillyStuffFiles) { const sillycommand = require(`./includes/sillyStuff/${file}`); client.sillyStuff.set(sillycommand.name, sillycommand); }

// Set the Activity to what is saved.
function setActivity() { client.user.setActivity(options.Activity, { name: 'game', type: 0 }); }

// ---------- Event Handlers ----------

// Bot is Ready to communicate
client.on('ready', async () => {
	// Print to console that we have logged in.
	console.log(`Logged in as ${client.user.tag}!`);
	loadOptions(options);
	// Set the activity
	setActivity();
	// Make sure the activity is always there, by resetting it every 12 hours
	setInterval(setActivity, 43200); // 43200 -> 12 Hours
	client.settings = await urlHandler.fetchDatabase(client.guilds)
});

// Member Joins
client.on('guildMemberAdd', member => { eventHandler.memberAdd(client, client.settings, member); });
// Member leaves or is kicked
client.on('guildMemberRemove', member => { eventHandler.memberRemove(client, client.settings, member); });
// Client Name change / new roles
client.on('guildMemberUpdate', (oldMember, newMember) => { eventHandler.memberUpdate(client, client.settings, oldMember, newMember); });
// Member Banned
client.on('guildBanAdd', member => { eventHandler.banAdd(client, client.settings, member); });
// Message gets deleted
client.on('messageDelete', message => { eventHandler.messageDelete(client, client.settings, message); });
// Message edited
client.on('messageUpdate', (oldMessage, newMessage) => { eventHandler.messageUpdate(client, client.settings, oldMessage, newMessage); });
// Bulk Message deleted.
client.on('messageDeleteBulk', messages => { eventHandler.bulkDelete(client, client.settings, messages); });
// Client experiances an error
client.on('error', error => { eventHandler.errorHandler(client, client.settings, error); });

client.on('messageReactionAdd', (reaction, user) => {
	if(reaction.message.id == '743249306517241879') {
		if(reaction._emoji.name == 'KiwiNinja')
		{
			const guild = reaction.message.guild;
			const memberWhoReacted = guild.members.find(member => member.id === user.id);
			memberWhoReacted.addRole('442136610218180609');
		}
	}
});

client.on('messageReactionRemove', (reaction, user) => {
	if(reaction.message.id == '743249306517241879') {
		console.log('Correct message reacted to')
		if(reaction._emoji.name == 'KiwiNinja')
		{
			const guild = reaction.message.guild;
			const memberWhoReacted = guild.members.find(member => member.id === user.id);
			memberWhoReacted.removeRole('442136610218180609');
		}
	}
});

client.on('raw', packet => {
    // We don't want this to run on unrelated packets
    if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
    // Grab the channel to check the message from
    const channel = client.channels.get(packet.d.channel_id);
    // There's no need to emit if the message is cached, because the event will fire anyway for that
    if (channel.messages.has(packet.d.message_id)) return;
    // Since we have confirmed the message is not cached, let's fetch it
    channel.fetchMessage(packet.d.message_id).then(message => {
        // Emojis can have identifiers of name:id format, so we have to account for that case as well
        const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
        // This gives us the reaction we need to emit the event properly, in top of the message object
        const reaction = message.reactions.get(emoji);
        // Adds the currently reacting user to the reaction's users collection.
        if (reaction) reaction.users.set(packet.d.user_id, client.users.get(packet.d.user_id));
        // Check which type of event it is before emitting
        if (packet.t === 'MESSAGE_REACTION_ADD') {
            client.emit('messageReactionAdd', reaction, client.users.get(packet.d.user_id));
        }
        if (packet.t === 'MESSAGE_REACTION_REMOVE') {
            client.emit('messageReactionRemove', reaction, client.users.get(packet.d.user_id));
        }
    });
});

// Client recieves a message
client.on('message', message => {
	if (message.channel.id === client.settings.ignoreChannel) return;
	if (message.author.bot) return;

	const guildConf = client.settings[message.guild.id];

	if (guildConf[0].sillyStuff == 'true') { let stringToTest = message.content.toLowerCase(); if (stringToTest.match(/(^| )heck($|.)/g)) { client.sillyStuff.get('heck').execute(message); } }
	
	// Return if message does not start with the prefix.
	if (message.content.indexOf(guildConf[0].prefix) !== 0) return;
	
	// Split the message up then remove the prefix
	const args = message.content.split(/\s+/g);
	const commands = args.shift().slice(guildConf[0].prefix.length);
	
	// Check if its an Admin command.
	if (client.adminCommands.get(commands) && (message.author.id === clientData.OwnerID)) { client.adminCommands.get(commands).execute(client, guildConf[0], message, args); return; }
	// Check if its in a Mod command.
	/* 
	// Remove mod commands temporarily until the logic for connecting to the Database is implemented 
	if (client.modCommands.get(commands) && (message.member.roles.has(guildConf[0].modRole))) { client.modCommands.get(commands).execute(client, guildConf[0], message, args); return; }
	*/
	// Check if its a normal command.
	if (client.commands.get(commands)) { client.commands.get(commands).execute(client, guildConf[0], message, args); return; }
	// Else error out.
	else { message.reply('that is not a command use ' + guildConf[0].prefix + 'help, to see the list of commands.'); return; }
});

// Log the bot in.
client.login(clientData.Token);

// Process listeners 
process.on('exit', (code) => { console.log('Bot exited with code: ' + code); }); 
process.on('unhandledRejection', err => { console.error('Unhandled Rejection: \n', err); });
process.on('error', err => { console.error('Error happened: \n ', err); });