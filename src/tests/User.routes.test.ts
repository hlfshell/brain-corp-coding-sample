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
        let passwd = Passwd.getInstance();
        Passwd.setPath("./src/tests/fake.passwd");

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
        let passwd = Passwd.getInstance();
        let newPath = "./src/tests/fake.passwd";
        Passwd.setPath(newPath);

        let request = createRequest();
        let response = createResponse();

        //Wait for the call to be done
        await finish(response);

        expect(response.statusCode).to.be.equal(500);
        
        let responseData = response._getData() as ErrorResponse;

        expect(responseData.code).to.be.ok;
        expect(responseData.code).to.be.equal("PASSWD_FILE_LOCATION_ERROR");
        expect(responseData.message).to.be.equal(`The passwd file could not be reached at ${newPath}`);
    });

    it("should return an appropriate status code and error message if the passwd file can not be parsed", async ()=>{
        let passwd = Passwd.getInstance();
        Passwd.setPath("./src/tests/fake.passwd");

        let request = createRequest();
        let response = createResponse();

        //Wait for the call to be done
        await finish(response);

        expect(response.statusCode).to.be.equal(500);

        let responseData = response._getData() as ErrorResponse;

        expect(responseData.code).to.be.ok;
        expect(responseData.code).to.be.equal("PASSWD_PARSE_ERROR");
        expect(responseData.message).to.be.equal('There was an issue parsing the passwd file');
    });


    afterEach(()=>{
        Passwd.setPath("/etc/path"); 
        Passwd.setColumnDelimiter(":");
        Passwd.setLineDelimiter("\n");
    });
});