var async = require("async");

const list : string[] = ["hey" , "howdy" , "hola" , "this", "what", "the", "heyo"];
async.mapLimit(list, 5, function(url : any, cb : any) {
    cb(null, url.length);
}, (err : any, results : any) => {
    if (err)
        console.log("ERROR" + err)
    // results is now an array of the response bodies
    console.log(results)
})