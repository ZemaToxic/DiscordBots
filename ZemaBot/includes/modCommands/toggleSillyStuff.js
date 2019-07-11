module.exports = {
	name: "toggleSillyStuff",
	description: "Toggle if the silly stuff is enabled",
	execute(client, guildConf, message, args) {
		if (guildConf.sillyStuff == "false") {
			guildConf.sillyStuff = "true";
		} else {
			guildConf.sillyStuff = "false";
		}
	}
};