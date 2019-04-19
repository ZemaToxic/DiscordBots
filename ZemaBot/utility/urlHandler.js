const https = require("https"); // Includes needed for the Bot
const imgurClient = require("../includes/jsonFiles/imgur.json");
const StringDecoder = require("string_decoder").StringDecoder; // Includes needed for the Bot

var dataOut;

// ----- API Connect Metork -
function extractURLData(url) {
    var data = {};
    //find & remove protocol (http, ftp, etc.) and get domain
    var domain;
    var domainSplit;
    var pathStart = "";
    if (url.indexOf("://") > -1) {
        domainSplit = url.split("/");
        domain = domainSplit[2];
        pathStart = domainSplit[3];
    } else {
        domainSplit = url.split("/");
        domain = domainSplit[0];
        pathStart = domainSplit[1];
    }

    //find & remove port number
    portSplit = domain.split(":");

    data.domain = portSplit[0];
    data.port = portSplit[1];
    data.path = url.substring(url.indexOf(pathStart));

    return data;
}

module.exports = {
    urlHandler: async function(url) {
        var data = extractURLData(url);
        var options = {
            'host': data.domain,
            'port': data.port,
            'path': "/" + data.path,
            'method': "GET"
        };
    
        var req = await https.request(options,
            async function(res) {
                var decoder = new StringDecoder("utf8");
                var body = "";
                res.setEncoding("utf8");
                res.on("data",
                    function(chunk) {
                        body += decoder.write(chunk);
                    });
                res.on("end",
                    function() {
                        dataOut = JSON.parse(body);
                    });
            });
        req.end();
    
        return dataOut;
    },
    
    imgurDecoder: function(searchValue) {
        var options = {
            'method': "GET",
            'hostname': "api.imgur.com",
            'path': `/3/gallery/search/?q_all=${searchValue}`,
            'headers': {
                'Authorization': `Client-ID ${imgurClient.ClientID}`
            }
        };
    
        var req = http.request(options,
            function(res) {
                var decoder = new StringDecoder("utf8");
                var body = "";
                res.setEncoding("utf8");
                res.on("data",
                    function(chunk) {
                        body += decoder.write(chunk);
                    });
                res.on("end",
                    function() {
                        dataOut = JSON.parse(body);
                    });
            });
        req.end();
    
        return dataOut;
    }
}