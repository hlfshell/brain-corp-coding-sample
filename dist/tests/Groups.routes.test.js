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
const Group_1 = require("../classes/Group");
const node_mocks_http_1 = require("node-mocks-http");
const groups_1 = __importDefault(require("../routes/groups"));
const finish_1 = require("./finish");
const resetUtilities_1 = __importDefault(require("./resetUtilities"));
describe("/groups - get all groups", () => {
    it("should return a list of all groups if all goes well", () => __awaiter(this, void 0, void 0, function* () {
        let request = node_mocks_http_1.createRequest();
        let response = node_mocks_http_1.createResponse();
        groups_1.default.getAllGroups(request, response);
        //Wait for the call to be done
        yield finish_1.finish(response);
        chai_1.expect(response.statusCode).to.be.equal(200);
        let responseData = response._getData();
        chai_1.expect(Array.isArray(responseData)).to.be.true;
        chai_1.expect(responseData.length).to.be.equal(23);
    }));
    it("should return an appropriate status code and error message if the passwd file path is wrong", () => __awaiter(this, void 0, void 0, function* () {
        let newPath = "./doesnt/exist";
        Group_1.Group.setPath(newPath);
        let request = node_mocks_http_1.createRequest();
        let response = node_mocks_http_1.createResponse();
        groups_1.default.getAllGroups(request, response);
        //Wait for the call to be done
        yield finish_1.finish(response);
        chai_1.expect(response.statusCode).to.be.equal(500);
        let responseData = response._getData();
        chai_1.expect(responseData.code).to.be.ok;
        chai_1.expect(responseData.code).to.be.equal("GROUP_FILE_LOCATION_ERROR");
        chai_1.expect(responseData.message).to.be.equal("Something went wrong reading the group file");
    }));
    it("should return an appropriate status code and error message if the group file can not be parsed", () => __awaiter(this, void 0, void 0, function* () {
        Group_1.Group.setLineDelimiter("\t");
        let request = node_mocks_http_1.createRequest();
        let response = node_mocks_http_1.createResponse();
        groups_1.default.getAllGroups(request, response);
        //Wait for the call to be done
        yield finish_1.finish(response);
        chai_1.expect(response.statusCode).to.be.equal(500);
        let responseData = response._getData();
        chai_1.expect(responseData.code).to.be.ok;
        chai_1.expect(responseData.code).to.be.equal("GROUP_PARSE_ERROR");
        chai_1.expect(responseData.message).to.be.equal('There was an issue parsing the group file');
    }));
    beforeEach(() => {
        resetUtilities_1.default();
    });
});
describe("/groups/query - Query for groups", () => {
    it("should get expected groups based on queries being passed in", () => __awaiter(this, void 0, void 0, function* () {
        let request = node_mocks_http_1.createRequest({
            query: {
                name: 'sambashare'
            }
        });
        let response = node_mocks_http_1.createResponse();
        groups_1.default.queryForGroups(request, response);
        //Wait for the call to be done
        yield finish_1.finish(response);
        chai_1.expect(response.statusCode).to.be.equal(200);
        let responseData = response._getData();
        chai_1.expect(Array.isArray(responseData)).to.be.true;
        chai_1.expect(responseData.length).to.be.equal(1);
        chai_1.expect(responseData[0].name).to.be.equal("sambashare");
        chai_1.expect(responseData[0].members.length).to.be.equal(2);
    }));
    it("should return an empty array if no such groups match", () => __awaiter(this, void 0, void 0, function* () {
        let request = node_mocks_http_1.createRequest({
            query: {
                name: 'doesntexist'
            }
        });
        let response = node_mocks_http_1.createResponse();
        groups_1.default.queryForGroups(request, response);
        //Wait for the call to be done
        yield finish_1.finish(response);
        chai_1.expect(response.statusCode).to.be.equal(200);
        let responseData = response._getData();
        chai_1.expect(Array.isArray(responseData)).to.be.true;
        chai_1.expect(responseData.length).to.be.equal(0);
    }));
    it("should return an appropriate status code and error message if the passwd file path is wrong", () => __awaiter(this, void 0, void 0, function* () {
        let newPath = "./doesnt/exist";
        Group_1.Group.setPath(newPath);
        let request = node_mocks_http_1.createRequest();
        let response = node_mocks_http_1.createResponse();
        groups_1.default.queryForGroups(request, response);
        //Wait for the call to be done
        yield finish_1.finish(response);
        chai_1.expect(response.statusCode).to.be.equal(500);
        let responseData = response._getData();
        chai_1.expect(responseData.code).to.be.ok;
        chai_1.expect(responseData.code).to.be.equal("GROUP_FILE_LOCATION_ERROR");
        chai_1.expect(responseData.message).to.be.equal("Something went wrong reading the group file");
    }));
    it("should return an appropriate status code and error message if the group file can not be parsed", () => __awaiter(this, void 0, void 0, function* () {
        Group_1.Group.setLineDelimiter("\t");
        let request = node_mocks_http_1.createRequest();
        let response = node_mocks_http_1.createResponse();
        groups_1.default.queryForGroups(request, response);
        //Wait for the call to be done
        yield finish_1.finish(response);
        chai_1.expect(response.statusCode).to.be.equal(500);
        let responseData = response._getData();
        chai_1.expect(responseData.code).to.be.ok;
        chai_1.expect(responseData.code).to.be.equal("GROUP_PARSE_ERROR");
        chai_1.expect(responseData.message).to.be.equal('There was an issue parsing the group file');
    }));
    beforeEach(() => {
        resetUtilities_1.default();
    });
});
describe("/group/:gid - Specific group", () => {
    it("should get the expected group based on gid", () => __awaiter(this, void 0, void 0, function* () {
        let request = node_mocks_http_1.createRequest({
            params: {
                gid: 121
            }
        });
        let response = node_mocks_http_1.createResponse();
        groups_1.default.getSpecificGroup(request, response);
        //Wait for the call to be done
        yield finish_1.finish(response);
        chai_1.expect(response.statusCode).to.be.equal(200);
        let responseData = response._getData();
        chai_1.expect(responseData.name).to.be.equal("scanner");
        chai_1.expect(responseData.members.indexOf("saned")).to.not.equal(-1);
    }));
    it("should return a status code of 404 if no such group is found", () => __awaiter(this, void 0, void 0, function* () {
        let request = node_mocks_http_1.createRequest({
            params: {
                gid: 9999
            }
        });
        let response = node_mocks_http_1.createResponse();
        groups_1.default.getSpecificGroup(request, response);
        //Wait for the call to be done
        yield finish_1.finish(response);
        chai_1.expect(response.statusCode).to.be.equal(404);
    }));
    it("should return an appropriate status code and error message if the passwd file path is wrong", () => __awaiter(this, void 0, void 0, function* () {
        let newPath = "./doesnt/exist";
        Group_1.Group.setPath(newPath);
        let request = node_mocks_http_1.createRequest();
        let response = node_mocks_http_1.createResponse();
        groups_1.default.getSpecificGroup(request, response);
        //Wait for the call to be done
        yield finish_1.finish(response);
        chai_1.expect(response.statusCode).to.be.equal(500);
        let responseData = response._getData();
        chai_1.expect(responseData.code).to.be.ok;
        chai_1.expect(responseData.code).to.be.equal("GROUP_FILE_LOCATION_ERROR");
        chai_1.expect(responseData.message).to.be.equal("Something went wrong reading the group file");
    }));
    it("should return an appropriate status code and error message if the group file can not be parsed", () => __awaiter(this, void 0, void 0, function* () {
        Group_1.Group.setLineDelimiter("\t");
        let request = node_mocks_http_1.createRequest();
        let response = node_mocks_http_1.createResponse();
        groups_1.default.getSpecificGroup(request, response);
        //Wait for the call to be done
        yield finish_1.finish(response);
        chai_1.expect(response.statusCode).to.be.equal(500);
        let responseData = response._getData();
        chai_1.expect(responseData.code).to.be.ok;
        chai_1.expect(responseData.code).to.be.equal("GROUP_PARSE_ERROR");
        chai_1.expect(responseData.message).to.be.equal('There was an issue parsing the group file');
    }));
    beforeEach(() => {
        resetUtilities_1.default();
    });
});
