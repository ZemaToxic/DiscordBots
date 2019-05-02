const url = require("../../utility/urlHandler.js");

let images;
var imageToSend;

function getRandomImage() {
    if (!images) return;
    var imagesCount;
    // get the length of the images
    imagesCount = images["data"].length;
    // get a random number between 0 and (imagesCount)
    var RandomImage = Math.floor(Math.random() * imagesCount - 1) + 1;
    // Assign imageToSend the value at that index
    if (images["data"][RandomImage]["type"] === ("image/jpeg" || "image/png")) {
        imageToSend = images["data"][RandomImage]["link"];
    } else {
        imageToSend = images["data"][RandomImage]["images"][0]["link"];
    }
}

module.exports = {
    name: "heck",
    async execute(message) {
        images = await url.imgurDecoder("heck+dog");
        getRandomImage();

        if (!images) {
            return;
        } else {
            message.channel.send({
                files: [imageToSend]
            });
        }
    }
};