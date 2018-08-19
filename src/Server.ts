import express from "express";
import { Express } from "express";

import GroupRoutes from "./routes/groups";
import UserRoutes from "./routes/users";

import getPort = require('get-port');

export default class Server {

    port : number;
    app : Express;

    constructor(port : number = -1){
        this.port = port;
        this.app = express();
        this.loadRoutes();
    }

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

    public async listen() : Promise<void> {
        if(this.port == -1) this.port = await getPort();
        this.app.listen(this.port, ()=> console.log(`Server is now listening on ${this.port}!`));
    }

}