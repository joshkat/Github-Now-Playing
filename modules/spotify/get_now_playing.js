const https = require("https");
const stream_to_message = require("../stream_to_message.js");
const update_github_status = require("../update_github_status.js");
const user_sessions = require("../database/user_sessions.js");
const bad_words = require("badwords-list").object;

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
        
              const full_string = `${artist} - ${song}`;
              console.log(id,"is currently streaming", full_string.length > 80 ? full_string.slice(0, 77) + `...` : full_string);
              update_github_status(full_string.length > 80 ? full_string.slice(0, 77) + `...` : full_string, user_sessions.get_github_auth(id));
            }
          }
          setTimeout(() => { get_now_playing(id) }, 30000);
        });
    }).end();
}

function cleanup_string(inputString) {
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

