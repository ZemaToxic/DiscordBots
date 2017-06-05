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

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

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

sql.get(`SELECT * FROM sqlite_sequence WHERE name = 'quotes'`).then(row=> {
	console.log(row)
});

		
	
	// IF ID IS ENTERED
		
	var TESTVAR = parseInt(args[0]);

    sql.get(`SELECT * FROM quotes WHERE ID ='${TESTVAR}'`).then(row => {
		
		console.log(quote)
		  
		  message.channel.send(quote)
		  
		  // sql.run('INSERT INTO quotes ( quote, addedBy, date) VALUES ( ?, ?, ?)',
			 // [args[0],
			 // message.author.username, 
			 // getCurrentDate()]);
			 
		 console.log("THIS IS WHERE I BROKE")
        
    }).catch(() => {
		// console.error;
		// });


		
		 // IF ADD
		
         console.log("I BROKE MORE");
         console.error;

         sql.run('CREATE TABLE IF NOT EXISTS quotes ( INTEGER, quote TEXT, addedBy TEXT, date TEXT)')
		 .then((
              sql.run('INSERT INTO quotes ( quote, addedBy, date) VALUES (?, ?, ?)',
			  [args[0],
			  message.author.username, 
			  getCurrentDate()])));
	 });
}