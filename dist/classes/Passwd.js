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
class Passwd {
    constructor() {
    }
    static getInstance() {
        if (!this.instance)
            this.instance = new Passwd();
        return this.instance;
    }
    //======== Utility Functions ======== 
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            let passwdFile;
            try {
                passwdFile = yield this.readPasswdFile();
            }
            catch (err) {
                throw new Error(`Something went wrong reading the passwd file`);
            }
            let users = [];
            try {
                let userLines = passwdFile.split(Passwd.userLineDelimiter);
                userLines.forEach((line) => {
                    //Protection in case of an empty line - ignore
                    if (!line || line == "")
                        return;
                    //Split the line by the delimitor
                    //Example line: root:x:0:0:root:/root:/bin/bash
                    let columns = line.split(Passwd.userColumnDelimiter);
                    //If we don't have the right amount of columns, parsing did not go right!
                    if (columns.length != 7)
                        throw new Error("There was an issue parsing the passwd file");
                    let user = {
                        name: columns[0],
                        uid: parseInt(columns[2]),
                        gid: parseInt(columns[3]),
                        comment: columns[4],
                        home: columns[5],
                        shell: columns[6]
                    };
                    users.push(user);
                });
            }
            catch (err) {
                throw new Error("There was an issue parsing the passwd file");
            }
            return users;
        });
    }
    getUsersByQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let users = yield this.getAllUsers();
            let filteredUsers = users.filter((user) => {
                let matched = true;
                for (let attribute in query) {
                    //Normally I don't like using any, but it has to be done
                    //here, otherwise I have to introduce open params to the interface
                    //itself. That being said, there's no penalty for introducing
                    //a filter that doesn't exist - it will just always fail
                    if (user[attribute] != query[attribute])
                        matched = false;
                }
                return matched;
            });
            return filteredUsers;
        });
    }
    //======== Getters and Setters ======== 
    static getPath() {
        return Passwd.passwdFileLocation;
    }
    static setPath(pathToPasswd) {
        Passwd.passwdFileLocation = pathToPasswd;
    }
    static getColumnDelimiter() {
        return Passwd.userColumnDelimiter;
    }
    static setColumnDelimiter(delimiter) {
        Passwd.userColumnDelimiter = delimiter;
    }
    static getLineDelimiter() {
        return Passwd.userLineDelimiter;
    }
    static setLineDelimiter(delimiter) {
        Passwd.userLineDelimiter = delimiter;
    }
    readPasswdFile() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield getFile(Passwd.passwdFileLocation)).toString();
        });
    }
}
Passwd.passwdFileLocation = "/etc/passwd";
Passwd.userLineDelimiter = "\n";
Passwd.userColumnDelimiter = ":";
exports.Passwd = Passwd;
