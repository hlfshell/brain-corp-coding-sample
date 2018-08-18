import { readFile } from "fs";
import { promisify } from "util";

import PasswdUser from "../interfaces/PasswdUser";
import PasswdQuery from "../interfaces/PasswdQuery";

const getFile = promisify(readFile);

export class Passwd {

    private static instance : Passwd;
    
    private static passwdFileLocation : string = "/etc/passwd";
    private static userLineDelimiter : string = "\n";
    private static userColumnDelimiter : string = ":";

    private constructor(){

    }

    public static getInstance() : Passwd {
        if(!this.instance) this.instance = new Passwd();
        return this.instance;
    }

    //======== Utility Functions ======== 

    public async getAllUsers() : Promise<PasswdUser[]> {
        let passwdFile;
        try {
            passwdFile = await this.readPasswdFile();
        } catch(err){
            throw new Error(`Something went wrong reading the passwd file.`);
        }

        let users : PasswdUser[] = [];
        try{
            let userLines = passwdFile.split(Passwd.userLineDelimiter);
            userLines.forEach((line : string)=>{
                //Protection in case of an empty line - ignore
                if(!line || line == "") return;

                //Split the line by the delimitor
                //Example line: root:x:0:0:root:/root:/bin/bash
                let columns = line.split(Passwd.userColumnDelimiter);

                let user : PasswdUser = {
                    name: columns[0],
                    uid: parseInt(columns[2]),
                    gid: parseInt(columns[3]),
                    comment: columns[4],
                    home: columns[5],
                    shell: columns[6]
                }

                users.push(user);
            });
            
        } catch(err){
            throw new Error("There was an issue parsing the passwd file");
        }

        return users;
    }

    public async getUsersByQuery(query : PasswdQuery) : Promise<PasswdUser[]> {
        let users = await this.getAllUsers();

        let filteredUsers = users.filter((user : PasswdUser)=>{
            let matched = true;

            for(let attribute in query){
                //Normally I don't like using any, but it has to be done
                //here, otherwise I have to introduce open params to the interface
                //itself. That being said, there's no penalty for introducing
                //a filter that doesn't exist - it will just always fail
                if((<any> user)[attribute] != (<any> query)[attribute]) matched = false;
            }

            return matched;
        });

        return filteredUsers;
    }

    //======== Getters and Setters ======== 

    public static getPath() : string {
        return Passwd.passwdFileLocation;
    }

    public static setPath(pathToPasswd : string) : void{
        Passwd.passwdFileLocation = pathToPasswd;
    }

    public static getDelimiter() : string {
        return Passwd.userColumnDelimiter;
    }

    public static setDelimiter(delimiter : string) : void {
        Passwd.userColumnDelimiter = delimiter;
    }

    public static getLineDelimiter() : string {
        return Passwd.userLineDelimiter;
    }

    public static setLineDelimiter(delimiter : string) : void {
        Passwd.userLineDelimiter = delimiter;
    }

    private async readPasswdFile() : Promise<string> {
        return (await getFile(Passwd.passwdFileLocation)).toString();
    }

}