const Sequelize = require("sequelize");
const Discord = require("discord.js");

// Connection Information.
const sequelize = new Sequelize("database",
    "user",
    "password",
    {
        host: "localhost",
        dialect: "sqlite",
        logging: false,
        operatorsAliases: false,
        // SQLite only
        storage: "database.sqlite",
    });

// Creating the (model/table).
const guildDB = sequelize.define("guilds",
    {
        guildID: {
            type: Sequelize.INTEGER,
            unique: true,
        },
        prefix: {
            type: Sequelize.TEXT,
        },
        modRole: {
            type: Sequelize.INTEGER,
        },
        logChannel: {
            type: Sequelize.INTEGER,
        },
        guildOwnerID: {
            type: Sequelize.INTEGER,
        }
    });


var _guildID;
var _prefix;
var _modRole;
var _logChannel;
var _guildOwnerID;

// Sync Data 
guildDB.sync();

module.exports = {
    async getInfo(client, options, message, args) {

        const _guildDB = await guildDB.findOne({ where: { guildID: `${message.guild.id}` } });

        _guildID = _guildDB.get("guildID");
        _prefix = _guildDB.get("prefix");
        _modRole = _guildDB.get("modRole");
        _logChannel = _guildDB.get("logChannel");
        _guildOwnerID = _guildDB.get("guildOwnerID");


        console.log(
            `Database Info: \n 
				guildID: ${_guildID} \n
				prefix: ${_prefix} \n
				modRole: ${_modRole} \n
				logChannel: ${_logChannel} \n
				guildOwnerID: ${_guildOwnerID} \n
		`);
    }
};