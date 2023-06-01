const express = require("express");
require("dotenv").config();
const app = express();
const port = 3000;

//modules
const spotify_redirect = require("./modules/spotify/spotify_redirect.js");
const spotify_token = require("./modules/spotify/spotify_token.js");
const github_redirect = require("./modules/github/github_redirect.js");

//db
const user_sessions = require("./modules/database/user_sessions.js");

// Home page route within this
app.use(express.static("./public"));
app.use(express.urlencoded({extended: false}));

app.post("/login", spotify_redirect() ,(req,res) => {
    console.log("Redirect should've been handled");
});

app.get("/spotify_code", spotify_token(), github_redirect(),(req, res) => {
    if(req.query.error){
        return res.redirect("/");
    }
});

app.get("/github_code", (req, res) => {
    res.send("Received Github Token :) it's " + req.query.code);
});

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});