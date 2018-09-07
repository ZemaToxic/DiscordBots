/// ~~~~~~~~ SQL ~~~~~~~~~~
const sql = require('sqlite');
/// ~~~~~~~~ SQL ~~~~~~~~~~
sql.open('./ZemabotDB.sqlite');
console.log(sql);


exports.run = (client, message, args) => {

    // ~~~~~~~~~~ SQL TEST ~~~~~~~~~~~~~
    var totalQuotes;

    // IF count return user swear amounts.
    if (args[0] === "count") {

        args.splice(0, 1);

        var quoteToAdd = args.join(' ')


        sql.run('CREATE TABLE IF NOT EXISTS quotes ( ID INTEGER, quote TEXT, addedBy TEXT, date TEXT)')
            .then((
                sql.run('INSERT INTO quotes ( quote, addedBy, date) VALUES (?, ?, ?)',
                    [quoteToAdd,
                        message.author.username,
                        getCurrentDate()])));

        sql.get(`SELECT COUNT(quote) FROM quotes`).then(row => {

            // Set The var QUOTENUMBER to be the new Max number of Quotes
            QUOTENUMBER = row["COUNT(quote)"];

        }).catch(() => {
            console.error;
        });

        // Send a embed message Saying a quote has been added and the ID to use when calling it.
        message.channel.send({
            embed: {
                color: 3464001,
                fields: [{
                    name: 'Quote Added',
                    value: quoteToAdd
                },
                {
                    name: '-------------------------------------',
                    value: 'It has been saved as Quote: ' + (QUOTENUMBER + 1),
                }
                ],
                timestamp: new Date(),
                footer: {
                    text: message.author.username
                }
            }
        });
    }
}
        catch (err) {
    console.log(err)
}
