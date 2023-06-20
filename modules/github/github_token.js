const https = require("https");
const querystring = require("querystring");
const stream_to_message = require("../stream_to_message.js");
const user_sessions = require("../database/user_sessions.js");

const get_now_playing = require("../spotify/get_now_playing.js");
const refresh_token = require("../spotify/refresh_token.js");

function github_token() {
  return (req, res, next) => {
    if (
      user_sessions.get_user_from_state(req.query.state) === undefined ||
      req.query.error
    ) {
      res.redirect("/");
      return;
    }
    const token_endpoint = "https://github.com/login/oauth/access_token";
    const post_body = querystring.stringify({
      code: req.query.code,
      client_id: process.env.GITHUB_ID,
      client_secret: process.env.GITHUB_SECRET,
    });
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    https
      .request(token_endpoint, options, (response) => {
        stream_to_message(response, (body) => {
          const github_access_token = querystring.parse(body).access_token;
          const user = user_sessions.get_user_from_state(req.query.state);

          //at this point begin loop to upload np to github
          user_sessions.set_user_value(
            req.query.state,
            "github_auth",
            github_access_token
          );
          //start refreshing access token
          refresh_token(user.spotify_refresh, user.spotify_id);
          //calls get now playing function to start fetching and logging current track
          get_now_playing(user.spotify_id);
        });
      })
      .end(post_body);
    next();
  };
}

module.exports = github_token;
