module.exports = {
    name: "setModChannel",
    description: "Sets the mod channel to send mod logs.",
    execute(client, options, message, args) {

        // if no ID Specified { } <------------- WORK ON THIS ------------- >

        // Get the current channel and set it as the Mod channel.
        options.modChannelID = message.channel.id;

        // Get the channel using options['modChannelID']
        var modChannel = client.channels.get(options.modChannelID);

        // Tell the user the channel has been set.
        message.channel.send("The mod channel has been set to: #" + `${modChannel.name}`);
        // Save the options.json
        saveOptions(options);
    }
};