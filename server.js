const express = require("express");
require("dotenv").config();
const app = express();
const port = 3000;

//modules
const spotify_redirect = require("./modules/spotify/spotify_redirect.js");
const spotify_token = require("./modules/spotify/spotify_token.js");
const get_now_playing = require("./modules/spotify/get_now_playing.js");

//user session
/**
 * Will contain objects of format:
 *  {
 *      spotify_refresh:"",
 *      github_refresh:"",
 *  }
 */
let user_session = {};

// Home page route within this
app.use(express.static("./public"));
app.use(express.urlencoded({extended: false}));

app.post("/login", spotify_redirect(),(req,res) => {
    // when redirect fails -> 404
    res.status(404).send("You shouldn't be here >:( ");
});

app.get("/spotify_code", spotify_token(),(req, res) => {
    if(req.query.error){
        return res.redirect("/");
    }else{
        user_session.spotify_refresh = res.locals.spotify_refresh;
        res.json(user_session);
    }
});

// app.get("/github_code", github_token(), (req, res) => {
//     res.send("Received Github Token :)");
// });

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});
