const imgurClient = require('../jsonFiles/imgur.json');
const urlHandler = require('./../../utility/urlHandler.js');

var options = {
	'method': 'GET',
	'hostname': 'api.imgur.com',
	'path': '/3/gallery/search/?q_all=heck+dog',
	'headers': {
		'Authorization': `Client-ID ${imgurClient.ClientID}`
	}
};

var images;
var imageToSend;

function getRandomImage() {
	console.log(images);
	if (!images) return;
	// get the length of the images
	var imagesCount = images['data'].length;
	// get a random number between 0 and (imagesCount)
	var RandomImage = Math.floor(Math.random() * imagesCount - 1) + 1;
	// Assign imageToSend the value at that index
	if (images['data'][RandomImage]['type'] === ('image/jpeg' || 'image/png')) {
		imageToSend = images['data'][RandomImage]['link'];
	} else {
		imageToSend = images['data'][RandomImage]['images'][0]['link'];
	}
}

module.exports = {
	name: 'heck',
	async heck(message) {

		images = urlHandler.parseData(options).then(getRandomImage())
			.then(
				message.channel.send({
					files: [imageToSend]
				})
			).catch(console.error);

	}
};