const { RichEmbed } = require('discord.js');
var moment = require('moment-timezone');

module.exports = {
  name: 'time',
  description: 'Display the current time in various timezones.',
  execute(message, args, options, client) {

    // Make a local variable of the current time.
    var currentDate = new Date();

    const embed = new RichEmbed()
      .setTitle('Current Time')
      .setDescription('Current time in various time zones.')
      .addField('Auckland NZ', `${moment.tz(currentDate, "Pacific/Auckland").format("llll")}`, true)
      .addField('Brisbane AUS', `${moment.tz(currentDate, "Australia/Brisbane").format("llll")}`, true)
      .addBlankField()
      .addField('London UK', `${moment.tz(currentDate, "Europe/London").format("llll")}`, true)
      .addField('Los Angeles US', `${moment.tz(currentDate, "America/los_Angeles").format("llll")}`, true)
      .setColor(0x42F4AA)
      .setTimestamp(new Date());

    // Send the message
    message.channel.send(embed);

  }
};

// Spare <---------------->

// .addField(' ', ` `, true)
// .addField(' ', ` `, true)
// .addField(' ', ` `, true)
