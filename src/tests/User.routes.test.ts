import 'mocha';
import { before, after } from 'mocha';
import { expect } from 'chai';
import { Passwd } from "../classes/Passwd";
import { createRequest, createResponse } from "node-mocks-http";

import UserRoutes from "../routes/users";
import PasswdUser from '../interfaces/PasswdUser';
import { finish } from "./finish";
import ErrorResponse from '../interfaces/ErrorResponse';

describe("/users - Get all users", ()=>{

    it("should return a list of all users if all goes well", async ()=>{
        let request = createRequest();
        let response = createResponse();

        UserRoutes.getAllUsers(request, response);

        //Wait for the call to be done
        await finish(response);
 
        expect(response.statusCode).to.be.equal(200);

        let responseData = response._getData() as PasswdUser[];
        
        expect(Array.isArray(responseData)).to.be.true;
        expect(responseData.length).to.be.equal(25);
    });

    it("should return an appropriate status code and error message if the passwd file path is wrong", async ()=>{
        let newPath = "./doesnt/exist";
        Passwd.setPath(newPath);

        let request = createRequest();
        let response = createResponse();

        UserRoutes.getAllUsers(request, response);

        //Wait for the call to be done
        await finish(response);

        expect(response.statusCode).to.be.equal(500);
        
        let responseData = response._getData() as ErrorResponse;

        expect(responseData.code).to.be.ok;
        expect(responseData.code).to.be.equal("PASSWD_FILE_LOCATION_ERROR");
        expect(responseData.message).to.be.equal("Something went wrong reading the passwd file");
    });

    it("should return an appropriate status code and error message if the passwd file can not be parsed", async ()=>{
        Passwd.setLineDelimiter("\t");

        let request = createRequest();
        let response = createResponse();

        UserRoutes.getAllUsers(request, response);

        //Wait for the call to be done
        await finish(response);

        expect(response.statusCode).to.be.equal(500);

        let responseData = response._getData() as ErrorResponse;

        expect(responseData.code).to.be.ok;
        expect(responseData.code).to.be.equal("PASSWD_PARSE_ERROR");
        expect(responseData.message).to.be.equal('There was an issue parsing the passwd file');
    });

    beforeEach(()=>{
        Passwd.setPath("./src/tests/fake.passwd"); 
        Passwd.setColumnDelimiter(":");
        Passwd.setLineDelimiter("\n");
    });
});

describe("/users/query - Query for users", ()=>{

    it("should get expected users based on queries being passed in", async ()=>{
        let request = createRequest({
            query: {
                name: 'keith'
            }
        });
        let response = createResponse();

        UserRoutes.queryForUsers(request, response);

        //Wait for the call to be done
        await finish(response);
 
        expect(response.statusCode).to.be.equal(200);

        let responseData = response._getData() as PasswdUser[];
        
        expect(Array.isArray(responseData)).to.be.true;
        expect(responseData.length).to.be.equal(1);
        expect(responseData[0].name).to.be.equal("keith");
    });

    it("should return an empty array if no such users match", async ()=>{
        let request = createRequest({
            query: {
                name: 'doesntexist'
            }
        });
        let response = createResponse();

        UserRoutes.queryForUsers(request, response);

        //Wait for the call to be done
        await finish(response);
 
        expect(response.statusCode).to.be.equal(200);

        let responseData = response._getData() as PasswdUser[];
        
        expect(Array.isArray(responseData)).to.be.true;
        expect(responseData.length).to.be.equal(0);
    });

    it("should return an appropriate status code and error message if the passwd file path is wrong", async ()=>{
        let passwd = Passwd.getInstance();
        let newPath = "./doesnt/exist";
        Passwd.setPath(newPath);

        let request = createRequest();
        let response = createResponse();

        UserRoutes.queryForUsers(request, response);

        //Wait for the call to be done
        await finish(response);

        expect(response.statusCode).to.be.equal(500);
        
        let responseData = response._getData() as ErrorResponse;

        expect(responseData.code).to.be.ok;
        expect(responseData.code).to.be.equal("PASSWD_FILE_LOCATION_ERROR");
        expect(responseData.message).to.be.equal("Something went wrong reading the passwd file");
    });

    it("should return an appropriate status code and error message if the passwd file can not be parsed", async ()=>{
        let passwd = Passwd.getInstance();
        Passwd.setPath("./src/tests/fake.passwd");
        Passwd.setLineDelimiter("\t");

        let request = createRequest();
        let response = createResponse();

        UserRoutes.queryForUsers(request, response);

        //Wait for the call to be done
        await finish(response);

        expect(response.statusCode).to.be.equal(500);

        let responseData = response._getData() as ErrorResponse;

        expect(responseData.code).to.be.ok;
        expect(responseData.code).to.be.equal("PASSWD_PARSE_ERROR");
        expect(responseData.message).to.be.equal('There was an issue parsing the passwd file');
    });

    before(()=>{
        Passwd.setPath("./src/tests/fake.passwd"); 
        Passwd.setColumnDelimiter(":");
        Passwd.setLineDelimiter("\n");
    });
});

