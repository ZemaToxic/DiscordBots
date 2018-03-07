//APP DETAILS
//Client ID: 365594524644409345
//Client Secret:
//yal1681lsrOPBI8-sGerGCe8bZ4-WSlw

//Authorize Link
//https://discordapp.com/oauth2/authorize?&client_id=365594524644409345&scope=bot&permissions=488488448

//Username: MistressZema#1309
//Token:
//MzY1NTk0NTI0NjQ0NDA5MzQ1.DLgmBA.mn7nBieG8UyByU_GHzmtk3M80pE

// Console Colour Code
var RESET_COLOR = '\x1b[0m';
var COLOR_RED = '\x1b[1m\x1b[31m';
var COLOR_GREEN = '\x1b[1m\x1b[32m';
var COLOR_CYAN = '\x1b[1m\x1b[36m';
var COLOR_YELLOW = '\x1b[1m\x1b[33m';

// Import the discord.js module
const Discord = require('discord.js');
const YTDL = require("ytdl-core");
const fs = require('fs')

// Create an instance of a Discord client
const client = new Discord.Client();
// Create a server empty Object
var servers = {};

// Catch Errors and ignore them for now 
process.on("uncaughtException", function (e) { return false; })

// Set Console window title
process.stdout.write("\033]0;Cunt-Discord\007");

// The token of your bot - https://discordapp.com/developers/applications/me
const token = 'MzY1NTk0NTI0NjQ0NDA5MzQ1.DLgmBA.mn7nBieG8UyByU_GHzmtk3M80pE';


// The ready event is vital, it means that your bot will only start reacting to information from Discord _after_ ready is emitted
client.on('ready', () => {
    console.log(COLOR_YELLOW, 'I am Connected!', RESET_COLOR);
});


// Create an event listener for new guild members
client.on('guildMemberAdd', member => {
    // Send the message to the guilds default channel (usually #general), mentioning the member
    //member.guild.defaultChannel.send(`Welcome to the server, ${member}!`);
});

const prefix = "&";

// Create an event listener for messages
client.on('message', message => {

    // Ignore all messages unless they start with 'prefix' (~)
    if (!message.content.startsWith(prefix)) return;

    // Remove the prefix and Do things based off the second Word.
    let command = message.content.split(" ")[0];
    command = command.slice(prefix.length);

    // Split the next few words and do things with them.
    let args = message.content.split(" ").slice(1);

    if (command === "say") {
        message.channel.send(args.join(" "));
    }

    if (command === "time") {
        try {
            let timeFile = require(`./commands/time.js`);
            timeFile.run(client, message, args);
        } catch (err) {
            console.error(err);
        }
        return;
    }

    //guild.roles



});

// Log our bot in
client.login(token);

