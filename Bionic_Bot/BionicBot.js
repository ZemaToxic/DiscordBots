
//APP DETAILS
//Client ID: 335999746324037633
//Client Secret:
//4mZ0VYmGyLwT2mzs-PSojPdlXvE7m349

//Username: Bionic_Bot#4918
//Token:
//MzM1OTk5NzQ2MzI0MDM3NjMz.DE3s2Q.4vPF_BIpgyOihgNwWy8GVt_ec90


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
const token = 'MzM1OTk5NzQ2MzI0MDM3NjMz.DE3s2Q.4vPF_BIpgyOihgNwWy8GVt_ec90';

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

function play(connection, message) {
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

    server.queue.shift();

    server.dispatcher.on("end", function () {
        if (server.queue[0]) play(connection, message);
        else connection.disconnect();
    });
}


// The ready event is vital, it means that your bot will only start reacting to information from Discord _after_ ready is emitted
client.on('ready', () => {
    console.log(COLOR_YELLOW,'I am Connected!',RESET_COLOR);
});


// Create an event listener for new guild members
client.on('guildMemberAdd', member => {
    // Send the message to the guilds default channel (usually #general), mentioning the member
    member.guild.defaultChannel.send(`Welcome to the server, ${member}!`);
});

const prefix = "~";

// Used for Quote JSON
let quote = []
quote = loadQuotes(quote)

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
    // If the message is "what is my avatar"
    if (command === 'what is my avatar') {
        // Send the user's avatar URL
        message.reply(message.author.avatarURL);
    }

    // Voice only works in guilds, if the message does not come from a guild,
    // we ignore it
    if (!message.guild) return;

    if (command ===  'join') {
        // Only try to join the sender's voice channel if they are in one themselves
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join()
                .then(connection => {
                    // Connection is an instance of VoiceConnection
                    message.reply('I have successfully connected to the channel!');
                })
                .catch(console.log);
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }
    if (command === 'disconnect') {
        // Only try to join the sender's voice channel if they are in one themselves
        if (message.member.voiceChannel) {
            message.member.voiceChannel.leave()
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }

    if (command === "quote")
    {
        let args = message.content.split(' ').slice(1);

        try {
            let quoteFile = require(`./quotes/quotes.js`);
            quoteFile.run(client, message, args);
        } catch (err) {
            console.error(err);
        }
        return;
    }

    if (command == "play") {
        // If no Link provided Complain.
        if (!args[0]) {
            message.channel.send("Please Provide a Link to a song.")
        }
        // If the User is not in a voice Channel.... Complain.
        if (!message.member.voiceChannel) {
            message.channel.send("You must be in a Voice Channel.")
        }
        // Make a queue if there is none
        if (!servers[message.guild.id]) servers[message.guild.id] = {
            queue: []
        }
        // Make server = The current connected Server.
        var server = servers[message.guild.id];

        server.queue.push(args[0]);

        // Call the Play function
        if (message.guild.voiceConnection) message.member.voiceChannel.join().then(connection => {
            play(connection, message);
        })
    }

    if (command == "skip") {
        var server = servers[message.guild.id];
        // If there is a dispatcher, End the song.
        if (server.dispatcher) server.dispatcher.end();
    }

    if (command == "stop") {
        var server = servers[message.guild.id];
        if (message.member.voiceChannel) {
            message.member.voiceChannel.leave()
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }
});

// Log our bot in
client.login(token);