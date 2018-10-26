const Sequelize = require('sequelize');
const discord = require('discord.js');

// Connection Information.
const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	operatorsAliases: false,
	// SQLite only
	storage: 'database.sqlite',
});

// Creating the (model/table).
const Quotes = sequelize.define('quotes', {
	number: {
		type: Sequelize.INTEGER,
		unique: true,
	},
	quoteText: Sequelize.TEXT,
	quotedPerson: Sequelize.STRING,
	quoter: Sequelize.STRING,
	timesCalled: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});

module.exports = {
	name: 'quote',
	description: 'Return quote\'s when requested.',
	async execute(client, options, message, args) {
		// Do command stuff here
		if (!options.quoteNumber) {
			options.quoteNumber = 0;
		}
		// Sync/Make sure it exists.
		Quotes.sync();

		// Add quote
		if (args[0] === 'add') {
			// Remove (add)
			args.shift();
			// Split out (args)
			const QuotedPerson = args.pop();
			const QuoteText = args.join(' ');

			// Add a new Row of quotes.
			try {
				options.quoteNumber += 1;
				const quote = Quotes.create({
					number: options.quoteNumber,
					quoteText: QuoteText,
					quotedPerson: QuotedPerson,
					quoter: message.author.username,
				});
				saveOptions(options);
				return message.reply(`Quote added, it is number: ${options.quoteNumber}`);
			} catch (err) {
				return message.reply('Error adding Quote.');
			}
		}
		// Get a specifc quote
		else if (isNumber(parseInt(args[0])) === true) {
			const quoteToGet = args.shift();

			const quote = await Quotes.findOne({
				where: {
					number: quoteToGet
				}
			});
			if (quote) {
				return message.channel.send(quote.get('quoteText')); // ---- MAKE EMBED
			}
			return message.reply(` could not find quote: ${quoteToGet}`);
		}
		// Remove quote
		else if (args[0] === 'remove') {
			args.shift();
			const quoteNumber = parseInt(args[0]);

			const rowCount = await Quotes.destroy({
				where: {
					number: quoteNumber
				}
			});
			options.quoteNumber -= 1;
			if (!rowCount) return message.reply(`quote number: ${quoteNumber} couldn't be found.`);
		}
		// Edit quote
		else if (args[0] === 'edit') {
			args.shift();
			const quoteNumber = args.shift();
			const newQuoteText = args.join(' ');

			const affectedRows = await Quotes.update({
				quoteText: newQuoteText
			}, {
				where: {
					number: quoteNumber
				}
			});
			if (affectedRows) {
				return message.reply(`Quote: ${quoteNumber} was edited.`);
			}
			return message.reply(`Could not find Quote: ${quoteNumber}`);
		}
		// Get a list of quotes
		else if (args[0] === 'list') {
			const quoteCount = await Quotes.findAll({
				attributes: ['number']
			});
			return message.channel.send(`There are: ${quoteCount.length} quote(s)`);
		}
		// Random quote 
		else {
			// Random quote
			const quoteCount = await Quotes.findAll({
				attributes: ['number']
			});

			var RandomQuote = Math.floor(Math.random() * quoteCount.length) + 1;

			const quote = await Quotes.findOne({
				where: {
					number: RandomQuote
				}
			});
			message.channel.send('Quote: ' + RandomQuote + ' -> ' + quote.get('quoteText'));
		}
	}
};

// Returns true (n) is a number and not (Nan).
function isNumber(n) {
	return ((typeof n == 'number' && !isNaN(n)) && (n > 0));
}