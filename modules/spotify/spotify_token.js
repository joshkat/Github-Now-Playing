const https = require("https");
const querystring = require("querystring");
const stream_to_message = require("../stream_to_message.js");
const get_now_playing = require("./get_now_playing.js");
const refresh_token = require("./refresh_token.js");
const { SPOTIFY_ID, SPOTIFY_SECRET } = process.env;

function spotify_token(){
    return function (req, res, next){
        const token_endpoint = "https://accounts.spotify.com/api/token";
        const post_body = querystring.stringify({
            grant_type: "authorization_code",
            code: req.query.code,
            redirect_uri: "http://localhost:3000/spotify_code"
        });
        const options = {
            method: "POST",
            headers: {
                "Content-Type":"application/x-www-form-urlencoded",
                "Authorization": `Basic ${Buffer.from(`${SPOTIFY_ID}:${SPOTIFY_SECRET}`).toString("base64")}`
            }
        }
        const token_request = https.request(token_endpoint, options, (token_response) => {
            stream_to_message(token_response, (body)=>{
                const spotify_json = JSON.parse(body);
                if(spotify_json.error){
                    return res.redirect("/");
                }else{
                    console.log(spotify_json);
                    res.locals.spotify_refresh = spotify_json.refresh_token;
                    res.locals.spotify_access_token = spotify_json.access_token;
                    //set access token for inital request
                    refresh_token.set_access_token(spotify_json.access_token);
                    //start refreshing access token
                    refresh_token.refresh_token(spotify_json.refresh_token);
                    //calls get now playing function to start fetching and logging current track
                    get_now_playing();

                    next();
                }
            });
        });
        token_request.end(post_body);
    }
}

module.exports = spotify_token;