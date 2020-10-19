const Discord = require("discord.js");
const moment = require("moment-timezone");

module.exports = {
    name: "serverinfo",
    description: "Display Information about the current server.",
    execute(client, guildConf, message, args) {

        // Get the server roles, sort via the [position] and then reverse the entire thing so it counts down 3, 2, 1 ... etc
        let serverRoles = message.guild.roles.sort((first, next) => first.position - next.position)
            .map(r => `${r.name}`).reverse().join("] [");
        // Get all memebers with a status of 'online'
        let onlineMembers = message.guild.members.filter(m => m.presence.status === "online");
        // Get all memebers with a status of 'idle'
        let idleMembers = message.guild.members.filter(m => m.presence.status === "idle");
        // Get all memebers with a status of 'do not disturb'
        let dndMembers = message.guild.members.filter(m => m.presence.status === "dnd");
        // Get all memebers with a status of 'offline'
        let offlineMembers = message.guild.members.filter(m => m.presence.status === "offline");

        const embed = new Discord.RichEmbed()
            .setTitle("Server Information")
            .setColor("0ED4DA")
            .setThumbnail(message.guild.iconURL)
            .addField("Server Name", `${message.guild.name} (${message.guild.nameAcronym})`)
            .addField("Server Owner", message.guild.owner.user.tag, true)
            .addField("Server Region", message.guild.region, true)
            .addField("Server Created at", `${moment.utc(message.guild.createdAt).format("llll")}`, true)
            .addField("Total members", message.guild.memberCount, true)
            .addField("Active members", `${(onlineMembers.size + idleMembers.size + dndMembers.size)}`, true)
            .addField("Offline members", `${offlineMembers.size}`, true)
            .addField("Roles", `\`\`\`[ ${serverRoles} ]\`\`\``);

        // Send the message
        message.channel.send(embed);
    }
};