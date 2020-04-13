const { fork } = require('child_process');
const { lstatSync, readdirSync } = require('fs');
const { join } = require('path');
const fs = require('fs');

// Directory Navigation
const isDir = source => lstatSync(source).isDirectory();
const getDirs = source => readdirSync(source).map(name => join(source, name)).filter(isDir);
const directories = getDirs('./');

const bots = directories.reduce((bots, dir) => {
	if (fs.existsSync('./' + dir + '/app.js')) {
		const bot = {
			name: dir,
			onClose: (code) => {
				console.log(timeStamp(), 'DATA FROM ' + bot.name + ': Process exited with code ' + code)
				bot.process.removeListener('close', bot.onClose)
				bot.start()
			},
			start: () => {
				bot.process = fork(bot.name + '/app.js')
				bot.process.on('close', bot.onClose)
			}
		}
		bots.push(bot)
	}
	return bots
}, [])

bots.forEach((bot) => bot.start());

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
process.on("exit", (code) => { console.log("Bot exited with code: " + code); });
process.on("unhandledRejection", err => { console.error("Unhandled Rejection: \n", err); });
process.on("error", err => { console.error("Error happened: \n ", err); });