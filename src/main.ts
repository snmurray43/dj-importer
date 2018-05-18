class Main {
    public Main(params : any) : void {
        console.log("it worked!");
        console.log(params);
    }
}

const parsedParams : any = require('minimist')(process.argv.slice(2));
(new Main()).Main(parsedParams);