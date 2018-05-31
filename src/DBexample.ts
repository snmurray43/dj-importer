import * as fs from "fs";
import {DB} from "./DB";

const config : any = JSON.parse(fs.readFileSync(__dirname + "/../config.json", "utf8"));
const db = new DB(config.mysql);
const createdD = new Date('2018-06-04 00:00:00');
//var createdD = new Date().toISOString().slice(0, 19).replace('T', ' ');
const updatedD = new Date('2018-07-05 00:00:00');

const createdTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
//const createdT : string = <string> createdTime;
//const createdT : Date = <Date> createdTime;

//const created = new Date(createdT);
//console.log(createdT);

/*export interface Playlist {
    id : number;
    spotifyId : string;
    spotifyUsername : string;
    name : string;
    createdAt : Date;
    updatedAt : Date;
}*/

const myPlaylist = {
   id : 1001,
   name : "name test2.0",
   spotifyUsername : "username test2.0",
   spotifyId : "spotifyId test 4.0",
   userId : "userId test",
    createdAt : createdD,
    updatedAt : updatedD,
    _kind : "playlist"

};

const myPlaylist2 = {
    id: 483,
    spotifyId : "updated ID2",
    spotifyUsername : "updated username2",
    name : "updated name2",
    createdAt : createdD,
    updatedAt : updatedD,
    _kind : "playlist"
};

const mySong = {
    id: 166,
    videoId : "test video ID 2",
    videoTitle: "Test video title 2",
    thumbUrl: "test thumb url 2",
    position: 10,
    createdAt : createdD,
    updatedAt : updatedD,
    _kind : "song"

};


db
    //.findSong(163);
    //.deleteSong(mySong);

//.updateSong(mySong);
    .insertPlaylist(myPlaylist);
    //.deletePlaylist(myPlaylist2);

   //.updatePlaylist(myPlaylist2);

  //  .findPlaylist(191);

/*.insertPlaylist({id: 191, username: "a user", name: "test playlist", spotifyId: "test spot ID"})
.then(playlist => {
   console.log(playlist);
});*/


