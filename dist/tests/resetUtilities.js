"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Passwd_1 = require("../classes/Passwd");
const Group_1 = require("../classes/Group");
function resetUtilities() {
    Passwd_1.Passwd.setPath("./src/tests/fake.passwd");
    Passwd_1.Passwd.setLineDelimiter("\n");
    Passwd_1.Passwd.setColumnDelimiter(":");
    Group_1.Group.setPath("./src/tests/fake.group");
    Group_1.Group.setLineDelimiter("\n");
    Group_1.Group.setColumnDelimiter(":");
}
exports.default = resetUtilities;
;
