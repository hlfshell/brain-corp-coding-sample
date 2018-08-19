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
        case "Something went wrong reading the group file": {
            error.code = "GROUP_FILE_LOCATION_ERROR";
            break;
        }
        case "There was an issue parsing the group file": {
            error.code = "GROUP_PARSE_ERROR";
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
let GroupRoutes = {
    getAllGroups: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let groups = yield group.getAllGroups();
                res.send(groups);
            }
            catch (err) {
                handleErrors(err, res);
            }
        });
    },
    queryForGroups: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //We are doing this due to naming difference in the requested
                //route query and the actual attributes search
                if (req.query.member) {
                    req.query.members = req.query.member;
                    delete req.query.member;
                }
                let groups = yield group.getGroupsByQuery(req.query);
                res.send(groups);
            }
            catch (err) {
                handleErrors(err, res);
            }
        });
    },
    getSpecificGroup: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let groups = yield group.getGroupsByQuery({ gid: req.params.gid });
                if (groups.length <= 0)
                    res.status(404).end();
                else
                    res.send(groups[0]);
            }
            catch (err) {
                handleErrors(err, res);
            }
        });
    }
};
exports.default = GroupRoutes;
