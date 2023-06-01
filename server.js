const express = require("express");
require("dotenv").config();
const crypto = require("crypto");
const app = express();
const port = 3000;

//modules
const spotify_redirect = require("./modules/spotify/spotify_redirect.js");
const spotify_token = require("./modules/spotify/spotify_token.js");
const user_sessions = require("./modules/database/user_sessions.js");

// Home page route within this
app.use(express.static("./public"));
app.use(express.urlencoded({extended: false}));

app.post("/login", (req,res) => {
    const state = crypto.randomBytes(20).toString("hex");
    user_sessions.set_user_value(state);
    spotify_redirect(res, state);
});

app.get("/spotify_code", spotify_token(),(req, res) => {
    if(req.query.error){
        return res.redirect("/");
    }else{
        res.send(user_sessions.get_user(req.query.state));
    }
});

// app.get("/github_code", github_token(), (req, res) => {
//     res.send("Received Github Token :)");
// });

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});