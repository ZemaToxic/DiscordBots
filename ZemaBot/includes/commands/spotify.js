const SpotifyWebApi = require('spotify-web-api-node');
const spotifyCreds = require('../jsonFiles/spotify.json');
const Discord = require('discord.js');
const util = require('util');

// credentials are optional
const spotifyApi = new SpotifyWebApi(
{
	clientId: spotifyCreds.Client_ID,
	clientSecret: spotifyCreds.Client_Secret,
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant().then(
	function (data)
	{
		// Save the access token so that it's used in future calls
		spotifyApi.setAccessToken(data.body['access_token']);
	},
	function (err)
	{
		console.log('Something went wrong when retrieving an access token', err.message);
	}
);

async function getCreds()
{
	// Retrieve an access token
	spotifyApi.clientCredentialsGrant().then(
		function (data)
		{
			// Save the access token so that it's used in future calls
			spotifyApi.setAccessToken(data.body['access_token']);
		},
		function (err)
		{
			console.log('Something went wrong when retrieving an access token', err.message);
		}
	);
	return 'Complete';
}

var newArgs;
var searchQuery;

module.exports = {
	name: 'spotify',
	description: '',
	execute(client, options, message, args)
	{
		getCreds()
			.then(function ()
			{

				// Search for a song
				if (args[0] === 'song')
				{
					newArgs = args.slice(1);
					// Join the incominng args
					searchQuery = newArgs.join(' ');
					// search for the message
					spotifyApi.searchTracks(searchQuery,
						{
							limit: 1
						})
						.then(function (data)
						{
							// Go through the first page of results
							const firstPage = data.body.tracks.items;

							var messageToSend = [];
							firstPage.forEach(function (track, index)
							{
								messageToSend.push(track);
							});

							const returnedSong = messageToSend[0];
							console.log('\n' + util.inspect(returnedSong));

							const embed = new Discord.RichEmbed()
								.setTitle(returnedSong.name)
								.setThumbnail(returnedSong.album.images[0].url)
								.setColor('#84bd00')
								.addField('Artist', returnedSong.artists[0].name, true)
								.addField('Song Length', millisToMinutesAndSeconds(returnedSong.duration_ms), true)
								.addField('Explicit ? ', returnedSong.explicit, true)
								.addField('Orignal Relase Date', returnedSong.album.release_date, true)
								.addField('Spotify Link', returnedSong.external_urls.spotify, true)
								.setTimestamp(new Date());

							message.channel.send(embed);
						});

				}

				// Search for albums from a single artist
				else if (args[0] === 'artist')
				{
					var artistID;
					newArgs = args.slice(1);
					// Join the incominng args
					searchQuery = newArgs.join(' ');
					spotifyApi.searchTracks(searchQuery,
						{
							limit: 1
						})
						.then(function (data)
						{
							artistID = data.body.tracks.items[0].album.artists[0].id;
							return artistID;
						})
						.then(function ()
						{
							// Get albums by a certain artist
							spotifyApi.getArtistAlbums(artistID,
								{
									type: 'album',
									limit: '25'
								})
								.then(function (data)
								{
									var albums = data.body.items;
									var albumNames = '';
									albums.forEach(element =>
									{
										albumNames = albumNames + element.name + '\n';
									});

									var arr = albumNames.split('\n');

									albumNames = arr.filter(function (value, index, self)
									{
										return self.indexOf(value) === index;
									}).join('\n');

									const embed = new Discord.RichEmbed()
										.setTitle(`Abums from: ${searchQuery}`)
										.setColor('#84bd00')
										.addField('Albums', albumNames)
										.setTimestamp(new Date());

									message.channel.send(embed);
								}, function (err)
								{
									console.error(err);
								});

						});











				}

				// Search for tracks from a specific album
				else if (args[0] === 'album')
				{
					newArgs = args.slice(1);
					// Join the incominng args
					searchQuery = newArgs.join(' ');
					// Get tracks in an album
					spotifyApi.getAlbumTracks(searchQuery,
						{
							limit: 5,
							offset: 1
						})
						.then(function (data)
						{
							console.log(data.body);
						}, function (err)
						{
							console.log('Something went wrong!', err);
						});
				}



			}),
			function (err)
			{
				console.error(err);
			};
	}
};

function millisToMinutesAndSeconds(millis)
{
	var minutes = Math.floor(millis / 60000);
	var seconds = ((millis % 60000) / 1000).toFixed(0);
	return (seconds == 60 ? (minutes + 1) + ':00' : minutes + ':' + (seconds < 10 ? '0' : '') + seconds);
}