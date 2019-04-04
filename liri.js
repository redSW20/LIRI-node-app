//Globals
require("dotenv").config();
var axios = require("axios");
var key = require("./keys.js");
var moment = require("moment");
var spotify = require("node-spotify-api");
var spotKeys = require("keys.spotify");
var fs = require("fs");
var inquirer = require("inquirer");
var args = process.argv;
var action = args[2];
var target = args[3];
var today = "\n Event happened at: " + moment().format("LLL");

// MAIN PICKER FUNCTION
function picker(action, target) {
    switch (action) {
        case "concert-this":
            concertthis(target);
            break;

        case "spotify-this-song":
            spotifythissong(target);
            break;

        case "movie-this":
            moviethis(target);
            break;

        case "do-what-it-says":
            dowhatitsays();
            break;

        default:
            console.log("Hmmm ... I don't understand.");
            break;
    }
};

// CONCERTS FUNCTION
function concertthis(artistName) {
    // * Returns the following from Bands in Town Artist Events API
    // * Name of the venue
    // * Venue location
    // * Date of the Event (use moment to format this as "MM/DD/YYYY")

    if (!artistName) {
        text += "\nNo artist specified... but Tool is on tour";
        artistName = "Tool";
    }
    text += "\nSearching Bands In Town for upcoming " + artistName + " concerts\n";

    var queryURL = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp";
    // console.log(queryURL);
    // make axios request to bandsintown api
    axios
        .get(queryURL)
        .then(function (response) {
            var artistInfo = response.data
            var concert;

            for (concert in artistInfo) {
                var dates = artistInfo[concert].datetime.split("T");
                var concertDate = moment(dates[0]).format('LL')
                var venue = artistInfo[concert].venue;
                // build text to print log and console.log
                text += "=====================";
                text += "\n" + concertDate;
                text += "\n" + venue.name;
                text += "\n" + venue.city + " " + venue.region + " " + venue.country;
                text += "\n=====================\n";
            }
            text += "\n";
            console.log(text);
            updateLog(text);
        })

        // error handling
        .catch(function (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
};

// SONGS FUNCTION
function spotifythissong(songName) {
    // * Returns the following from the Spotify API
    // * Artist(s)
    // * The song's name
    // * A preview link of the song from Spotify
    // * The album that the song is from

    if (!songName) {
        text += "\nNo song specified... enjoy some Ace of Base";
        songName = "The Sign"
    }

    text += "\nSearching Spotify for: " + songName + "\n";

    spotify
        .search({ type: 'track', query: songName })
        .then(function (response) {
            // This is where the magic happens            
            var albums = response.tracks.items;
            var i;
            for (i in albums) {
                // console.log(albums[i]);
                var info = albums[i];
                text += "==================";
                text += "\nArtist: " + info.artists[0].name;
                text += "\nSong: " + info.name;
                text += "\nAlbum: " + info.album.name;
                text += "\nPreview: " + info.preview_url;
                text += "\nFull album: " + info.external_urls.spotify;
                text += "\n==================\n";
            }
            text += "\n";
            console.log(text);
            updateLog(text);
        })
        .catch(function (err) {
            console.log(err);
        });
};

// MOVIES FUNCTION
function moviethis(movieName) {

    //     * Returns the following from the OMDB API
    //     * Title of the movie.
    //     * Year the movie came out.
    //     * IMDB Rating of the movie.
    //     * Rotten Tomatoes Rating of the movie.
    //     * Country where the movie was produced.
    //     * Language of the movie.
    //     * Plot of the movie.
    //     * Actors in the movie.

    if (!movieName) {
        text += "\nNo movie specified... You're getting a Jared Leto movie instead.";
        movieName = "Mr. Nobody"
    }
    text += "\nSearching OMDB for: " + movieName + "\n";

    var queryURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    axios
        .get(queryURL)
        .then(function (response) {
            var movie = response.data

            text += "==================";
            text += "\nMovie: " + movie.Title;
            text += "\nYear: " + movie.Year;
            text += "\nActors: " + movie.Actors;
            text += "\n" + movie.Ratings[0].Source + " rating: " + movie.Ratings[0].Value;
            text += "\n" + movie.Ratings[1].Source + " rating: " + movie.Ratings[1].Value;
            text += "\nCountry: " + movie.Country;
            text += "\nLanguage: " + movie.Language;
            text += "\nPlot: " + movie.Plot;
            text += "\n==================\n";

            console.log(text);
            updateLog(text);
        })

        // error handling
        .catch(function (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
};

// RANDOM FUNCTION
function dowhatitsays() {
    console.log("Do what it says in random.txt...\n");
    fs.readFile("random.txt", "utf8", function (error, data) {

        // error handling
        if (error) {
            return console.log(error);
        }

        // separate out the action and target from the info in random, run picker
        var args = data.split(", ");
        picker(args[0], args[1])
    })
};

function updateLog(text) {
    fs.appendFile("log.txt", text, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            return;
        }
    });
};

function inquire() {
    inquirer.prompt([
        {
            name: "action",
            message: "What would you like to search for?",
            type: "list",
            choices: ["Concerts", "Songs", "Movies", "Surprise me"]
        }
    ]).then(function (firstAnswer) {
        var action = firstAnswer.action;
        if (action === "Surprise me") {
            picker("do-what-it-says")
        } else {
            inquirer.prompt([
                {
                    name: "target",
                    message: "Enter a band, song or movie name."
                }
            ]).then(function (secondAnswer) {
                var target = secondAnswer.target;
                switch (action) {
                    case "Concerts":
                        picker("concert-this", target);
                        break;
                    case "Songs":
                        picker("spotify-this-song", target);
                        break;
                    case "Movies":
                        picker("movie-this", target);
                        break;
                    default:
                        break;
                };
            });
        };

    });
};

// START APPLICATION
// Can be run with arguments from command line, or through prompted input from inquirer
function initLiri() {
    if (action) {
        picker(action, target);
    } else {
        inquire();
    };
}
initLiri();