const Discord = require("discord.js");
const weather = require("weather-js");


module.exports = {
    name: "weather",
    description: "Sends an embed with weather data for a location.",
    execute(client, guildConf, message, args) {

        weather.find({ search: args, degreeType: "C" },
            function(err, result) {
                if (result === undefined || result.length === 0) {
                    message.reply("please enter in a location");
                    return;
                } else if (err) {
                    console.log(err);
                    return;
                }

                let alert = result[0].location.alert;
                if (!alert) {
                    alert = "No Alerts";
                }

                const embed = new Discord.RichEmbed()
                    .setDescription(`**Weather for ${result[0].current.observationpoint}**`)
                    .setThumbnail(result[0].current.imageUrl)
                    .setColor(0x00AE86)
                    .addField("Sky", result[0].current.skytext, true)
                    .addField("Temperature", `${result[0].current.temperature}°C`, true)
                    .addField("Feels Like", `${result[0].current.feelslike}°C`, true)
                    .addField("Humidity", `${result[0].current.humidity}%`, true)
                    .addField("Wind speed", result[0].current.winddisplay, true)
                    .addField("Alerts:", alert);

                message.channel.send(embed);
            });
    }
};