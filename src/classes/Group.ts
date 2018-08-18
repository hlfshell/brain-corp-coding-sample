import { readFile } from "fs";
import { promisify } from "util";

import GroupItem from "../interfaces/GroupItem";
import GroupQuery from "../interfaces/GroupQuery";

const getFile = promisify(readFile);

export class Group {

    private static instance : Group;
    
    private static GroupFileLocation : string = "/etc/group";
    private static userLineDelimiter : string = "\n";
    private static userColumnDelimiter : string = ":";

    private constructor(){

    }

    public static getInstance() : Group {
        if(!this.instance) this.instance = new Group();
        return this.instance;
    }

    //======== Utility Functions ======== 

    public async getAllGroups() : Promise<GroupItem[]> {
        let GroupFile;
        try {
            GroupFile = await this.readGroupFile();
        } catch(err){
            throw new Error(`Something went wrong reading the group file`);
        }

        let groups : GroupItem[] = [];
        try{
            let userLines = GroupFile.split(Group.userLineDelimiter);
            userLines.forEach((line : string)=>{
                //Protection in case of an empty line - ignore
                if(!line || line == "") return;

                //Split the line by the delimitor
                //Example line: root:x:0:0:root:/root:/bin/bash
                let columns = line.split(Group.userColumnDelimiter);
                
                //If we don't have the right amount of columns, parsing did not go right!
                if(columns.length != 4) throw new Error("There was an issue parsing the group file");

                let group : GroupItem = {
                    name: columns[0],
                    gid: parseInt(columns[2]),
                    members: columns[3].split(",")
                }

                groups.push(group);
            });
            
        } catch(err){
            throw new Error("There was an issue parsing the group file");
        }

        return groups;
    }

    public async getGroupsByQuery(query : GroupQuery) : Promise<GroupItem[]> {
        let users = await this.getAllGroups();

        let filteredGroups = users.filter((group : GroupItem)=>{
            let matched = true;

            for(let attribute in query){
                //Members requires its own search
                if(attribute == "members"){
                    let memberAssigned = false;
                    
                    //Check to see if each user requested is in the group
                    group.members.forEach((member : string)=>{
                        if(group.members.indexOf(member) == -1) memberAssigned = false;
                    });

                    matched = memberAssigned;
                } else {
                    // Same issue as in the Passwd object - see my note there!
                    if((<any> group)[attribute] != (<any> query)[attribute]) matched = false;
                }
            }

            return matched;
        });

        return filteredGroups;
    }

    //======== Getters and Setters ======== 

    public static getPath() : string {
        return Group.GroupFileLocation;
    }

    public static setPath(pathToGroup : string) : void{
        Group.GroupFileLocation = pathToGroup;
    }

    public static getColumnDelimiter() : string {
        return Group.userColumnDelimiter;
    }

    public static setColumnDelimiter(delimiter : string) : void {
        Group.userColumnDelimiter = delimiter;
    }

    public static getLineDelimiter() : string {
        return Group.userLineDelimiter;
    }

    public static setLineDelimiter(delimiter : string) : void {
        Group.userLineDelimiter = delimiter;
    }

    private async readGroupFile() : Promise<string> {
        return (await getFile(Group.GroupFileLocation)).toString();
    }

}