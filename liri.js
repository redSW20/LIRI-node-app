//Globals
require("dotenv").config();
var axios = require("axios");
var keys = require("./keys.js");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var spotify = new Spotify("keys.spotify");
var fs = require("fs");
var inquirer = require("inquirer");
var args = process.argv;
var action = args[2];
var target = args[3];
var today = "\n Event happened at: " + moment().format("LLL");
var omdbId = keys.omdb.id;

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


// SONGS FUNCTION
function spotifythissong(songName) {
    // * Returns the following from the Spotify API
    // * Artist(s)
    // * The song's name
    // * A preview link of the song from Spotify
    // * The album that the song is from

    if (!songName) {
        text += "\nNo song specified... enjoy some Ace of Base";
        songName = "Eternal Refuge"
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