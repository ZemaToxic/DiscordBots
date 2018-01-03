/// ~~~~~~~~ SQL ~~~~~~~~~~
const sql = require('sqlite');
/// ~~~~~~~~ SQL ~~~~~~~~~~
sql.open('./ZemabotDB.sqlite');
console.log(sql);	

// Used to make js Wait and calm the fuck down
var sleep = require('system-sleep');


exports.run = (client, message, args/*,swearAmount*/) => {

    // ~~~~~~~~~~ SQL TEST ~~~~~~~~~~~~~
    //var UserAmount;

    var UserAmount = new Number();
    /*
    if (swearAmount != null) {
        var SwearTotal;

        sql.get(`SELECT User, SwearCount FROM UserSwears WHERE User = '${message.author.username}'`).then(row => {

            // Set UserAmount to be the current value of SwearCount.
            UserAmount = `${row.SwearCount}`;

            // Log for Sanity Reasons
            console.log(row)

        }).catch(() => {
            console.error;
        });

        // Temp pause for normality sakes
        sleep(1000)

        //// ADD swearAmount
        UserAmount++;
        ////

        // Add new Swear to total
        sql.run('CREATE TABLE IF NOT EXISTS UserSwears (User TEXT UNIQUE, SwearCount INTEGER)')
            .then(
            (
                // Update swear number to new value
                sql.run(`UPDATE UserSwears SET SwearCount = '${UserAmount}' where User = '${message.author.username}'`
                ).catch(() => {
                    console.err;
                }))
            );
        // Log out shit for my own sake
        console.log(message.author.username, UserAmount)
    }
    */

    if (args[0] === "add1") {
        var SwearTotal;

        sql.get(`SELECT User, SwearCount FROM UserSwears WHERE User = '${message.author.username}'`).then(row => {

            // Set UserAmount to be the current value of SwearCount.
            UserAmount = `${row.SwearCount}`;

            // Log for Sanity Reasons
            console.log(row)

        }).catch(() => {
            console.error;
        });

        // Temp pause for normality sakes
        sleep(1000)

        UserAmount++;

        // Add new Swear to total
        sql.run('CREATE TABLE IF NOT EXISTS UserSwears (User TEXT UNIQUE, SwearCount INTEGER)')
            .then(
            (
                // Update swear number to new value
                sql.run(`UPDATE UserSwears SET SwearCount = '${UserAmount}' where User = '${message.author.username}'`
                ).catch(() => {
                    console.err;
                }))
            );
        // Log out shit for my own sake
        console.log(message.author.username, UserAmount)
    }

    // IF count return user swear amounts.
    if (args[0] === "count") {

        var Swear_Count = 0;

        sql.get(`SELECT User, SwearCount FROM UserSwears WHERE User = '${message.author.username}'`).then(row => {

            // Set UserAmount to be the current value of SwearCount.
            Swear_Count = `${row.SwearCount}`;

            // Send an embed with the Swear Count back to Discord.
            message.channel.send({
                embed: {
                    color: 3464001,
                    fields: [{
                        name: 'Swear Total',
                        value: 'Amount of Swears: ' + Swear_Count
                    }],
                    footer: {
                        text: "Requested by " + message.author.username
                    }
                }
            });
            message.channel.send('Amount of Swears: ' + Swear_Count)
        }).catch(() => {
            console.error;
        });
    }
}