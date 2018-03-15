// Console Colour Code
var RESET_COLOR = '\x1b[0m';
var COLOR_RED = '\x1b[1m\x1b[31m';
var COLOR_GREEN = '\x1b[1m\x1b[32m';
var COLOR_CYAN = '\x1b[1m\x1b[36m';
var COLOR_YELLOW = '\x1b[1m\x1b[33m';

// Import the discord.js module
const Discord = require('discord.js');
var nodemailer = require('nodemailer');
const fs = require('fs')
const sleep = require('system-sleep');
var request = require('request'); // Includes needed for the Bot


// Create an instance of a Discord client
const client = new Discord.Client();
// Create a server empty Object
var servers = {};

// Catch Errors and ignore them for now 
//process.on("uncaughtException", function (e) { return false; })

// Set Console window title
process.stdout.write("\033]0;ZemaBot-Discord\007");

//http://localhost:50451/?code=1Ljji7cSZKmwWbxasU4dW1zLXBrxon&guild_id=318559873606615050&permissions=8

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

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'toxicbots.info@gmail.com',
        pass: 'wwssadadba123'
    }
});

var mailOptions = {
    from: 'toxicbots.info@gmail.com',
    to: 'mseymour.home@gmail.com',
    subject: 'BOT BROKE! HALP plz fix.',
    text: 'That was easy!'
};

