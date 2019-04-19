module.exports = {
    name: "ping",
    description: "Ping~ Pong!",
    execute(client, options, message, args) {
        message.channel.send("Pong.");
    }
};