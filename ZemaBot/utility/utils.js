const fs = require('fs');

module.exports = function () {
	this.saveOptions = function (options) {    // Save options to File
		fs.writeFile('./jsonFiles/options.json', JSON.stringify(options, null, 1), (err) => {
			if (err) {
				return console.log(err);
			}
			console.log('Options saved!');
		});
	};
	this.loadOptions = function (options) {
		try {
			const optionsJson = fs.readFileSync('./jsonFiles/options.json');
			const optionsFromFile = JSON.parse(optionsJson);

			// Merge default options with added jsonFilesinformation
			return Object.assign(options, optionsFromFile);
		} catch (err) {
			// If file doesn't exist, return default options
			return options;
		}
	};
	this.initValues = function (options) {
		// Check if the default settings exist, if they dont create them.
		if (!options.prefix) { options.prefix = '~'; }
		if (!options.Activity) { options.Activity = 'with the Matrix, poking random things.'; }
		// Save the values
		console.log('Initial values set');
	};
};
