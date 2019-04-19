module.exports = {
    name: "latency",
    description: "",
    execute(client, options, message, args) {
        let start = Date.now();
        message.channel.send("Pinging...").then(message => {
            message.delete();
            let diff = (Date.now() - start).toLocaleString();
            let API = client.ping.toFixed(2);
            message.channel.send(`Ping: \`${diff}ms\` \nAPI: \`${API}ms\``);
        });
    }
};