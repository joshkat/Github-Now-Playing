const https = require("https");
const stream_to_message = require("../stream_to_message.js");
const update_github_status = require("../update_github_status.js");
const refresh_spotify = require("./refresh_token.js");
const bad_words = require("badwords-list").object;

function get_now_playing(){
    const token = refresh_spotify.get_access_token();
    const np_endpoint = "https://api.spotify.com/v1/me/player/currently-playing";
    const options = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }
    https.request(np_endpoint, options, (res) => {
        stream_to_message(res, (body) => {
            if(body.length === 0){
                console.log("Nothing currently streaming");
                //have set timeout every 30seconds here so once streaming begins itll know
                setTimeout(()=> { get_now_playing(token) }, 30000);
                return;
            }
            const np_json = JSON.parse(body);
            //format how you want str to look here
            //then send to github
            let artist = cleanup_string(np_json?.item?.artists[0]?.name);
            let song = cleanup_string(np_json?.item?.name);


            const full_string = `${artist} - ${song}`;
            console.log(full_string.length > 80 ? full_string.slice(0, 77) + `...` : full_string);
            
            //for testing
            setTimeout(()=> { get_now_playing(token) }, 30000);
            update_github_status(full_string.length > 80 ? full_string.slice(0, 77) + `...` : full_string);
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

