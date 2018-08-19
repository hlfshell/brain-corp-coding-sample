import 'mocha';
import { before, after } from 'mocha';
import { expect } from 'chai';

describe("Passwd - Instantiation", ()=>{
    
    it("should return an instance of Passwd when calling getInstance()", ()=>{
        let Passwd = require('../classes/Passwd').Passwd;

        let passwd = Passwd.getInstance();

        expect(passwd instanceof Passwd).to.be.true;
    });

    it("should return the same instance irregardless of how often one calls getInstance()", ()=>{
        let Passwd = require('../classes/Passwd').Passwd;

        let passwd_one = Passwd.getInstance();
        let passwd_two = Passwd.getInstance();

        expect(passwd_one instanceof Passwd).to.be.true;
        expect(passwd_two instanceof Passwd).to.be.true;

        expect(passwd_one).to.equal(passwd_two);
    });

});

describe("Passwd - Getters/Setters", ()=>{
    let Passwd = require('../classes/Passwd').Passwd;

    it("- getPath - should get the currently assigned path", ()=>{
        expect(Passwd.getPath()).to.be.equal("/etc/passwd");
    });

    it("- setPath - should set the currently assigned path", ()=>{
        let newPath = "some/new/path";
        
        expect(Passwd.setPath(newPath)).to.not.throw;

        expect(Passwd.getPath()).to.be.equal(newPath);
    });

    it("- getLineDelimiter - should get the line delimiter", ()=>{
        expect(Passwd.getLineDelimiter()).to.be.equal("\n");
    });

    it("- setLineDelimiter - should set the line delimiter", ()=>{
        let newDelimiter = "|";
        
        expect(Passwd.setLineDelimiter(newDelimiter)).to.not.throw;

        expect(Passwd.getLineDelimiter()).to.be.equal(newDelimiter);
    });

    it("- getColumnDelimiter - should get the column delimiter", ()=>{
        expect(Passwd.getColumnDelimiter()).to.be.equal(":");
    });

    it("- setColumnDelimiter - should set the column delimiter", ()=>{
        let newDelimiter = "_";
        
        expect(Passwd.setColumnDelimiter(newDelimiter)).to.not.throw;

        expect(Passwd.getColumnDelimiter()).to.be.equal(newDelimiter);
    });

    after(()=>{
        Passwd.setPath("/etc/passwd");
        Passwd.setLineDelimiter("\n");
        Passwd.setColumnDelimiter(":");
    });

});

describe("Passwd - getAllUsers", ()=>{
    let Passwd = require('../classes/Passwd').Passwd;
    let passwd = Passwd.getInstance();

    it("should return an array of objects", async ()=>{
        let users = await passwd.getAllUsers();

        expect(users).to.be.ok;
        expect(Array.isArray(users)).to.be.true;
    });

    it("should return the correct number of members", async ()=>{
        Passwd.setPath("./src/tests/fake.passwd");
        let users = await passwd.getAllUsers();

        expect(users).to.be.ok;
        expect(users.length).to.be.equal(25);
    });

    it("each object should return a username, uid, gid, comment, home directory, and shell", async ()=>{
        let users = await passwd.getAllUsers();

        expect(users.length).to.be.ok;
        expect(users.length).to.be.greaterThan(0);

        let user = users[0];

        expect(user).to.be.ok;

        expect(user.name).to.not.be.null;
        expect(typeof user.name).to.be.equal("string");

        expect(user.uid).to.not.be.null;
        expect(typeof user.uid).to.be.equal("number");

        expect(user.gid).to.not.be.null;
        expect(typeof user.gid).to.be.equal("number");

        expect(user.comment).to.not.be.null;
        expect(typeof user.comment).to.be.equal("string");

        expect(user.home).to.not.be.null;
        expect(typeof user.home).to.be.equal("string");

        expect(user.shell).to.not.be.null;
        expect(typeof user.shell).to.be.equal("string");
    });

    it("should return a member with information properly set", async ()=>{
        Passwd.setPath("./src/tests/fake.passwd");
        let users = await passwd.getAllUsers();

        let keith = users[24];

        expect(keith).to.be.ok;
        expect(keith.name).to.be.equal("keith");
        expect(keith.uid).to.be.equal(1000);
        expect(keith.gid).to.be.equal(1000);
        expect(keith.comment).to.be.equal("Keith Chester,,,");
        expect(keith.home).to.be.equal("/home/keith");
        expect(keith.shell).to.be.equal("/bin/bash");
    });

    it("should fail if the passwd file does not exist", async ()=>{
        Passwd.setPath("/does/not/exist");

        // Note - normally you'd do a expect(fnc).to.throw() - can't do
        // that with async it seems?

        try{
            let users = await passwd.getAllUsers();
        } catch(err){
            expect(err instanceof Error).to.be.true;
            expect(err.message).to.be.equal(`Something went wrong reading the passwd file`);
            return; // We want to stop here
        }

        //We should never reach here due to the catch above
        expect.fail();
    });

    it("should fail if there is a problem parsing the passwd file", async ()=>{
        Passwd.setLineDelimiter("\t");
        Passwd.setColumnDelimiter("|");
        let users;
        try{
            users = await passwd.getAllUsers();
        } catch(err){
            expect(err instanceof Error).to.be.true;
            expect(err.message).to.be.equal("There was an issue parsing the passwd file");
            return
        }
        
        //We should never reach here due to the catch above
        expect.fail();
    });

    afterEach(()=>{
        Passwd.setPath("/etc/passwd");
        Passwd.setLineDelimiter("\n");
        Passwd.setColumnDelimiter(":");
    });

});

