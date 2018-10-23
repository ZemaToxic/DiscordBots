var moment = require('moment');

module.exports = {
	name: 'remindme',
	description: 'Reminds the user to do "something" after a set time.',
	execute(message, args) {
		// Make a variable of the time the command was called.
		var currentTime = moment();
		// Split the inputed value
		var inputedTime = args[0].split('');

		//	Variables for the time and the length (minutes, hours, days)
		var delayValue = inputedTime.pop();
		// Parse the Value as an (int)
		var timeValue = parseInt(inputedTime.join(''));

		var remindMeTime = 0;

		if ((isNumber(timeValue) === true) && (delayValue == 'm' || 'h' || 'd')) {
			if (delayValue === 'm') {
				remindMeTime = moment(currentTime).add(timeValue, 'm');
				message.reply(` you will be reminded in: ${timeValue} minute(s)`);

			} else if (delayValue === 'h') {
				remindMeTime = moment(currentTime).add(timeValue, 'h');
				message.reply(` you will be reminded in: ${timeValue} hour(s)`);

			} else if (delayValue === 'd') {
				remindMeTime = moment(currentTime).add(timeValue, 'd');
				message.reply(` you will be reminded in: ${timeValue} day(s)`);
			}
		} else {
			message.reply(' that isn\'t a valid time period');
		}

		// Make a new variable of the stuff we want as a reminder.
		args.splice(0, 1);
		const response = args.join(' ');

		// Make a value based on the time requested.
		var miliseconds = remindMeTime - currentTime;

		// Send the message after x time.
		setTimeout(timerThing, miliseconds, message, response);

	}
};


function timerThing(message, response) {
	message.reply(response);
}

// Returns true (n) is a number and not (Nan)
function isNumber(n) {
	return (typeof n == 'number' && !isNaN(n));
}