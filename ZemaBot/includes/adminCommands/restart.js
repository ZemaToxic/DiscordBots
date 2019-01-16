module.exports = {
	name: 'restart',
	description: 'Restarts the bot if something is being funky',
	execute(client, options, message, args) {

		message.reply('Restarting the bot... BRB');
		setTimeout(execFunc, 1200);
	}
};

function execFunc() {
	process.exit();
}