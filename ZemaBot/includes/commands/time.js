const Discord = require("discord.js");
let moment = require("moment-timezone");

module.exports = {
    name: "time",
    description: "Display the current time in various timezones.",
    execute(client, guildConf, message, args) {

        // Make a local variable of the current time.
        let currentDate = new Date();

        const embed = new Discord.RichEmbed()
            .setTitle("Current Time")
            .setDescription("Current time in various time zones.")
            .addField("Auckland NZ", `${moment.tz(currentDate, "Pacific/Auckland").format("llll")}`, true)
            .addField("Sydney AUS", `${moment.tz(currentDate, "Australia/Sydney").format("llll")}`, true)
            .addField("London UK", `${moment.tz(currentDate, "Europe/London").format("llll")}`, true)
            .addField("Berlin DE", `${moment.tz(currentDate, "Europe/Berlin").format("llll")}`, true)
            .addField("Los Angeles US", `${moment.tz(currentDate, "America/Los_Angeles").format("llll")}`, true)
            .addField("Toronto CA", `${moment.tz(currentDate, "America/Toronto").format("llll")}`, true)
            .setColor(0x42F4AA)
            .setTimestamp(new Date());

        // Send the message
        message.channel.send(embed);

    }
};