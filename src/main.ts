import * as _ from "lodash";
import * as restify from "restify";
import * as fs from "fs";
import {Server} from "restify";
import {Response} from "restify";
import {Next} from "restify";
import {Request} from "restify";

const SpotifyWebApi = require("spotify-web-api-node");

interface IConfig {
    port: number;
    clientId : string;
    clientSecret : string;
}

class Main {

    config : IConfig;
    server : restify.Server;

    public Main(params : IConfig) : void {
        this.config = params;
        this.configServer();
    }

    public index(request: Request, response: Response, next: Next) : void {
        const html = fs.readFileSync(__dirname + "/../templates/index.html", "utf8");
        this.sendHtml(html, response, next);
    }

    private search(html : string, response: Response, next: Next) : void {

        const spotify = new SpotifyWebApi({
            clientId: this.config.clientId,
            clientSecret: this.config.clientSecret
        });

        spotify.clientCredentialsGrant()
            .then((data : any) => {

                spotify.setAccessToken(data.body['access_token']);

                spotify.searchPlaylists("country", {market: "us"})
                    .then((data: any) => {
                        const items = data.body.playlists.items;
                        response.send(items);
                        next();
                    }, (err: any) => {
                        console.log(err);
                    });
            },
            function(err : any) {
                console.log('Something went wrong when retrieving an access token', err);
            }
        );
    }

    private sendHtml(html : string, response: Response, next: Next) : void {
        response.setHeader('Content-Type', 'text/html');
        response.setHeader('Content-Length', Buffer.byteLength(html));
        response.write(html);

        next();
    }

    private configServer() : void {
        this.server = restify.createServer({
            name: 'dj-importer',
            version: '1.0.0'
        });

        this.server.use(restify.plugins.acceptParser(this.server.acceptable));
        this.server.use(restify.plugins.queryParser());
        this.server.use(restify.plugins.bodyParser());

        this.server.get('/', this.index.bind(this));
        this.server.get('/search', this.search.bind(this));

        this.server.listen(this.config.port, () => {
            console.log('%s listening at %s', this.server.name, this.server.url);
        });
    }
}

if(!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_SECRET_KEY){
    console.log("You must set SPOTIFY_CLIENT_ID and SPOTIFY_SECRET_KEY environment variables.");
    process.exit(-1);
}

const parsedParams : IConfig = _.extend({port: 8080}, require('minimist')(process.argv.slice(2)));
parsedParams.clientId = process.env.SPOTIFY_CLIENT_ID ? process.env.SPOTIFY_CLIENT_ID : "";
parsedParams.clientSecret = process.env.SPOTIFY_SECRET_KEY ? process.env.SPOTIFY_SECRET_KEY : "";

(new Main()).Main(parsedParams);


