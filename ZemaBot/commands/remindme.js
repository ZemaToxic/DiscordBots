var moment = require('moment');

module.exports = {
	name: 'remindme',
	description: 'Reminds the user to do "something" after a set time.',
	execute(message, args) {
		// Make a variable of the time the command was called.
		var currentTime = moment();
		// Split the inputed value.
		var inputedTime = args[0].split('');

		//	Variables for the time and the length (minutes, hours, days).
		var delayValue = inputedTime.pop();
		// Parse the Value as an (int).
		var timeValue = parseInt(inputedTime.join(''));
		// Declare (remindMeTime) so we can edit it later.
		var remindMeTime = 0;

		// Make a new variable of the stuff we want as a reminder.
		args.splice(0, 1);
		const response = args.join(' ');
		
		if ((isNumber(timeValue) === true) && (isValid(delayValue) === true)) {
			if (delayValue === 'm') {
				remindMeTime = moment(currentTime).add(timeValue, 'm');
			} else if (delayValue === 'h') {
				remindMeTime = moment(currentTime).add(timeValue, 'h');
			} else if (delayValue === 'd') {
				remindMeTime = moment(currentTime).add(timeValue, 'd');
			}
			
			// Make a value based on the time requested.
			var miliseconds = remindMeTime - currentTime;

			// Check that (milliseconds) isnt set to high/ridiclous.
			if (isWithinTime(miliseconds) === true) {
				message.reply(` you will be reminded in: ${timeValue} ${timePeriod(delayValue)}`);
			} else if (isWithinTime(miliseconds) === false) {
				message.reply(' that time period is to long.');
				return;
			}
			// Send the message after x time.
			setTimeout(messageTimer, miliseconds, message, response);
		} else {
			// Else send a response saying that its wrong.
			message.reply(' that isn\'t a valid time period.');
			return;
		}
	}
};

// Returns true if (delayValue) is a valid option.
function isValid(delayValue) {
	switch (delayValue) {
		case 'm':
			return true;
		case 'h':
			return true;
		case 'd':
			return true;
		default:
			return false;
	}
}
// Returns the timePeriod.
function timePeriod(delayValue) {
	switch (delayValue) {
		case 'm':
			return 'minute(s)';
		case 'h':
			return 'hour(s)';
		case 'd':
			return 'day(s)';
		default:
			return false;
	}
}
// Returns true (n) is a number and not (Nan).
function isNumber(n) {
	return ((typeof n == 'number' && !isNaN(n)) && (n > 0));
}
// Returns true if the time period is within the 32 bit interger.
function isWithinTime(miliseconds) {
	var mili = parseInt(miliseconds);
	if ((mili >= 2147483647) || isNaN(mili) || mili < 0) {
		return false;
	} else {
		return true;
	}
}
// Timeoit Callback
function messageTimer(message, response) {
	message.reply(response);
}