const https = require("https");
const querystring = require("querystring");
const stream_to_message = require("../stream_to_message.js");
const get_spotify_id = require("./get_spotify_id.js");
const user_sessions = require("../database/user_sessions.js");

function spotify_token(){
    return (req, res, next) => {
        if(req.query.code === undefined){
            res.redirect("/");
            return;
        }
        const token_endpoint = "https://accounts.spotify.com/api/token";
        const post_body = querystring.stringify({
            grant_type: "authorization_code",
            code: req.query.code,
            redirect_uri: process.env.REDIRECT_URL?`${process.env.REDIRECT_URL}/spotify_code`:"http://localhost:3000/spotify_code"
        });
        const options = {
            method: "POST",
            headers: {
                "Content-Type":"application/x-www-form-urlencoded",
                "Authorization": `Basic ${Buffer.from(`${process.env.SPOTIFY_ID}:${process.env.SPOTIFY_SECRET}`).toString("base64")}`
            }
        }
        const token_request = https.request(token_endpoint, options, (token_response) => {
            stream_to_message(token_response, (body)=>{
                const spotify_json = JSON.parse(body);
                if(spotify_json.error){
                    return res.redirect("/");
                }else{
                    //add users spotify refresh token to db
                    user_sessions.set_user_value(req.query.state, "spotify_refresh", spotify_json.refresh_token);
                    //get users unique spotify ID and move on to github auth
                    get_spotify_id(req.query.state, spotify_json.access_token, next, res);
                }
            });
        });
        token_request.end(post_body);
    }
}

module.exports = spotify_token;