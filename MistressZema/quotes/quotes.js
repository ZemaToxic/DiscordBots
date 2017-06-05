/// ~~~~~~~~ SQL ~~~~~~~~~~
const sql = require('sqlite');
/// ~~~~~~~~ SQL ~~~~~~~~~~
sql.open('./mistressZema.sqlite');
console.log(sql);	

var conToMilli      = 60 * 60 * 1000
var timeZone        = 0

// -- Get Date of Streamer For BAN CODE --
function getCurrentDate() {
    // Convert My timezone to Streamers Time Zone, 

    var date = new Date((new Date).getTime() - timeZone * conToMilli);
    // (NZ time - Ed Time) * ( 60 Minutes ) * ( 60 Seconds ) * ( 1000 Milliseconds )

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    StreamersDate = date

    return day + "/" + month + "/" + year;// + " -- " + hour + ":" + min + ":" + sec;
}

exports.run = (client, message, args) => {

    // ~~~~~~~~~~ SQL TEST ~~~~~~~~~~~~~
    var totalQuotes;

    if (args[0] === undefined)
    {
        message.channel.send("TESTESTEST");
    }


    // IF ID IS ENTERED
    var quoteNumber = args[0];

    if (args[0] === quoteNumber) {
       sql.get(`SELECT seq FROM sqlite_sequence WHERE name = 'quotes'`).then(row => {
            totalQuotes = row;
        }).catch(() => {
            console.error;
            });

        sql.get(`SELECT * FROM quotes WHERE ID ='${quoteNumber}'`).then(row => {

            message.channel.send({
                embed: {
                    color: 3447003,
                    fields: [{
                        name: 'Quote',
                        value: `${row.quote}`
                    },
                    {
                        name: "-------------------------",
                        value: 'Quote: ' + quoteNumber + "/" + `${totalQuotes.seq}`
                    }],
                    footer: {
                    text: "Added by " + message.author.username + " | On: " + `${row.date}`
                    }
                }
            });
            
        }).catch(() => {
            console.error;
        });
    }

    // IF ADD
    if (args[0] === "add") {

        args.splice(0, 1);
        
        var quoteToAdd = args.join(' ')
        
        sql.run('CREATE TABLE IF NOT EXISTS quotes ( ID INTEGER, quote TEXT, addedBy TEXT, date TEXT)')
            .then((
                sql.run('INSERT INTO quotes ( quote, addedBy, date) VALUES (?, ?, ?)',
                    [quoteToAdd,
                    message.author.username,
                    getCurrentDate()])));

        message.channel.send({
            embed: {
                color: 3464001,
                fields: [{
                    name: 'Quote Added',
                    value: quoteToAdd
                },
                {
                    name: '-------------------------------------',
                    value: 'It has been saved as Quote: '
                }
                ],
                timestamp: new Date(),
                footer: {
                    text: message.author.username
                }
            }
        });
    }

    // IF DEL
    if (args[0] === "del")
    {
        var quoteNumbertoDel = args[1];
        sql.get(`SELECT * FROM quotes WHERE ID ='${quoteNumbertoDel}'`).then(row => {

            // OLLOLDSADS
            message.channel.send({
                embed: {
                    color: 16711680,
                    fields: [{
                        name: 'Quote Deleted',
                        value: `${row.quote}`
                    },
                    {
                        name: "-------------------------",
                        value: 'Quote: ' + quoteNumbertoDel
                    }],
                    footer: {
                        text: "Added by " + message.author.username + " | On: " + `${row.date}`
                    }
                }
            });

            sql.run(`DELETE FROM quotes WHERE ID ='${quoteNumbertoDel}'`)
        }).catch(() => {
            console.error;
        });
    }

    // IF EDIT
    if (args[0] === "edit")
    {
        args.splice(0, 1);
        var quoteNumToEdit = args[0];

        args.splice(0, 1);
        var quoteToEdit = args.join(' ')


        sql.run(`UPDATE quotes SET quote = '${quoteToEdit}' where ID = '${quoteNumToEdit}'`)

        // OLLOLDSADS
        message.channel.send({
            embed: {
                color: 16383744,
                fields: [{
                    name: 'Quote Edited - New Quote',
                    value: `${quoteToEdit}`
                },
                {
                    name: "-------------------------",
                    value: 'Quote: ' + quoteNumToEdit
                }],
                footer: {
                    text: "Edited by " + message.author.username
                }
            }
        });

    }

    // IF TEST
    if (args[0] === "test") {
        //args.splice(0, 1);
        //var quoteNumToEdit = args[0];

        //args.splice(0, 1);
        //var quoteToEdit = args.join(' ')

       // sql.run(`DELETE FROM quotes WHERE ID ='${quoteNumToEdit}'`)

        try {
            var quoteToEdit = args[1]

            sql.run(`DELETE FROM quotes WHERE ID ='${quoteToEdit}'`)

            sql.get(`SELECT seq FROM sqlite_sequence WHERE name = 'quotes'`).then(row => {
                totalQuotes = row;

                var quotesOnwardsToEdit = parseInt(quoteToEdit) + 1;

                console.log(quotesOnwardsToEdit)

                for (i = quotesOnwardsToEdit; i < totalQuotes.seq; i++) {

                    sql.get(`SELECT * FROM quotes WHERE ID >'${quoteToEdit}'`).then(row => {
                 // console.log("ROW ID: " + row.ID)
                 // console.log("CURRENT ROW: " + i)
                 // console.log("TOTAL QUOTES: " + totalQuotes.seq)
                 // console.log("~~~~~~~~~~~~~~~~");
                  var j = row.ID - 1;
                 // console.log("ID - 1: " + j)
                 // console.log("!!!!!!!!!!!!!!!!")
                    sql.run(`UPDATE quotes SET ID = '${j}' where ID = '${row.ID}'`);
                  })

            }

            }).catch(() => {
                console.error;
            });


        }
        catch (err) {
            console.log(err)
        }

        //// OLLOLDSADS
        //message.channel.send({
        //    embed: {
        //        color: 16383744,
        //        fields: [{
        //            name: 'Quote Edited - New Quote',
        //            value: `${quoteToEdit}`
        //        },
        //        {
        //            name: "-------------------------",
        //            value: 'Quote: ' + quoteNumToEdit
        //        }],
        //        footer: {
        //            text: "Edited by " + message.author.username
        //        }
        //    }
        //});

    }
}