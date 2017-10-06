// Hopefully get timezone and due shit with that info

var moment = require('moment-timezone')

exports.run = (client, message, args) => {

    var m = new Date();
    
    var date = moment.tz(m,"America/New_York").format(/*'Z'*/);

    // console.log(message.member.roles)
    
    message.channel.send(message.member  +  ' Test ' + m + " Convert: "  + date).catch(console.error);
}

    //message.channel.send("It is currently: " + hour + ":" + min + ":" + sec + " on the " + day + "/" + month + "/" + year + " for ZemaToxic").catch(console.error);
    //var newDate = new Date(date);

    //var hour = newDate.getHours();
    //hour = (hour < 10 ? "0" : "") + hour;

    //var min = newDate.getMinutes();
    //min = (min < 10 ? "0" : "") + min;

    //var sec = newDate.getSeconds();
    //sec = (sec < 10 ? "0" : "") + sec;

    //var year = newDate.getFullYear();

    //var month = newDate.getMonth() + 1;
    //month = (month < 10 ? "0" : "") + month;

    //var day = newDate.getDate();
    //day = (day < 10 ? "0" : "") + day;