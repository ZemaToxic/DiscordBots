const SpotifyWebApi = require("spotify-web-api-node");
const spotifyCreds = require("../jsonFiles/spotify.json");
const Discord = require("discord.js");
const util = require("util");

// credentials are optional
const spotifyApi = new SpotifyWebApi({ clientId: spotifyCreds.Client_ID, clientSecret: spotifyCreds.Client_Secret, });

// Retrieve an access token
spotifyApi.clientCredentialsGrant().then(function (data) {
    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body["access_token"]);
}, function (err) { console.log("Something went wrong when retrieving an access token", err.message); });

async function getCreds() {
    // Retrieve an access token
    spotifyApi.clientCredentialsGrant().then(
        function (data) {
            // Save the access token so that it's used in future calls
            spotifyApi.setAccessToken(data.body["access_token"]);
        },
        function (err) { console.log("Something went wrong when retrieving an access token", err.message); }
    );
    return "Complete";
}

let newArgs;
let searchQuery;

module.exports = {
    name: "spotify",
    description: "",
    async execute(client, guildConf, message, args) {
        await getCreds()
            .then(function () {
                // Search for a song
                if (args[0] === "song") {
                    newArgs = args.slice(1);
                    // Join the incominng args
                    searchQuery = newArgs.join(" ");
                    // search for the message
                    spotifyApi.searchTracks(searchQuery, { limit: 25, })
                        .then(function (data) {
                            // Go through the first page of results
                            const firstPage = data.body.tracks.items;

                            let messageToSend = [];
                            firstPage.forEach(function (track, index) { messageToSend.push(track); });
                            messageToSend.sort((first, next) => first.popularity - next.popularity).reverse();

                            const returnedSong = messageToSend[0];
                            const embed = new Discord.RichEmbed()
                                .setTitle(returnedSong.name)
                                .setThumbnail(returnedSong.album.images[0].url)
                                .setColor("#84bd00")
                                .addField("Artist", returnedSong.artists[0].name, true)
                                .addField("Song Length", convertMilli(returnedSong.duration_ms), true)
                                .addField("Explicit ? ", returnedSong.explicit, true)
                                .addField("Orignal Relase Date", returnedSong.album.release_date, true)
                                .addField("Spotify Link", returnedSong.external_urls.spotify, true)
                                .setTimestamp(new Date());

                            message.channel.send(embed);
                        });

                }
                // Search for albums from a single artist
                else if (args[0] === "artist") {
                    let artistID;
                    newArgs = args.slice(1);
                    // Join the incominng args
                    searchQuery = newArgs.join(" ");
                    spotifyApi.searchTracks(searchQuery, { limit: 25, })
                        .then(function (data) {
                            // Go through the first page of results
                            const firstPage = data.body.tracks.items;

                            let messageToSend = [];
                            firstPage.forEach(function (track, index) { messageToSend.push(track); });

                            messageToSend.sort((first, next) => first.popularity - next.popularity).reverse();

                            artistID = messageToSend[0].album.artists[0].id;
                            return artistID;
                        })
                        .then(function () {
                            // Get albums by a certain artist
                            spotifyApi.getArtistAlbums(artistID, { type: "album", limit: "25" })
                                .then(function (data) {
                                    let albums = data.body.items;
                                    let albumNames = "";
                                    albums.forEach(element => { albumNames = albumNames + element.name + "\n"; });

                                    let arr = albumNames.split("\n");

                                    albumNames = arr.filter(function (value, index, self) { return self.indexOf(value) === index; }).join("\n");

                                    const embed = new Discord.RichEmbed()
                                        .setTitle(`Abums from: ${searchQuery}`)
                                        .setColor("#84bd00")
                                        .addField("Albums", albumNames)
                                        .setTimestamp(new Date());

                                    message.channel.send(embed);
                                },
                                    function (err) { console.error(err); });
                        });
                }
                // Search for tracks from a specific album
                else if (args[0] === "album") {
                    newArgs = args.slice(1);
                    let trackID;
                    let messageToSend = [];
                    // Join the incominng args
                    searchQuery = newArgs.join(" ");
                    // Get tracks in an album
                    spotifyApi.searchTracks(searchQuery, { limit: 25, })
                        .then(function (data) {
                            // Go through the first page of results
                            const firstPage = data.body.tracks.items;
                            firstPage.forEach(function (track, index) { messageToSend.push(track); });
                            messageToSend.sort((first, next) => first.popularity - next.popularity).reverse();
                            trackID = messageToSend[0].album.id;
                            return trackID;
                        })
                        .then(function () {
                            spotifyApi.getAlbumTracks(trackID, { limit: 20 })
                                .then(function (data) {
                                    const tracks = data.body.items;
                                    const embed = new Discord.RichEmbed()
                                        .setTitle(`Tracklist for album ${searchQuery}`)
                                        .setDescription(`Album link: ${messageToSend[0].album.external_urls.spotify}`)
                                        .setColor("#84bd00")
                                        .setThumbnail(messageToSend[0].album.images[0].url);

                                    tracks.forEach(function (track, index) { embed.addField(`Track ${track.track_number}:`, track.name + " - " + convertMilli(track.duration_ms)); });
                                    message.channel.send(embed);
                                },
                                    function (err) { console.log("Something went wrong!", err); });
                        }),
                        function (err) { console.error(err); };
                }
            });
    }
};

function convertMilli(millis) {
    let minutes = Math.floor(millis / 60000);
    let seconds = ((millis % 60000) / 1000).toFixed(0);
    return (seconds == 60 ? (minutes + 1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
}