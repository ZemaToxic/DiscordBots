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

   //  IF DEL
   // if (args[0] === "del")
   // {
   //     var quoteNumbertoDel = parseInt(args[1]);
   //     sql.get(`SELECT * FROM quotes WHERE ID ='${quoteNumbertoDel}'`).then(row => {

   //          OLLOLDSADS
   //         message.channel.send({
   //             embed: {
   //                 color: 16711680,
   //                 fields: [{
   //                     name: 'Quote Deleted',
   //                     value: `${row.quote}`
   //                 },
   //                 {
   //                     name: "-------------------------",
   //                     value: 'Quote: ' + quoteNumbertoDel
   //                 }],
   //                 footer: {
   //                     text: "Added by " + message.author.username + " | On: " + `${row.date}`
   //                 }
   //             }
   //         });

   //         sql.run(`DELETE FROM quotes WHERE ID ='${quoteNumbertoDel}'`)
   //     }).catch(() => {
   //         console.error;
   //     });
   // }

   //  IF EDIT
   // if (args[0] === "edit")
   // {
   //     args.splice(0, 1);
   //     var quoteNumToEdit = args[0];

   //     args.splice(0, 1);
   //     var quoteToEdit = args.join(' ')


   //     sql.run(`UPDATE quotes SET quote = '${quoteToEdit}' where ID = '${quoteNumToEdit}'`)

   //      OLLOLDSADS
   //     message.channel.send({
   //         embed: {
   //             color: 16383744,
   //             fields: [{
   //                 name: 'Quote Edited - New Quote',
   //                 value: `${quoteToEdit}`
   //             },
   //             {
   //                 name: "-------------------------",
   //                 value: 'Quote: ' + quoteNumToEdit
   //             }],
   //             footer: {
   //                 text: "Edited by " + message.author.username
   //             }
   //         }
   //     });

   // }

   //  IF TEST
   // if (args[0] === "test") {

   //     try {
   //         var quoteToEdit = args[1]

   //         sql.run(`DELETE FROM quotes WHERE ID ='${quoteToEdit}'`);
			//sql.run(`UPDATE quotes SET ID = ID - 1 WHERE ID > ?`);
			
			
			
			
			
			

   //          sql.get(`SELECT seq FROM sqlite_sequence WHERE name = 'quotes'`).then(row => {
   //              totalQuotes = row;

   //              var quotesOnwardsToEdit = parseInt(quoteToEdit) + 1;

   //              console.log(quotesOnwardsToEdit)

   //              for (i = quotesOnwardsToEdit; i < totalQuotes.seq; i++) {

   //               sql.get(`select * from quotes where id >'${quotetoedit}'`).then(row => {
   //               console.log("row id: " + row.id)
   //               console.log("current row: " + i)
   //               console.log("total quotes: " + totalquotes.seq)
   //               console.log("~~~~~~~~~~~~~~~~");
   //               var j = row.id - 1;
   //               console.log("id - 1: " + j)
   //               console.log("!!!!!!!!!!!!!!!!")
   //                  sql.run(`UPDATE quotes SET ID = '${j}' where ID = '${row.ID}'`);
   //                })

   //          }

   //          }).catch(() => {
   //              console.error;
   //          });


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