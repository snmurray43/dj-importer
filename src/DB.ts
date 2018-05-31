import * as mysql from "mysql";
import {Pool} from "mysql";
import {ISpotifyPlaylist} from "./main";
import {PoolConnection} from "mysql";

interface BaseEntity {

    _kind : string;

    [key: string]: any;

}

const DBMapping = [

    {
        table: "playlist_testing",
        _kind : "playlist",
        numCols : 6, // number of columns that will be updated when inserting a playlist (
        mapping: [ ["id", "id"], ["spotifyId", "spotify_id"], ["spotifyUsername" , "spotify_username"],["name", "name"],["createdAt","created_at"],["updatedAt","updated_at"] ]
    },
    {
        table: "playlist_songs_testing",
        _kind : "song",
        numCols : 7, // number of columns that will be updated when inserting a playlist (
        mapping: [ ["id", "id"], ["videoId", "video_id"],["videoTitle" , "video_title"],["thumbUrl","thumb_url"],["position","position"],["createdAt", "created_at"],["updatedAt","updated_at"] ]
    }

];

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
    public insertPlaylist(playlist : Playlist) : Promise<Playlist> {
        let insertId : number;
        const table = DBMapping[0];
        const cols = table.mapping.map(f=>f[1]);
        const cols2 = table.mapping[1][1];
        console.log(cols2);
        //const vals = playlist[table.mapping.map((f:any) => f[1][0])];
        //console.log(vals);
        console.log(table.mapping[0][0]);
        //const vals = playlist[table.mapping[0][0]];
       // const vals = playlist[table.mapping.map(f => f[0][0])];

        let values : any[] = [];
        for (let i=0; i<table.numCols; i++) {
            values.push(playlist[table.mapping[i][0]])
        }
        if(cols.indexOf("id") != -1) {
            values.splice(cols.indexOf("id"),1);
            cols.splice(cols.indexOf("id"), 1);
        }
/*
        console.log("Columns: " + cols);
        console.log("VALUES ARRAY: " + `${values.join(", ")}`);
       // console.log("vals: " + vals);
        console.log("Columns: " + cols);
        console.log(table.table);
*/

        this.getConnection().then(conn => {
            const s = `insert into ${(table.table)} (${cols.join(", ")}) values ('${values.join("', '")}', NOW(), NOW())`;
            //console.log(s);

            //     conn.query(s, [playlist[table.mapping[0][0]], playlist[table.mapping[1][0]], playlist[table.mapping[2][0]], playlist[table.mapping[3][0]]], function (err: any, results) {
            conn.query(s, function (err: any, results) {

                if (err) throw err;
                //console.log("Insert ID: " + results.insertId);
               // insertId = results.insertId;
            });
            conn.release();
        });
       // const sql = `INSERT INTO $(table.table) ${cols.join(", ")} ${vals.join(", ")}`;
        return new Promise<Playlist>((resolve, reject) => {
            /*this.getConnection().then(conn => {
                const sql = "insert into playlist_testing (name, spotify_id, spotify_username, created_at, updated_at) values (?,?,?,NOW(),NOW())";
                conn.query(sql, [playlist.name, playlist.spotifyId, playlist.spotifyUsername, playlist.updatedAt], function(err:any, results) {
                    if(err) throw err;
                    //console.log("Insert ID: " + results.insertId);
                    insertId = results.insertId;
                });
                conn.release();
            })*/
     /*       .then( conn => {
                this.getConnection().then(conn => {
                    this.findPlaylist(insertId)
                        .then((result: any) => {
                            resolve(result);
                        });
                    conn.release();
                })
            });*/
        });
    }

    /**
     * Now, you're given data that exists in the database,
     * need to generate an UPDATE SQL query, and run it, and then just resolve the updated playlist.
     */
    public updatePlaylist(playlist : Playlist) : Promise<Playlist> {
        return new Promise<Playlist>((resolve, reject) => {
            this.getConnection().then(conn => {
                const sql = "UPDATE playlist_testing set name = ?, spotify_id = ?, spotify_username = ?, updated_at = NOW() WHERE id = ?"
                conn.query(sql, [playlist.name, playlist.spotifyId, playlist.spotifyUsername, playlist.id], function(err:any, results: any, fields : any) {
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

    /** ----------------------------------------------------------------------------------------------------------
     * ----------------------------------------------------------------------------------------------------------
     * ----------------------------------------------------------------------------------------------------------

    */
    /**
     * Write a SELECT to find the song row with the database id = id and resolve it.
     * (You'll need this to power the insertSong function below)
     */
    public findSong(id : number) : Promise<Song> {
        return new Promise<Song>((resolve, reject) => {
            this.getConnection().then(conn => {
                const sql = "SELECT * FROM playlist_songs_testing WHERE id = ?";
                conn.query(sql, [id], function(err:any, results : any) {
                    if(err) throw err;
                    //console.log("Find Title: " + results[0].video_title);
                    resolve(results[0]);
                });
                conn.release();
            });
        });
    }

    /**
     * The insight here is that you're taking in a song,
     * need to generate, run an SQL INSERT, and then resolve the data from the newly inserted row
     */
    public insertSong(song : Song) : Promise<Song> {
        let insertId : number;
        return new Promise<Song>((resolve, reject) => {
            this.getConnection().then(conn => {
                const sql = "insert into playlist_songs_testing (video_id, video_title, thumb_url, position, playlist_id, created_at, updated_at) values (?,?,?,?,40, NOW(),NOW())";
                conn.query(sql, [song.videoId, song.videoTitle, song.thumbUrl, song.position], function(err:any, results) {
                    if(err) throw err;
                    console.log("Insert ID: " + results.insertId);
                    insertId = results.insertId;
                });
                conn.release();
            })
                .then( conn => {
                    this.getConnection().then(conn => {
                        this.findSong(insertId)
                            .then((result: any) => {
                                //console.log("Result: " + result.thumb_url);
                                resolve(result);
                            });
                        conn.release();
                    })
                });
        });
    }

    /**
     * Now, you're given data that exists in the database,
     * need to generate an UPDATE SQL query, and run it, and then just resolve the updated song.
     */
    public updateSong(song : Song) : Promise<Song> {
        return new Promise<Song>((resolve, reject) => {
            this.getConnection().then(conn => {
                const sql = "UPDATE playlist_songs_testing set video_id = ?, video_title = ?, thumb_url = ?, position = ?, created_at = ?, updated_at = ? WHERE id = ?"
                conn.query(sql, [song.videoId, song.videoTitle, song.thumbUrl, song.position, song.createdAt, song.updatedAt, song.id], function(err:any, results: any, fields : any) {
                    if(err) throw err;
                });
                resolve(song);
                conn.release();
            });
        });
    }

    /**
     * Just generate and run the appropriate DELETE SQL statement and resolve when its done
     */
    public deleteSong(song: Song) : Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.getConnection().then(conn => {
                const sql = "DELETE FROM playlist_songs_testing WHERE id = ?";
                conn.query(sql, song.id, function(err:any) {
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

export interface Playlist extends BaseEntity{
    id : number;
    spotifyId : string;
    spotifyUsername : string;
    name : string;
    createdAt : Date;
    updatedAt : Date;
}

export interface Song extends BaseEntity{
    id : number;
    videoId : string;
    videoTitle: string;
    thumbUrl : string;
    position: number;
    createdAt: Date;
    updatedAt: Date;
}

interface IDBConfig {
    host : string;
    user : string;
    password : string;
    database : string;
}