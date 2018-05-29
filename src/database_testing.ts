/*
const mysql = require('mysql');
const con = mysql.createConnection({
    host     : 'localhost',
    user     : 'jointdj',
    password : 'Jointdj43$',
    database : 'jointdj'
});

con.connect((err : any) => {
    if(err){
        console.log('Error connecting to Db');
        return;
    }
    console.log('Connection established woohoo!!');
});

var sql = "insert into playlist_testing (name, user_id) values ?";
var values = [
    ['spencer' , 43],
    ['jax', 47]
];
con.query(sql, [values], function(err:any) {
    if(err) throw err;
    con.end();
});
*/

/*
con.end((err : any) => {

});*/
