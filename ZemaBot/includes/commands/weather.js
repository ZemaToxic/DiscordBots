const Discord = require('discord.js');
const weather = require("weather-js");


module.exports = {
	name: 'weather',
	description: 'Sends an embed with weather data for a location.',
	execute(client, options, message, args) {

		weather.find({
			search: args,
			degreeType: 'C'
		}, function (err, result) {
			if (result === undefined || result.length === 0) {
                message.reply('please enter in a location')
                return
            } else if (err) {
                console.log(err)
                return
            }

            let current = result[0].current
            let location = result[0].location
            let alert = location.alert
            let imageL = current.imageUrl

            if (alert === undefined) {
                alert = 'No Alerts'
            }

            const embed = new Discord.RichEmbed()
                .setDescription(`**Weather for ${current.observationpoint}**`)
                .setThumbnail(imageL)
                .setColor(0x00AE86)
                .addField('Sky', current.skytext, true)
                .addField('Temperature', `${current.temperature}°C`, true)
                .addField('Feels Like', `${current.feelslike}°C`, true)
                .addField('Humidity', `${current.humidity}%`, true)
                .addField('Wind speed', current.winddisplay, true)
                .addField(`Alerts: ${alert}`)

                message.channel.send(embed)            
		});
	}
};