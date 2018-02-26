// Console Colour Code
var RESET_COLOR = '\x1b[0m';
var COLOR_WHITE = '\x1b[1m\x1b[0m';
var COLOR_RED = '\x1b[1m\x1b[31m';
var COLOR_GREEN = '\x1b[1m\x1b[32m';
var COLOR_CYAN = '\x1b[1m\x1b[36m';
var COLOR_YELLOW = '\x1b[1m\x1b[33m';

const { spawn } = require('child_process');
const { lstatSync, readdirSync } = require('fs');
const { join } = require('path');

var fs = require('fs');

const discordBots = {};

// Directory Naviagtion
const isDir = source => lstatSync(source).isDirectory();
const getDirs = source => readdirSync(source).map(name => join(source, name)).filter(isDir);

var directories = getDirs("./");

directories.forEach(function( v ){
    
    // Search through each folder looking for app.js
    console.log(COLOR_YELLOW, timeStamp(), "Searching for ./"+v+"/app.js", RESET_COLOR)
    if ( fs.existsSync("./"+v+"/app.js") ){

        // Make a new [object?] for each bot client
        discordBots[v] = {};
        discordBots[v].start = function(){

            // Start up a new bot client 
            console.log(COLOR_GREEN, timeStamp(), "Starting Bot "+v,RESET_COLOR);
            const bot = discordBots[v].process = spawn('cmd.exe', ['/c', 'cd ./' + v + ' & start node app.js']);

            // ????
            discordBots[v].process.stdout.on('data', (d) => {
                console.log(timeStamp(), "DATA FROM "+v+": "+d);
            });
            // ????            
            discordBots[v].process.stderr.on('data', (data) => {
                console.log(timeStamp(), "DATA FROM "+v+': stderr: '+data);
            });
                
            // What to do when each bot child closes
            discordBots[v].process.on('close', (code) => {
                console.log(COLOR_RED, timeStamp(), "DATA FROM "+v+': Process exited with code ' +code, RESET_COLOR);
              discordBots[v].start();
            });
        }
        // Start all bots 
        discordBots[v].start();      
    }
});

function timeStamp() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    return "[" + hours + ":" + minutes + "]";
};