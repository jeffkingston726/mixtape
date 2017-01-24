"use strict";

var similarArtists = [];

function spotifyMethod(initialArtist) {
  initialArtist = initialArtist.toLowerCase();
  var primaryGenres = [];
  similarArtists = [];
  determineArtistPrimaryGenres(initialArtist, primaryGenres, function () {
    findSimilarArtistsByGenreSearch(primaryGenres, function () {
      removeLessRelevantArtists(similarArtists);
      similarArtists = sortSimilarArtistsByFrequency(similarArtists);
      console.log(similarArtists);
    });
  });
}

function determineArtistPrimaryGenres(initialArtist, primaryGenres, callback) {
  var urlPrefix = "https://api.spotify.com/v1/search?q="
  $.getJSON(urlPrefix + initialArtist + "&type=artist", function (artistResults) {
    var fullGenreList = getInitialArtistFullGenreList(initialArtist, artistResults);

    if (fullGenreList !== undefined) {
      urlPrefix = urlPrefix + "%20genre:%22";
      fullGenreList.forEach(function (genre) {
        $.getJSON(urlPrefix + genre + "%22&type=artist&limit=50", function (genreResults) {
          var aPrimaryGenre = searchByGenreToFindInitialArtist(initialArtist, genre, genreResults);
          if (aPrimaryGenre !== undefined) {
            primaryGenres.push(aPrimaryGenre);
          }
        });
      });
    }

  });
  setTimeout(callback, 1000);
}

function getInitialArtistFullGenreList(initialArtist, spotifyData) {
  if (spotifyData.artists.items.length > 0) { // Need to address case for no results
    for (var i = 0; i < spotifyData.artists.items.length; i++) {
      var returnedArtistName = spotifyData.artists.items[i].name.toLowerCase();
      if (returnedArtistName === initialArtist) {
        return spotifyData.artists.items[i].genres;
      }
    }
  }
}

function searchByGenreToFindInitialArtist(initialArtist, genre, spotifyData) {
  for (var i = 0; i < spotifyData.artists.items.length; i++) {
    var currentArtistResult = spotifyData.artists.items[i].name.toLowerCase();
    if (currentArtistResult === initialArtist) {
      return genre;
    }
  }
}

function findSimilarArtistsByGenreSearch(primaryGenres, callback) {
  var urlPrefix = "https://api.spotify.com/v1/search?q=%20genre:%22";
  primaryGenres.forEach(function (genre) {
    $.getJSON(urlPrefix + genre + "%22&type=artist&limit=50", function (genreResults) {
      for (var i = 0; i < genreResults.artists.items.length; i++) {
        var returnedArtistName = genreResults.artists.items[i].name.toLowerCase();
        similarArtists.push(returnedArtistName);
      }
    });
  });
  setTimeout(callback, 500);
}

function removeLessRelevantArtists(array) {
  similarArtists = array.filter(function (elem, pos) {
    return array.indexOf(elem) !== pos;
  });
}

function sortSimilarArtistsByFrequency(array) {
  var frequency = {};
  array.forEach(function (artist) {
    frequency[artist] = 0;
  });
  var instanceOfArtist = array.filter(function (artist) {
    return ++frequency[artist] === 1;
  });
  return instanceOfArtist.sort(function (a, b) {
    return frequency[b] - frequency[a];
  });
}