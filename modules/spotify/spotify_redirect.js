const querystring = require("querystring");

function spotify_redirect(res, state){
    console.log("Redirecting!");
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

module.exports = spotify_redirect;