const https = require("https");
const stream_to_message = require("../stream_to_message");
const user_sessions = require("../database/user_sessions");

//temp imports
const get_now_playing = require("./get_now_playing.js");
const refresh_token = require("./refresh_token.js");

function get_spotify_id(state, token, next, response){
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
            user_sessions.set_user_value(state, "spotify_id", spotify_id);

            if(user_sessions.user_id_exists(spotify_id) && user_sessions.user_github_exists(spotify_id)){
                console.log("user is already logged in, not making another session");
                //redirects to sucess page
                response.redirect("/success.html");
                return;
            }else{
                const user = user_sessions.get_user(spotify_id);
                //keep this here for now, but fr need to put this in after github auth
                //set access token for inital request
                user_sessions.set_spotify_access(token, response_obj.id);


                //start refreshing access token
                refresh_token.refresh_token(user.spotify_refresh, response_obj.id);
                //calls get now playing function to start fetching and logging current track
                get_now_playing(response_obj.id);

                next();
            }
        });
    }).end();
}

module.exports = get_spotify_id;