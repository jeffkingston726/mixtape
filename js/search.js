// After the API loads, call a function to enable the search box.
function handleAPILoaded() {
  //$('#search-button').attr('disabled', false);
  console.log("YouTube API... is loaded");
}

var videoToPlay;
var videoTitle;
var nextPageToken;
var currentArtist;

function createSearch(artist) {
  var request = gapi.client.youtube.search.list({
    q: artist,
    part: 'snippet',
    maxResults: 10,
    type: "video",
    videoCategoryId: 10, // 10 = music, 22 = People & Blogs
    videoEmbeddable: "true"
  });
  if (artist !== currentArtist) {
    currentArtist = artist;
  } else {
    request.Zq.k5.params.pageToken = nextPageToken;
    request.Zq.k5.params.maxResults = 2;
  }
  runVideoSearch(request);
}

function runVideoSearch(request) {
  request.execute(function (response) {
    processResponse(response);
  });
}

function processResponse(response) {
  var index = getRandomInt(0, response.result.items.length);
  var selectedResult = response.result.items[index].snippet;
  if (selectedResult.title.toLowerCase() === videoTitle) { // Avoiding repeating current video
    processResponse(response);
  } else {
    nextPageToken = response.nextPageToken;
    videoTitle = selectedResult.title.toLowerCase();
    var description = selectedResult.description;
    var thumbnailURL = selectedResult.thumbnails.default.url;
    var videoID = thumbnailURL.slice(-23, -12);
    videoToPlay = videoID;
    $(".nowPlaying").fadeOut("slow", function () {
      $(this).html("Playing <span>" + videoTitle + "</span>").fadeIn("slow");
    });
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}




















// ADD TO PLAYLIST SECTION:
// Define some variables used to remember state.
// var playlistId;
// var channelId;

// // Create a private playlist.
// function createPlaylist(playlistTitle) {
//   var request = gapi.client.youtube.playlists.insert({
//     part: 'snippet,status',
//     resource: {
//       snippet: {
//         title: playlistTitle,
//         description: 'A programmatically generated playlist'
//       },
//       status: {
//         privacyStatus: 'private'
//       }
//     }
//   });
//   displayStatusOfPlaylistToUser(request);
// }

// function displayStatusOfPlaylistToUser(request) {
//   request.execute(function (response) {
//     var result = response.result;
//     if (result) {
//       playlistId = result.id;
//       console.log("https://www.youtube.com/playlist?list=" + playlistId);

//       // $('#playlist-id').val(playlistId);
//       // $('#playlist-title').html(result.snippet.title);
//       // $('#playlist-description').html(result.snippet.description);
//     } else {
//       // $('#status').html('Could not create playlist');
//     }
//   });
// }

// // Add a video to a playlist. The "startPos" and "endPos" values let you
// // start and stop the video at specific times when the video is played as
// // part of the playlist. However, these values are not set in this example.
// function addToPlaylist(id, startPos, endPos) {
//   var details = {
//     videoId: id,
//     kind: 'youtube#video'
//   }
//   if (startPos != undefined) {
//     details['startAt'] = startPos;
//   }
//   if (endPos != undefined) {
//     details['endAt'] = endPos;
//   }
//   var request = gapi.client.youtube.playlistItems.insert({
//     part: 'snippet',
//     resource: {
//       snippet: {
//         playlistId: playlistId,
//         resourceId: details
//       }
//     }
//   });
//   request.execute(function (response) {
//     // $('#status').html('<pre>' + JSON.stringify(response.result) + '</pre>');
//   });
// }

// function autoCreatePlaylist(playlistTitle) {
//   createPlaylist(playlistTitle);
//   var addSlowly;
//   setTimeout(function () {
//     addSlowly = setInterval(iterateThroughSampleVideoArraySlowly, 200);
//   }, 500); // Would be better to base all this on callbacks--using timed events for now

//   var j = 0;
//   function iterateThroughSampleVideoArraySlowly() {
//     addToPlaylist(videosForPlaylist[j]);
//     //console.log(videosForPlaylist[j] + " added");
//     if (j < videosForPlaylist.length) {
//       j++;
//     } else {
//       clearInterval(addSlowly);
//       $(".createPlaylist").hide();
//       $(".allSearchResults").append("<button class='viewPlaylist btn btn-info'>View playlist</button>");
//       $(".viewPlaylist").click(function () {
//         window.open("https://www.youtube.com/playlist?list=" + playlistId);
//       });
//     }
//   }
// }

