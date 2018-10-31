const imgurClient = require('../jsonFiles/imgur.json');
var StringDecoder = require('string_decoder').StringDecoder; // Includes needed for the Bot
var http = require('https');

var images;
var imagesCount;
var imageToSend;

var options = {
	'method': 'GET',
	'hostname': 'api.imgur.com',
	'path': '/3/gallery/search/?q_all=heck+dog',
	'headers': {
		'Authorization': `Client-ID ${imgurClient.ClientID}`
	}
};

var req = http.request(options, function (res) {
	var decoder = new StringDecoder('utf8'); // cuz who wants to read a fucking buffer anyway :/
	var body = '';
	res.setEncoding('utf8');

	res.on('data', function (chunk) {
		body += decoder.write(chunk);
	});

	res.on('end', function () {
		interpResult(body);
	});
});

req.end();

function interpResult(res) {
	// Make a new Var and parse the JSON
	images = JSON.parse(res);
}

function getRandomImage() {
	// get the length of the images
	imagesCount = images['data'].length;
	// get a random number between 0 and (imagesCount)
	var RandomImage = Math.floor(Math.random() * imagesCount - 1) + 1;
	// Assign imageToSend the value at that index
	if (images['data'][RandomImage]['type'] === 'image/jpeg') {
		imageToSend = images['data'][RandomImage]['link'];
	} else {
		imageToSend = images['data'][RandomImage]['images'][0]['link']
	}
}

module.exports = {
	name: 'heck',
	heck(message) {

		getRandomImage();
		message.channel.send({
			files: [imageToSend]
		});
	}
};