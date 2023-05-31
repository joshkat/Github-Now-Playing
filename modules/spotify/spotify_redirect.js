const querystring = require("querystring");

function spotify_redirect(){
    return function(req, res, next){
        console.log("Redirecting!");
        const auth_endpoint = "https://accounts.spotify.com/authorize";
        const query_params = querystring.stringify({
            client_id: process.env.SPOTIFY_ID,
            response_type: "code",
            redirect_uri: "http://localhost:3000/spotify_code",
            scope: "user-read-currently-playing",
        });
        res.redirect(302, `${auth_endpoint}?${query_params}`);
    }
}

module.exports = spotify_redirect;