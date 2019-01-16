// Console Colour Code
const RESET_COLOR = '\x1b[0m';
const COLOR_WHITE = '\x1b[1m\x1b[0m';
const COLOR_RED = '\x1b[1m\x1b[31m';
const COLOR_GREEN = '\x1b[1m\x1b[32m';
const COLOR_CYAN = '\x1b[1m\x1b[36m';
const COLOR_YELLOW = '\x1b[1m\x1b[33m';

const { spawn } = require('child_process');
const { lstatSync, readdirSync } = require('fs');
const { join } = require('path');

var fs = require('fs');

const discordBots = {};

// Directory Naviagtion
const isDir = source => lstatSync(source).isDirectory();
const getDirs = source => readdirSync(source).map(name => join(source, name)).filter(isDir);

var directories = getDirs('./');

directories.forEach(function( v ){
	// Search through each folder looking for app.js
	console.log(COLOR_YELLOW, timeStamp(), 'Searching for ./' + v + '/app.js', RESET_COLOR);

	if ( fs.existsSync('./'+v+'/app.js') ) {

		// Make a new [object?] for each bot client
		discordBots[v] = {};
		discordBots[v].start = function () {
			
			// Start up a new bot client 
			console.log(COLOR_GREEN, timeStamp(), 'Starting Bot ' + v, RESET_COLOR);
			
			const bot = discordBots[v].process = spawn('node', [v + '/app.js']);

			// Console logging 
			bot.stdout.on('data', (d) => {
				console.log(COLOR_WHITE, timeStamp(), 'DATA FROM ' + v + ': ' + d, RESET_COLOR);
			});
			// If the child has an error printed out            
			bot.stderr.on('data', (data) => {
				console.log(COLOR_CYAN, timeStamp(), 'DATA FROM ' + v + ': stderr: ' + data, RESET_COLOR);
			});

			// What to do when each bot child closes
			bot.on('close', (code) => {
				console.log(COLOR_RED, timeStamp(), 'DATA FROM ' + v + ': Process exited with code ' + code, RESET_COLOR);
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

// Process listeners 
process.on('exit', (code) =>
{
	console.log('Process exited with code: ' + code);
});

process.on('unhandledRejection', err =>
{
	console.error('Unhandled Rejection: \n', err);
});

process.on('error', err =>
{
	console.error('Error happened: \n ', err);
});

