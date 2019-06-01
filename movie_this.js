// MOVIES FUNCTION
var axios = require("axios");
var moment = require('moment');
var fs = require("fs");
var keys = require("./keys.js");
var omdbId = keys.omdb.id;

var MovieThis = function() {

    this.search = function(query) {
        var URL = "http://www.omdbapi.com/?apikey=" + omdbId + "&";
        URL += "t="+query;
        
        axios.get(URL).then(function(response) {
            if(response.data.Response === 'False'){
                console.log(response.data.Error);
                console.log(' -----------------------------------------------');
                return;
            }
            
            var jsonData = response.data;
            var title = "| Title: \t " + jsonData.Title + "\n";
            var released = "| Released: \t " + jsonData.Released + "\n";
            var imdbRating = "| IMDB Rating: \t " + jsonData.imdbRating + "\n";
            var rotTomRating="| RT Rating: \t "+jsonData.Ratings[1].Value+"\n";
            var country = "| Country: \t " + jsonData.Country + "\n";
            var lang = "| Language: \t " + jsonData.Language + "\n";
            var plot = "| Plot: \t " + jsonData.Plot + "\n";
            var actors = "| Actors: \t " + jsonData.Actors;
            console.log(title + released + imdbRating + rotTomRating +
                        country + lang + plot + actors);
            console.log(' -----------------------------------------------');
        });
    }
}

module.exports = MovieThis;