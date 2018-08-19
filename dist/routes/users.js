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
const Passwd_1 = require("../classes/Passwd");
const Group_1 = require("../classes/Group");
let passwd = Passwd_1.Passwd.getInstance();
let group = Group_1.Group.getInstance();
function handleErrors(err, res) {
    let error = {
        code: "",
        message: err.message
    };
    switch (err.message) {
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
;
let UserRoutes = {
    getAllUsers: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let allUsers = yield passwd.getAllUsers();
                res.send(allUsers);
            }
            catch (err) {
                handleErrors(err, res);
            }
        });
    },
    queryForUsers: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let users = yield passwd.getUsersByQuery(req.query);
                res.send(users);
            }
            catch (err) {
                handleErrors(err, res);
            }
        });
    },
    getSpecificUser: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let users = yield passwd.getUsersByQuery({ uid: req.params.uid });
                if (users.length <= 0)
                    res.status(404).end();
                else
                    res.send(users[0]);
            }
            catch (err) {
                handleErrors(err, res);
            }
        });
    },
    getUsersGroups: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let users = yield passwd.getUsersByQuery({ uid: req.params.uid });
                if (users.length <= 0)
                    return res.status(404).end();
                let user = users[0];
                let groups = yield group.getGroupsByQuery({ members: [user.name] });
                res.send(groups);
            }
            catch (err) {
                handleErrors(err, res);
            }
        });
    }
};
exports.default = UserRoutes;
