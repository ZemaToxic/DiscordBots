const Discord = require("discord.js")
const url = require("../../utility/urlHandler.js");

module.exports = {
    name: "convert",
    description: "Convert currency from one type to another.",
    async execute(client, guildConf, message, args) {
        
        let amount = args [0]
        let countryCode = args[1].toLowerCase()
        let convertCode = args[2].toLowerCase()
        let sendURL = 'http://www.floatrates.com/daily/' + countryCode + '.json'
        
        let returnVar = await url.urlHandler(sendURL)

        if(!returnVar) { message.channel.send('Something went wrong, please try again.');
         return; }
        else{
  
            amount = amount * returnVar[convertCode]['rate']

            const embed = new Discord.RichEmbed()
            .setTitle("Converted Currency.")
            .addField(args[1].toUpperCase(), args[0], true)
            .addField(args[2].toUpperCase(), amount.toFixed(2), true)
            .setColor("006400");

            message.channel.send(embed)
        }
    }
};