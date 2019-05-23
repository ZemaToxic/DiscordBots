const clientData = require("./../jsonFiles/ClientData.json");

function clean(text) {
    if (typeof (text) === "string") {
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    } else {
        return text;
    }
}

module.exports = {
    name: "eval",
    description: "NodeJs Eval command, only works for @ZemaToxic",
    execute(client, guildConf, message, args) {
        // Do command stuff here
        if (message.author.id !== clientData.OwnerID) {
            return message.channel.send("You aren't allowed to do that.");
        }
        try {
            const code = args.join(" ");
            let evaled = eval(code);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);

            message.channel.send(clean(evaled),
                {
                    code: "xl",
                    split: true,
                });
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
        }
    }
};