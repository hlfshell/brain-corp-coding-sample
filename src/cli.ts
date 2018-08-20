#!/usr/bin/env node

//Imports
import Server from "./Server";
import { Group } from "./classes/Group";
import { Passwd } from "./classes/Passwd";

const cli = require('commander');

const packagejson = require('../package.json');
const version = packagejson.version;

//Load options for cli and parse
cli
    .version(version)
    .option('-p, --port [port]', 'What port to listen on')
    .option('-P, --passwd [passwd_path]', 'Path to the passwd file')
    .option('-G, --group [group_path]', 'Path to the group file')
    .parse(process.argv);

//If options were used, set them
if(cli.passwd) Passwd.setPath(cli.passwd);
if(cli.group) Passwd.setPath(cli.group);

//Create a server - the -1 is default for no set port
const server = new Server(cli.port ? cli.port : -1);

//Listen!
server.listen();