describe("Passwd - getUsersByQuery", ()=>{

    let Passwd = require('../classes/Passwd').Passwd;
    let passwd = Passwd.getInstance();

    it("should return an array with the correct members from the query", async ()=>{
        Passwd.setPath("./src/tests/fake.passwd");
        let queriedUsers = await passwd.getUsersByQuery({ name: 'keith' });

        expect(queriedUsers).to.be.ok;
        expect(Array.isArray(queriedUsers)).to.be.true;
        expect(queriedUsers.length).to.be.equal(1);

        let keith = queriedUsers[0];

        expect(keith).to.be.ok;
        expect(keith.name).to.be.equal("keith");
        expect(keith.uid).to.be.equal(1000);
        expect(keith.gid).to.be.equal(1000);
        expect(keith.comment).to.be.equal("Keith Chester,,,");
        expect(keith.home).to.be.equal("/home/keith");
        expect(keith.shell).to.be.equal("/bin/bash");
    });

    it("should return an emtpy array if no users match the query", async ()=>{
        Passwd.setPath("./src/tests/fake.passwd");
        let queriedUsers = await passwd.getUsersByQuery({ name: "doesn't_exist" });

        expect(queriedUsers).to.be.ok;
        expect(Array.isArray(queriedUsers)).to.be.true;
        expect(queriedUsers.length).to.be.equal(0);
    });

    it("should allow querying by name", async ()=>{
        Passwd.setPath("./src/tests/fake.passwd");
        let queriedUsers = await passwd.getUsersByQuery({ name: "daemon" });

        expect(queriedUsers).to.be.ok;
        expect(Array.isArray(queriedUsers)).to.be.true;
        expect(queriedUsers.length).to.be.equal(1);
    });

    it("should allow querying by uid", async ()=>{
        Passwd.setPath("./src/tests/fake.passwd");
        let queriedUsers = await passwd.getUsersByQuery({  uid: 39 });

        expect(queriedUsers).to.be.ok;
        expect(Array.isArray(queriedUsers)).to.be.true;
        expect(queriedUsers.length).to.be.equal(1);
    });

    it("should allow querying by gid", async ()=>{
        Passwd.setPath("./src/tests/fake.passwd");
        let queriedUsers = await passwd.getUsersByQuery({ gid: 34 });

        expect(queriedUsers).to.be.ok;
        expect(Array.isArray(queriedUsers)).to.be.true;
        expect(queriedUsers.length).to.be.equal(1);
    });

    it("should allow querying by comment", async ()=>{
        Passwd.setPath("./src/tests/fake.passwd");
        let queriedUsers = await passwd.getUsersByQuery({ comment: "systemd Time Synchronization,,," });

        expect(queriedUsers).to.be.ok;
        expect(Array.isArray(queriedUsers)).to.be.true;
        expect(queriedUsers.length).to.be.equal(1);
    });

    it("should allow querying by home", async ()=>{
        Passwd.setPath("./src/tests/fake.passwd");
        let queriedUsers = await passwd.getUsersByQuery({ home: "/home/keith" });

        expect(queriedUsers).to.be.ok;
        expect(Array.isArray(queriedUsers)).to.be.true;
        expect(queriedUsers.length).to.be.equal(1);
    });

    it("should allow querying by shell", async ()=>{
        Passwd.setPath("./src/tests/fake.passwd");
        let queriedUsers = await passwd.getUsersByQuery({ shell: "/bin/bash" });

        expect(queriedUsers).to.be.ok;
        expect(Array.isArray(queriedUsers)).to.be.true;
        expect(queriedUsers.length).to.be.equal(2);
    });

    it("should allow querying by mixed attributes", async ()=>{
        Passwd.setPath("./src/tests/fake.passwd");
        let queriedUsers = await passwd.getUsersByQuery({ name: 'keith', uid: 1000, gid: 1000, comment: "Keith Chester,,," });

        expect(queriedUsers).to.be.ok;
        expect(Array.isArray(queriedUsers)).to.be.true;
        expect(queriedUsers.length).to.be.equal(1);
    });

    it("should fail if the passwd file does not exist", async ()=>{
        Passwd.setPath("/does/not/exist");

        // Note - normally you'd do a expect(fnc).to.throw() - can't do
        // that with async it seems?

        try{
            let users = await passwd.getAllUsers();
        } catch(err){
            expect(err instanceof Error).to.be.true;
            expect(err.message).to.be.equal(`Something went wrong reading the passwd file`);
            return; // We want to stop here
        }

        //We should never reach here due to the catch above
        expect.fail();
    });

    it("should fail if there is a problem parsing the passwd file", async ()=>{
        Passwd.setLineDelimiter("\t");
        Passwd.setColumnDelimiter("|");
        let users;
        try{
            users = await passwd.getAllUsers();
        } catch(err){
            expect(err instanceof Error).to.be.true;
            expect(err.message).to.be.equal("There was an issue parsing the passwd file");
            return
        }
        
        //We should never reach here due to the catch above
        expect.fail();
    });

    afterEach(()=>{
        Passwd.setPath("/etc/passwd");
        Passwd.setLineDelimiter("\n");
        Passwd.setColumnDelimiter(":");
    });

});