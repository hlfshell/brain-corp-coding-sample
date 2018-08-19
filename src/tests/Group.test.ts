import 'mocha';
import { before, after } from 'mocha';
import { expect } from 'chai';
import GroupItem from '../interfaces/GroupItem';
import { AsyncResource } from 'async_hooks';

describe("Group - Instantiation", ()=>{
    
    it("should return an instance of Group when calling getInstance()", ()=>{
        let Group = require('../classes/Group').Group;

        let group = Group.getInstance();

        expect(group instanceof Group).to.be.true;
    });

    it("should return the same instance irregardless of how often one calls getInstance()", ()=>{
        let Group = require('../classes/Group').Group;

        let group_one = Group.getInstance();
        let group_two = Group.getInstance();

        expect(group_one instanceof Group).to.be.true;
        expect(group_two instanceof Group).to.be.true;

        expect(group_one).to.equal(group_two);
    });

});

describe("Group - Getters/Setters", ()=>{
    let Group = require('../classes/Group').Group;

    it("- getPath - should get the currently assigned path", ()=>{
        expect(Group.getPath()).to.be.equal("/etc/group");
    });

    it("- setPath - should set the currently assigned path", ()=>{
        let newPath = "some/new/path";
        
        expect(Group.setPath(newPath)).to.not.throw;

        expect(Group.getPath()).to.be.equal(newPath);
    });

    it("- getLineDelimiter - should get the line delimiter", ()=>{
        expect(Group.getLineDelimiter()).to.be.equal("\n");
    });

    it("- setLineDelimiter - should set the line delimiter", ()=>{
        let newDelimiter = "|";
        
        expect(Group.setLineDelimiter(newDelimiter)).to.not.throw;

        expect(Group.getLineDelimiter()).to.be.equal(newDelimiter);
    });

    it("- getColumnDelimiter - should get the column delimiter", ()=>{
        expect(Group.getColumnDelimiter()).to.be.equal(":");
    });

    it("- setColumnDelimiter - should set the column delimiter", ()=>{
        let newDelimiter = "_";
        
        expect(Group.setColumnDelimiter(newDelimiter)).to.not.throw;

        expect(Group.getColumnDelimiter()).to.be.equal(newDelimiter);
    });

    after(()=>{
        Group.setPath("/etc/group");
        Group.setLineDelimiter("\n");
        Group.setColumnDelimiter(":");
    });

});

describe("Group - getAllGroups", ()=>{
    let Group = require('../classes/Group').Group;
    let group = Group.getInstance();

    it("should return an array of objects", async ()=>{
        let groups = await group.getAllGroups();

        expect(groups).to.be.ok;
        expect(Array.isArray(groups)).to.be.true;
    });

    it("should return the correct number of groups", async ()=>{
        Group.setPath("./src/tests/fake.group");
        let groups = await group.getAllGroups();

        expect(groups).to.be.ok;
        expect(groups.length).to.be.equal(23);
    });

    it("each object should return a username, uid, gid, comment, home directory, and shell", async ()=>{
        let groups = await group.getAllGroups();

        expect(groups.length).to.be.ok;
        expect(groups.length).to.be.greaterThan(0);

        let groupItem : GroupItem = groups[0];

        expect(groupItem).to.be.ok;

        expect(groupItem.name).to.not.be.null;
        expect(typeof groupItem.name).to.be.equal("string");

        expect(groupItem.gid).to.not.be.null;
        expect(typeof groupItem.gid).to.be.equal("number");

        expect(groupItem.members).to.not.be.null;
        expect(Array.isArray(groupItem.members)).to.be.true;
    });

    it("should return a group with information properly set", async ()=>{
        Group.setPath("./src/tests/fake.group");
        let groups = await group.getAllGroups();

        let sambashare = groups[18];
        expect(sambashare).to.be.ok;
        expect(sambashare.name).to.be.equal("sambashare");
        expect(sambashare.gid).to.be.equal(128);
        expect(sambashare.members[0]).to.be.equal("keith");
    });

    it("should fail if the group file does not exist", async ()=>{
        Group.setPath("/does/not/exist");

        // Note - normally you'd do a expect(fnc).to.throw() - can't do
        // that with async it seems?

        try{
            let groups = await group.getAllGroups();
        } catch(err){
            expect(err instanceof Error).to.be.true;
            expect(err.message).to.be.equal(`Something went wrong reading the group file`);
            return; // We want to stop here
        }

        //We should never reach here due to the catch above
        expect.fail();
    });

    it("should fail if there is a problem parsing the group file", async ()=>{
        Group.setLineDelimiter("\t");
        Group.setColumnDelimiter("|");
        let groups;
        try{
            groups = await group.getAllGroups();
        } catch(err){
            expect(err instanceof Error).to.be.true;
            expect(err.message).to.be.equal("There was an issue parsing the group file");
            return
        }
        
        //We should never reach here due to the catch above
        expect.fail();
    });

    afterEach(()=>{
        Group.setPath("/etc/group");
        Group.setLineDelimiter("\n");
        Group.setColumnDelimiter(":");
    });

});

