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

const bots = directories.reduce((bots, dir) => {
	if (fs.existsSync('./' + v + '/app.js')) {
	  bots.push({
		name: v,
		onClose: (code) => {
		  console.log(timeStamp(), 'DATA FROM ' + v + ': Process exited with code ' + code)
		  bot.process.removeListener('close', bot.onClose)
		  bot.start()
		},
		start: () => {
		  bot.process = fork(dir + '/app.js')
		  bot.process.on('close', bot.onClose)
		  bot.sendMessage = (message) => {
			return new Promise((resolve, reject) => {
			  bot.onMessage = (message) => {
				children[i].removeListener('message', bot.onMessage)
				resolve(message)
			  }
			  bot.process.on('message', bot.onMessage)
			  bot.process.send(message)
			})
		  }
		}
	  })
	}
	return bots
  }, [])
  
  bots.forEach((bot) => bot.start())

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
