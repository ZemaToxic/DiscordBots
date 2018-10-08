const { RichEmbed } = require('discord.js');
var moment = require('moment-timezone');

module.exports = {
  name: 'serverinfo',
  description: 'Display Information about the current server.',
  execute(message, args, options, client) {

    var serverRoles = message.guild.roles.map(r => ` ${r.name}`);
    var onlineMembers = message.guild.members.filter(m => m.presence.status === 'online');
    var idleMembers = message.guild.members.filter(m => m.presence.status === 'idle');
    var dndMembers = message.guild.members.filter(m => m.presence.status === 'dnd');
    var offlineMembers = message.guild.members.filter(m => m.presence.status === 'offline');

    const embed = new RichEmbed()
      .setTitle("Server Information")
      .setColor("0ED4DA")
      .setThumbnail(message.guild.iconURL)
      .addField('Server Name', `${message.guild.name} (${message.guild.nameAcronym})`, true)
      .addField('Server Owner', message.guild.owner.user.tag, true)
      .addField("Server Created at", `${moment.utc(message.guild.createdAt).format("llll")}`, true)
      .addField("Total members", message.guild.memberCount, true)
      .addField("Active members", `${(onlineMembers.size + idleMembers.size + dndMembers.size)}`, true)
      .addField("Offline members", `${offlineMembers.size}`, true)
      .addField("Roles", `${serverRoles}`);

      // Send the message
      message.channel.send(embed);
  }
};
