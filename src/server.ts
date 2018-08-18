import express from "express";
import { Express } from "express";

export default class Server {

    port : number;
    app : Express;

    constructor(port : number){
        this.port = port;
        this.app = express();
        this.loadRoutes();
    }

    private loadRoutes() : void {
        
    }

    public listen() : void {
        this.app.listen(this.port, ()=> console.log(`Server is now listening on ${this.port}!`));
    }

}