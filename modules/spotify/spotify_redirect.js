const querystring = require("querystring");
const generate_session = require('../generate_session');

function spotify_redirect(){
    return (req, res, next) => {
        const state = generate_session();
        console.log("Redirecting to Spotify!");
        const auth_endpoint = "https://accounts.spotify.com/authorize";
        const query_params = querystring.stringify({
            client_id: process.env.SPOTIFY_ID,
            response_type: "code",
            redirect_uri: "http://localhost:3000/spotify_code",
            scope: "user-read-currently-playing user-read-private user-read-email",
            state: state
        });
        res.redirect(302, `${auth_endpoint}?${query_params}`);
    }
}

module.exports = spotify_redirect;