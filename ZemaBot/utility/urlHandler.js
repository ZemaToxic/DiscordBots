const https = require("https"); // Includes needed for the Bot
const imgurClient = require("../includes/jsonFiles/imgur.json");
const StringDecoder = require("string_decoder").StringDecoder; // Includes needed for the Bot

const fetch = require("node-fetch");
const { map } = require("bluebird");

// ----- API Connect Metork -
function extractURLData(url) {
    let data = {};
    //find & remove protocol (http, ftp, etc.) and get domain
    let domain;
    let domainSplit;
    let pathStart = "";
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
    imgurDecoder: function (searchValue) {
        return new Promise((resolve, reject) => {
            let options = {
                'method': "GET",
                'hostname': "api.imgur.com",
                'path': `/3/gallery/search/?q_all=${searchValue}`,
                'headers': {
                    'Authorization': `Client-ID ${imgurClient.ClientID}`
                }
            };
            let req = https.request(options, function (results) {
                let decoder = new StringDecoder("utf8")
                let body = " ";
                results
                    .setEncoding("utf8")
                    .on('data', (chunk) => body += decoder.write(chunk))
                    .on('end', () => {
                        const json = JSON.parse(body)
                        results.statusCode === 200
                            ? resolve(json)
                            : reject(json)
                    })
            }).on('error', reject)
            req.end();
        })
    },
    urlHandler: function (url) {
        return new Promise((resolve, reject) => {
            let data = extractURLData(url);
            let options =
            {
                'host': data.domain,
                'port': data.port,
                'path': "/" + data.path,
                'method': "GET"
            };
            let req = https.request(options, function (results) {
                let decoder = new StringDecoder("utf8")
                let body = " ";
                results
                    .setEncoding("utf8")
                    .on('data', (chunk) => body += decoder.write(chunk))
                    .on('end', () => {
                        const json = JSON.parse(body)
                        results.statusCode === 200
                            ? resolve(json)
                            : reject(json)
                    })
            }).on('error', reject)
            req.end();
        })
    },
    fetchDatabase: async function (guilds) {
        const serverSettings ={}
        guilds.forEach(element => {
            return new Promise((resolve, reject) => {
                fetch(`http://localhost:3001/discord?serverID=${element.id}`)
                    .then(res => res.json())
                    .then((data) => {
                        resolve(data)
                        serverSettings[element.id] = data
                    })
                    .catch(error => console.log('Error:', error))
            })
        });
        return serverSettings
    }
}
