"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const util_1 = require("util");
const getFile = util_1.promisify(fs_1.readFile);
class Group {
    constructor() {
    }
    static getInstance() {
        if (!this.instance)
            this.instance = new Group();
        return this.instance;
    }
    //======== Utility Functions ======== 
    getAllGroups() {
        return __awaiter(this, void 0, void 0, function* () {
            let GroupFile;
            try {
                GroupFile = yield this.readGroupFile();
            }
            catch (err) {
                throw new Error(`Something went wrong reading the group file`);
            }
            let groups = [];
            try {
                let userLines = GroupFile.split(Group.userLineDelimiter);
                userLines.forEach((line) => {
                    //Protection in case of an empty line - ignore
                    if (!line || line == "")
                        return;
                    //Split the line by the delimitor
                    //Example line: root:x:0:0:root:/root:/bin/bash
                    let columns = line.split(Group.userColumnDelimiter);
                    //If we don't have the right amount of columns, parsing did not go right!
                    if (columns.length != 4)
                        throw new Error("There was an issue parsing the group file");
                    let group = {
                        name: columns[0],
                        gid: parseInt(columns[2]),
                        members: columns[3].split(",")
                    };
                    groups.push(group);
                });
            }
            catch (err) {
                throw new Error("There was an issue parsing the group file");
            }
            return groups;
        });
    }
    getGroupsByQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let users = yield this.getAllGroups();
            let filteredGroups = users.filter((group) => {
                let matched = true;
                for (let attribute in query) {
                    //Members requires its own search
                    if (attribute == "members") {
                        let memberAssigned = true;
                        //Check to see if each user requested is in the group
                        query.members.forEach((member) => {
                            if (group.members.indexOf(member) == -1)
                                memberAssigned = false;
                        });
                        matched = memberAssigned;
                    }
                    else {
                        // Same issue as in the Passwd object - see my note there!
                        if (group[attribute] != query[attribute])
                            matched = false;
                    }
                }
                return matched;
            });
            return filteredGroups;
        });
    }
    //======== Getters and Setters ======== 
    static getPath() {
        return Group.GroupFileLocation;
    }
    static setPath(pathToGroup) {
        Group.GroupFileLocation = pathToGroup;
    }
    static getColumnDelimiter() {
        return Group.userColumnDelimiter;
    }
    static setColumnDelimiter(delimiter) {
        Group.userColumnDelimiter = delimiter;
    }
    static getLineDelimiter() {
        return Group.userLineDelimiter;
    }
    static setLineDelimiter(delimiter) {
        Group.userLineDelimiter = delimiter;
    }
    readGroupFile() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield getFile(Group.GroupFileLocation)).toString();
        });
    }
}
Group.GroupFileLocation = "/etc/group";
Group.userLineDelimiter = "\n";
Group.userColumnDelimiter = ":";
exports.Group = Group;
