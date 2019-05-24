// Bot Info
const clientData = require("./includes/jsonFiles/ClientData.json");

// Utility Imports
const eventHandler = require("./utility/eventHandler.js");
require("./utility/utils.js")();

const path = require("path");
// Change the Directory incase of spawned as child
process.chdir(__dirname);
process.title = `Bot/Discord/${path.basename(__dirname)}`;

// Imports and Declarations.
let options = {}; // -- Used for prefix and activity etc.
const fs = require("fs");
const moment = require("moment");
require("moment-duration-format");
const Discord = require("discord.js");

// Express set up
const express = require("express");
const https = require('https');
const http = require('http');
const cors = require('cors');
const app = express();

// const whitelist = ['https://www.zematoxic.com', 'https://zematoxic.com']
// const /*corsOptions*/ = {
//   origin: function (origin, callback) {
//       console.log(origin)
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS - Please use an allowed url'))
//     }
//   }
// }

// Also set up http
http.createServer(app).listen(3001, () => console.log('Express HTTP Started'));
// Set up https for express
//https.createServer(app).listen(3002, () => console.log('Express HTTPS Started'))
// Redirect http to https
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
});

app.use(cors(/*corsOptions*/))
app.set('json spaces',2);

const client = new Discord.Client();

// Enmap setup 
const Enmap = require('enmap')

client.settings = new Enmap({
    name: 'settings',
    fetchAll: false,
    autoFetch: true,
    cloneLevel: 'deep'
})

// Just setting up a default configuration object here, to have somethign to insert.
const defaultSettings = {
    prefix: "!",
    modLogChannel: "mod-log",
    modRole: "Moderator",
    adminRole: "Administrator",
    ignoreChannel: "IgnoreThis"
}

// New collections of Commands
client.commands = new Discord.Collection();
client.modCommands = new Discord.Collection();
client.adminCommands = new Discord.Collection();
client.sillyStuff = new Discord.Collection();

var commandFiles, modCommandFiles, adminCommandFiles, sillyStuffFiles;

// Make a new const of all files in the commands folder which end in .js
commandFiles = fs.readdirSync("./includes/commands").filter(file => file.endsWith(".js"));
// Make a new const of all files in the modCommands folder which end in .js
modCommandFiles = fs.readdirSync("./includes/modCommands").filter(file => file.endsWith(".js"));
// Make a new const of all files in the adminFiles folder which end in .js
adminCommandFiles = fs.readdirSync("./includes/adminCommands").filter(file => file.endsWith(".js"));
// Make a new const of all files in the sillyStuff folder which end in .js
sillyStuffFiles = fs.readdirSync("./includes/sillyStuff").filter(file => file.endsWith(".js"));

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
client.on("ready",
    () => {
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
        client.user.setActivity(options.Activity,
            {
                name: "game",
                type: 0
            });
    });

// Member Joins
client.on("guildMemberAdd",
    member => {
        eventHandler.memberAdd(client, client.settings, member);
    });

// Member leaves or is kicked
client.on("guildMemberRemove",
    member => {
        eventHandler.memberRemove(client, client.settings, member);
    });

// Client Name change / new roles
client.on("guildMemberUpdate",
    (oldMember, newMember) => {
      eventHandler.memberUpdate(client, client.settings, oldMember, newMember);
    });

// Member Banned
client.on("guildBanAdd",
    member => {
       eventHandler.banAdd(client, client.settings, member);
    });

// Message gets deleted
client.on("messageDelete",
    message => {
       eventHandler.messageDelete(client, client.settings, message);
    });

// Message edited
client.on("messageUpdate",
    (oldMessage, newMessage) => {
      eventHandler.messageUpdate(client, client.settings, oldMessage, newMessage);
    });

// Bulk Message deleted.f
client.on("messageDeleteBulk",
    messages => {
        eventHandler.bulkDelete(client, client.settings, messages);
    });

// Client experiances an error
client.on("error",
    error => {
      eventHandler.errorHandler(client, client.settings, error);
    });


// Client recieves a message
client.on("message",
    message => {

        if (message.channel.id === client.settings.ignoreChannel) return;
        if (message.author.bot) return;
        
        var stringToTest = message.content.toLowerCase();

        if (stringToTest.match(/(^| )heck($|.)/g)) {
            client.sillyStuff.get("heck").execute(message);
        }

        const guildConf = client.settings.ensure(message.guild.id, defaultSettings);

        // Return if message does not start with the prefix.
        if (message.content.indexOf(guildConf.prefix) !== 0) return;

        // Split the message up then remove the prefix
        const args = message.content.split(/\s+/g);
        const commands = args.shift().slice(guildConf.prefix.length).toLowerCase();

        // Check if the command is in the commands or modCommands object.
        if (!client.commands.has(commands) &&
            !client.modCommands.has(commands) &&
            !client.adminCommands.has(commands)) {
            message.reply("that is not a command use " + guildConf.prefix + "help, to see the list of commands.");
            return;
        }
        // Check if its an Admin command.
        else if (client.adminCommands.get(commands) && (message.author.id === clientData.OwnerID)) {
            client.adminCommands.get(commands).execute(client, guildConf, message, args);
            return;
        }
        // Check if its in a Mod command.
        else if (client.modCommands.get(commands) &&
        (message.member.roles.has(guildConf.modRole) ||
            (message.guild.owner.user.username === message.author.username))) {
            client.modCommands.get(commands).execute(client, guildConf, message, args);
            return;
        }
        // Check if its a normal command.
        else if (client.commands.get(commands)) {
            client.commands.get(commands).execute(client, guildConf, message, args);
            return;
        }
        // Else error out.
        else {
            message.reply("either there was an error, or you dont have permission to use that command.");
        }
    });

// Log the bot in.
client.login(clientData.Token);

// Process listeners 
process.on("exit",
    (code) => {
        console.log("Bot exited with code: " + code);
    });

process.on("unhandledRejection",
    err => {
        console.error("Unhandled Rejection: \n", err);
    });

process.on("error",
    err => {
        console.error("Error happened: \n ", err);
    });

app.get('/', cors(/*corsOptions*/), (req,res) => {
    res.json({
        Info: 'Discord Bots by Zematoxic'
    })
})

app.get('/botinfo', cors(/*corsOptions*/), (req, res) => {
    const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
    res.json({
        Name: client.user.username,
        Users: client.users.size,
        MemoryUsage: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + ' MB',
        BotUptime: duration,
        Servers: client.guilds.size,
        Channels: client.channels.size,
        DiscordjsVersion: Discord.version,
        NodejsVersion: process.version
    })
})

app.get('/commands', cors(/*corsOptions*/), (req,res) => {

    const commands = client.commands.map(command => ({command: command.name, description: command.description})) 
    res.json(commands)
})