describe("/users/:uid - Specific user", ()=>{

    it("should get the expected user based on uid", async ()=>{
        let request = createRequest({
            params: {
                uid: 1000
            }
        });
        let response = createResponse();

        UserRoutes.getSpecificUser(request, response);

        //Wait for the call to be done
        await finish(response);
 
        expect(response.statusCode).to.be.equal(200);

        let responseData = response._getData() as PasswdUser;
        
        expect(responseData.name).to.be.equal("keith");
    });

    it("should return a status code of 404 if no such user is found", async ()=>{
        let request = createRequest({
            params: {
                name: 'doesntexist'
            }
        });
        let response = createResponse();

        UserRoutes.getSpecificUser(request, response);

        //Wait for the call to be done
        await finish(response);
 
        expect(response.statusCode).to.be.equal(404);
    });

    it("should return an appropriate status code and error message if the passwd file path is wrong", async ()=>{
        let passwd = Passwd.getInstance();
        let newPath = "./doesnt/exist";
        Passwd.setPath(newPath);

        let request = createRequest();
        let response = createResponse();

        UserRoutes.getSpecificUser(request, response);

        //Wait for the call to be done
        await finish(response);

        expect(response.statusCode).to.be.equal(500);
        
        let responseData = response._getData() as ErrorResponse;

        expect(responseData.code).to.be.ok;
        expect(responseData.code).to.be.equal("PASSWD_FILE_LOCATION_ERROR");
        expect(responseData.message).to.be.equal("Something went wrong reading the passwd file");
    });

    it("should return an appropriate status code and error message if the passwd file can not be parsed", async ()=>{
        let passwd = Passwd.getInstance();
        Passwd.setPath("./src/tests/fake.passwd");
        Passwd.setLineDelimiter("\t");

        let request = createRequest();
        let response = createResponse();

        UserRoutes.getSpecificUser(request, response);

        //Wait for the call to be done
        await finish(response);

        expect(response.statusCode).to.be.equal(500);

        let responseData = response._getData() as ErrorResponse;

        expect(responseData.code).to.be.ok;
        expect(responseData.code).to.be.equal("PASSWD_PARSE_ERROR");
        expect(responseData.message).to.be.equal('There was an issue parsing the passwd file');
    });

    before(()=>{
        Passwd.setPath("./src/tests/fake.passwd"); 
        Passwd.setColumnDelimiter(":");
        Passwd.setLineDelimiter("\n");
    });
});

describe("/users/:uid/groups - Get assigned groups to specific user", ()=>{
    it("should get the groups assigned to the user", async ()=>{
        let request = createRequest({
            params: {
                uid: 1000
            }
        });
        let response = createResponse();

        UserRoutes.getUsersGroups(request, response);

        //Wait for the call to be done
        await finish(response);
 
        expect(response.statusCode).to.be.equal(200);

        let responseData = response._getData() as string[];

        expect(Array.isArray(responseData)).to.be.true;
        expect(responseData.length).to.be.equal(4);
        expect(responseData.indexOf("docker")).to.not.equal(-1);
    });

    it("should return a status code of 404 if no such user is found", async ()=>{
        let request = createRequest({
            params: {
                name: 'doesntexist'
            }
        });
        let response = createResponse();

        UserRoutes.getUsersGroups(request, response);

        //Wait for the call to be done
        await finish(response);
 
        expect(response.statusCode).to.be.equal(404);
    });

    it("should return an appropriate status code and error message if the passwd file path is wrong", async ()=>{
        let passwd = Passwd.getInstance();
        let newPath = "./doesnt/exist";
        Passwd.setPath(newPath);

        let request = createRequest();
        let response = createResponse();

        UserRoutes.getUsersGroups(request, response);

        //Wait for the call to be done
        await finish(response);

        expect(response.statusCode).to.be.equal(500);
        
        let responseData = response._getData() as ErrorResponse;

        expect(responseData.code).to.be.ok;
        expect(responseData.code).to.be.equal("PASSWD_FILE_LOCATION_ERROR");
        expect(responseData.message).to.be.equal("Something went wrong reading the passwd file");
    });

    it("should return an appropriate status code and error message if the passwd file can not be parsed", async ()=>{
        let passwd = Passwd.getInstance();
        Passwd.setPath("./src/tests/fake.passwd");
        Passwd.setLineDelimiter("\t");

        let request = createRequest();
        let response = createResponse();

        UserRoutes.getUsersGroups(request, response);

        //Wait for the call to be done
        await finish(response);

        expect(response.statusCode).to.be.equal(500);

        let responseData = response._getData() as ErrorResponse;

        expect(responseData.code).to.be.ok;
        expect(responseData.code).to.be.equal("PASSWD_PARSE_ERROR");
        expect(responseData.message).to.be.equal('There was an issue parsing the passwd file');
    });

    before(()=>{
        Passwd.setPath("./src/tests/fake.passwd"); 
        Passwd.setColumnDelimiter(":");
        Passwd.setLineDelimiter("\n");
    });
});