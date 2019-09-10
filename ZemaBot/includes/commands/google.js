const Discord = require("discord.js")
var scraper = require('google-search-scraper');

module.exports = {
    name: "google",
    description: "Google something cause *someone* is too lazy to do it themselves.",
    async execute(client, guildConf, message, args) {
        
        var options = {
            query: args[0],
            limit: 1
        }
            scraper.search(options, function(err, url, meta) {
                // This is called for each result
                if(err) throw err;
                const embed = new Discord.RichEmbed()
                .setTitle(url)
                .addField(meta.title,meta.desc, true)
                .setColor("560500");
    
                message.channel.send(embed)
            });
    }
};