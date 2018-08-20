import express from "express";
import { Express } from "express";

import GroupRoutes from "./routes/groups";
import UserRoutes from "./routes/users";

import getPort = require('get-port');

export default class Server {

    private port : number;
    private app : Express;

    //Create a server. The -1 setting here is because of issues with null checks
    //in typescript - this hack gets around that and keeps the process still running
    //fine
    constructor(port : number = -1){
        this.port = port;
        this.app = express();
        this.loadRoutes();
    }

    //Load all routes from the roue objects. Only handle pathing here,
    //actual route logic is in the routes/ folder
    private loadRoutes() : void {
        // /users
        this.app.get("/users", UserRoutes.getAllUsers);
        this.app.get("/users/query", UserRoutes.queryForUsers);
        this.app.get("/users/:uid", UserRoutes.getSpecificUser);
        this.app.get("/users/:uid/groups", UserRoutes.getUsersGroups);

        // /groups
        this.app.get("/groups", GroupRoutes.getAllGroups);
        this.app.get("/groups/query", GroupRoutes.queryForGroups);
        this.app.get("/groups/:gid", GroupRoutes.getSpecificGroup);
    }

    //Set server to listen on set port
    public async listen() : Promise<void> {
        //If port is set to -1 (not set) just grab a random open port
        //This is done here because constructors don't support asynchronous code well.
        if(this.port == -1) this.port = await getPort();
        this.app.listen(this.port, ()=> console.log(`Server is now listening on ${this.port}!`));
    }

}