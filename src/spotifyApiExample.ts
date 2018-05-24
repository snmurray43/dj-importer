const SpotifyWebApi = require("spotify-web-api-node");

if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_SECRET_KEY || !process.env.YOUTUBE_KEY) {
    console.log("You must set SPOTIFY_CLIENT_ID, SPOTIFY_SECRET_KEY, and YOUTUBE_KEY environment variables.");
    process.exit(-1);
}

const spotify = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_SECRET_KEY
});

spotify.clientCredentialsGrant()
    .then((data: any) => {
        spotify.setAccessToken(data.body['access_token']);

        spotify.searchPlaylists("jay-z", {market: "us"})
            .then((data: any) => {
                const items = data.body.playlists.items;

                console.log("Got these results:");
                items.forEach((f: any) => {
                    console.log(f.id);
                });

            })
            .catch((err: any) => {
                console.log(err);
            });

        spotify.getPlaylistTracks("spotify", "37i9dQZF1DX4dyzvuaRJ0n")
            .then((data: any) => {
                console.log("Total tracks: " + data.body.items.length);
            })
            .catch((err: any) => {
                console.log(err);
            });

    })
    .catch((err: any) => {
        console.log('Something went wrong when retrieving an access token', err);
    });