describe("Group - getGroupsByQuery", ()=>{
    let Group = require('../classes/Group').Group;
    let group = Group.getInstance();

    it("should return an array with the correct members from the query", async ()=>{
        Group.setPath("./src/tests/fake.group");
        let queriedGroups = await group.getGroupsByQuery({ name: 'sambashare' });

        expect(queriedGroups).to.be.ok;
        expect(Array.isArray(queriedGroups)).to.be.true;
        expect(queriedGroups.length).to.be.equal(1);

        let sambashare = queriedGroups[0];

        expect(sambashare).to.be.ok;
        expect(sambashare.name).to.be.equal("sambashare");
        expect(sambashare.gid).to.be.equal(128);
        expect(sambashare.members.length).to.be.equal(2);
        expect(sambashare.members[0]).to.be.equal("keith");
    });

    it("should return an empty array if no users match the query", async ()=>{
        Group.setPath("./src/tests/fake.group");
        let queriedGroups = await group.getGroupsByQuery({ name: "Doesn't exist"});

        expect(queriedGroups).to.be.ok;
        expect(Array.isArray(queriedGroups)).to.be.true;
        expect(queriedGroups.length).to.be.equal(0);
    });

    it("should allow querying by name", async ()=>{
        Group.setPath("./src/tests/fake.group");
        let queriedGroups = await group.getGroupsByQuery({ name: "keith" });

        expect(queriedGroups).to.be.ok;
        expect(Array.isArray(queriedGroups)).to.be.true;
        expect(queriedGroups.length).to.be.equal(1);
    });

    it("should allow querying by gid", async ()=>{
        Group.setPath("./src/tests/fake.group");
        let queriedGroups = await group.getGroupsByQuery({ gid: 33 });

        expect(queriedGroups).to.be.ok;
        expect(Array.isArray(queriedGroups)).to.be.true;
        expect(queriedGroups.length).to.be.equal(1);
    });

    it("should allow querying by members (singular)", async ()=>{
        Group.setPath("./src/tests/fake.group");
        let queriedGroups = await group.getGroupsByQuery({ members: ["keith"] });

        expect(queriedGroups).to.be.ok;
        expect(Array.isArray(queriedGroups)).to.be.true;
        expect(queriedGroups.length).to.be.equal(4);
    });

    it("should allow querying by multiple members", async ()=>{
        Group.setPath("./src/tests/fake.group");
        let queriedGroups = await group.getGroupsByQuery({ members: ["test","keith"] });

        expect(queriedGroups).to.be.ok;
        expect(Array.isArray(queriedGroups)).to.be.true;
        expect(queriedGroups.length).to.be.equal(1);
    });

    afterEach(()=>{
        Group.setPath("/etc/group");
        Group.setLineDelimiter("\n");
        Group.setColumnDelimiter(":");
    });

});