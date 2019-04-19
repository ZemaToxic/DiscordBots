const Discord = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

module.exports = {
    name: "stats",
    description: "Display Bot status etc.",
    execute(client, options, message, args) {

        const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");

        const embed = new Discord.RichEmbed()
            .setTitle("Bot Statistics")
            .setThumbnail(client.user.displayAvatarURL)
            .setDescription("Statistics about the bot.")
            .addField("Memory Usage", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
            .addField("Bot Uptime", duration, true)
            .addField("Users", `${client.users.size.toLocaleString()}`, true)
            .addField("Servers", `${client.guilds.size.toLocaleString()}`, true)
            .addField("Channels", `${client.channels.size.toLocaleString()}`, true)
            .addField("Discord.js version", `v${Discord.version}`, true)
            .addField("Node.js version", `${process.version}`, true)
            .setColor(0x42F4EE)
            .setTimestamp(new Date());

        // Send the message
        message.channel.send(embed);
    }
};