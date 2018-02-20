// Console Colour Code
var RESET_COLOR = '\x1b[0m';
var COLOR_RED = '\x1b[1m\x1b[31m';
var COLOR_GREEN = '\x1b[1m\x1b[32m';
var COLOR_CYAN = '\x1b[1m\x1b[36m';
var COLOR_YELLOW = '\x1b[1m\x1b[33m';

// Import the discord.js module
const Discord = require('discord.js');
const fs = require('fs')

// Create an instance of a Discord client
const client = new Discord.Client();
// Create a server empty Object
var servers = {};

// Catch Errors and ignore them for now 
process.on("uncaughtException", function (e) { return false; })


// -------- Options ---------
const loadOptions = (options) => {
    try {
        const optionsJson = fs.readFileSync('./options.json')
        const optionsFromFile = JSON.parse(optionsJson)
        
        // merging default commands with added commands
        return Object.assign(optionsFromFile, options)
    } catch (err) {
        console.log(err)
        // file doesn't exist, returning default commands
        return options
    }
}

// -------- Quotes ----------
const saveQuotes = (quote) => {
    fs.writeFile('./quotes.json', JSON.stringify(quote), (err) => {
        if (err) {
            return console.log(err)
        }

        console.log('Quote has been saved')
    })
}
const loadQuotes = (quote) => {
    try {
        const quotesJson = fs.readFileSync('./quotes.json')
        const quotesFromFile = JSON.parse(quotesJson)

        // merging default commands with added commands
        return Object.assign(quotesFromFile, quote)
    } catch (err) {
        // file doesn't exist, returning default commands
        return quote
    }
}

// The ready event is vital, it means that your bot will only 
// start reacting to information from Discord _after_ ready is emitted
client.on('ready', () => {
    console.log(COLOR_YELLOW, 'I am Connected!', RESET_COLOR);
});

// Member Joins
client.on('guildMemberAdd', member => {
    // Send the message to the guilds default channel (usually #general), mentioning the member
    member.guild.defaultChannel.send(`Welcome to the server, ${member}!`);

    // 402404101713035264 logs Channel ID
    client.channels.get('402404101713035264').send({
        embed: {
            color: 3464001,
            fields: [{
                name: 'User has Joined ' + `${member.user.id}`,
                value: 'User joined: ' + `${member}` + " their username is: " + `${member.user.username}`
            }],
            timestamp: new Date(),
            footer: {
                text: member.user.username
            }
        }
    });
});

// Member leaves or is kicked
client.on('guildMemberRemove', member => {

    client.channels.get('402404101713035264').send({
        embed: {
            color: 16711680,
            fields: [{
                name: 'User has Bitched out ' + `${member.user.id}`,
                value: 'User has bitched out ' + `${member}` + " their username is: " + `${member.user.username}`
            }],
            timestamp: new Date(),
            footer: {
                text: member.user.username
            }
        }
    });
})

// Member Banned
client.on('guildBanAdd', member => {

    client.channels.get('402404101713035264').send({
        embed: {
            color: 16716947,
            fields: [{
                name: 'User was banned.',
                value: `${member}`
            }],
            timestamp: new Date(),
            footer: {
                text: member.author
            }
        }
    });
    console.log(member)

})

const prefix = "~";

// Used for Quote JSON
let quote = []
let botConfig = []

var preventLoop = false;

quote = loadQuotes(quote)
botConfig = loadOptions(botConfig)

// Create an event listener for messages
client.on('message', message => {

    // Prevent it looping from reading messages it sends
    if (preventLoop == true) {
        if (message.author.username == 'ZemaBot') return;
    }
    
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

    // Make sure the next two words after add are ints, and then add them together.
    if (command === "add") {
        let num1 = parseInt(args[0]);
        let num2 = parseInt(args[1]);

        message.channel.send(num1 + num2);
    }

    // If the message is "ping"
    if (command === 'ping') {
        // Send "pong" to the same channel
        message.channel.send('pong');
    }

    // Toggle Looping.
    if (command === 'looptoggle') {
        if (preventLoop == true)
        {
            preventLoop = false
        }
        else {
            preventLoop = true;
        }
        message.channel.send({
            embed: {
                color: 3464001,
                fields: [{
                    name: 'Loop prevention',
                    value: 'Loop prevention is currently set to ' + preventLoop
                }],
                footer: {
                    text: "Requested by " + message.author.username
                }
            }
        })
    }

    // Rich Embed stuff.
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

    if (command === "testquote") {
        let args = message.content.split(' ').slice(1);

        try {
            let quoteFile = require(`./commands/swears.js`);
            quoteFile.run(client, message, args);
        } catch (err) {
            console.error(err);
        }
        return;
    }

    // Handle Swear commands.
    if (command === "swears") {
        let args = message.content.split(' ').slice(1);

        try {
            let swearFile = require(`./commands/swears.js`);
            swearFile.run(client, message, args/*, swearAmount*/);
        } catch (err) {
            console.error(err);
        }
        return;
    }

    // Return User Information.
    if (command === "user")
    {
        message.channel.send(`Your Username: ${message.author.username}\nYour ID: ${message.author.id}\nYour Connections:  ${message.author.conenctions}`);

        var _Id = message.author.id

        message.guild.members.get(_Id).user.fetchProfile().then(p => { console.log(p.connections) })
    }
});

// Log our bot in
client.login(botConfig['token']);



// Read through all messages for specific words
// i.e Cunt, Slut, Bitch, Fuck

// Auto run 
// Make auto count = swearAmount

/*
        try {
            let quoteFile = require(`./commands/swears.js`);
            quoteFile.run(client, message, args, swearAmount);
        } catch (err) {
            console.error(err);
        }
        return;
*/

// Return count of swears






//// Emitted whenever a guild member changes - i.e. new role, removed role, nickname.
//client.on('guildMemberUpdate', member => {

//    console.log(oldMember, newMember);

//    client.channels.get('402404101713035264').send({
//        embed: {
//            color: 16711680,
//            fields: [{
//                name: 'Member was Updated',
//                value: `${member}`
//            }],
//            timestamp: new Date(),
//            footer: {
//                text: member.author
//            }
//        }
//    });
//})