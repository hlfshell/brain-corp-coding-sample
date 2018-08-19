import 'mocha';
import { before, after } from 'mocha';
import { expect } from 'chai';
import { Passwd } from "../classes/Passwd";
import { Group } from "../classes/Group";
import { createRequest, createResponse } from "node-mocks-http";

import GroupRoutes from "../routes/groups";
import PasswdUser from '../interfaces/PasswdUser';
import { finish } from "./finish";
import ErrorResponse from '../interfaces/ErrorResponse';
import GroupItem from '../interfaces/GroupItem';