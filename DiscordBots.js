const { spawn } = require('child_process');
const { lstatSync, readdirSync } = require('fs');
const { join } = require('path');

var fs = require('fs');

const discordBots = {};

// Directory Navigation
const isDir = source => lstatSync(source).isDirectory();
const getDirs = source => readdirSync(source).map(name => join(source, name)).filter(isDir);

var directories = getDirs('./');
console.log(process.cwd());

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

function timeStamp() {
	var now = new Date();
	var date = now.getDate();
	var month = now.getMonth();
	var year = now.getFullYear();
	var hours = now.getHours();
	var minutes = now.getMinutes();
	return '[' + date + '/' + month + '/' + year + ' - ' + hours + ':' + minutes + ']';
}