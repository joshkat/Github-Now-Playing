const https = require("https");
const querystring = require("querystring");
const stream_to_message = require("../stream_to_message.js");
const user_sessions = require("../database/user_sessions.js");

function github_token(){
    return(req, res, next) => {
        if(user_sessions.get_user_from_state(req.query.state) === undefined || req.query.error){
            res.redirect("/");
            return;
        }
        const token_endpoint = "https://github.com/login/oauth/access_token";
        const post_body = querystring.stringify({
            code: req.query.code,
            client_id: process.env.GITHUB_ID,
            client_secret: process.env.GITHUB_SECRET
        });
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        };
        https.request(token_endpoint, options, (response) => {
            stream_to_message(response, (body) => {
                const github_access_token = querystring.parse(body).access_token;
                //at this point begin loop to upload np to github
                user_sessions.set_user_value(req.query.state, "github_auth", github_access_token);

                console.log(user_sessions.get_user_from_state(req.query.state), "final thing before redirect");
            });
        }).end(post_body);
        next();
    }
}

module.exports = github_token;

