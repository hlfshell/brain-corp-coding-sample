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
require("mocha");
const chai_1 = require("chai");
const Passwd_1 = require("../classes/Passwd");
const node_mocks_http_1 = require("node-mocks-http");
const users_1 = __importDefault(require("../routes/users"));
const finish_1 = require("./finish");
const resetUtilities_1 = __importDefault(require("./resetUtilities"));
describe("/users - Get all users", () => {
    it("should return a list of all users if all goes well", () => __awaiter(this, void 0, void 0, function* () {
        let request = node_mocks_http_1.createRequest();
        let response = node_mocks_http_1.createResponse();
        users_1.default.getAllUsers(request, response);
        //Wait for the call to be done
        yield finish_1.finish(response);
        chai_1.expect(response.statusCode).to.be.equal(200);
        let responseData = response._getData();
        chai_1.expect(Array.isArray(responseData)).to.be.true;
        chai_1.expect(responseData.length).to.be.equal(25);
    }));
    it("should return an appropriate status code and error message if the passwd file path is wrong", () => __awaiter(this, void 0, void 0, function* () {
        let newPath = "./doesnt/exist";
        Passwd_1.Passwd.setPath(newPath);
        let request = node_mocks_http_1.createRequest();
        let response = node_mocks_http_1.createResponse();
        users_1.default.getAllUsers(request, response);
        //Wait for the call to be done
        yield finish_1.finish(response);
        chai_1.expect(response.statusCode).to.be.equal(500);
        let responseData = response._getData();
        chai_1.expect(responseData.code).to.be.ok;
        chai_1.expect(responseData.code).to.be.equal("PASSWD_FILE_LOCATION_ERROR");
        chai_1.expect(responseData.message).to.be.equal("Something went wrong reading the passwd file");
    }));
    it("should return an appropriate status code and error message if the passwd file can not be parsed", () => __awaiter(this, void 0, void 0, function* () {
        Passwd_1.Passwd.setLineDelimiter("\t");
        let request = node_mocks_http_1.createRequest();
        let response = node_mocks_http_1.createResponse();
        users_1.default.getAllUsers(request, response);
        //Wait for the call to be done
        yield finish_1.finish(response);
        chai_1.expect(response.statusCode).to.be.equal(500);
        let responseData = response._getData();
        chai_1.expect(responseData.code).to.be.ok;
        chai_1.expect(responseData.code).to.be.equal("PASSWD_PARSE_ERROR");
        chai_1.expect(responseData.message).to.be.equal('There was an issue parsing the passwd file');
    }));
    beforeEach(() => {
        resetUtilities_1.default();
    });
});
describe("/users/query - Query for users", () => {
    it("should get expected users based on queries being passed in", () => __awaiter(this, void 0, void 0, function* () {
        let request = node_mocks_http_1.createRequest({
            query: {
                name: 'keith'
            }
        });
        let response = node_mocks_http_1.createResponse();
        users_1.default.queryForUsers(request, response);
        //Wait for the call to be done
        yield finish_1.finish(response);
        chai_1.expect(response.statusCode).to.be.equal(200);
        let responseData = response._getData();
        chai_1.expect(Array.isArray(responseData)).to.be.true;
        chai_1.expect(responseData.length).to.be.equal(1);
        chai_1.expect(responseData[0].name).to.be.equal("keith");
    }));
    it("should return an empty array if no such users match", () => __awaiter(this, void 0, void 0, function* () {
        let request = node_mocks_http_1.createRequest({
            query: {
                name: 'doesntexist'
            }
        });
        let response = node_mocks_http_1.createResponse();
        users_1.default.queryForUsers(request, response);
        //Wait for the call to be done
        yield finish_1.finish(response);
        chai_1.expect(response.statusCode).to.be.equal(200);
        let responseData = response._getData();
        chai_1.expect(Array.isArray(responseData)).to.be.true;
        chai_1.expect(responseData.length).to.be.equal(0);
    }));
    it("should return an appropriate status code and error message if the passwd file path is wrong", () => __awaiter(this, void 0, void 0, function* () {
        let passwd = Passwd_1.Passwd.getInstance();
        let newPath = "./doesnt/exist";
        Passwd_1.Passwd.setPath(newPath);
        let request = node_mocks_http_1.createRequest();
        let response = node_mocks_http_1.createResponse();
        users_1.default.queryForUsers(request, response);
        //Wait for the call to be done
        yield finish_1.finish(response);
        chai_1.expect(response.statusCode).to.be.equal(500);
        let responseData = response._getData();
        chai_1.expect(responseData.code).to.be.ok;
        chai_1.expect(responseData.code).to.be.equal("PASSWD_FILE_LOCATION_ERROR");
        chai_1.expect(responseData.message).to.be.equal("Something went wrong reading the passwd file");
    }));
    it("should return an appropriate status code and error message if the passwd file can not be parsed", () => __awaiter(this, void 0, void 0, function* () {
        let passwd = Passwd_1.Passwd.getInstance();
        Passwd_1.Passwd.setPath("./src/tests/fake.passwd");
        Passwd_1.Passwd.setLineDelimiter("\t");
        let request = node_mocks_http_1.createRequest();
        let response = node_mocks_http_1.createResponse();
        users_1.default.queryForUsers(request, response);
        //Wait for the call to be done
        yield finish_1.finish(response);
        chai_1.expect(response.statusCode).to.be.equal(500);
        let responseData = response._getData();
        chai_1.expect(responseData.code).to.be.ok;
        chai_1.expect(responseData.code).to.be.equal("PASSWD_PARSE_ERROR");
        chai_1.expect(responseData.message).to.be.equal('There was an issue parsing the passwd file');
    }));
    beforeEach(() => {
        resetUtilities_1.default();
    });
});
describe("/users/:uid - Specific user", () => {
    it("should get the expected user based on uid", () => __awaiter(this, void 0, void 0, function* () {
        let request = node_mocks_http_1.createRequest({
            params: {
                uid: 1000
            }
        });
        let response = node_mocks_http_1.createResponse();
        users_1.default.getSpecificUser(request, response);
        //Wait for the call to be done
        yield finish_1.finish(response);
        chai_1.expect(response.statusCode).to.be.equal(200);
        let responseData = response._getData();
        chai_1.expect(responseData.name).to.be.equal("keith");
    }));
    it("should return a status code of 404 if no such user is found", () => __awaiter(this, void 0, void 0, function* () {
        let request = node_mocks_http_1.createRequest({
            params: {
                name: 'doesntexist'
            }
        });
        let response = node_mocks_http_1.createResponse();
        users_1.default.getSpecificUser(request, response);
        //Wait for the call to be done
        yield finish_1.finish(response);
        chai_1.expect(response.statusCode).to.be.equal(404);
    }));
    it("should return an appropriate status code and error message if the passwd file path is wrong", () => __awaiter(this, void 0, void 0, function* () {
        let passwd = Passwd_1.Passwd.getInstance();
        let newPath = "./doesnt/exist";
        Passwd_1.Passwd.setPath(newPath);
        let request = node_mocks_http_1.createRequest();
        let response = node_mocks_http_1.createResponse();
        users_1.default.getSpecificUser(request, response);
        //Wait for the call to be done
        yield finish_1.finish(response);
        chai_1.expect(response.statusCode).to.be.equal(500);
        let responseData = response._getData();
        chai_1.expect(responseData.code).to.be.ok;
        chai_1.expect(responseData.code).to.be.equal("PASSWD_FILE_LOCATION_ERROR");
        chai_1.expect(responseData.message).to.be.equal("Something went wrong reading the passwd file");
    }));
    it("should return an appropriate status code and error message if the passwd file can not be parsed", () => __awaiter(this, void 0, void 0, function* () {
        let passwd = Passwd_1.Passwd.getInstance();
        Passwd_1.Passwd.setPath("./src/tests/fake.passwd");
        Passwd_1.Passwd.setLineDelimiter("\t");
        let request = node_mocks_http_1.createRequest();
        let response = node_mocks_http_1.createResponse();
        users_1.default.getSpecificUser(request, response);
        //Wait for the call to be done
        yield finish_1.finish(response);
        chai_1.expect(response.statusCode).to.be.equal(500);
        let responseData = response._getData();
        chai_1.expect(responseData.code).to.be.ok;
        chai_1.expect(responseData.code).to.be.equal("PASSWD_PARSE_ERROR");
        chai_1.expect(responseData.message).to.be.equal('There was an issue parsing the passwd file');
    }));
    beforeEach(() => {
        resetUtilities_1.default();
    });
});
describe("/users/:uid/groups - Get assigned groups to specific user", () => {
    it("should get the groups assigned to the user", () => __awaiter(this, void 0, void 0, function* () {
        let request = node_mocks_http_1.createRequest({
            params: {
                uid: 1000
            }
        });
        let response = node_mocks_http_1.createResponse();
        users_1.default.getUsersGroups(request, response);
        //Wait for the call to be done
        yield finish_1.finish(response);
        chai_1.expect(response.statusCode).to.be.equal(200);
        let responseData = response._getData();
        chai_1.expect(Array.isArray(responseData)).to.be.true;
        chai_1.expect(responseData.length).to.be.equal(4);
        chai_1.expect(responseData.findIndex((item) => {
            return item.name == "docker";
        })).to.not.equal(-1);
    }));
    it("should return a status code of 404 if no such user is found", () => __awaiter(this, void 0, void 0, function* () {
        let request = node_mocks_http_1.createRequest({
            params: {
                name: 'doesntexist'
            }
        });
        let response = node_mocks_http_1.createResponse();
        users_1.default.getUsersGroups(request, response);
        //Wait for the call to be done
        yield finish_1.finish(response);
        chai_1.expect(response.statusCode).to.be.equal(404);
    }));
    it("should return an appropriate status code and error message if the passwd file path is wrong", () => __awaiter(this, void 0, void 0, function* () {
        let passwd = Passwd_1.Passwd.getInstance();
        let newPath = "./doesnt/exist";
        Passwd_1.Passwd.setPath(newPath);
        let request = node_mocks_http_1.createRequest();
        let response = node_mocks_http_1.createResponse();
        users_1.default.getUsersGroups(request, response);
        //Wait for the call to be done
        yield finish_1.finish(response);
        chai_1.expect(response.statusCode).to.be.equal(500);
        let responseData = response._getData();
        chai_1.expect(responseData.code).to.be.ok;
        chai_1.expect(responseData.code).to.be.equal("PASSWD_FILE_LOCATION_ERROR");
        chai_1.expect(responseData.message).to.be.equal("Something went wrong reading the passwd file");
    }));
    it("should return an appropriate status code and error message if the passwd file can not be parsed", () => __awaiter(this, void 0, void 0, function* () {
        let passwd = Passwd_1.Passwd.getInstance();
        Passwd_1.Passwd.setPath("./src/tests/fake.passwd");
        Passwd_1.Passwd.setLineDelimiter("\t");
        let request = node_mocks_http_1.createRequest();
        let response = node_mocks_http_1.createResponse();
        users_1.default.getUsersGroups(request, response);
        //Wait for the call to be done
        yield finish_1.finish(response);
        chai_1.expect(response.statusCode).to.be.equal(500);
        let responseData = response._getData();
        chai_1.expect(responseData.code).to.be.ok;
        chai_1.expect(responseData.code).to.be.equal("PASSWD_PARSE_ERROR");
        chai_1.expect(responseData.message).to.be.equal('There was an issue parsing the passwd file');
    }));
    beforeEach(() => {
        resetUtilities_1.default();
    });
});
