module.exports = {
	name: 'restart',
	description: 'Restarts the bot if something is being funky',
	execute(message) {

		message.reply('Restarting the bot... BRB');
		setTimeout(execFunc, 1200);
	}
};

function execFunc() {
	process.exit();
}