#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Server_1 = __importDefault(require("./Server"));
const Passwd_1 = require("./classes/Passwd");
const cli = require('commander');
const packagejson = require('../package.json');
const version = packagejson.version;
cli
    .version(version)
    .option('-p, --port [port]', 'What port to listen on')
    .option('-P, --passwd [passwd_path]', 'Path to the passwd file')
    .option('-G, --group [group_path]', 'Path to the group file')
    .parse(process.argv);
if (cli.passwd)
    Passwd_1.Passwd.setPath(cli.passwd);
if (cli.group)
    Passwd_1.Passwd.setPath(cli.group);
const server = new Server_1.default(cli.port ? cli.port : -1);
server.listen();
