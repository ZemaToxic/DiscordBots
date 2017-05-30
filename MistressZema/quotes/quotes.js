/// ~~~~~~~~ SQL ~~~~~~~~~~
const sql = require('sqlite');
/// ~~~~~~~~ SQL ~~~~~~~~~~
sql.open('../quotes.sqlite');
console.log('../quotes.sqlite')
exports.run = (client, message, args) => {
    console.log(args)
    // ~~~~~~~~~~ SQL TEST ~~~~~~~~~~~~~
    sql.get(`SELECT * FROM quotes WHERE quoteId ='${args[0]}'`).then(row => {
        if (!row) {
            sql.run('INSERT INTO quotes (quoteId, quote, addedBy, date) VALUES (?, ?, ?, ?)', [args[0], args[1], args[3], args[4]]);
        } else {
            console.log("I BROKE");
 ;
        }
    }).catch(() => {
        console.log("I BROKE MORE");
        console.error;
        sql.run('CREATE TABLE IF NOT EXISTS quotes (quoteId INTERGER, quote TEXT, addedBy TEXT, date TEXT)').then((
            sql.run('INSERT INTO quotes (quoteId, quote, addedBy, date) VALUES (?, ?, ?, ?)', [args[0], args[1], args[3], args[4]])))
    });
}