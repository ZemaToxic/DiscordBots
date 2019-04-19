module.exports = {
    name: "setModRole",
    description: "Sets the Mod Role.",
    execute(client, options, message, args) {

        // if no ID Specified { } <------------- WORK ON THIS ------------- >


        //
        const modRole = message.mentions.roles.first().id;

        //
        options.modRole = modRole;

        // Tell the user the modRole 
        message.channel.send("The mod role has been set to: " + `${modRole}`);
        // Save the options.json
        saveOptions(options);
    }
};