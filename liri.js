require("dotenv").config();

// As always, we grab the fs package to handle read/write
var fs = require("fs");

var keys = require("./keys");

var spotifyKey = keys.spotify;
var Spotify = require('node-spotify-api');

var request = require("request");



// Store all of the arguments in an array
var nodeArgs = process.argv;

// Create an empty variable for holding the movie name
var parameterName = "";

// Loop through all the words in the node argument
// And do a little for-loop magic to handle the inclusion of "+"s
for (var i = 3; i < nodeArgs.length; i++) {
  if (i > 3 && i < nodeArgs.length) {
    parameterName = parameterName + "+" + nodeArgs[i];
  }
  else {
    parameterName += nodeArgs[i];
  }
}



if(process.argv[2] == "spotify-this-song"){
 
var spotify = new Spotify({
  id: spotifyKey.id,
  secret: spotifyKey.secret
});
 
spotify
  .request('https://api.spotify.com/v1/search?q=track:' + parameterName + "&type=track")
  .then(function(data) {
    console.log("Name: " + data.tracks.items[0].name); 
    for(var i = 0; i < data.tracks.items[0].artists.length; i ++){
        console.log("Artist: " + data.tracks.items[0].artists[i].name); 
    } 
    console.log("URL:" + data.tracks.items[0].external_urls.spotify); 
  })
  .catch(function(err) {
    console.error('Error occurred: ' + err); 
  });
}
else if(process.argv[2] == "movie-this"){

    if(parameterName === "")
    parameterName = "Mr.Nobody"
    // Then run a request to the OMDB API with the movie specified
var queryUrl = "http://www.omdbapi.com/?t=" + parameterName + "&y=&plot=short&apikey=trilogy";

// This line is just to help us debug against the actual URL.
console.log(queryUrl);

request(queryUrl, function(error, response, body) {

  // If the request is successful
  if (!error && response.statusCode === 200) {

    console.log("Title: " + JSON.parse(body).Title);
    console.log("Release Year: " + JSON.parse(body).Year);
    var IMDBRating = JSON.parse(body).Ratings.filter(item => item.Source=="Internet Movie Database");
    var rottenTomatoes = JSON.parse(body).Ratings.filter(item => item.Source=="Rotten Tomatoes");
    console.log("IMDB Rating: " + IMDBRating[0].Value);
    console.log("Rotten Tomatoes Rating : " + rottenTomatoes[0].Value);
    console.log("Country: " + JSON.parse(body).Country);
    console.log("Language: " + JSON.parse(body).Language);
    console.log("Plot: " + JSON.parse(body).Plot);
    console.log("Actors: " + JSON.parse(body).Actors);
  }
});
}
else if(process.argv[2] == "do-what-it-says"){
// This block of code will read from the "movies.txt" file.
// It's important to include the "utf8" parameter or the code will provide stream data (garbage)
// The code will store the contents of the reading inside the variable "data"
fs.readFile("random.txt", "utf8", function(error, data) {

    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }    
  
    // Then split it by commas (to make it more readable)
    var dataArr = data.split(",");    

    var songName = dataArr[1].split(' ').join('+');

    var spotify = new Spotify({
        id: spotifyKey.id,
        secret: spotifyKey.secret
      });
       
      spotify
        .request('https://api.spotify.com/v1/search?q=track:' + songName + "&type=track")
        .then(function(data) {
          console.log("Name: " + data.tracks.items[0].name); 
          for(var i = 0; i < data.tracks.items[0].artists.length; i ++){
              console.log("Artist: " + data.tracks.items[0].artists[i].name); 
          } 
          console.log("URL:" + data.tracks.items[0].external_urls.spotify); 
        })
        .catch(function(err) {
          console.error('Error occurred: ' + err); 
        });
  
  });
}

 