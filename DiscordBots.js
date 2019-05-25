// Express set up
const express = require("express");
const cors = require('cors');
const app = express();

const { spawn } = require('child_process');
const { lstatSync, readdirSync } = require('fs');
const { join } = require('path');
const fs = require('fs');
const moment = require("moment");
require("moment-duration-format");

// Directory Navigation
const isDir = source => lstatSync(source).isDirectory();
const getDirs = source => readdirSync(source).map(name => join(source, name)).filter(isDir);

const discordBots = {};
const directories = getDirs('./');

const whitelist = ['https://www.zematoxic.com', 'https://zematoxic.com', '27.252.146.165']

app.use(cors({
    origin: function(origin, callback){
      // Allow requests with no origin like mobile apps and CURL
      if(!origin) return callback(null, true);
      if(whitelist.indexOf(origin) === -1){
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    }
  }));

app.set('json spaces', 2);

directories.forEach(function( v ){
	
	// Search through each folder looking for app.js
	console.log(timeStamp(), 'Searching for ./' + v + '/app.js');

	if ( fs.existsSync('./'+v+'/app.js') ) {

		// Make a new [object?] for each bot client
		discordBots[v] = {};
		discordBots[v].start = function () {

			// Start up a new bot client 
			console.log(timeStamp(), 'Starting Bot ' + v);
			
			const bot = discordBots[v].process = spawn('node', [ v + '/app.js'], {shell: true});
			
			// Console logging 
			bot.stdout.on('data', (d) => {
				console.log(timeStamp(), 'DATA FROM ' + v + ': ' + d);
			});
			// If the child has an error printed out            
			bot.stderr.on('data', (data) => {
				console.log( timeStamp(), 'DATA FROM ' + v + ': stderr: ' + data);
			});

			// What to do when each bot child closes
			bot.on('close', (code) => {
				console.log( timeStamp(), 'DATA FROM ' + v + ': Process exited with code ' + code);
				discordBots[v].start();
			});
		};
		// Start all bots 
		discordBots[v].start();      
	}
});

app.get('/', (req, res) => {
    res.json({
        Info: 'Discord Bots by Zematoxic'
    })
})

app.get('/botinfo', (req, res) => {
    const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
    res.json({
		Test: 'test'
        // Name: client.user.username,
        // Users: client.users.size,
        // MemoryUsage: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + ' MB',
        // BotUptime: duration,
        // Servers: client.guilds.size,
        // Channels: client.channels.size,
        // DiscordjsVersion: Discord.version,
        // NodejsVersion: process.version
    })
})

app.get('/commands', (req,res) => {
    //const commands = client.commands.map(command => ({command: command.name, description: command.description})) 
    //res.json(commands)
})

// Sset up http
app.listen(3001, () => console.log('Express HTTP Started'));



function timeStamp() {
	var now = new Date();
	var date = now.getDate();
	var month = now.getMonth();
	var year = now.getFullYear();
	var hours = now.getHours();
	var minutes = now.getMinutes();
	return '[' + date + '/' + month + '/' + year + ' - ' + hours + ':' + minutes + ']';
}