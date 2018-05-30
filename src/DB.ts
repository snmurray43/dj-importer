import * as mysql from "mysql";
import {Pool} from "mysql";
import {ISpotifyPlaylist} from "./main";
import {PoolConnection} from "mysql";

export class DB {

    private pool : mysql.Pool;

    public constructor(config : IDBConfig){
        this.pool  = mysql.createPool(config);
    }

    /**
     * Write a SELECT to find the playlist row with the database id = id and resolve it.
     * (You'll need this to power the insertPlaylist function below)
     */
    public findPlaylist(id : number) : Promise<Playlist> {
        return new Promise<Playlist>((resolve, reject) => {

        });
    }

    /**
     * The insight here is that you're taking in a spotify playlist,
     * need to generate, run an SQL INSERT, and then resolve the data from the newly inserted row
     */
    public insertPlaylist(playlist : ISpotifyPlaylist) : Promise<Playlist> {
        return new Promise<Playlist>((resolve, reject) => {
            this.getConnection().then(conn => {
                // do your things with conn here...


                // at some point you'll need to run this
                conn.release();
            });
        });
    }

    /**
     * Now, you're given data that exists in the database,
     * need to generate an UPDATE SQL query, and run it, and then just resolve the updated playlist.
     */
    public updatetPlaylist(playlist : Playlist) : Promise<Playlist> {
        return new Promise<Playlist>((resolve, reject) => {
            this.getConnection().then(conn => {
                // do your things with conn here...


                // at some point you'll need to run this
                conn.release();
            });
        });
    }

    /**
     * Just generate and run the appropriate DELETE SQL statement and resolve when its done
     */
    public deletePlaylist(playlist : Playlist) : Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.getConnection().then(conn => {
                // do your things with conn here...


                // at some point you'll need to run this
                conn.release();
            });
        });
    }

    private getConnection() : Promise<PoolConnection> {
        return new Promise<PoolConnection>((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    console.error(err);
                    process.exit(-1);
                }

                resolve(connection);
            });
        });
    }
}

export interface Playlist {
    id : number;
    spotifyId : string;
    spotifyUsername : string;
    name : string;
    createdAt : Date;
    updatedAt : Date;
}

interface IDBConfig {
    host : string;
    user : string;
    password : string;
    database : string;
}