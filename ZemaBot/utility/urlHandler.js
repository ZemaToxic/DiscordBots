const imgurClient = require('../includes/jsonFiles/imgur.json');
var StringDecoder = require('string_decoder').StringDecoder;
var http = require('https');

var dataOut;

function urlHandler(searchValue) {
	var options = {
		'method': 'GET',
		'hostname': 'api.imgur.com',
		'path': `/3/gallery/search/?q_all=${searchValue}`,
		'headers': {
			'Authorization': `Client-ID ${imgurClient.ClientID}`
		}
	};

	var req = http.request(options, function (res) {
		var decoder = new StringDecoder('utf8');
		var body = '';
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			body += decoder.write(chunk);
		});
		res.on('end', function () {
			dataOut = JSON.parse(body);
		});
	});
	req.end();
	
	return dataOut;
}
exports.urlHandler = urlHandler;