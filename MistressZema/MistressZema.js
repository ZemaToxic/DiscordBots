
//APP DETAILS
//Client ID: 318561742118584322
//Client Secret:
//sIQarSj0S2sALMqXhPmG6A_kAJBLCyAs


//Username: MistressZema#1309
//Token:
//MzE4NTYxNzQyMTE4NTg0MzIy.DA0LVg.K_Gu0kCsLUV7a6xDZzn - 7Xc5A7o

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

// The token of your bot - https://discordapp.com/developers/applications/me
const token = 'MzE4NTYxNzQyMTE4NTg0MzIy.DA0LVg.K_Gu0kCsLUV7a6xDZzn-7Xc5A7o';

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

// This loop reads the /events/ folder and attaches each event file to the appropriate event.
fs.readdir('./events/', (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        let eventFunction = require(`./events/${file}`);
        let eventName = file.split('.')[0];
        // super-secret recipe to call events with all their proper arguments *after* the `client` var.
        client.on(eventName, (...args) => eventFunction.run(client, ...args));
    });
});


// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
    console.log(COLOR_YELLOW,'I am Connected!',RESET_COLOR);
});


// Create an event listener for new guild members
client.on('guildMemberAdd', member => {
    // Send the message to the guilds default channel (usually #general), mentioning the member
    member.guild.defaultChannel.send(`Welcome to the server, ${member}!`);
});

const prefix = "~";
let quote = []


quote = loadQuotes(quote)

// Create an event listener for messages
client.on('message', message => {
    
    /*
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

    // If the message is Quote.
    if (command === "quote") {

        const splitMessage = message.content.split(' ')

        // If nothing apart form ~quote then return a random Quote.
        if (splitMessage.length == 1) {

            var RandomQuote = Math.floor(Math.random() * quote.length) + 1

            message.channel.send("Quote: " + RandomQuote + " -> " + quote[RandomQuote])
        }

        // Return what ever quote is asked for
        if (splitMessage.length == 2) {
            // second word is a number
            const quoteNumber = parseInt(splitMessage[1]) - 1

            if (quoteNumber >= 0) {
                if (quote.length > quoteNumber) {
                    message.channel.send("[" + (quoteNumber + 1) + "/" + quote.length + "] " + quote[quoteNumber])
                } else {
                    // If the number asked doesn't exist then error.
                    message.channel.send("There is only " + quote.length + " quotes, choose a number from from 1 to " + quote.length + ".")
                }
            }
        }
        if (splitMessage.length < 3) {
            return
        }

        const subcommand = splitMessage[1]
        splitMessage.splice(0, 2)
        const sentence = splitMessage.join(' ')
        const quoteNumber = parseInt(splitMessage[0])

        console.log(quoteNumber)

        // ----------- Add -----------
        if (subcommand === 'add') {
            if (quote.indexOf(sentence) !== -1) {
                message.channel.send(sentence + " Is already a Quote.")
            } else {
                quote.push(sentence)
                saveQuotes(quote)
                message.channel.send(sentence + " Has been saved as !quote " + quote.length + ".")
            }
        }
        // ----------- Edit ----------
        if (subcommand === 'edit') {


            if (quote.indexOf(quoteNumber) !== -1) {
                quote.push(sentence)
                saveQuotes(quote)
                message.channel.send(sentence + " Has been saved.")
            } else {
                message.channel.send(sentence + " Is not a Quote.")

            }
        }
        // ----------- Delete --------
        else if (subcommand === 'del' || subcommand === 'delete' || subcommand === 'remove') {
            if (quote.indexOf(sentence) === -1) {
                message.channel.send(sentence + " Is not currently a Quote.")
            } else {
                quote.splice(quote.indexOf(sentence), 1)
                saveQuotes(quote)
                message.channel.send(sentence + " Has been deleted.")
            }
        }
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
    
    
    


*/
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    let command = message.content.split(' ')[0];
    command = command.slice(prefix.length);

    if (command === "testquote")
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
   
    let args = message.content.split(' ').slice(1);
    // The list of if/else is replaced with those simple 2 lines:

    try {
        let commandFile = require(`./commands/${command}.js`);
        commandFile.run(client, message, args);
    } catch (err) {
        console.error(err);
    }

});



// Log our bot in
client.login(token);