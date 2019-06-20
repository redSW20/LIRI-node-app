require("dotenv").config();

var fs = require("fs");
var keys = require("./keys.js");

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var ConcertThis = require('./concert_this.js');
var concert_this = new ConcertThis();

var MovieThis = require('./movie_this.js');
var movie_this = new MovieThis();

// Grab search command line argument
var argSearch = process.argv[2];
// Joining the remaining arguments since the query may contain spaces
var argTerm = process.argv.slice(3).join(' ');

function handleSearches(search,term){
    if (search === 'concert-this') {
        if(!term) return;
        console.log('\n -----------------------------------------------');
        console.log(' ~Searching for "' + term + '" from Bands in Town~');
        console.log(' -----------------------------------------------');
        concert_this.search(term);

    } else if(search === 'spotify-this-song'){
        if(!term) term = "Vicer Exciser";
        console.log('\n -----------------------------------------------');
        console.log(' ~Searching for "' + term + '" in Spotify~');
        console.log(' -----------------------------------------------');
        spotify.search({ type: 'track', query: term })
        .then(function(response) {
        if(!response.tracks.items.length){
            console.log("Song not found!");
            console.log(' -----------------------------------------------');
            return;
        }
        var artists = response.tracks.items[0].album.artists;
        var songName = response.tracks.items[0].name;
        var songLink = response.tracks.items[0].external_urls.spotify;
        var albumName = response.tracks.items[0].album.name;
        var artistText = "Artist(s): \t[ ";
        var songNameText = "Song name: \t[ " + songName + " ]\n";
        var songLinkText = "Song link: \t[ " + songLink + " ]\n";
        var albumNameText = "Album name: \t[ " + albumName + " ]\n";
        for(var i = 0; i < artists.length;i++){
            if(i<=artists.length-2)
                artistText += artists[i].name + " ] [ ";
            else
                artistText += artists[i].name + " ]\n";
        }
        console.log(artistText + songNameText + songLinkText + albumNameText);
        })
        .catch(function(err) {
        console.log(err);
        });

    } else if(search === 'movie-this'){
        if(!term) term = "Hackers";
        console.log('\n -----------------------------------------------');
        console.log('\t~Searching for "' + term + '" in OMDB~');
        console.log(' -----------------------------------------------');
        movie_this.search(term);

    } else if(search === 'do-what-it-says'){
        fs.readFile('./random.txt', 'utf-8',(err, data) => {
            if (err) throw err;
            var tempArgs = data.split(',"');
            handleSearches(tempArgs[0],
                            tempArgs[1]
                            .trim()
                            .replace('"',''));
        });
    }
}

handleSearches(argSearch,argTerm);