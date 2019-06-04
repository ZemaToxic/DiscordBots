// Express set up
require('rootpath')();
const express = require("express");
const cors = require('cors');
const app = express();

const bodyParser = require('body-parser');
const jwt = require('./_helpers/jwt');
const errorHandler = require('./_helpers/error-handler');

const { fork } = require('child_process');
const { lstatSync, readdirSync } = require('fs');
const { join } = require('path');
const fs = require('fs');

// Directory Navigation
const isDir = source => lstatSync(source).isDirectory();
const getDirs = source => readdirSync(source).map(name => join(source, name)).filter(isDir);

const discordBots = {};
const directories = getDirs('./');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

// Turn on JWT
app.use(jwt())

app.set('json spaces', 2);

// api routes
app.use('/users', require('./users/users.controller'));

// global error handler
app.use(errorHandler);

directories.forEach(function (v) {
	// Search through each folder looking for app.js
	console.log(timeStamp(), 'Searching for ./' + v + '/app.js');

	if (fs.existsSync('./' + v + '/app.js')) {

		// Make a new [object?] for each bot client
		discordBots[v] = {};
		discordBots[v].start = function () {

			// Start up a new bot client
			console.log(timeStamp(), 'Starting Bot ' + v);

			const bot = discordBots[v].process = fork(v + '/app.js')

			// What to do when each bot child closes
			bot.on('close', (code) => {
				console.log(timeStamp(), 'DATA FROM ' + v + ': Process exited with code ' + code);
				discordBots[v].start();
			});

			bot.sendMessage = (message) => {
				return new Promise((resolve, reject) => {
					bot.messageListener = (message) => {
						bot.removeListener('message', bot.messageListener)
						resolve(message)
					}
					bot.on('message', bot.messageListener)
					bot.send(message)
				})
			}

			Promise.all(bot.map((bots, i) => bots.sendMessage(i)))
				.then((results) => console.log('Results: ', results))
		}
		// Start all bots
		discordBots[v].start();
	};
});

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
