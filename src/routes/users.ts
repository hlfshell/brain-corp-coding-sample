import { Request, Response } from "express";

import { Route } from "../interfaces/Route";
import { Passwd } from "../classes/Passwd";
import ErrorResponse from "../interfaces/ErrorResponse";

let passwd = Passwd.getInstance();

let UserRoutes : Route = {
    
    getAllUsers: async function(req : Request, res : Response){
        try{
            let allUsers = await passwd.getAllUsers();
            res.send(allUsers);
        } catch(err){
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
        }
    },

    queryForUsers: async function(req : Request, res : Response){
        try {
            let users = await passwd.getUsersByQuery(req.query);
            res.send(users);
        } catch(err){
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
        }
    },

    getSpecificUser: function(req : Request, res : Response){

    },

    getUsersGroups: function(req : Request, res : Response){

    }

};


export default UserRoutes;