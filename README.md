# Github-Now-Playing

Share what you're currently listening to on Spotify to your Github Status

---

## Setup
1. Clone project
2. Create a Spotify Developer App and obtain a Github Acess Token
3. Setup `.env` file with `SPOTIFY_SECRET`, `SPOTIFY_ID`, and `GITHUB_ACCESS_TOKEN`
4. Run `npm install`, then `node server.js`
5. Navigate to localhost:3000, and login

### Obtain Keys

[Github Token](https://github.com/settings/tokens)

[Spotify App](https://developer.spotify.com/dashboard) (be sure to put the redirect URI as "http://localhost:3000/spotify_code")
