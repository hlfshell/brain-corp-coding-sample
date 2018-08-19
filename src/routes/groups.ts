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

let GroupRoutes : Route = {
    
    getAllGroups: async function(req : Request, res : Response){

    },

    queryForGroups: async function(req : Request, res : Response){

    },

    getSpecificGroup: async function(req : Request, res : Response){

    }

};


export default GroupRoutes;