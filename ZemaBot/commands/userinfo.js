const { RichEmbed } = require('discord.js');
const moment = require('moment');
require('moment-duration-format');
const status = {
	online: 'Online',
	idle: 'Idle',
	dnd: 'Do Not Disturb',
	offline: 'Offline'
};

module.exports = {
	name: 'userinfo',
	description: 'Retrive information about a specific user.',
	execute(message, args, options) {
		const member = message.mentions.members.first() || message.guild.members.get(args[0]) || message.member;
		if (!member) return message.reply('Please provide a vaild Mention or USER ID');
		let bot, mod;
		if (member.user.bot === true) {
			bot = 'Yes';
		} else {
			bot = 'No';
		}
		if (member.roles.has(options.modRole) === true) {
			mod = 'Yes';
		}  else {
			mod = 'No';
		}
		const embed = new RichEmbed()
			.setColor('#45DE15')
			.setThumbnail(`${member.user.displayAvatarURL}`)
			.setAuthor(`${member.user.tag} (${member.id})`, `${member.user.displayAvatarURL}`)
			.addField('Nickname:', `${member.nickname !== null ? `Nickname: ${member.nickname}` : 'No nickname'}`, true)
			.addField('Bot?', `${bot}`, true)
			.addField('Moderator?', `${mod}`, true)
			.addField('Playing', `${member.user.presence.game ? `${member.user.presence.game.name}` : 'not playing anything.'}`, true)
			.addField('Status', `${status[member.user.presence.status]}`, true)
			.addField('Roles', `${member.roles.filter(r => r.id !== message.guild.id).map(roles => `\`[ ${roles.name} ]\``).join(' **|** ') || 'No Roles'}`, true)
			.addField('Joined At', `${moment.utc(member.joinedAt).format('llll')}`, true)
			.addField('Created At', `${moment.utc(member.user.createdAt).format('llll')}`, true);

		message.channel.send(embed);
	}
};
