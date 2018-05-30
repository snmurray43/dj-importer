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
            this.getConnection().then(conn => {
                const sql = "SELECT * FROM playlist_testing WHERE id = ?";
                conn.query(sql, [id], function(err:any, results : any) {
                    if(err) throw err;
                    //console.log("Find Name: " + results[0].name);
                    resolve(results[0]);
                });
                conn.release();
            });
        });
    }

    /**
     * The insight here is that you're taking in a spotify playlist,
     * need to generate, run an SQL INSERT, and then resolve the data from the newly inserted row
     */
    public insertPlaylist(playlist : ISpotifyPlaylist) : Promise<Playlist> {
        let insertId : number;
        return new Promise<Playlist>((resolve, reject) => {
            this.getConnection().then(conn => {
                const sql = "insert into playlist_testing (name, spotify_id, spotify_username, created_at, updated_at) values (?,?,?,?,?)";
                conn.query(sql, [playlist.name, playlist.spotifyId, playlist.username, playlist.createdAt, playlist.updatedAt], function(err:any, results) {
                    if(err) throw err;
                    console.log("Insert ID: " + results.insertId);
                    insertId = results.insertId;

                });

                conn.release();
            })
            .then( conn => {
                this.getConnection().then(conn => {
                    this.findPlaylist(insertId)
                        .then((result: any) => {
                            console.log("Result: " + result.spotify_id);
                            resolve(result);
                        });
                    conn.release();
                })
            });
        });
    }

    /**
     * Now, you're given data that exists in the database,
     * need to generate an UPDATE SQL query, and run it, and then just resolve the updated playlist.
     */
    public updatePlaylist(playlist : Playlist) : Promise<Playlist> {
        return new Promise<Playlist>((resolve, reject) => {
            this.getConnection().then(conn => {
                const sql = "UPDATE playlist_testing set name = ?, spotify_id = ?, spotify_username = ?, created_at = ?, updated_at = ? WHERE id = ?"
                conn.query(sql, [playlist.name, playlist.spotifyId, playlist.spotifyUsername, playlist.createdAt, playlist.updatedAt, playlist.id], function(err:any, results: any, fields : any) {
                    if(err) throw err;
                });
                resolve(playlist);
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
                const sql = "DELETE FROM playlist_testing WHERE id = ?"
                conn.query(sql, playlist.id, function(err:any) {
                    if(err) throw err;
                });
                resolve(true);
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