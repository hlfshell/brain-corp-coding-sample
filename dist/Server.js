"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const groups_1 = __importDefault(require("./routes/groups"));
const users_1 = __importDefault(require("./routes/users"));
const getPort = require("get-port");
class Server {
    constructor(port = -1) {
        this.port = port;
        this.app = express_1.default();
        this.loadRoutes();
    }
    loadRoutes() {
        // /users
        this.app.get("/users", users_1.default.getAllUsers);
        this.app.get("/users/query", users_1.default.queryForUsers);
        this.app.get("/users/:uid", users_1.default.getSpecificUser);
        this.app.get("/users/:uid/groups", users_1.default.getUsersGroups);
        // /groups
        this.app.get("/groups", groups_1.default.getAllGroups);
        this.app.get("/groups/query", groups_1.default.queryForGroups);
        this.app.get("/groups/:gid", groups_1.default.getSpecificGroup);
    }
    listen() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.port == -1)
                this.port = yield getPort();
            this.app.listen(this.port, () => console.log(`Server is now listening on ${this.port}!`));
        });
    }
}
exports.default = Server;