// The ready event is vital, it means that your bot will only 
// start reacting to information from Discord _after_ ready is emitted
client.on('ready', () => {
    console.log(COLOR_YELLOW, 'I am Connected!', RESET_COLOR);
    client.user.setActivity("with the Matrix, Poking random things.", { name: "game", type: 0 });
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

// Message gets deleted
client.on('messageDelete', message => {

    if (message.author.username === 'ZemaBot') return;

    // 402404101713035264 logs Channel ID
    client.channels.get('402404101713035264').send({
        embed: {
            color: 65535,
            fields: [{
                name: 'Message Deleted',
                value: 'Message deleted by: ' + `${message.author.username}` + " the message was: " + `"${message}"` + " in channel: #" + `${message.channel.name}`
            }],
            timestamp: new Date(),
            footer: {
                text: message.author.username
            }
        }
    });
});

// Message edited
client.on('messageUpdate', (oldMessage, newMessage) => {
	
    if (oldMessage.author.username === 'ZemaBot') return;
    if (oldMessage.embeds == true) return;

    // 402404101713035264 logs Channel ID
    client.channels.get('402404101713035264').send({
        embed: {
            color: 16776960,
            fields: [{
                name: 'Message Modifed',
                value: 'Message changed by: ' + `${oldMessage.author.username}` + " the message used to be: " + `"${oldMessage}"` + " it is now, " + `"${newMessage}"` + " in channel: #" + `${oldMessage.channel.name}`
            }],
            timestamp: new Date(),
            footer: {
                text: oldMessage.author.username
            }
        }
    });
});

// Client Name change / new roles
client.on('guildMemberUpdate', (oldMember, newMember) => {

    // If User nicknames are changed
    if (oldMember.nickname != newMember.nickname) {

        var oldName = oldMember.nickname;
        var newName = newMember.nickname;

        if (oldMember.nickname == null) { oldName = oldMember.user.username };
        if (newMember.nickname == null) { newName = newMember.user.username };

        console.log(oldName, " --- ", newName);
        
        client.channels.get('402404101713035264').send({
            embed: {
                color: 16737792,
                fields: [{
                    name: 'Username Changed.',
                    value: `${oldName}` + " nickname has changed to: " + `${newName}`
                }],
                timestamp: new Date(),
                footer: {
                    text: oldMember.username
                }
            }
        });
    }

    // If Roles are changed
    if (oldMember.roles != newMember.roles) {

        function filterArray(src, filt) {
            var temp = {}, i, result = [];
            for (i = 0; i < filt.length; i++) {
                temp[filt[i]] = true;
            }
            for (i = 0; i < src.length; i++) {
                if (!(src[i] in temp)) {
                    result.push(src[i]);
                }
            }
            return (result);
        }

        var oldRoles = [];
        var newRoles = [];
        oldMember.roles.forEach(function (k, v) {
            oldRoles.push(k.name);
        })
        newMember.roles.forEach(function (k, v) {
                newRoles.push(k.name)
        })
    
        if (oldRoles.length < newRoles.length) {
            // If a Role was Added
            var change = filterArray(newRoles, oldRoles)[0];
            client.channels.get('402404101713035264').send({
                embed: {
                    color: 16750080,
                    fields: [{
                        name: 'Use Roles Changed.',
                        value: `${oldMember.user.username}` + " was given the role: " + `${change}`
                    }],
                    timestamp: new Date(),
                    footer: {
                        text: oldMember.user.username
                    }
                }
            });

        } else {
            // If a role was removed.
            var change = filterArray(oldRoles, newRoles)[0];
            client.channels.get('402404101713035264').send({
                embed: {
                    color: 16750080,
                    fields: [{
                        name: 'Use Roles Changed.',
                        value: `${oldMember.user.username}` + " has lost the role: " + `${change}`
                    }],
                    timestamp: new Date(),
                    footer: {
                        text: oldMember.user.username
                    }
                }
            });
        }
    }
})

// Client experiances an error
client.on("error", error => {

    console.log(error)

    client.channels.get('402404101713035264').send({
        embed: {
            color: 16716947,
            fields: [{
                name: 'There was an error.',
                value: `${error}`
            }],
            timestamp: new Date(),
            footer: {
                text: member.author
            }
        }
    });
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

    // Purge messages 
    if (command === "purge") {
        // Check if the use has the "Robot MK2" Role. ID(389029787005485067)
        if (message.member.roles.has('389029787005485067') == true) {
            // Run the purge command        
            const user = message.mentions.users.first();
            const amount = !!parseInt(message.content.split(' ')[1]) ? parseInt(message.content.split(' ')[1]) : parseInt(message.content.split(' ')[2])
            if (!amount) return message.reply('Must specify an amount to delete!');
            if (!amount && !user) return message.reply('Must specify a user and amount, or just an amount, of messages to purge!');
            message.channel.fetchMessages({
                limit: amount,
            }).then((messages) => {
                if (user) {
                    const filterBy = user ? user.id : Client.user.id;
                    messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
                }
                message.channel.bulkDelete(messages).catch(error => console.log(error.stack));
            });
        } else {
            message.channel.send('Im sorry, you dont have permission to use this command')
        }
    }

    // Be a parrot
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

    if (command === 'mail') {
        // https://myaccount.google.com/lesssecureapps?rfn=27&rfnc=1&eid=-8179429175982098682&et=0&asae=2&pli=1 Need to toggle this
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                message.channel.send('Mail sent');
            }
        });
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
    if (command === "user") {
        message.channel.send(`Your Username: ${message.author.username}\nYour ID: ${message.author.id}\nYour Connections:  ${message.author.fetchProfile().conenctions}`);

        var _Id = message.author.id

        message.guild.members.get(_Id).user.fetchProfile().then(p => { console.log(p.connections) })
    }
	
	if (command === "datatest") {
		
		return request ({
            baseUrl: 'https://discordapp.com/api/v6',
            url: 'oauth2/token', 
            method: 'POST',
            // headers: {
                 // "Content-Type": 'application/x-www-form-urlencoded',
             // },
            json: true,
            body: {
                client_id: '388491707580416001',
                client_secret: 'ZJr3vOzuagGFMoE6wCIifKQ7lV-InQuF',
                grant_type: 'authorization_code',
                code: '1Ljji7cSZKmwWbxasU4dW1zLXBrxon',
                redirect_uri: "http://localhost:50451"
            }
        }, (err, {
                statusCode
            }, body) => {
            if (err) {
                console.log(err);
            } else if (statusCode !== 200) {
                console.log({
                    statusCode,
                    body
                });
            } else {
                console.log(body);
            }
        });
	
		console.log(request);
		
	}
		
    if (command === "restart") {
        if (message.author.id === '171234951566589954') {
            message.channel.send("Bot will restart, please wait a minute");
            sleep(1000);
            process.exit();
        }
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