module.exports = {
    name: "ping",
    description: "Ping~ Pong!",
    execute(client, guildConf, message, args) {
        message.channel.send("Pong.");
    }
};