//all that required jazz 
require("dotenv").config();

var keys = require("./keys.js");

var Spotify = require('node-spotify-api');

var fs = require("fs");

var spotify = new Spotify(keys.spotify);

// var inquirer = require("inquirer");

var moment = require("moment");
var axios = require("axios");

//store user input as input var and store app search var
var appSearch = process.argv[2]
var input = process.argv.slice(3).join(" ");

//run our search function
goLiri(input)

//function to determine whcih api function to call
function goLiri(input){
  if(appSearch === "concert-this"){
    concertThis(input)
  };
  if(appSearch === "spotify-this-song"){
    spotifyThis(input)
  };
  if(appSearch === "movie-this"){
    movieThis(input)
  };
  if(appSearch === "do-what-it-says"){
    doWhatItSays()
  };

};

//BIT api axios call
function concertThis(input){
axios.get("https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp").then(
    function (response) {

    
        console.log("---------------------------");
      response.data.forEach(concert => {
        console.log("Venue: " + concert.venue.name);
        console.log("Location: " + concert.venue.city + ", " + concert.venue.region);
       
        var bitDate = concert.datetime;
        spliced = bitDate.slice(0, 10);
       
        format = "YYYY-MM-DD";
        convertedDate = moment(spliced, format);
        bitFinalDate = convertedDate.format("MM/DD/YYYY");
        console.log("Date: " + bitFinalDate);
        console.log("---------------------------");
      });
      
    });
  };

//spotify api call
function spotifyThis(input){
spotify.search({ type: 'track', query: input }, function (err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  }
  console.log("\n---------------------------------------------------\n");
  console.log("Artist: " + data.tracks.items[0].artists[0].name);
  console.log("Song: " + data.tracks.items[0].name);
  console.log("Preview: " + data.tracks.items[3].preview_url);
  console.log("Album: " + data.tracks.items[0].album.name);
  console.log("\n---------------------------------------------------\n");

});
};

//omdb api call
function movieThis(input){
  if(!input){
    input = "Mr. Nobody"
  };
  axios.get("http://www.omdbapi.com/?t=" +input + "&y=&plot=short&apikey=trilogy").then(
  function(response) {
    console.log("\n---------------------------------------------------\n");
    console.log("Title: " + response.data.Title);
    console.log("Year: " + response.data.Year);
    console.log("IMDB Rating: " + response.data.imdbRating);
    console.log("Rotten Tomatoes: " + response.data.Ratings[1]);
    console.log("Country: " + response.data.Country);
    console.log("Language: " + response.data.Language);
    console.log("Movie Plot: " + response.data.Plot);
    console.log("Actors: " + response.data.Actors);
    console.log("\n---------------------------------------------------\n");
  });
};


//a function that reads strings from random.text and outputs the api data that is desired
function doWhatItSays(){
  fs.readFile("random.txt", "utf8", function (error, data) {
    //putting string in array
    var random = data.split(",")
   
//assigining variables for items in array
    var search = random[0];
    var input =  random[1].split('"').join('');
   

    //running search based o
    if (error) {
      return console.log(error);
    }

    if (search === "concert-this"){
      concertThis(input);
    }
    if (search === "spotify-this-song"){
      spotifyThis(input);
    }
    if (search === "movie-this"){
      movieThis(input);
    }
});
}