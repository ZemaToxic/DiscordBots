const Discord = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

const status = { online: "Online", idle: "Idle", dnd: "Do Not Disturb", offline: "Offline" };

module.exports = {
    name: "userinfo",
    description: "Retrive information about a specific user.",
    execute(client, guildConf, message, args) {
        if (!message.channel) { return; }
        else {
            const resolveMember = (message, (message.mentions.members.first() || message.guild.members.get(args[0]) || message.member));

            if (!resolveMember) return message.reply("Please provide a vaild Mention or USER ID");

            let bot = "No";
            let mod = "No";
            if (resolveMember.bot === true) { bot = "Yes"; }
            if (resolveMember.roles.has(guildConf.modRole) === true) { mod = "Yes"; }

            const embed = new Discord.RichEmbed()
                .setColor("#45DE15")
                .setThumbnail(`${resolveMember.user.displayAvatarURL}`)
                .setAuthor(`${resolveMember.user.tag} (${resolveMember.id})`, `${resolveMember.user.displayAvatarURL}`)
                .addField("Nickname:", `${resolveMember.nickname !== null ? `Nickname: ${resolveMember.nickname}` : "No nickname"}`, true)
                .addField("Bot?", `${bot}`, true)
                .addField("Moderator?", `${mod}`, true)
                .addField("Playing", `${resolveMember.user.presence.game ? `${resolveMember.user.presence.game.name}` : "not playing anything."}`, true)
                .addField("Status", `${status[resolveMember.user.presence.status]}`, true)
                .addField("Roles", `${resolveMember.roles.filter(r => r.id !== message.guild.id).map(roles => `\`[ ${roles.name} ]\``).join(" **|** ") || "No Roles"}`, true)
                .addField("Joined At", `${moment.utc(resolveMember.joinedAt).format("llll")}`, true)
                .addField("Created At", `${moment.utc(resolveMember.user.createdAt).format("llll")}`, true);
            message.channel.send(embed);
        }
    }
};