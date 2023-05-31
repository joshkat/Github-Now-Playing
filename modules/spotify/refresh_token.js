const https = require("https");
const querystring = require("querystring");

const stream_to_message = require("../stream_to_message.js");
const { SPOTIFY_ID, SPOTIFY_SECRET } = process.env;
let access_token = "";

function refresh_token(token){
    const token_endpoint = "https://accounts.spotify.com/api/token";
    const post_body = querystring.stringify({
        "grant_type":"refresh_token",
        "refresh_token":token
    });
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Basic ${Buffer.from(`${SPOTIFY_ID}:${SPOTIFY_SECRET}`).toString("base64")}`, //TODO FIX THIS TO WORK WITH .env LATER
            "Content-Type": "application/x-www-form-urlencoded"
        }
    };

    https.request(token_endpoint, options, (response) => { stream_to_message(response, (body) => {
        const refresh_json = JSON.parse(body);
        access_token = refresh_json.access_token;
        setTimeout(() => { refresh_token(token) }, refresh_json.expires_in * 1000);
    })}).end(post_body);
}

function set_access_token(token) {
    access_token = token;
}

module.exports = {
    get_access_token: () => access_token,
    refresh_token: refresh_token,
    set_access_token: set_access_token
}