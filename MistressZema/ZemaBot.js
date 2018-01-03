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

// -------- Options ---------
const loadOptions = (options) => {
    try {
        const optionsJson = fs.readFileSync('./options.json')
        const optionsFromFile = JSON.parse(optionsJson)

        // merging default commands with added commands
        return Object.assign(optionsFromFile, options)
    } catch (err) {
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

// The ready event is vital, it means that your bot will only start reacting to information from Discord _after_ ready is emitted
client.on('ready', () => {
    console.log(COLOR_YELLOW, 'I am Connected!', RESET_COLOR);
});


// Create an event listener for new guild members
client.on('guildMemberAdd', member => {
    // Send the message to the guilds default channel (usually #general), mentioning the member
    member.guild.defaultChannel.send(`Welcome to the server, ${member}!`);
});

const prefix = "~";

// Used for Quote JSON
let quote = []
let botConfig = []

quote = loadQuotes(quote)
botConfig = loadOptions(botConfig)


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
            let quoteFile = require(`./quotes/quotes.js`);
            quoteFile.run(client, message, args);
        } catch (err) {
            console.error(err);
        }
        return;
    }
});


// Log our bot in
client.login(botConfig['token']);