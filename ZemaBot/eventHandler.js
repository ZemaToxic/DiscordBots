const {
  RichEmbed
} = require('discord.js');

module.exports = {
  // guildMemberAdd function.
  memberAdd: function(client, options, member) {
    console.log("Member Joined");
    // Make a new RichEmbed
    const embed = new RichEmbed()
      .setTitle('User Joined.')
      .setThumbnail(`${member.user.displayAvatarURL}`)
      .setDescription('New user joined ' + member + ', there username is: ' + member.user.username)
      .setColor(0x4EF442)
      .setTimestamp(new Date());

    // Send the message to the Mod Channel
    client.channels.get(options.modChannelID).send(embed);
  },

  // guildMemberRemove function.
  memberRemove: function(client, options, member) {
    console.log("Member Left");
    // Make a new RichEmbed
    const embed = new RichEmbed()
      .setTitle('User Left.')
      .setThumbnail(`${member.user.displayAvatarURL}`)
      .setDescription('User: ' + member + ' has bitched out, their username was: ' + member.user.username)
      .setColor(0xF44242)
      .setTimestamp(new Date());

    // Send the message to the Mod Channel
    client.channels.get(options.modChannelID).send(embed);
  },

  // guildMemberUpdate function.
  memberUpdate: function(client, options, oldMember, newMember) {
    console.log("Guild Member Changed something");

    // If user nickname changes.
    if (oldMember.nickname != newMember.nickname) {

      // Make local vars
      var oldName = oldMember.nickname;
      var newName = newMember.nickname;

      // If no set nickname, use the user's username.
      if (oldMember.nickname == null) {
        oldName = oldMember.user.username;
      }
      if (newMember.nickname == null) {
        newName = newMember.user.username;
      }

      // Make a new RichEmbed
      const embed = new RichEmbed()
        .setTitle('User Nickname changed.')
        .setThumbnail(`${oldMember.user.displayAvatarURL}`)
        .setDescription('User: ' + oldMember.user.username + '\'s nickname changed, it was: ' + oldName + ', it is now: ' + newName)
        .setColor(0xFF7700)
        .setTimestamp(new Date());

      // Send the message to the Mod Channel
      client.channels.get(options.modChannelID).send(embed);
      return;
    }

    // If user roles change.
    if (oldMember.roles != newMember.roles) {

      // Make local vars.
      var oldRoles = [];
      var newRoles = [];

      // Get the roles from the user and push to our local vars.
      oldMember.roles.forEach(function(k, v) {
        oldRoles.push(k.name);
      });
      newMember.roles.forEach(function(k, v) {
        newRoles.push(k.name);
      });

      // If a role was Added.
      if (oldRoles.length < newRoles.length) {
        var addedChange = filterArray(newRoles, oldRoles)[0];

        // Make a new RichEmbed
        const embed = new RichEmbed()
          .setTitle('User Role changed.')
          .setThumbnail(`${oldMember.user.displayAvatarURL}`)
          .setDescription('User: ' + oldMember + ' has gained the role: ' + addedChange)
          .setColor(0xFF7700)
          .setTimestamp(new Date());

        // Send the message to the Mod Channel
        client.channels.get(options.modChannelID).send(embed);
      }
      // If a role was Removed.
      else {
        var removedChange = filterArray(oldRoles, newRoles)[0];

        // Make a new RichEmbed
        const embed = new RichEmbed()
          .setTitle('User Role changed.')
          .setThumbnail(`${oldMember.user.displayAvatarURL}`)
          .setDescription('User: ' + oldMember + ' has lost the role: ' + removedChange)
          .setColor(0xFF7700)
          .setTimestamp(new Date());

        // Send the message to the Mod Channel
        client.channels.get(options.modChannelID).send(embed);
      }
      return;
    }
  },

  // guildBanAdd function.
  banAdd: function(client, options, member) {
    console.log("Member Banned");
    // Make a new RichEmbed
    const embed = new RichEmbed()
      .setTitle('User Banned.')
      .setThumbnail(`${member.user.displayAvatarURL}`)
      .setDescription('User: ' + member.user.username + ' was banned.')
      .setColor(0xF442DC)
      .setTimestamp(new Date());

    // Send the message to the Mod Channel
    client.channels.get(options.modChannelID).send(embed);
  },

  // messageDelete function.
  messageDelete: function(client, options, message) {
    console.log("Message Deleted");
    // Make sure the message isnt from the Bot.
    if (message.author === client.user) return;
    // Make a new RichEmbed
    const embed = new RichEmbed()
      .setTitle('Message Deleted.')
      .setThumbnail(`${message.author.displayAvatarURL}`)
      .setDescription('Message sent by: ' + message.author.username + ' deleted.')
      .addField('Deleted Message', message)
      .setColor(0xF44242)
      .setTimestamp(new Date());

    // Send the message to the Mod Channel
    client.channels.get(options.modChannelID).send(embed);
  },

  // messageUpdate function.
  messageUpdate: function(client, options, oldMessage, newMessage) {

    // return if the message came from the bot.
    if (oldMessage.author.tag === client.user.tag) return;
    if (oldMessage.embeds === true) return;
    // (link checker? idfk)
    if (oldMessage.content === newMessage.content) return;

    // Make a new RichEmbed
    const embed = new RichEmbed()
      .setTitle('Message modified')
      .setThumbnail(`${oldMessage.author.displayAvatarURL}`)
      .setDescription('Message modifed by: ' + oldMessage.author.username)
      .setColor(0xCCC000)
      .addField('Before: ', oldMessage.content)
      .addField('After: ', newMessage.content)
      .setTimestamp(new Date());

    // Send the message to the Mod Channel
    client.channels.get(options.modChannelID).send(embed);
  },

  // bulkDelete function
  bulkDelete: function(client, options, messages) {

    // Grab the purged messages and who sent them.
    var purgedMessages = messages.map(c => `${c.author.username}: ${c.content || c.embeds[0].title} \n`).reverse();
    // remove the comma's and replace them with nothing.
    var cleanedString = purgedMessages.toString().replace(/,/g, '');
    // surround the new messages in code tags.
    var codeBlock = '\`\`\`\n' + cleanedString + '\`\`\`';

    // Grab the channel the messages where purged from.
    var purgedChannel = messages.map(c => c.channel);
    // get the first one.
    var firstChannel = purgedChannel[0];

    // Grab the user who purged.
    var purger = messages.map(u => u.author.username);

    // Make a new RichEmbed
    const embed = new RichEmbed()
      .setTitle('Messages purged.')
      .setDescription('Messages purged in channel: ' + firstChannel)
      .setColor(0xFF0092)
      .addField('Deleted Messages: ', codeBlock, true)
      .addBlankField(false)
      .addField('Total Messages purged', purgedMessages.length, true)
      .addField('Purged by:', purger[0], true)
      .setTimestamp(new Date());

    // Send the message to the Mod Channel
    client.channels.get(options.modChannelID).send(embed).catch(e => {
      console.log(e);
    });
  },

  // error Handler.
  errorHandler: function(client, options, error) {
    //  console.log(error.error);
    // Make a new RichEmbed
    const embed = new RichEmbed()
      .setTitle('Bot Experianced an error.')
      .setDescription('Error of type: ' + error.message)
      .addField('Error object:', '\`\`\`' + error.error + '\`\`\`')
      .setColor(0xA100FF)
      .setTimestamp(new Date());

    // Send the message to the Mod Channel
    client.channels.get(options.modChannelID).send(embed);
  }
};

// Custom function used in memberUpdate.
function filterArray(src, filt) {
  var temp = {},
    i, result = [];
  for (i = 0; i < filt.length; i++) {
    temp[filt[i]] = true;
  }
  for (i = 0; i < src.length; i++) {
    if (!(src[i] in temp)) {
      result.push(src[i]);
    }
  }
  return result;
}
