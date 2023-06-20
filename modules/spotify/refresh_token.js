const https = require("https");
const querystring = require("querystring");
const user_sessions = require("../database/user_sessions.js");
const stream_to_message = require("../stream_to_message.js");
const { SPOTIFY_ID, SPOTIFY_SECRET } = process.env;

function refresh_token(token, id) {
  const token_endpoint = "https://accounts.spotify.com/api/token";
  const post_body = querystring.stringify({
    grant_type: "refresh_token",
    refresh_token: token,
  });
  const options = {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${SPOTIFY_ID}:${SPOTIFY_SECRET}`
      ).toString("base64")}`, //TODO FIX THIS TO WORK WITH .env LATER
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  https
    .request(token_endpoint, options, (response) => {
      stream_to_message(response, (body) => {
        const refresh_json = JSON.parse(body);
        user_sessions.set_spotify_access(refresh_json.access_token, id);
        setTimeout(() => {
          refresh_token(token, id);
        }, refresh_json.expires_in * 1000);
      });
    })
    .end(post_body);
}

module.exports = refresh_token;
