const https = require("https");
const stream_to_message = require("../stream_to_message");
const user_sessions = require("../database/user_sessions");

//temp imports
const get_now_playing = require("./get_now_playing.js");
const refresh_token = require("./refresh_token.js");

function get_spotify_id(state, token){
    const endpoint = "https://api.spotify.com/v1/me";
    const options = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    };
    https.request(endpoint, options, (res) => {
        stream_to_message(res, (body) => {
            const response_obj = JSON.parse(body);
            const spotify_id = response_obj.id;
            if(user_sessions.user_exists(spotify_id)){
                console.log("user is already logged in, not making another session");
                return;
            }else{
                const user = user_sessions.get_user(state);
                console.log(user, "USER");
                user_sessions.set_user_value(state, "spotify_id", response_obj.id);
                console.log(user_sessions.get_user(state));

                //keep this here for now, but fr need to put this in after github auth
                //set access token for inital request
                refresh_token.set_access_token(token);
                //start refreshing access token
                refresh_token.refresh_token(user.spotify_refresh);
                //calls get now playing function to start fetching and logging current track
                get_now_playing();
            }
        });
    }).end();
}

module.exports = get_spotify_id;