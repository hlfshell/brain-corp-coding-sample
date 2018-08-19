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
require("mocha");
const mocha_1 = require("mocha");
const chai_1 = require("chai");
describe("Group - Instantiation", () => {
    it("should return an instance of Group when calling getInstance()", () => {
        let Group = require('../classes/Group').Group;
        let group = Group.getInstance();
        chai_1.expect(group instanceof Group).to.be.true;
    });
    it("should return the same instance irregardless of how often one calls getInstance()", () => {
        let Group = require('../classes/Group').Group;
        let group_one = Group.getInstance();
        let group_two = Group.getInstance();
        chai_1.expect(group_one instanceof Group).to.be.true;
        chai_1.expect(group_two instanceof Group).to.be.true;
        chai_1.expect(group_one).to.equal(group_two);
    });
});
describe("Group - Getters/Setters", () => {
    let Group = require('../classes/Group').Group;
    it("- getPath - should get the currently assigned path", () => {
        chai_1.expect(Group.getPath()).to.be.equal("/etc/group");
    });
    it("- setPath - should set the currently assigned path", () => {
        let newPath = "some/new/path";
        chai_1.expect(Group.setPath(newPath)).to.not.throw;
        chai_1.expect(Group.getPath()).to.be.equal(newPath);
    });
    it("- getLineDelimiter - should get the line delimiter", () => {
        chai_1.expect(Group.getLineDelimiter()).to.be.equal("\n");
    });
    it("- setLineDelimiter - should set the line delimiter", () => {
        let newDelimiter = "|";
        chai_1.expect(Group.setLineDelimiter(newDelimiter)).to.not.throw;
        chai_1.expect(Group.getLineDelimiter()).to.be.equal(newDelimiter);
    });
    it("- getColumnDelimiter - should get the column delimiter", () => {
        chai_1.expect(Group.getColumnDelimiter()).to.be.equal(":");
    });
    it("- setColumnDelimiter - should set the column delimiter", () => {
        let newDelimiter = "_";
        chai_1.expect(Group.setColumnDelimiter(newDelimiter)).to.not.throw;
        chai_1.expect(Group.getColumnDelimiter()).to.be.equal(newDelimiter);
    });
    mocha_1.after(() => {
        Group.setPath("/etc/group");
        Group.setLineDelimiter("\n");
        Group.setColumnDelimiter(":");
    });
});
describe("Group - getAllGroups", () => {
    let Group = require('../classes/Group').Group;
    let group = Group.getInstance();
    it("should return an array of objects", () => __awaiter(this, void 0, void 0, function* () {
        let groups = yield group.getAllGroups();
        chai_1.expect(groups).to.be.ok;
        chai_1.expect(Array.isArray(groups)).to.be.true;
    }));
    it("should return the correct number of groups", () => __awaiter(this, void 0, void 0, function* () {
        Group.setPath("./src/tests/fake.group");
        let groups = yield group.getAllGroups();
        chai_1.expect(groups).to.be.ok;
        chai_1.expect(groups.length).to.be.equal(23);
    }));
    it("each object should return a username, uid, gid, comment, home directory, and shell", () => __awaiter(this, void 0, void 0, function* () {
        let groups = yield group.getAllGroups();
        chai_1.expect(groups.length).to.be.ok;
        chai_1.expect(groups.length).to.be.greaterThan(0);
        let groupItem = groups[0];
        chai_1.expect(groupItem).to.be.ok;
        chai_1.expect(groupItem.name).to.not.be.null;
        chai_1.expect(typeof groupItem.name).to.be.equal("string");
        chai_1.expect(groupItem.gid).to.not.be.null;
        chai_1.expect(typeof groupItem.gid).to.be.equal("number");
        chai_1.expect(groupItem.members).to.not.be.null;
        chai_1.expect(Array.isArray(groupItem.members)).to.be.true;
    }));
    it("should return a group with information properly set", () => __awaiter(this, void 0, void 0, function* () {
        Group.setPath("./src/tests/fake.group");
        let groups = yield group.getAllGroups();
        let sambashare = groups[18];
        chai_1.expect(sambashare).to.be.ok;
        chai_1.expect(sambashare.name).to.be.equal("sambashare");
        chai_1.expect(sambashare.gid).to.be.equal(128);
        chai_1.expect(sambashare.members[0]).to.be.equal("keith");
    }));
    it("should fail if the group file does not exist", () => __awaiter(this, void 0, void 0, function* () {
        Group.setPath("/does/not/exist");
        // Note - normally you'd do a expect(fnc).to.throw() - can't do
        // that with async it seems?
        try {
            let groups = yield group.getAllGroups();
        }
        catch (err) {
            chai_1.expect(err instanceof Error).to.be.true;
            chai_1.expect(err.message).to.be.equal(`Something went wrong reading the group file`);
            return; // We want to stop here
        }
        //We should never reach here due to the catch above
        chai_1.expect.fail();
    }));
    it("should fail if there is a problem parsing the group file", () => __awaiter(this, void 0, void 0, function* () {
        Group.setLineDelimiter("\t");
        Group.setColumnDelimiter("|");
        let groups;
        try {
            groups = yield group.getAllGroups();
        }
        catch (err) {
            chai_1.expect(err instanceof Error).to.be.true;
            chai_1.expect(err.message).to.be.equal("There was an issue parsing the group file");
            return;
        }
        //We should never reach here due to the catch above
        chai_1.expect.fail();
    }));
    afterEach(() => {
        Group.setPath("/etc/group");
        Group.setLineDelimiter("\n");
        Group.setColumnDelimiter(":");
    });
});
describe("Group - getGroupsByQuery", () => {
    let Group = require('../classes/Group').Group;
    let group = Group.getInstance();
    it("should return an array with the correct members from the query", () => __awaiter(this, void 0, void 0, function* () {
        Group.setPath("./src/tests/fake.group");
        let queriedGroups = yield group.getGroupsByQuery({ name: 'sambashare' });
        chai_1.expect(queriedGroups).to.be.ok;
        chai_1.expect(Array.isArray(queriedGroups)).to.be.true;
        chai_1.expect(queriedGroups.length).to.be.equal(1);
        let sambashare = queriedGroups[0];
        chai_1.expect(sambashare).to.be.ok;
        chai_1.expect(sambashare.name).to.be.equal("sambashare");
        chai_1.expect(sambashare.gid).to.be.equal(128);
        chai_1.expect(sambashare.members.length).to.be.equal(2);
        chai_1.expect(sambashare.members[0]).to.be.equal("keith");
    }));
    it("should return an empty array if no users match the query", () => __awaiter(this, void 0, void 0, function* () {
        Group.setPath("./src/tests/fake.group");
        let queriedGroups = yield group.getGroupsByQuery({ name: "Doesn't exist" });
        chai_1.expect(queriedGroups).to.be.ok;
        chai_1.expect(Array.isArray(queriedGroups)).to.be.true;
        chai_1.expect(queriedGroups.length).to.be.equal(0);
    }));
    it("should allow querying by name", () => __awaiter(this, void 0, void 0, function* () {
        Group.setPath("./src/tests/fake.group");
        let queriedGroups = yield group.getGroupsByQuery({ name: "keith" });
        chai_1.expect(queriedGroups).to.be.ok;
        chai_1.expect(Array.isArray(queriedGroups)).to.be.true;
        chai_1.expect(queriedGroups.length).to.be.equal(1);
    }));
    it("should allow querying by gid", () => __awaiter(this, void 0, void 0, function* () {
        Group.setPath("./src/tests/fake.group");
        let queriedGroups = yield group.getGroupsByQuery({ gid: 33 });
        chai_1.expect(queriedGroups).to.be.ok;
        chai_1.expect(Array.isArray(queriedGroups)).to.be.true;
        chai_1.expect(queriedGroups.length).to.be.equal(1);
    }));
    it("should allow querying by members (singular)", () => __awaiter(this, void 0, void 0, function* () {
        Group.setPath("./src/tests/fake.group");
        let queriedGroups = yield group.getGroupsByQuery({ members: ["keith"] });
        chai_1.expect(queriedGroups).to.be.ok;
        chai_1.expect(Array.isArray(queriedGroups)).to.be.true;
        chai_1.expect(queriedGroups.length).to.be.equal(4);
    }));
    it("should allow querying by multiple members", () => __awaiter(this, void 0, void 0, function* () {
        Group.setPath("./src/tests/fake.group");
        let queriedGroups = yield group.getGroupsByQuery({ members: ["test", "keith"] });
        chai_1.expect(queriedGroups).to.be.ok;
        chai_1.expect(Array.isArray(queriedGroups)).to.be.true;
        chai_1.expect(queriedGroups.length).to.be.equal(1);
    }));
    afterEach(() => {
        Group.setPath("/etc/group");
        Group.setLineDelimiter("\n");
        Group.setColumnDelimiter(":");
    });
});
