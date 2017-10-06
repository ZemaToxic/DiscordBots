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

// The token of your bot - https://discordapp.com/developers/applications/me
const token = 'MzY1NTk0NTI0NjQ0NDA5MzQ1.DLgmBA.mn7nBieG8UyByU_GHzmtk3M80pE';


// The ready event is vital, it means that your bot will only start reacting to information from Discord _after_ ready is emitted
client.on('ready', () => {
    console.log(COLOR_YELLOW, 'I am Connected!', RESET_COLOR);
});


// Create an event listener for new guild members
client.on('guildMemberAdd', member => {
    // Send the message to the guilds default channel (usually #general), mentioning the member
    member.guild.defaultChannel.send(`Welcome to the server, ${member}!`);
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

    if (command === "embed") {
        message.channel.send({
            embed: {
                color: 3447003,
                author: {
                    name: client.user.username,
                    icon_url: client.user.avatarURL
                },
                title: 'This is an embed',
                url: 'http://google.com',
                description: 'This is a test embed to showcase what they look like and what they can do.',
                fields: [{
                    name: 'Fields',
                    value: 'They can have different fields with small headlines.'
                },
                {
                    name: 'Masked links',
                    value: 'You can put [masked links](http://google.com) inside of rich embeds.'
                },
                {
                    name: 'Markdown',
                    value: 'You can put all the *usual* **__Markdown__** inside of them.'
                }
                ],
                timestamp: new Date(),
                footer: {
                    icon_url: client.user.avatarURL,
                    text: '© Example'
                }
            }
        });
    }

    if (command === "richembed") {
        const embed = new Discord.RichEmbed()
            .setTitle('This is your title, it can hold 256 characters')
            .setAuthor('Author Name', 'https://i.imgur.com/lm8s41J.png')
            //
            //Alternatively, use '#00AE86', [0, 174, 134] or an integer number.
            //
            .setColor(0x00AE86)
            .setDescription('This is the main body of text, it can hold 2048 characters.')
            .setFooter('This is the footer text, it can hold 2048 characters', 'http://i.imgur.com/w1vhFSR.png')
            .setImage('http://i.imgur.com/yVpymuV.png')
            .setThumbnail('http://i.imgur.com/p2qNFag.png')
            //
            //Takes a Date object, defaults to current date.
            //
            .setTimestamp()
            .setURL('https://discord.js.org/#/docs/main/indev/class/RichEmbed')
            .addField('This is a field title, it can hold 256 characters',
            'This is a field value, it can hold 2048 characters.')
            //
            //Inline fields may not display as inline if the thumbnail and/or image is too //big.
            //
            .addField('Inline Field', 'They can also be inline.', true)
            //
            //Blank field, useful to create some space.
            //
            .addBlankField(true)
            .addField('Inline Field 3', 'You can have a maximum of 25 fields.', true);

        message.channel.send({ embed });
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

});

// Log our bot in
client.login(token);

