import 'mocha';
import { before, after } from 'mocha';
import { expect } from 'chai';
import { Passwd } from "../classes/Passwd";
import { createRequest, createResponse } from "node-mocks-http";

import UserRoutes from "../routes/users";
import PasswdUser from '../interfaces/PasswdUser';
import { awaitFinish } from "./awaitFinish";

describe("/users - Get all users", ()=>{

    it("should return a list of all users if all goes well", async ()=>{
        let passwd = Passwd.getInstance();
        Passwd.setPath("./src/tests/fake.passwd");

        let request = createRequest();
        let response = createResponse();

        UserRoutes.getAllUsers(request, response);

        //Wait for the call to be done
        await awaitFinish(response);
 
        let responseData = JSON.parse(response._getData()) as PasswdUser[];
        
        expect(Array.isArray(responseData)).to.be.true;
        expect(responseData.length).to.be.equal(25);
    });

    it("should return an appropriate status code and error message if the passwd file path is wrong");

    it("should return an appropriate status code and error message if the passwd file can not be parsed");


    afterEach(()=>{
        Passwd.setPath("/etc/path"); 
        Passwd.setColumnDelimiter(":");
        Passwd.setLineDelimiter("\n");
    });
});