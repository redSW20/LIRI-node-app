var axios = require("axios");
var moment = require('moment');
var fs = require("fs");
var keys = require("./keys.js");
var concertId = keys.concert;

var ConcertThis = function() {

    this.search = function(query) {
        var URL = "https://rest.bandsintown.com/artists/";
        URL += query;
        URL += "/events?app_id=" + concertId;
        axios.get(URL).then(function(response) {
            var jsonData = response.data;
            if(response.data === '\n{warn=Not found}\n') {
                console.log('Search not found!');
                console.log(' -----------------------------------------------');
                return;
            }
            for(var i = 0; i < jsonData.length; i++){
                var eventDate = jsonData[i].datetime;
                var formattedDate = moment(eventDate).format('MM/DD/YYYY');
                var dateText = "| Date: \t" + formattedDate;
                var venue = "| Venue: \t" + jsonData[i].venue.name;
                var loc = "| Location: \t" + jsonData[i].venue.city + ", ";
                loc += jsonData[i].venue.country;
                console.log(venue + "\n" + loc + "\n" + dateText);
                console.log(' -----------------------------------------------');
            }
        });
    }
};

module.exports = ConcertThis;