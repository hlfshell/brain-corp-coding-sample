import { Request, Response } from "express";

import { Route } from "../interfaces/Route";
import { Passwd } from "../classes/Passwd";
import ErrorResponse from "../interfaces/ErrorResponse";
import { Group } from "../classes/Group";

let passwd = Passwd.getInstance();
let group = Group.getInstance();

function handleErrors(err : Error, res : Response){
    let error : ErrorResponse = {
        code: "",
        message: err.message
    }

    switch(err.message){
        case "Something went wrong reading the passwd file": {
            error.code = "PASSWD_FILE_LOCATION_ERROR";
            break;
        }
        case "There was an issue parsing the passwd file": {
            error.code = "PASSWD_PARSE_ERROR";
            break;
        }
        default: {
            error.code = "UNKNOWN_ERROR";
            break;
        }
    }

    res.status(500).send(error);
};

let UserRoutes : Route = {

    getAllUsers: async function(req : Request, res : Response){
        try{
            let allUsers = await passwd.getAllUsers();
            res.send(allUsers);
        } catch(err){
            handleErrors(err, res);
        }
    },

    queryForUsers: async function(req : Request, res : Response){
        try {
            let users = await passwd.getUsersByQuery(req.query);
            res.send(users);
        } catch(err){
            handleErrors(err, res);
        }
    },

    getSpecificUser: async function(req : Request, res : Response){
        try {
            let users = await passwd.getUsersByQuery({ uid: req.params.uid });

            if(users.length <= 0) res.status(404).end();
            else res.send(users[0]);
        } catch(err){
            handleErrors(err, res);
        }
    },

    getUsersGroups: async function(req : Request, res : Response){
        try {
            let users = await passwd.getUsersByQuery({ uid: req.params.uid });

            if(users.length <= 0) return res.status(404).end();
            let user = users[0];
            let groups = await group.getGroupsByQuery({ members: [user.name] })

            res.send(groups);
        } catch(err){
            handleErrors(err, res);
        }
    }

};


export default UserRoutes;