const express = require("express");
require("dotenv").config();
const app = express();
const port = 3000;

// Home page route within this
app.use(express.static("./public"));
app.use(express.urlencoded());

app.post("/spotify-login", (req,res) => {
    console.log(req.body);
    res.send("Posting to Spotify " + process.env.SPOTIFY_ID);
})

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});
