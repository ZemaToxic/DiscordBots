const { RichEmbed } = require('discord.js');

module.exports = {
    name: 'randomColour',
    description: 'Make a new embed with a new random colour.',
    execute(message, args, options, client) {

      const randomColor = "#000000".replace(/0/g, function() {
        return (~~(Math.random() * 16)).toString(16);
      });

      const embed = new RichEmbed()
        .setTitle('Random Colour created.')
        .setDescription(`New Colour created ${randomColor.toUpperCase()}`)
        .setColor(randomColor);

      // Send the message to the Channel
      message.channel.send(embed);
    }
};
