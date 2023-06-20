const https = require("https");
const stream_to_message = require("../stream_to_message.js");
const update_github_status = require("../github/update_github_status.js");
const user_sessions = require("../database/user_sessions.js");
const Filter = require("bad-words"), filter = new Filter();

function get_now_playing(id, counter=0){
    if(counter === 3) return; //this counter is incremented up to 3 to check for expired token
    const token = user_sessions.get_spotify_access(id);
    const np_endpoint = "https://api.spotify.com/v1/me/player/currently-playing";
    const options = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }
    https.request(np_endpoint, options, (res) => {
        stream_to_message(res, (body) => {
          if (body.length === 0) {
            console.log(id, "isn't currently streaming anything");
          } else {
            const np_json = JSON.parse(body);
            if(np_json.error){
              console.log(id, "had an error:",np_json.error);
              return;
            } else if (np_json?.error?.status === 401) {
              //will try again 3 more times until if refresh doesnt happen it'll exit out
              setTimeout(() => { get_now_playing(id, counter++) }, 30000);
              return;
            } else if (np_json.currently_playing_type !== "track") {
              console.log(id, "is not currently listening to a song");
            } else {
              let artist = cleanup_string(np_json?.item?.artists[0]?.name);
              let song = cleanup_string(np_json?.item?.name);
        
              //if no profanity found it'll update github
              const full_string = filter.clean(`${artist} - ${song}`.length > 80 ? `${artist} - ${song}`.slice(0,77) + "..." : `${artist} - ${song}`);
              if(!full_string.includes("*")){
                update_github_status(full_string.length > 80 ? full_string.slice(0, 77) + `...` : full_string, user_sessions.get_github_auth(id));
              }
              const date = new Date();
              console.log(`\x1b[32m${id}\x1b[0m is currently streaming \x1b[34m${full_string}\x1b[0m @ \x1b[35m${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} \x1b[0m`); //<id> is currently streaming <song_name> @ <date>
            }
          }
          setTimeout(() => { get_now_playing(id) }, 30000);
        });
    }).end();
}

function cleanup_string(inputString) {
  if(inputString.charAt(0) === "(" || inputString.charAt(0) === "["){
    return inputString;
  }
    const firstOpeningParenthesisIndex = inputString.indexOf('(');
    const firstOpeningBracketIndex = inputString.indexOf('[');
    const firstHyphenIndex = inputString.indexOf('-'); 
    
    // Find the index of the first occurrence of either parentheses or brackets
    const index = Math.min(
      firstOpeningParenthesisIndex !== -1 ? firstOpeningParenthesisIndex : Infinity,
      firstOpeningBracketIndex !== -1 ? firstOpeningBracketIndex : Infinity,
      firstHyphenIndex !== -1 ? firstHyphenIndex : Infinity
    );
  
    if (index !== -1 && index !== Infinity) {
      // If there is an opening parenthesis/bracket/hyphen
      return inputString.slice(0, index).trim();
    } else {
      // If there are no parentheses or brackets
      return inputString;
    }
}
  
module.exports = get_now_playing;

