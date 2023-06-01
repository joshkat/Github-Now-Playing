const querystring = require("querystring");

function github_redirect(){
    return (req, res, next) => {
        console.log("Redirecting to Github!");
        const auth_endpoint = "https://github.com/login/oauth/authorize";
        const query_params = querystring.stringify({
            scope: "user",
            client_id: process.env.GITHUB_ID,
            state: req.query.state
        });
        res.redirect(302, `${auth_endpoint}?${query_params}`);
        next();
    }
}

module.exports = github_redirect