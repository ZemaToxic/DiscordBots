module.exports = {
    name: "setPrefix",
    description: "Set the Bot prefix.",
    execute(client, guildConf, message, args) {
        const newPrefix = args[0];

        // Make sure the user has supplied a prefix.
        if (newPrefix == null) {
            message.reply("please specifiy a new prefix");
            return;
        }
        // Update the prefix to the requested one.
        guildConf.prefix = newPrefix;
        // Tell the client the Prefix has been updated.
		message.channel.send("The Bot's prefix has been changed to: " + newPrefix);
    }
};