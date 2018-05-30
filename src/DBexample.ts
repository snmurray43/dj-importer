import * as fs from "fs";
import {DB} from "./DB";

const config : any = JSON.parse(fs.readFileSync(__dirname + "/../config.json", "utf8"));
const db = new DB(config.mysql);

db
.insertPlaylist({id: "-1", username: "a user", name: "test playlist"})
.then(playlist => {
   console.log(playlist);
});

