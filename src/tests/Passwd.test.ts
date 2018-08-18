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